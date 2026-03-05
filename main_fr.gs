/**
 * --------------------------------------------------------------------------
 * cross-platform-spend-consolidator - Google Ads Script for SMBs
 * --------------------------------------------------------------------------
 * Author: Thibault Fayol - Consultant SEA PME
 * Website: https://thibaultfayol.com
 * License: MIT
 * --------------------------------------------------------------------------
 */
var CONFIG = { TEST_MODE: true, SHEET_URL: "https://docs.google.com/spreadsheets/..." };
function main() {
    Logger.log("Consolidation des dépenses Google Ads...");
    var sheet = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL).getActiveSheet();
    var stats = AdsApp.currentAccount().getStatsFor("THIS_MONTH");
    var cost = stats.getCost();
    var date = Utilities.formatDate(new Date(), AdsApp.currentAccount().getTimeZone(), "yyyy-MM-dd");
    Logger.log("Dépense Mensuelle Google Ads: " + cost);
    if (!CONFIG.TEST_MODE) {
        sheet.appendRow([date, "Google Ads", cost]);
    }
}
