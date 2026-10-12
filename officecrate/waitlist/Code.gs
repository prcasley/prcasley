// OfficeCrate waitlist -> Google Sheet.
// Setup steps are in README.md next to this file.
var SHEET_NAME = 'Waitlist';
var FIELDS = ['submitted_at', 'name', 'email', 'line', 'dress_code', 'plan', 'timing', 'consent',
              'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'referrer'];
var ALLOWED = {
  line: ['him', 'her'],
  dress_code: ['business_formal', 'business_casual', 'smart_casual', 'not_sure'],
  plan: ['starter', 'professional'],
  timing: ['now', 'new_role', 'few_months', 'browsing'],
  consent: ['yes']
};
var MAX_PER_WINDOW = 30;      // submissions allowed per window across all visitors
var WINDOW_SECONDS = 600;
var EMAIL_RE = /^[^\s@<>"']{1,64}@[^\s@<>"']{1,180}\.[a-z]{2,24}$/i;

function reply(text) { return ContentService.createTextOutput(text); }

function clean(v, max) {
  // Strip control characters, cap length, and neutralize spreadsheet formulas.
  v = String(v || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
  return /^[=+\-@\t\r]/.test(v) ? "'" + v : v;
}

function doPost(e) {
  var p = (e && e.parameter) || {};
  if (p.company) return reply('ok');                       // honeypot: pretend success to bots
  var email = String(p.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || !String(p.name || '').trim()) return reply('invalid');
  for (var k in ALLOWED) {
    if (ALLOWED[k].indexOf(String(p[k] || '')) === -1) return reply('invalid');
  }

  var cache = CacheService.getScriptCache();
  var count = Number(cache.get('rate') || 0);
  if (count >= MAX_PER_WINDOW) return reply('busy');
  cache.put('rate', String(count + 1), WINDOW_SECONDS);

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return reply('busy');
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(FIELDS);
    var emailCol = FIELDS.indexOf('email') + 1;
    if (sheet.getLastRow() > 1) {
      var found = sheet.getRange(2, emailCol, sheet.getLastRow() - 1, 1)
        .createTextFinder(email).matchEntireCell(true).findNext();
      if (found) return reply('ok');                       // already on the list
    }
    var row = FIELDS.map(function (f) {
      if (f === 'submitted_at') return new Date().toISOString();  // server time, not client
      if (f === 'email') return clean(email, 254);
      return clean(p[f], f === 'referrer' ? 300 : 120);
    });
    sheet.appendRow(row);
    return reply('ok');
  } finally {
    lock.releaseLock();
  }
}
