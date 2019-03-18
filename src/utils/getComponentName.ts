export default function getComponentName(Component: any): string {
  return Component.displayName || Component.name || 'Unknown';
}
