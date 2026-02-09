import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export function formatDateForInput(dateString) {
  const date = new Date(dateString);
  const offsetDate = new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000)); // handle timezone
  return offsetDate.toISOString().split('T')[0]; // ambil 'YYYY-MM-DD'
};

export function DatePickertoDateOrNull(dateString) {
  if (!dateString) return null;

  const date = new Date(dateString);
  return isNaN(date) ? null : date;
}

/**
 * Format a date string to 'YYYY-MM-DD HH:MM:SS' for MySQL DATETIME
 * Handles timezone correctly
 */
export function formatDateForMySQL(dateString){
  const date = new Date(dateString);

  return date.toISOString()
}

export function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatAccountingRupiah(value) {
  if (value == null || value === "") return "---";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export function unformatRupiah(str) {
  if (!str) return "";
  return Number(str.replace(/[^0-9]/g, ""));
}



// export function buildBusinessDayCreatedCaseBySeries(cases, user, { businessDays = 5 } = {}) {
//   const dateKeys = getLastNBusinessDaysYYYYMMDD(businessDays);
//
//   const map = new Map(
//     dateKeys.map(date => [date, { date, bench: 0, onsite: 0 }])
//   );
//
//   for (const row of cases || []) {
//     const caseType = row?.caseinformation?.CreatedType;
//     // const createdBy = row?.caseinformation?.CreatedBy;
//     if (caseType !== "Bench" && caseType !== "Onsite") continue;
//
//     const createdOn = row?.caseinformation?.CreatedOn;
//     if (!createdOn) continue;
//
//     // Skip weekend cases entirely (even if they exist in the range)
//     if (!isBusinessDayJakarta(createdOn)) continue;
//
//     const dayKey = toJakartaYYYYMMDD(createdOn);
//     if (!map.has(dayKey)) continue;
//
//     const bucket = map.get(dayKey);
//     if (caseType === "Bench") bucket.bench += 1;
//     if (caseType === "Onsite") bucket.onsite += 1;
//   }
//
//   return dateKeys.map(d => map.get(d));
// }
