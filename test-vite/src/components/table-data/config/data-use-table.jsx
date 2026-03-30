"use client";

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  DATA TABLE HOOKS                                                       │
 * │                                                                         │
 * │  useClientTable     — full data in memory, client-side sort/filter/page │
 * │  useServerPageTable — true server pagination, any page jump works       │
 * │  useServerVirtual   — infinite-scroll / virtualized, append-only        │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * DATE FILTER FIX:
 *   extraParams was captured in the initial fetchPage closure and never
 *   updated when the object reference changed (e.g. startDate/endDate change).
 *   Fix: track extraParams via a ref so fetchPage always reads the latest value
 *   without needing to be recreated. Also added extraParamsKey (JSON string)
 *   as a useEffect dependency so a new fetch fires when extraParams changes.
 *   This means date changes trigger an immediate refetch without needing to
 *   toggle another filter or hit refresh.
 */

import * as React from "react";
import axios from "axios";
import ApiCustomer from "@/api";

// ── Shared utility ─────────────────────────────────────────────────────────

export function useDebouncedValue(value, delay = 300) {
  const [dv, setDv] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return dv;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. useClientTable
// ─────────────────────────────────────────────────────────────────────────────

export function useClientTable({ fetchFn, deps = [] }) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (e) {
      setError(e.message ?? "Fetch failed");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. useServerPageTable
// ─────────────────────────────────────────────────────────────────────────────

export function useServerPageTable({
  url,
  pageSize: initialPageSize = 20,
  defaultSorting = [],
  defaultFilters = [],
  filtersToParams = (f) => Object.fromEntries(f.map((x) => [x.id, x.value])),
  sortToParams = (s) =>
    s[0] ? { sortBy: s[0].id, sortDir: s[0].desc ? "desc" : "asc" } : {},
  extraParams = {},
  globalSearchParam = "search",
  staleWhileRevalidate = true,
} = {}) {
  const [data, setData] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [sorting, setSorting] = React.useState(defaultSorting);
  const [columnFilters, setColumnFilters] = React.useState(defaultFilters);
  const [globalSearch, setGlobalSearch] = React.useState("");

  const debouncedFilters = useDebouncedValue(columnFilters, 300);
  const debouncedSorting = useDebouncedValue(sorting, 150);
  const debouncedSearch  = useDebouncedValue(globalSearch, 350);

  // ── KEY FIX: track extraParams in a ref so fetchPage always reads the latest
  // value without needing to be in the useCallback dep array (which would cause
  // infinite re-renders if the caller passes an object literal).
  const extraParamsRef = React.useRef(extraParams);
  React.useEffect(() => {
    extraParamsRef.current = extraParams;
  }, [extraParams]);

  // Stable JSON string of extraParams — used as a dep to trigger refetch
  // when date range or resource changes, without recreating fetchPage.
  const extraParamsKey = JSON.stringify(extraParams);

  // ── Reset to page 0 when filters / sorting / pageSize / search / extraParams change
  const prevKey = React.useRef("");
  React.useEffect(() => {
    const key = JSON.stringify({
      f:  debouncedFilters,
      s:  debouncedSorting,
      ps: pageSize,
      q:  debouncedSearch,
      ep: extraParamsKey,   // ← extraParams included in reset key
    });
    if (key !== prevKey.current) {
      prevKey.current = key;
      setPageIndex(0);
    }
  }, [debouncedFilters, debouncedSorting, pageSize, debouncedSearch, extraParamsKey]);

  const pageCount = total > 0 ? Math.ceil(total / pageSize) : 0;

  // ── fetchPage — stable closure, reads extraParams via ref ─────────────────
  const fetchPage = React.useCallback(async () => {
    if (!url) return;

    const controller = new AbortController();
    let alive = true;

    if (!staleWhileRevalidate) setData([]);
    setLoading(true);
    setError(null);

    try {
      const { data: json } = await ApiCustomer.get(url, {
        params: {
          skip: pageIndex * pageSize,
          take: pageSize,
          ...sortToParams(debouncedSorting),
          ...filtersToParams(debouncedFilters),
          ...(debouncedSearch ? { [globalSearchParam]: debouncedSearch } : {}),
          // Always read from ref — guaranteed to be the latest extraParams
          ...extraParamsRef.current,
        },
        signal: controller.signal,
      });

      if (!alive) return;

      const rows  = json.data?.data ?? json.data ?? [];
      const count = json.data?.total ?? json.total ?? 0;

      setData(rows);
      setTotal(count);
    } catch (e) {
      if (!alive) return;
      if (axios.isCancel?.(e) || e.name === "CanceledError") return;
      setError(e.response?.data?.message ?? e.message ?? "Fetch failed");
    } finally {
      if (alive) setLoading(false);
    }

    return () => {
      alive = false;
      controller.abort();
    };
  }, [
    url,
    pageIndex,
    pageSize,
    debouncedFilters,
    debouncedSorting,
    debouncedSearch,
    // NOTE: extraParams intentionally NOT here — we use extraParamsRef instead.
    // extraParamsKey triggers the separate reset effect above which resets
    // pageIndex → 0, which then causes fetchPage to re-run via the pageIndex dep.
  ]);

  // ── Re-fetch also fires directly when extraParamsKey changes (e.g. date change
  // while already on page 0 — the pageIndex reset wouldn't trigger a new fetch).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { fetchPage(); }, [fetchPage, extraParamsKey]);

  const refresh = React.useCallback(() => fetchPage(), [fetchPage]);

  return {
    data,
    total,
    pageCount,
    loading,
    error,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    sorting,
    setSorting,
    refresh,
    columnFilters,
    setColumnFilters,
    globalSearch,
    setGlobalSearch,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. useServerVirtual
// ─────────────────────────────────────────────────────────────────────────────

export function useServerVirtual({
  url,
  windowSize = 100,
  defaultSorting = [],
  defaultFilters = [],
  filtersToParams = (f) => Object.fromEntries(f.map((x) => [x.id, x.value])),
  sortToParams = (s) =>
    s[0] ? { sortBy: s[0].id, sortDir: s[0].desc ? "desc" : "asc" } : {},
  extraParams = {},
  globalSearchParam = "search",
  sentinelOffset = 30,
} = {}) {
  const [sorting, setSorting] = React.useState(defaultSorting);
  const [columnFilters, setColumnFilters] = React.useState(defaultFilters);
  const [globalSearch, setGlobalSearch] = React.useState("");
  const debouncedFilters = useDebouncedValue(columnFilters, 300);
  const debouncedSearch  = useDebouncedValue(globalSearch, 350);

  const [data, setData] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [allLoaded, setAllLoaded] = React.useState(false);

  const fetchedRef      = React.useRef(0);
  const isFetchingRef   = React.useRef(false);
  const totalRef        = React.useRef(0);
  const sortingRef      = React.useRef(sorting);
  const filtersRef      = React.useRef(debouncedFilters);
  const searchRef       = React.useRef(debouncedSearch);
  const extraParamsRef  = React.useRef(extraParams);

  React.useEffect(() => { sortingRef.current      = sorting;         }, [sorting]);
  React.useEffect(() => { filtersRef.current      = debouncedFilters; }, [debouncedFilters]);
  React.useEffect(() => { searchRef.current       = debouncedSearch;  }, [debouncedSearch]);
  React.useEffect(() => { extraParamsRef.current  = extraParams;      }, [extraParams]);

  const extraParamsKey = JSON.stringify(extraParams);

  // ── Reset + initial load ──────────────────────────────────────────────────
  React.useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    let alive = true;

    fetchedRef.current    = 0;
    totalRef.current      = 0;
    isFetchingRef.current = true;

    setData([]);
    setTotal(0);
    setError(null);
    setAllLoaded(false);
    setLoading(true);

    (async () => {
      try {
        const { data: json } = await ApiCustomer.get(url, {
          params: {
            skip: 0,
            take: windowSize,
            ...sortToParams(sorting),
            ...filtersToParams(debouncedFilters),
            ...(debouncedSearch ? { [globalSearchParam]: debouncedSearch } : {}),
            ...extraParamsRef.current,
          },
          signal: controller.signal,
        });

        if (!alive) return;
        const rows  = json.data?.data ?? json.data ?? [];
        const count = json.data?.total ?? json.total ?? 0;
        setData(rows);
        setTotal(count);
        totalRef.current   = count;
        fetchedRef.current = rows.length;
        if (rows.length >= count) setAllLoaded(true);
      } catch (e) {
        if (!alive) return;
        if (axios.isCancel?.(e) || e.name === "CanceledError") return;
        setError(e.response?.data?.message ?? e.message ?? "Fetch failed");
      } finally {
        if (alive) {
          setLoading(false);
          isFetchingRef.current = false;
        }
      }
    })();

    return () => {
      alive = false;
      controller.abort();
      isFetchingRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, debouncedFilters, sorting, debouncedSearch, extraParamsKey]);

  // ── fetchMore — stable, reads everything via refs ─────────────────────────
  const fetchMore = React.useCallback(async () => {
    if (isFetchingRef.current) return;
    if (totalRef.current > 0 && fetchedRef.current >= totalRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const { data: json } = await ApiCustomer.get(url, {
        params: {
          skip: fetchedRef.current,
          take: windowSize,
          ...sortToParams(sortingRef.current),
          ...filtersToParams(filtersRef.current),
          ...(searchRef.current ? { [globalSearchParam]: searchRef.current } : {}),
          ...extraParamsRef.current,
        },
      });

      const rows  = json.data?.data ?? json.data ?? [];
      const count = json.data?.total ?? json.total ?? 0;

      setData((prev) => {
        const next = [...prev, ...rows];
        fetchedRef.current = next.length;
        return next;
      });
      setTotal(count);
      totalRef.current = count;
      if (fetchedRef.current >= count) setAllLoaded(true);
    } catch (e) {
      if (axios.isCancel?.(e) || e.name === "CanceledError") return;
      setError(e.response?.data?.message ?? e.message ?? "Fetch failed");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, windowSize]);

  return {
    data,
    total,
    loading,
    error,
    allLoaded,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    globalSearch,
    setGlobalSearch,
    fetchMore,
    sentinelOffset,
  };
}
