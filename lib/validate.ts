// Validates each cron field against its allowed numeric range.
// Supports *, plain numbers, ranges (1-5), steps (*/2), and comma lists.
function cronField(field: string, min: number, max: number): boolean {
  if (field === '*') return true;
  return field.split(',').every(part => {
    const [rangeStr, step] = part.split('/');
    if (step !== undefined && (!/^\d+$/.test(step) || Number(step) < 1)) return false;
    if (rangeStr === '*') return true;
    const [lo, hi] = rangeStr.split('-');
    const loN = Number(lo);
    if (!Number.isInteger(loN) || loN < min || loN > max) return false;
    if (hi !== undefined) {
      const hiN = Number(hi);
      if (!Number.isInteger(hiN) || hiN < loN || hiN > max) return false;
    }
    return true;
  });
}

export function isValidCron(cron: string): boolean {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return false;
  const [minute, hour, dom, month, dow] = parts;
  return cronField(minute, 0, 59)
      && cronField(hour,   0, 23)
      && cronField(dom,    1, 31)
      && cronField(month,  1, 12)
      && cronField(dow,    0,  7);
}

// Accepts a non-empty string only if it parses to a valid date.
export function isValidISODate(s: string): boolean {
  if (!s) return true;
  const d = new Date(s);
  return !isNaN(d.getTime());
}
