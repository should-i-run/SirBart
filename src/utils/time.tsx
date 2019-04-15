// https://stackoverflow.com/a/8888498
export function formatAMPM(date: Date): string {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'
  const paddedMinutes = minutes < 10 ? `0${minutes}` : String(minutes);
  const strTime = `${hours}:${paddedMinutes} ${ampm}`;
  return strTime;
}
