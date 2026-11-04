import { useExecuteQueryByWidgetId } from '@sisense/sdk-ui';

type Props = { dashboardId: string; widgetId: string };

// Runs the widget's own query and shows the first rows as a plain table.
export function WidgetData({ dashboardId, widgetId }: Props) {
  const { data, isLoading, isError, error } = useExecuteQueryByWidgetId({
    dashboardOid: dashboardId,
    widgetOid: widgetId,
    count: 100,
  });

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Query failed: {error.message}</p>;
  if (!data) return null;

  return (
    <table>
      <thead>
        <tr>
          {data.columns.map((column) => (
            <th key={column.name}>{column.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell.text ?? String(cell.data)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
