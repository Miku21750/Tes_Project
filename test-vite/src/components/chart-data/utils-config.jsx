
function isBusinessDayJakarta(dateInput) {
  const d = new Date(dateInput);

  // 1..7 where 1=Mon ... 7=Sun (ISO-ish) in the chosen timezone
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    weekday: "short",
  }).format(d);

  // "Mon", "Tue", "Wed", "Thu", "Fri"
  return weekday !== "Sat" && weekday !== "Sun";
}


function toJakartaYYYYMMDD(dateInput) {
  const d = new Date(dateInput);

  // format as YYYY-MM-DD in Asia/Jakarta
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);

  const y = parts.find(p => p.type === "year").value;
  const m = parts.find(p => p.type === "month").value;
  const day = parts.find(p => p.type === "day").value;
  return `${y}-${m}-${day}`;
}


function getLastNBusinessDaysYYYYMMDD(n = 5, holidaySet = new Set()) {
  const out = [];
  const now = new Date();

  let cursor = new Date(now);

  while (out.length < n) {
    if (isBusinessDayJakarta(cursor)) {
      const dateString = toJakartaYYYYMMDD(cursor);
      
      if (!holidaySet.has(dateString)) {
         out.push(dateString);
      }
    }
    cursor.setDate(cursor.getDate() - 1);
  }

  // reverse so chart goes oldest -> newest
  return out.reverse();
}



export function buildBusinessDayCaseTypeSeries(cases, user, { businessDays = 5, holidaysData } = {}) {
  const holidayDates = new Set((holidaysData || []).map(item => item.date));
  const dateKeys = getLastNBusinessDaysYYYYMMDD(businessDays, holidayDates);
  const adminUser = ["spv","admin"]

  const map = new Map(
    dateKeys.map(date => [date, { date, Bench: 0, Onsite: 0, InWarranty: 0, OutWarranty: 0, Cancel: 0, Close: 0 }])
  );

  for (const row of cases || []) {
    const caseType = row?.caseinformation?.CaseType; // "Bench" / "Onsite"
    if (caseType !== "Bench" && caseType !== "Onsite") continue;

    const warrantyType = row?.caseinformation?.asset_information?.WarrantyOTCCode?.WarrantyCondition;
    if (warrantyType !== "InWarranty" && warrantyType !== "OutWarranty") continue;

    const createdBy = row?.caseinformation?.CreatedBy;
    if (createdBy !== user?.id && !adminUser.includes(user?.role)) continue;

    const createdOn = row?.caseinformation?.CreatedOn;
    if (!createdOn) continue;

    const caseStatus = row?.CaseStatus;
       
    // Skip weekend cases entirely (even if they exist in the range)
    if (!isBusinessDayJakarta(createdOn)) continue;
    
    const dayKey = toJakartaYYYYMMDD(createdOn);
    if (holidayDates.has(dayKey)) { 
        continue; 
    }
    if (!map.has(dayKey)) continue;

    const bucket = map.get(dayKey);
    if (caseType === "Bench") bucket.Bench += 1;
    if (caseType === "Onsite") bucket.Onsite += 1;
    if (warrantyType === "OutWarranty") bucket.OutWarranty += 1;
    if (warrantyType === "InWarranty") bucket.InWarranty += 1;
    if (caseStatus === "Cancel") bucket.Cancel += 1;
    if (caseStatus === "Close") bucket.Close += 1;
  }

  return dateKeys.map(d => map.get(d));
}


// ========================= WAREHOUSE ======================

export function buildWeeklyCaseTypeSeries(cases, { days = 7 } = {}) {
  const dateKeys = getLastNDaysYYYYMMDD(days);

  // seed output so missing days still appear as 0
  const map = new Map(
    dateKeys.map(date => [date, { date, bench: 0, onsite: 0 }])
  );

  for (const row of cases || []) {
    const caseType = row?.caseinformation?.CaseType; // "Bench" / "Onsite"
    if (caseType !== "Bench" && caseType !== "Onsite") continue;

    const createdOn = row?.caseinformation?.CreatedOn;
    if (!createdOn) continue;

    const dayKey = toJakartaYYYYMMDD(createdOn);
    if (!map.has(dayKey)) continue; // outside last 7 days

    const bucket = map.get(dayKey);
    if (caseType === "Bench") bucket.bench += 1;
    if (caseType === "Onsite") bucket.onsite += 1;
  }

  return dateKeys.map(d => map.get(d));
}


function getLastNDaysYYYYMMDD(n = 7) {
  const out = [];
  const now = new Date();

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push(toJakartaYYYYMMDD(d));
  }
  return out;
}


function calculateTotal(data, key){

  return data.reduce((accumulator, currrentValue) =>{ return accumulator + currrentValue["key"]},0 ) 
  
}
