// Adds an "Open in CSDK app" item to the dashboard and widget "..." menus.
// Clicking it gets the signed-in user's API token and opens the Compose SDK
// app with it in the URL fragment:
//   <appUrl>?url=<sisense>&dashboardId=<oid>&widgetId=<oid>#token=<token>
(() => {
  const config = window.csdkTokenLinkConfig || {};
  const TOKEN_ENDPOINT = '/api/v1/authentication/tokens/api';

  if (!config.appUrl) {
    console.warn('[csdkTokenLink] appUrl is not set in config.js; plugin disabled.');
    return;
  }

  function debug(...args) {
    if (config.debug) console.info('[csdkTokenLink]', ...args);
  }

  function readCookie(cookieString, name) {
    for (const part of cookieString.split(';')) {
      const [key, ...rest] = part.trim().split('=');
      if (key === name) return decodeURIComponent(rest.join('='));
    }
    return undefined;
  }

  async function requestSessionToken() {
    const headers = { Accept: 'application/json' };
    const xsrf = readCookie(document.cookie, 'XSRF-TOKEN');
    if (xsrf) headers['X-XSRF-TOKEN'] = xsrf;

    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'GET',
      credentials: 'include',
      headers,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const body = await response.json();
    const token = typeof body === 'string' ? body : body?.token || body?.access_token;
    if (!token) throw new Error('No token in response');
    return token;
  }

  // Each new token revokes the previous one, so keep one per page load.
  // A failure is retried on the next click.
  let sessionToken = null;

  async function getSessionToken() {
    if (sessionToken) return sessionToken;
    try {
      sessionToken = await requestSessionToken();
      return sessionToken;
    } catch (error) {
      console.warn('[csdkTokenLink] Could not get an API token:', error);
      return undefined;
    }
  }

  function buildAppUrl(appUrl, { sisenseUrl, dashboardId, widgetId, token }) {
    const url = new URL(appUrl);
    url.searchParams.set('url', sisenseUrl);
    if (dashboardId) url.searchParams.set('dashboardId', dashboardId);
    if (widgetId) url.searchParams.set('widgetId', widgetId);
    // The fragment is never sent to a server or in a Referer header.
    url.hash = token ? `token=${encodeURIComponent(token)}` : '';
    return url.toString();
  }

  async function openApp(dashboardId, widgetId) {
    // Open before the first await, or popup blockers stop it.
    const win = window.open('', config.target || '_blank');
    if (win) win.opener = null;

    const token = await getSessionToken();
    const url = buildAppUrl(config.appUrl, {
      sisenseUrl: window.location.origin,
      dashboardId,
      widgetId,
      token,
    });
    if (win) win.location.href = url;
    else window.location.href = url;
  }

  function hasDownload(items) {
    return items.some((item) => String(item?.caption || '').toLowerCase() === 'download');
  }

  // Menu names vary across Sisense versions ('widget', 'widget-menu', ...).
  // Unknown names fall back to the menu's content: the dashboard and widget
  // "..." menus are the ones with a "Download" item.
  function menuKind(name, items, hasWidget) {
    const normalized = String(name || '')
      .toLowerCase()
      .replace(/[^a-z]/g, '');
    if (normalized === 'widget' || normalized === 'widgetmenu') return 'widget';
    if (normalized === 'dashboard' || normalized === 'dashboardmenu') return 'dashboard';
    if (hasDownload(items)) return hasWidget ? 'widget' : 'dashboard';
    return null;
  }

  // Right after "Download", or at the end after a separator.
  function insertMenuItem(items, item) {
    const download = items.findIndex(
      (existing) => String(existing?.caption || '').toLowerCase() === 'download',
    );
    if (download >= 0) items.splice(download + 1, 0, item);
    else items.push({ type: 'separator' }, item);
  }

  function isWidgetTypeAllowed(widget) {
    const types = config.widgetTypes || [];
    return types.length === 0 || types.includes(widget.type);
  }

  function activeDashboardId() {
    return window.prism?.activeDashboard?.oid;
  }

  prism.on('beforemenu', (_event, args) => {
    const settings = args?.settings;
    if (!settings?.items) return;
    const scope = settings.scope || {};
    const widget = scope.widget || scope.$parent?.widget || args.widget;
    const kind = menuKind(settings.name, settings.items, Boolean(widget));
    debug('beforemenu', { name: settings.name, kind, widgetType: widget?.type });

    if (kind === 'widget' && config.showOnWidgets !== false && widget?.oid) {
      if (!isWidgetTypeAllowed(widget)) return;
      const dashboardId = widget.dashboard?.oid || activeDashboardId();
      insertMenuItem(settings.items, {
        caption: config.label || 'Open in CSDK app',
        execute: () => openApp(dashboardId, widget.oid),
      });
      return;
    }

    if (kind === 'dashboard' && config.showOnDashboards !== false) {
      const dashboardId = scope.dashboard?.oid || activeDashboardId();
      if (!dashboardId) return;
      insertMenuItem(settings.items, {
        caption: config.label || 'Open in CSDK app',
        execute: () => openApp(dashboardId),
      });
    }
  });
})();
