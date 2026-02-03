#!/usr/bin/env python3
"""
M3U Playlist Channel Checker
Tests each channel stream and tracks success/failure status with reasons.
"""

import urllib.request
import urllib.error
import urllib.parse
import socket
import json
import re
import sys
from typing import Dict, List, Optional
from datetime import datetime

class ChannelChecker:
    def __init__(self, state_file='channels.json'):
        self.state_file = state_file
        self.state = self.load_state()
        self.timeout = 5  # seconds

    def load_state(self) -> Dict:
        """Load existing state from JSON file."""
        try:
            with open(self.state_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            return {
                'success': [],
                'failed': [],
                'last_updated': None
            }

    def save_state(self):
        """Save current state to JSON file."""
        self.state['last_updated'] = datetime.now().isoformat()
        with open(self.state_file, 'w', encoding='utf-8') as f:
            json.dump(self.state, f, indent=2, ensure_ascii=False)
        print(f"\nState saved to {self.state_file}")
        print(f"Success: {len(self.state['success'])}, Failed: {len(self.state['failed'])}")

    def parse_m3u(self, content: str) -> List[Dict]:
        """Parse M3U playlist content and extract channel information."""
        channels = []
        lines = content.strip().split('\n')
        current_channel = None

        for line in lines:
            line = line.strip()

            # Skip empty lines and header
            if not line or line == '#EXTM3U':
                continue

            # Parse channel metadata
            if line.startswith('#EXTINF:'):
                current_channel = {}

                # Extract tvg-name
                name_match = re.search(r'tvg-name="([^"]+)"', line)
                if name_match:
                    current_channel['tvg_name'] = name_match.group(1)

                # Extract tvg-logo
                logo_match = re.search(r'tvg-logo="([^"]+)"', line)
                current_channel['logo'] = logo_match.group(1) if logo_match else ''

                # Extract tvg-id
                id_match = re.search(r'tvg-id="([^"]+)"', line)
                current_channel['tvg_id'] = id_match.group(1) if id_match else ''

                # Extract group-title (category)
                group_match = re.search(r'group-title="([^"]+)"', line)
                current_channel['category'] = group_match.group(1) if group_match else 'Unknown'

                # Extract display name (text after last comma)
                name_match = re.search(r',(.+)$', line)
                current_channel['name'] = name_match.group(1).strip() if name_match else 'Unknown'

            # Parse stream URL
            elif current_channel and (line.startswith('http://') or line.startswith('https://')):
                current_channel['url'] = line
                channels.append(current_channel)
                current_channel = None

        return channels

    def channel_exists_in_state(self, url: str) -> bool:
        """Check if channel has already been tested."""
        for channel in self.state['success'] + self.state['failed']:
            if channel['url'] == url:
                return True
        return False

    def extract_first_variant_url(self, m3u8_content: str, base_url: str) -> Optional[str]:
        """Extract the first stream URL from M3U8 playlist content."""
        lines = m3u8_content.split('\n')
        for line in lines:
            line = line.strip()
            # Skip comments and empty lines
            if not line or line.startswith('#'):
                continue
            # Found a URL
            if line:
                # Handle relative URLs
                if line.startswith('http://') or line.startswith('https://'):
                    return line
                else:
                    # Resolve relative URL against base URL
                    return urllib.parse.urljoin(base_url, line)
        return None

    def check_variant_stream(self, variant_url: str) -> Dict:
        """Check if variant stream is accessible and has proper CORS headers."""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': '*/*'
            }
            req = urllib.request.Request(variant_url, headers=headers)

            with urllib.request.urlopen(req, timeout=self.timeout) as response:
                status_code = response.getcode()
                final_url = response.geturl()
                cors_header = response.headers.get('Access-Control-Allow-Origin')

                return {
                    'accessible': True,
                    'status_code': status_code,
                    'final_url': final_url,
                    'cors_header': cors_header,
                    'redirected': final_url != variant_url
                }
        except Exception as e:
            return {
                'accessible': False,
                'error': str(e)
            }

    def check_channel(self, channel: Dict, source_playlist: str = None) -> Dict:
        """Test if channel stream is accessible and determine failure reason if not."""
        url = channel['url']
        result = channel.copy()
        result['checked_at'] = datetime.now().isoformat()

        # Track source playlist
        if source_playlist:
            result['source_playlist'] = source_playlist

        # Skip non-HTTP(S) URLs
        if not url.startswith(('http://', 'https://')):
            result['status'] = 'failed'
            result['reason'] = 'unsupported_protocol'
            result['details'] = f"Protocol not supported: {url.split(':')[0]}"
            return result

        # Skip YouTube and Twitch links
        url_lower = url.lower()
        if any(platform in url_lower for platform in ['youtube.com', 'youtu.be', 'twitch.tv']):
            result['status'] = 'failed'
            result['reason'] = 'unsupported_platform'
            platform_name = 'YouTube' if 'youtube' in url_lower or 'youtu.be' in url_lower else 'Twitch'
            result['details'] = f"{platform_name} links are not supported (requires embedded player)"
            return result

        # Only accept M3U8 files (HLS streams)
        if '.m3u8' not in url_lower:
            result['status'] = 'failed'
            result['reason'] = 'not_m3u8'
            result['details'] = 'Only M3U8 (HLS) streams are supported'
            return result

        try:
            # Build request with headers
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': '*/*'
            }

            req = urllib.request.Request(url, headers=headers)

            # Try to fetch the manifest
            with urllib.request.urlopen(req, timeout=self.timeout) as response:
                status_code = response.getcode()
                content_type = response.headers.get('Content-Type', '')

                # Get final URL after redirects
                final_url = response.geturl()

                # Track redirect information
                if final_url != url:
                    result['redirected'] = True
                    result['final_url'] = final_url
                    result['original_url'] = url
                else:
                    result['redirected'] = False
                    result['final_url'] = url

                # Check if it's actually a playlist
                if status_code == 200:
                    # Check for CORS headers on the FINAL URL (master playlist)
                    cors_header = response.headers.get('Access-Control-Allow-Origin')
                    result['cors_header'] = cors_header
                    result['master_playlist'] = {
                        'cors_header': cors_header,
                        'final_url': final_url
                    }

                    # Only fail if CORS header exists and is restrictive on master
                    if cors_header is not None:
                        if cors_header != '*' and 'localhost' not in cors_header.lower():
                            result['status'] = 'failed'
                            result['reason'] = 'cors_restricted'
                            result['http_status'] = status_code
                            result['details'] = f'Master playlist CORS restricts access: {cors_header}'
                            return result

                    # Read and parse M3U8 content to check first variant
                    try:
                        content = response.read().decode('utf-8', errors='ignore')
                        first_variant = self.extract_first_variant_url(content, final_url)

                        if first_variant:
                            result['first_variant_url'] = first_variant
                            variant_check = self.check_variant_stream(first_variant)
                            result['variant_stream'] = variant_check

                            # Check variant stream CORS
                            if variant_check.get('accessible'):
                                variant_cors = variant_check.get('cors_header')
                                if variant_cors is not None:
                                    if variant_cors != '*' and 'localhost' not in variant_cors.lower():
                                        result['status'] = 'failed'
                                        result['reason'] = 'cors_restricted'
                                        result['http_status'] = status_code
                                        result['details'] = f'Variant stream CORS restricts access: {variant_cors}'
                                        return result
                            else:
                                result['status'] = 'failed'
                                result['reason'] = 'variant_stream_failed'
                                result['http_status'] = status_code
                                result['details'] = f'Variant stream not accessible: {variant_check.get("error", "Unknown error")}'
                                return result
                    except Exception as e:
                        # If we can't check variant, don't fail - master might be enough
                        result['variant_check_error'] = str(e)

                    result['status'] = 'success'
                    result['http_status'] = status_code
                    result['content_type'] = content_type
                    return result
                else:
                    result['status'] = 'failed'
                    result['reason'] = 'http_error'
                    result['http_status'] = status_code
                    result['details'] = f"HTTP {status_code}"
                    return result

        except urllib.error.HTTPError as e:
            result['status'] = 'failed'
            result['reason'] = 'http_error'
            result['http_status'] = e.code
            result['details'] = f"HTTP {e.code}: {e.reason}"
            return result

        except urllib.error.URLError as e:
            result['status'] = 'failed'

            # Determine specific URL error type
            if isinstance(e.reason, socket.gaierror):
                result['reason'] = 'dns_resolution_failed'
                result['details'] = 'DNS lookup failed - hostname not found'
            elif isinstance(e.reason, socket.timeout):
                result['reason'] = 'connection_timeout'
                result['details'] = f'Connection timeout after {self.timeout}s'
            elif isinstance(e.reason, ConnectionRefusedError):
                result['reason'] = 'connection_refused'
                result['details'] = 'Connection refused by server'
            else:
                result['reason'] = 'connection_error'
                result['details'] = str(e.reason)
            return result

        except socket.timeout:
            result['status'] = 'failed'
            result['reason'] = 'timeout'
            result['details'] = f'Request timeout after {self.timeout}s'
            return result

        except Exception as e:
            result['status'] = 'failed'
            result['reason'] = 'unknown_error'
            result['details'] = f'{type(e).__name__}: {str(e)}'
            return result

    def check_playlist_file(self, playlist_path: str, source_name: str = None):
        """Check all channels in a playlist file."""
        print(f"Loading playlist from: {playlist_path}")

        # Use source_name if provided, otherwise use playlist_path
        source_playlist = source_name if source_name else playlist_path

        try:
            with open(playlist_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except FileNotFoundError:
            print(f"Error: Playlist file not found: {playlist_path}")
            return

        channels = self.parse_m3u(content)
        print(f"Found {len(channels)} channels in playlist")

        # Filter out already checked channels
        channels_to_check = [ch for ch in channels if not self.channel_exists_in_state(ch['url'])]
        already_checked = len(channels) - len(channels_to_check)

        if already_checked > 0:
            print(f"Skipping {already_checked} already checked channels")

        if not channels_to_check:
            print("All channels have already been checked!")
            return

        print(f"Checking {len(channels_to_check)} new channels...\n")

        for i, channel in enumerate(channels_to_check, 1):
            print(f"[{i}/{len(channels_to_check)}] Checking: {channel['name']}")
            print(f"  URL: {channel['url'][:80]}...")

            result = self.check_channel(channel, source_playlist=source_playlist)

            if result['status'] == 'success':
                self.state['success'].append(result)
                cors_status = "✓ CORS" if result.get('cors_enabled') else "✗ No CORS"
                print(f"  ✓ SUCCESS - {result.get('http_status')} - {cors_status}")
            else:
                self.state['failed'].append(result)
                print(f"  ✗ FAILED - {result['reason']}: {result.get('details', 'N/A')}")

            # Save state periodically (every 10 channels)
            if i % 10 == 0:
                self.save_state()

        # Final save
        self.save_state()

    def check_playlist_url(self, playlist_url: str):
        """Download and check all channels from a remote playlist."""
        print(f"Downloading playlist from: {playlist_url}")

        try:
            req = urllib.request.Request(
                playlist_url,
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            with urllib.request.urlopen(req, timeout=30) as response:
                content = response.read().decode('utf-8')
        except Exception as e:
            print(f"Error downloading playlist: {e}")
            return

        # Save to temporary file and process
        temp_file = '/tmp/temp_playlist.m3u8'
        with open(temp_file, 'w', encoding='utf-8') as f:
            f.write(content)

        # Pass the actual URL as source_name, not the temp file path
        self.check_playlist_file(temp_file, source_name=playlist_url)

    def print_summary(self):
        """Print summary of results."""
        print("\n" + "="*60)
        print("SUMMARY")
        print("="*60)
        print(f"Total Successful: {len(self.state['success'])}")
        print(f"Total Failed: {len(self.state['failed'])}")

        if self.state['failed']:
            print("\nFailure Reasons:")
            reasons = {}
            for channel in self.state['failed']:
                reason = channel.get('reason', 'unknown')
                reasons[reason] = reasons.get(reason, 0) + 1

            for reason, count in sorted(reasons.items(), key=lambda x: x[1], reverse=True):
                print(f"  {reason}: {count}")

        print("\n" + "="*60)


def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python check_channels.py <playlist_file_or_url>")
        print("\nExample:")
        print("  python check_channels.py playlist.m3u8")
        print("  python check_channels.py https://example.com/playlist.m3u8")
        sys.exit(1)

    playlist_source = sys.argv[1]
    checker = ChannelChecker()

    try:
        if playlist_source.startswith('http://') or playlist_source.startswith('https://'):
            checker.check_playlist_url(playlist_source)
        else:
            checker.check_playlist_file(playlist_source)

        checker.print_summary()

    except KeyboardInterrupt:
        print("\n\nInterrupted by user. Saving state...")
        checker.save_state()
        sys.exit(0)


if __name__ == '__main__':
    main()
