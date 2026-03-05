/**
 * cross-platform-spend-consolidator - Google Ads Script for SMBs
 * Author: Thibault Fayol
 */
var CONFIG = { TEST_MODE: true, SHEET_URL: "https://docs.google.com/..." };
function main(){
  var cost = AdsApp.currentAccount().getStatsFor("THIS_MONTH").getCost();
  Logger.log("Google Cost: " + cost + " - Ready to merge with Bing data.");
}