export function generateDatesRange() {
  const result = [];
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 15);
  const end = new Date(now);
  end.setDate(end.getDate() + 15);
  let current = new Date(start);
  while (current <= end) {
    const dateStr =
      current.toDateString().slice(0, 3) + " " + current.getDate();
    result.push({
      fullDate: new Date(current),
      label: dateStr,
      keyID: dateStr + current.getMonth(),
    });
    current.setDate(current.getDate() + 1);
  }
  return result;
}
