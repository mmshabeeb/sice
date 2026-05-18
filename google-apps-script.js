// Deploy this in your Google Sheet via Extensions → Apps Script
// Then: Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone → Deploy
// Copy the Web app URL and set it as GOOGLE_SHEETS_WEBHOOK_URL in your .env.local

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(data.sheet);

    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ error: "Sheet not found: " + data.sheet }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow(data.values);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
