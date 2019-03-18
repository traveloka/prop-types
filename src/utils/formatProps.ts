export default function formatProp(value: any) {
  if (typeof value === 'string') {
    return `"${value}"`;
  }

  if (typeof value === 'number' || value == null) {
    return value;
  }

  return JSON.stringify(value);
}
