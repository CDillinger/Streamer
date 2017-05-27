using System;
using System.Net;

namespace LiveStreaming
{
	public class Program
	{
		public static string GetDailyMotionM3U8(string dmID)
		{
			var client = new WebClient();
			var sourceCode = client.DownloadString($"http://www.dailymotion.com/embed/video/{dmID}");
			var m3u8LinkIndex = sourceCode.IndexOf("stream_chromecast_url", StringComparison.Ordinal) + 24;
			var m3u8Link = sourceCode.Substring(m3u8LinkIndex);
			var quoteIndex = m3u8Link.IndexOf("\"", StringComparison.Ordinal);
			m3u8Link = m3u8Link.Substring(0, quoteIndex);
			m3u8Link = m3u8Link.Replace("\\/", "/");

			return m3u8Link;
		}

		static void Main(string[] args)
		{
			var i24NewsM3U8 = GetDailyMotionM3U8("x29atae");
		}
	}
}
