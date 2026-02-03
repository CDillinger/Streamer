# Channel Checker Script

## Overview
This script checks M3U playlist channels, tests their streams, and maintains a JSON state file with success/failure status.

## Features
- ✅ Parses M3U playlists (local files or URLs)
- ✅ Tests each stream manifest
- ✅ Tracks detailed failure reasons
- ✅ Maintains state (resumes from where it left off)
- ✅ Saves results to JSON
- ✅ Checks for CORS support
- ✅ Separate success/failure lists

## Usage

### Check a local playlist file:
```bash
python3 check_channels.py playlist.m3u8
```

### Check a remote playlist URL:
```bash
python3 check_channels.py https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8
```

### Resume checking (re-run same command):
The script automatically skips channels it has already checked. Just run the same command again.

## Output

### JSON State File: `channels.json`

```json
{
  "success": [
    {
      "name": "Channel Name",
      "tvg_name": "Channel Technical Name",
      "logo": "https://example.com/logo.png",
      "category": "News",
      "url": "https://stream.example.com/playlist.m3u8",
      "status": "success",
      "http_status": 200,
      "content_type": "application/x-mpegURL",
      "cors_enabled": true,
      "checked_at": "2026-02-01T23:00:00"
    }
  ],
  "failed": [
    {
      "name": "Channel Name",
      "category": "Sports",
      "url": "https://dead.stream.com/playlist.m3u8",
      "status": "failed",
      "reason": "dns_resolution_failed",
      "details": "DNS lookup failed - hostname not found",
      "checked_at": "2026-02-01T23:00:00"
    }
  ],
  "last_updated": "2026-02-01T23:00:00"
}
```

## Failure Reasons

The script categorizes failures into these types:

- **unsupported_platform** - YouTube or Twitch links (require embedded players)
- **not_m3u8** - URL does not point to an M3U8 file (only HLS streams supported)
- **cors_restricted** - CORS header explicitly restricts access (on master or variant stream)
- **variant_stream_failed** - First variant stream not accessible
- **dns_resolution_failed** - Hostname cannot be resolved
- **connection_timeout** - Connection took too long
- **connection_refused** - Server refused connection
- **connection_error** - Other connection issues
- **timeout** - Request timeout
- **http_error** - HTTP error status (404, 403, 500, etc.)
- **unsupported_protocol** - Non-HTTP(S) protocols (rtmp, rtsp, etc.)
- **unknown_error** - Unexpected errors

**CORS Logic:**
- ✅ No CORS header → Success (no explicit restriction)
- ✅ `Access-Control-Allow-Origin: *` → Success (allows all origins)
- ✅ CORS header contains "localhost" → Success (allows our origin)
- ❌ CORS header with specific origin (not localhost) → Failed (actively restricted)

**Requirements for Success:**
- Must be an M3U8 (HLS) stream
- Must be accessible (HTTP 200)
- Must not have restrictive CORS headers

YouTube and Twitch links are automatically excluded.

## Channel Information Tracked

- **name** - Display name
- **tvg_name** - Technical name
- **tvg_id** - Channel ID
- **logo** - Logo URL
- **category** - Group/category
- **url** - Original stream URL
- **source_playlist** - URL or path of the source playlist this channel came from
- **final_url** - Final URL after redirects (if redirected)
- **redirected** - Boolean indicating if redirect occurred
- **master_playlist** - Details about master playlist check
- **first_variant_url** - First variant stream URL
- **variant_stream** - Details about variant stream check
- **status** - success/failed
- **reason** - Failure reason (if failed)
- **details** - Detailed error message
- **http_status** - HTTP status code
- **cors_header** - CORS header value (from final URL)
- **checked_at** - Timestamp

## Redirect Handling

The script automatically follows HTTP redirects (301, 302, 307, 308) and:
- ✅ Tracks if redirect occurred
- ✅ Stores both original and final URLs
- ✅ Checks CORS headers on final URL (after all redirects)
- ✅ Uses final URL for playback in the app

## Variant Stream Checking

The script performs a two-level check:

1. **Master Playlist Check**
   - Fetches the main M3U8 file
   - Checks CORS headers on master playlist
   - Parses content to find variant streams

2. **First Variant Stream Check**
   - Extracts first URL from master playlist
   - Checks if variant stream is accessible
   - Validates CORS headers on variant stream
   - Handles relative URLs (resolves against base)

Both checks must pass for a channel to be marked successful. This ensures the actual playable stream (not just the manifest) is accessible.

## Tips

1. **Resume interrupted checks**: Just run the script again with the same playlist
2. **Check specific channels**: Edit the state file to remove entries you want to re-check
3. **Reset state**: Delete `channels.json` to start fresh
4. **Periodic saves**: State is saved every 10 channels (safe to Ctrl+C)

## Example Workflow

```bash
# Download and check a large playlist
python3 check_channels.py https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8

# Script checks channels and saves state...
# Press Ctrl+C to interrupt if needed

# Resume later
python3 check_channels.py https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8

# View results
cat channels.json | python3 -m json.tool
```

## Performance

- Default timeout: 10 seconds per channel
- Saves state every 10 channels
- Skips already-checked channels automatically
