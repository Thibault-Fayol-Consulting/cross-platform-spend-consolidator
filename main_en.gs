/**
 * --------------------------------------------------------------------------
 * Cross-Platform Spend Consolidator — Google Ads Script
 * --------------------------------------------------------------------------
 * Pulls Google Ads campaign spend data via GAQL and exports it to a Google
 * Sheet. Each row contains date, platform, campaign, cost, clicks, and
 * conversions so you can consolidate multi-platform spend in one place.
 *
 * Author : Thibault Fayol — Thibault Fayol Consulting
 * Website: https://thibaultfayol.com
 * License: MIT
 * --------------------------------------------------------------------------
 */

var CONFIG = {
  TEST_MODE: true,
  SHEET_URL: 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit',
  NOTIFICATION_EMAIL: 'you@example.com',
  DATE_RANGE: 'LAST_30_DAYS'
};

function main() {
  try {
    Logger.log('Cross-Platform Spend Consolidator — start');

    var tz = AdsApp.currentAccount().getTimeZone();
    var today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
    var accountName = AdsApp.currentAccount().getName();

    var query =
      'SELECT campaign.name, metrics.cost_micros, metrics.clicks, ' +
      'metrics.conversions, metrics.impressions ' +
      'FROM campaign ' +
      'WHERE segments.date DURING ' + CONFIG.DATE_RANGE;

    var rows = AdsApp.search(query);
    var output = [];

    while (rows.hasNext()) {
      var row = rows.next();
      var cost = row.metrics.costMicros / 1000000;
      output.push([
        today,
        'Google Ads',
        row.campaign.name,
        cost.toFixed(2),
        row.metrics.clicks,
        row.metrics.conversions.toFixed(1),
        row.metrics.impressions
      ]);
    }

    Logger.log('Found ' + output.length + ' campaigns.');

    if (!CONFIG.TEST_MODE && output.length > 0) {
      var ss = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
      var sheet = ss.getSheetByName('Spend') || ss.insertSheet('Spend');

      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Date', 'Platform', 'Campaign', 'Cost', 'Clicks', 'Conversions', 'Impressions']);
      }

      sheet.getRange(sheet.getLastRow() + 1, 1, output.length, output[0].length)
        .setValues(output);
    }

    var totalCost = 0;
    for (var i = 0; i < output.length; i++) {
      totalCost += parseFloat(output[i][3]);
    }

    var subject = '[Spend Consolidator] ' + accountName + ' — ' + today;
    var body = 'Google Ads spend exported: ' + output.length + ' campaigns, ' +
      'total cost: $' + totalCost.toFixed(2) + '.\n\n' +
      (CONFIG.TEST_MODE ? '(TEST MODE — no data written to Sheet)\n' : '') +
      'Sheet: ' + CONFIG.SHEET_URL;

    MailApp.sendEmail(CONFIG.NOTIFICATION_EMAIL, subject, body);
    Logger.log('Done. Total cost: $' + totalCost.toFixed(2));

  } catch (e) {
    Logger.log('ERROR: ' + e.message);
    MailApp.sendEmail(
      CONFIG.NOTIFICATION_EMAIL,
      '[Spend Consolidator] Error',
      'Script error:\n' + e.message + '\n' + e.stack
    );
  }
}
