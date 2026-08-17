const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/** '2023-08' -> 'Aug 2023'. Deterministic (no Date/locale) so SSR and the
    client always agree. */
export function formatMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-')
  return `${MONTHS[Number(month) - 1]} ${year}`
}

export function formatRange(start: string, end: string | null): string {
  return `${formatMonth(start)} — ${end ? formatMonth(end) : 'Present'}`
}
