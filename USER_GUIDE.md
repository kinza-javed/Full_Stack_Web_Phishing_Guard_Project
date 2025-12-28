
# Phishing Guard - User Guide

## Understanding Your Scan Results

### 🌍 Server Location (NOT Your Location!)

**What it shows:** Where the website's server is physically located

**Example:** 
- You scan `google.com` from Pakistan
- Shows "Location: Japan" 
- This means Google's server serving you is in Japan

**Your location is NEVER shown** - This tool doesn't track you!

---

## DNS Records Explained

### What are DNS Records?

DNS (Domain Name System) records are like a phone book for the internet.

### A Records (Address Records)
- **What:** Maps domain name to IP address
- **Normal:** 1-4 records
- **Zero means:** Either the domain has no website OR API limit reached

### MX Records (Mail Exchange)
- **What:** Email server configuration
- **Zero means:** No email service configured for this domain
- **Has email:** Domain can send/receive emails

### TXT Records (Text Records)
- **What:** Verification codes, SPF, DKIM for email security
- **Zero means:** No additional verification records

### Why showing 0?

**Two possible reasons:**
1. ✅ **Domain actually has no records** (new/parked domain)
2. ⚠️ **API rate limit reached** (too many requests)

**To confirm:** Check console (F12) - you'll see "DNS Counts" logged

---

## Website Screenshot

### Why no screenshot showing?

**Possible reasons:**
1. **Screenshot API has demo limits** - Free APIs have strict limits
2. **Website blocks screenshots** - Some sites prevent automated captures
3. **Loading time** - Large images take time to load
4. **CORS restrictions** - Browser security may block some services

### What I've done:
- Changed to ApiFlash demo API (better reliability)
- Added fallback services in comments
- Screenshot generates even if it fails (shows broken image instead of error)

### To fix permanently:
1. Sign up for free ApiFlash account: https://apiflash.com
2. Get free API key (1000 screenshots/month)
3. Replace `access_key=demo` with your key in `urlScanner.js`

---

## Real-Time Data Being Fetched

✅ **Working APIs:**
- Google DNS API - IP resolution
- ipapi.co - Geolocation data
- whoisjson.com - Domain info
- Pattern detection - Safety analysis

⚠️ **May hit limits:**
- PageSpeed Insights - 50 requests/day without key
- Screenshot API - Demo key has strict limits

---

## Tips for Best Results

### 1. Enter URLs correctly
✅ Good: `google.com` or `https://google.com`
❌ Bad: ` google.com` (extra space)

### 2. Check Console for details
Press **F12** → Console tab to see:
- Which APIs succeeded/failed
- DNS record counts
- Error messages

### 3. Wait for all data
Some APIs take 3-5 seconds to respond

### 4. Rate limits
If scanning many URLs quickly:
- Wait 10 seconds between scans
- Some APIs limit to 45 requests/minute

---

## API Status Indicators

| Data Point | Source | Limit |
|-----------|--------|-------|
| IP Address | Google DNS | Unlimited |
| Location | ipapi.co | 45/min |
| Domain Age | whoisjson.com | Free tier |
| Performance | PageSpeed | 50/day (no key) |
| Screenshot | ApiFlash demo | Very limited |
| DNS Records | Google DNS | Unlimited |
| Safety | Local analysis | Unlimited |

---

## Troubleshooting

### "Failed to scan URL"
1. Check URL format
2. Check internet connection
3. Open Console (F12) to see detailed error

### DNS Records showing 0
1. Open Console (F12)
2. Look for "DNS Counts - A: X, MX: Y, TXT: Z"
3. If all successful but 0, domain has no records
4. If failed, API limit or CORS issue

### No screenshot
1. Normal for demo API
2. Try another website
3. Screenshot may be blocked by CORS
4. Sign up for free API key for reliability

### Wrong country showing
- This is CORRECT! It's the server's country, not yours
- Your privacy is protected - no tracking

---

## Privacy & Security

✅ **What we DON'T collect:**
- Your IP address
- Your location
- Your browsing history
- Any personal data

✅ **What happens:**
- URL is sent to public APIs
- APIs return server information
- Everything happens in your browser
- No data stored on our servers

---

## Getting Better Results

### For Production Use:

1. **Get API keys** (all free):
   - ApiFlash: https://apiflash.com (screenshots)
   - Google PageSpeed: https://developers.google.com/speed/docs/insights/v5/get-started
   - VirusTotal: https://www.virustotal.com (enhanced security)

2. **Update the code:**
   ```javascript
   // In src/services/urlScanner.js
   // Replace demo keys with your keys
   ```

3. **No backend needed** - All APIs work from browser!

---

## Summary

✅ **Location = Server location (Japan, USA, etc.), NOT your location**
✅ **DNS 0s = Either no records OR API limit**
✅ **No screenshot = Demo API limits (sign up for free key)**
✅ **All data is real** - From actual APIs
✅ **Your privacy protected** - No tracking

**Questions?** Check the browser console (F12) for detailed logs!
