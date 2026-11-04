export type Link = {
  url?: string;
  token?: string;
  dashboardId?: string;
  widgetId?: string;
};

// Reads ?url=&dashboardId=&widgetId= and #token= from the link the plugin opened.
export function readLink(location: Pick<Location, 'search' | 'hash'>): Link {
  const query = new URLSearchParams(location.search);
  const hash = new URLSearchParams(location.hash.replace(/^#/, ''));
  return {
    url: query.get('url') ?? undefined,
    token: hash.get('token') ?? undefined,
    dashboardId: query.get('dashboardId') ?? undefined,
    widgetId: query.get('widgetId') ?? undefined,
  };
}

// Removes the token from the address bar so it isn't kept in history or copied links.
export function stripTokenFromUrl(win: Window = window) {
  const current = new URL(win.location.href);
  const hash = new URLSearchParams(current.hash.replace(/^#/, ''));
  if (!hash.has('token')) return;

  hash.delete('token');
  const rest = hash.toString();
  current.hash = rest ? `#${rest}` : '';
  win.history.replaceState(win.history.state, '', current.toString());
}
