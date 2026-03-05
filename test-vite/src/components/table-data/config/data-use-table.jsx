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
  const [data,    setData]    = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error,   setError]   = React.useState(null);

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

  React.useEffect(() => { refresh(); }, [refresh]);

  return { data, loading, error, refresh };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. useServerPageTable
//    Every page = one server request. No cache. Any page jump works instantly.
// ─────────────────────────────────────────────────────────────────────────────

export function useServerPageTable({
  url,
  pageSize:       initialPageSize = 20,
  defaultSorting  = [],
  defaultFilters  = [],
  filtersToParams = (f) => Object.fromEntries(f.map((x) => [x.id, x.value])),
  sortToParams    = (s) => s[0] ? { sortBy: s[0].id, sortDir: s[0].desc ? "desc" : "asc" } : {},
  extraParams     = {},
  staleWhileRevalidate = true,
} = {}) {
  const [data,          setData]          = React.useState([]);
  const [total,         setTotal]         = React.useState(0);
  const [loading,       setLoading]       = React.useState(false);
  const [error,         setError]         = React.useState(null);
  const [pageIndex,     setPageIndex]     = React.useState(0);
  // FIX B: pageSize is now stateful so the selector can change it
  const [pageSize,      setPageSize]      = React.useState(initialPageSize);
  const [sorting,       setSorting]       = React.useState(defaultSorting);
  const [columnFilters, setColumnFilters] = React.useState(defaultFilters);

  const debouncedFilters = useDebouncedValue(columnFilters, 300);
  const debouncedSorting = useDebouncedValue(sorting, 150);

  // Reset to page 0 when filters, sorting, or pageSize change
  const prevKey = React.useRef("");
  React.useEffect(() => {
    const key = JSON.stringify({ f: debouncedFilters, s: debouncedSorting, ps: pageSize });
    if (key !== prevKey.current) {
      prevKey.current = key;
      setPageIndex(0);
    }
  }, [debouncedFilters, debouncedSorting, pageSize]);

  const pageCount = total > 0 ? Math.ceil(total / pageSize) : 0;

  React.useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    let alive = true;

    if (!staleWhileRevalidate) setData([]);
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const { data: json } = await ApiCustomer.get(url, {
          params: {
            skip: pageIndex * pageSize,
            take: pageSize,
            ...sortToParams(debouncedSorting),
            ...filtersToParams(debouncedFilters),
            ...extraParams,
          },
          signal: controller.signal,
        });

        if (!alive) return;
        const rows  = json.data?.data  ?? json.data  ?? [];
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
    })();

    return () => { alive = false; controller.abort(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, pageIndex, pageSize, debouncedFilters, debouncedSorting]);

  return {
    data, total, pageCount, loading, error,
    pageIndex, setPageIndex,
    pageSize,  setPageSize,   // FIX B: expose setPageSize
    sorting,   setSorting,
    columnFilters, setColumnFilters,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. useServerVirtual
//    Infinite-scroll. Appends rows as user scrolls.
//
//    NOTE: This hook no longer manages sentinelRef or registerScrollEl.
//    The IntersectionObserver is built inside DataTable where it has direct
//    access to the scroll container ref (fix for observer root bug).
//    The hook simply exposes `fetchMore` for DataTable to call.
// ─────────────────────────────────────────────────────────────────────────────

export function useServerVirtual({
  url,
  windowSize      = 100,
  defaultSorting  = [],
  defaultFilters  = [],
  filtersToParams = (f) => Object.fromEntries(f.map((x) => [x.id, x.value])),
  sortToParams    = (s) => s[0] ? { sortBy: s[0].id, sortDir: s[0].desc ? "desc" : "asc" } : {},
  extraParams     = {},
  sentinelOffset  = 30,
} = {}) {
  const [sorting,       setSorting]       = React.useState(defaultSorting);
  const [columnFilters, setColumnFilters] = React.useState(defaultFilters);
  const debouncedFilters = useDebouncedValue(columnFilters, 300);

  const [data,      setData]      = React.useState([]);
  const [total,     setTotal]     = React.useState(0);
  const [loading,   setLoading]   = React.useState(false);
  const [error,     setError]     = React.useState(null);
  const [allLoaded, setAllLoaded] = React.useState(false);

  const fetchedRef    = React.useRef(0);
  const isFetchingRef = React.useRef(false);
  const totalRef      = React.useRef(0);

  // Stable ref copies so fetchMore closure never goes stale
  const sortingRef   = React.useRef(sorting);
  const filtersRef   = React.useRef(debouncedFilters);
  React.useEffect(() => { sortingRef.current = sorting;          }, [sorting]);
  React.useEffect(() => { filtersRef.current = debouncedFilters; }, [debouncedFilters]);

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
            ...extraParams,
          },
          signal: controller.signal,
        });

        if (!alive) return;
        const rows  = json.data?.data  ?? json.data  ?? [];
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
        if (alive) { setLoading(false); isFetchingRef.current = false; }
      }
    })();

    return () => { alive = false; controller.abort(); isFetchingRef.current = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, debouncedFilters, sorting]);

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
          ...extraParams,
        },
      });

      const rows  = json.data?.data  ?? json.data  ?? [];
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
    data, total, loading, error, allLoaded,
    sorting,       setSorting,
    columnFilters, setColumnFilters,
    fetchMore,       // DataTable builds the IntersectionObserver and calls this
    sentinelOffset,  // how many rows from the end to place the sentinel row
  };
}
