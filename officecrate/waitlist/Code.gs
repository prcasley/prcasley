// OfficeCrate waitlist -> Google Sheet.
// Setup steps are in README.md next to this file.
var SHEET_NAME = 'Waitlist';
var FIELDS = ['submitted_at', 'name', 'email', 'line', 'dress_code', 'plan', 'timing', 'consent',
              'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'referrer'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(FIELDS);
    var p = e.parameter || {};
    if (!p.email || String(p.email).indexOf('@') === -1) {
      return ContentService.createTextOutput('missing email');
    }
    sheet.appendRow(FIELDS.map(function (f) {
      // Prefix values that start with formula characters so the sheet can't execute them.
      var v = String(p[f] || '').slice(0, 300);
      return /^[=+\-@]/.test(v) ? "'" + v : v;
    }));
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}
