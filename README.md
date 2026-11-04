# csdkTokenLink

A Sisense plugin that adds an **Open in CSDK app** item to the dashboard and
widget "..." menus. It gets the user's API token and opens your Compose SDK
app with it:

```
<appUrl>?url=<sisense>&dashboardId=<oid>&widgetId=<oid>#token=<token>
```

- `plugin/`: the Sisense plugin.
- `app/`: a starter Compose SDK app that reads the link, connects, and shows
  the widget's data.

## Plugin

1. Set `appUrl` in `plugin/config.js`.
2. Add your app's origin to Sisense's CORS allow-list.
3. Copy `plugin/` to `/opt/sisense/storage/plugins/csdkTokenLink/`.
4. Reload Sisense.

## App

```bash
cd app
npm install
npm run dev
```

It runs on `http://localhost:5173/`. Use that as `appUrl` while testing.

- `src/link.ts` reads the link and removes the token from the address bar.
- `src/App.tsx` passes the URL and token to `SisenseContextProvider`.
- `src/WidgetData.tsx` runs the widget's query with
  `useExecuteQueryByWidgetId` and shows the rows in a table.

## Note

A new token revokes the user's previous one.
