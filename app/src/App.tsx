import { SisenseContextProvider } from '@sisense/sdk-ui';
import type { Link } from './link';
import { WidgetData } from './WidgetData';

export function App({ link }: { link: Link }) {
  if (!link.url || !link.token) {
    return <p>Open this app from the "Open in CSDK app" menu item in Sisense.</p>;
  }

  return (
    <SisenseContextProvider
      url={link.url}
      token={link.token}
      onError={(error) => <p>Could not connect to Sisense: {error.message}</p>}
    >
      <h1>CSDK app</h1>
      {link.dashboardId && link.widgetId ? (
        <WidgetData dashboardId={link.dashboardId} widgetId={link.widgetId} />
      ) : (
        <p>Connected. Open the app from a widget menu to see its data.</p>
      )}
    </SisenseContextProvider>
  );
}
