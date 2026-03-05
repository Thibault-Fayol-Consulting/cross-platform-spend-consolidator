/**
 * cross-platform-spend-consolidator - Script Google Ads for SMBs
 * Author: Thibault Fayol
 */
var CONFIG = { TEST_MODE: true, SHEET_URL: "https://docs.google.com/..." };
function main(){
  var cost = AdsApp.currentAccount().getStatsFor("THIS_MONTH").getCost();
  Logger.log("Google Cost: " + cost + " - Ready to merge with Bing data.");
}