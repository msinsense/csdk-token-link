# csdkTokenLink

A Sisense plugin that adds an **Open in CSDK app** item to the dashboard and
widget "..." menus. It gets the user's API token and opens your Compose SDK
app with it:

```
<appUrl>?url=<sisense>&dashboardId=<oid>&widgetId=<oid>#token=<token>
```

## Install

1. Set `appUrl` in `config.js`.
2. Add your app's origin to Sisense's CORS allow-list.
3. Copy this folder to `/opt/sisense/storage/plugins/csdkTokenLink/`.
4. Reload Sisense.

## In your app

Read the token from the URL fragment, remove it from the address bar, and pass
it to `SisenseContextProvider`:

```tsx
const url = new URLSearchParams(location.search).get('url');
const token = new URLSearchParams(location.hash.slice(1)).get('token');
history.replaceState(null, '', location.pathname + location.search);

<SisenseContextProvider url={url} token={token}>
  <App />
</SisenseContextProvider>
```

## Note

A new token revokes the user's previous one.
