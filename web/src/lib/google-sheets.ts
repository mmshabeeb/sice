export async function appendToSheet(sheetName: string, values: string[]) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('GOOGLE_SHEETS_WEBHOOK_URL not set — skipping sheet write');
    return;
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet: sheetName, values }),
  });

  if (!res.ok) {
    throw new Error(`Sheets webhook error ${res.status}`);
  }
}
