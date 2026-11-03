// Edit this file, then reload Sisense.
window.csdkTokenLinkConfig = {
  // Your Compose SDK app. Its origin must be in Sisense's CORS allow-list.
  appUrl: 'https://your-csdk-app.example.com/',

  // Menu item text.
  label: 'Open in CSDK app',

  // Where the item shows up.
  showOnDashboards: true,
  showOnWidgets: true,

  // Sisense widget types that get the item, e.g. ['pivot2', 'chart/bar'].
  // [] means every widget.
  widgetTypes: [],

  // Window the app opens in.
  target: '_blank',

  // Logs the menus the plugin sees to the browser console.
  debug: false,
};
