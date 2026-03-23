# Cross-Platform Spend Consolidator

A Google Ads Script that exports campaign spend data to a Google Sheet, making it easy to consolidate advertising costs across platforms in one place.

## What It Does

- Queries Google Ads campaign performance (cost, clicks, conversions, impressions) via GAQL
- Exports the data to a designated Google Sheet with date and platform columns
- Sends an email summary after each run

**Important:** This script pulls **Google Ads data only**. Microsoft Advertising (Bing) and other platforms do not have a native API accessible from Google Ads Scripts. To consolidate cross-platform spend, you can:

1. Run a similar script on the Bing Ads platform that writes to the same Sheet
2. Manually add rows for other platforms
3. Use a third-party connector (Supermetrics, Funnel.io, etc.)

## Setup

1. Create a Google Sheet and note its URL
2. In Google Ads, go to **Tools & Settings > Bulk Actions > Scripts**
3. Paste the contents of `main_en.gs` (or `main_fr.gs` for French)
4. Update the `CONFIG` values
5. Set `TEST_MODE` to `false` when ready
6. Schedule the script to run daily

## CONFIG Reference

| Parameter            | Type    | Default            | Description                                      |
|----------------------|---------|--------------------|--------------------------------------------------|
| `TEST_MODE`          | Boolean | `true`             | When true, logs data but does not write to Sheet  |
| `SHEET_URL`          | String  | —                  | Full URL of the destination Google Sheet          |
| `NOTIFICATION_EMAIL` | String  | —                  | Email address for summary and error notifications |
| `DATE_RANGE`         | String  | `LAST_30_DAYS`     | GAQL date range (e.g. `TODAY`, `LAST_7_DAYS`)     |

## How It Works

1. Runs a GAQL query against the `campaign` resource to pull cost, clicks, conversions, and impressions
2. Writes rows to the Sheet in batch using `setValues()` for performance
3. Sends an email with the total spend and campaign count

## Requirements

- Google Ads account with active campaigns
- A Google Sheet with edit access granted to the script
- Google Ads Scripts access (standard or MCC)

## License

MIT — Thibault Fayol Consulting
