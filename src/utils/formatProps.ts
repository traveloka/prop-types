export default function formatProp(value: any) {
  if (typeof value === 'string') {
    return `"${value}"`;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (value == null || typeof value === 'boolean') {
    return `{${value}}`;
  }

  return JSON.stringify(value);
}
