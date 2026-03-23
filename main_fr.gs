/**
 * --------------------------------------------------------------------------
 * Cross-Platform Spend Consolidator — Script Google Ads
 * --------------------------------------------------------------------------
 * Recupere les depenses par campagne Google Ads via GAQL et les exporte
 * dans un Google Sheet. Chaque ligne contient la date, la plateforme,
 * la campagne, le cout, les clics et les conversions.
 *
 * Auteur : Thibault Fayol — Thibault Fayol Consulting
 * Site   : https://thibaultfayol.com
 * Licence: MIT
 * --------------------------------------------------------------------------
 */

var CONFIG = {
  TEST_MODE: true,
  SHEET_URL: 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit',
  NOTIFICATION_EMAIL: 'vous@exemple.com',
  DATE_RANGE: 'LAST_30_DAYS'
};

function main() {
  try {
    Logger.log('Cross-Platform Spend Consolidator — demarrage');

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

    Logger.log(output.length + ' campagnes trouvees.');

    if (!CONFIG.TEST_MODE && output.length > 0) {
      var ss = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
      var sheet = ss.getSheetByName('Depenses') || ss.insertSheet('Depenses');

      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Date', 'Plateforme', 'Campagne', 'Cout', 'Clics', 'Conversions', 'Impressions']);
      }

      sheet.getRange(sheet.getLastRow() + 1, 1, output.length, output[0].length)
        .setValues(output);
    }

    var totalCost = 0;
    for (var i = 0; i < output.length; i++) {
      totalCost += parseFloat(output[i][3]);
    }

    var subject = '[Spend Consolidator] ' + accountName + ' — ' + today;
    var body = 'Depenses Google Ads exportees : ' + output.length + ' campagnes, ' +
      'cout total : ' + totalCost.toFixed(2) + ' EUR.\n\n' +
      (CONFIG.TEST_MODE ? '(MODE TEST — aucune donnee ecrite dans le Sheet)\n' : '') +
      'Sheet : ' + CONFIG.SHEET_URL;

    MailApp.sendEmail(CONFIG.NOTIFICATION_EMAIL, subject, body);
    Logger.log('Termine. Cout total : ' + totalCost.toFixed(2) + ' EUR');

  } catch (e) {
    Logger.log('ERREUR : ' + e.message);
    MailApp.sendEmail(
      CONFIG.NOTIFICATION_EMAIL,
      '[Spend Consolidator] Erreur',
      'Erreur du script :\n' + e.message + '\n' + e.stack
    );
  }
}
