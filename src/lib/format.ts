export function formatINR(value: number): string {
  if (value < 0) return "-" + formatINR(-value);
  if (value >= 10000000) {
    return "₹" + (value / 10000000).toFixed(2) + " Cr";
  }
  if (value >= 100000) {
    return "₹" + (value / 100000).toFixed(2) + " L";
  }
  const str = Math.round(value).toString();
  const last3 = str.slice(-3);
  const rest = str.slice(0, -3);
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (rest ? "," : "") + last3;
  return "₹" + formatted;
}

export function formatINRShort(value: number): string {
  if (value >= 10000000) return (value / 10000000).toFixed(1) + "Cr";
  if (value >= 100000) return (value / 100000).toFixed(1) + "L";
  if (value >= 1000) return (value / 1000).toFixed(1) + "K";
  return value.toFixed(0);
}