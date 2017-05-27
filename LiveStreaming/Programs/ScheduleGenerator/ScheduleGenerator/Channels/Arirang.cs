using System;
using System.Collections.Generic;
using System.Net;
using System.Web;
using ScheduleGenerator.Models;

namespace ScheduleGenerator.Channels
{
	public class Arirang
	{
		public static Channel GetArirangKoreaSchedule()
		{
			var channel = new Channel()
			{
				Name = "Arirang Korea",
				ID = "arirang-korea",
				TimeZoneOffset = "+0900",
				Programs = GetArirangTVSchedule("CH_K")
			};

			return channel;
		}

		public static Channel GetArirangWorldSchedule()
		{
			var channel = new Channel()
			{
				Name = "Arirang World",
				ID = "arirang-world",
				TimeZoneOffset = "+0900",
				Programs = GetArirangTVSchedule("CH_W")
			};

			return channel;
		}

		public static Channel GetArirangUNSchedule()
		{
			var channel = new Channel()
			{
				Name = "Arirang UN",
				ID = "arirang-un",
				TimeZoneOffset = "+0900",
				Programs = GetArirangTVSchedule("CH_Z")
			};

			return channel;
		}

		public static Channel GetArirangDirecTVSchedule()
		{
			var channel = new Channel()
			{
				Name = "Arirang (DirecTV)",
				ID = "arirang-directv",
				TimeZoneOffset = "-0500",
				Programs = GetArirangTVSchedule("CH_D")
			};

			return channel;
		}

		private static List<ProgramInfo> GetArirangTVSchedule(string channel)
		{
			var schedule = new List<ProgramInfo>();

			var client = new WebClient();
			var sourceCode = client.DownloadString($"http://www.arirang.com/Tv/TV_SCH.asp?Prog_Code=&vSeq=&Channel={channel}");

			var dateStartIndex = sourceCode.IndexOf("<li  class='on'>", StringComparison.Ordinal) + 16;
			var dateString = sourceCode.Substring(dateStartIndex);
			var dateEndIndex = dateString.IndexOf("</li>", StringComparison.Ordinal);
			dateString = dateString.Substring(0, dateEndIndex);
			dateStartIndex = dateString.IndexOf("<b>", StringComparison.Ordinal) + 3;
			dateString = dateString.Substring(dateStartIndex);
			dateEndIndex = dateString.IndexOf("</b>", StringComparison.Ordinal);
			dateString = dateString.Substring(0, dateEndIndex); // YYYY-MM-DD

			var programDataStartIndex = sourceCode.IndexOf("<tbody>", StringComparison.Ordinal) + 7;
			sourceCode = sourceCode.Substring(programDataStartIndex);
			var programDataEndIndex = sourceCode.IndexOf("</tbody>", StringComparison.Ordinal);
			sourceCode = sourceCode.Substring(0, programDataEndIndex);
			sourceCode = sourceCode.Replace("\t", "").Replace("\r", "").Replace("\n", "");

			var programData = sourceCode.Split(new[] { "</tr>" }, StringSplitOptions.RemoveEmptyEntries);

			foreach (var program in programData)
			{
				var time = "";
				var duration = "";
				var title = "";
				var desc = "";
				DateTime startTime;
				DateTime endTime;

				if (program.Contains("<td colspan"))
				{
					// Start time
					var timeStartIndex = program.IndexOf("<div class=\"sc_time\">", StringComparison.Ordinal) + 21;
					time = program.Substring(timeStartIndex);
					var timeEndIndex = time.IndexOf("</div>", StringComparison.Ordinal);
					time = time.Substring(0, timeEndIndex);
					startTime = DateTime.Parse($"{dateString} {time}");

					// End time
					var durationStartIndex = program.IndexOf("<div class=\"sc_duration\">DURATION ", StringComparison.Ordinal) + 34;
					duration = program.Substring(durationStartIndex);
					var durationEndIndex = duration.IndexOf("</div>", StringComparison.Ordinal);
					duration = duration.Substring(0, durationEndIndex);
					var minutes = int.Parse(duration);
					endTime = startTime.AddMinutes(minutes);

					// Title and description
					var titleStartIndex = program.IndexOf("<h4>", StringComparison.Ordinal) + 4;
					var titleAndDesc = program.Substring(titleStartIndex);
					var titleEndIndex = titleAndDesc.IndexOf("</a>", StringComparison.Ordinal);
					titleAndDesc = titleAndDesc.Substring(0, titleEndIndex);
					titleAndDesc = titleAndDesc.Replace("<i>", "").Replace("</i>", "").Replace("<em>", "").Replace("</em>", "");
					titleAndDesc = HttpUtility.HtmlDecode(titleAndDesc);
					var split = titleAndDesc.Split(new[] { "</h4>" }, StringSplitOptions.None);
					title = split[0];
					desc = split[1];
				}
				else
				{
					// Start time
					var timeStartIndex = program.IndexOf("<td class=\"sc_time\">", StringComparison.Ordinal) + 20;
					time = program.Substring(timeStartIndex);
					var timeEndIndex = time.IndexOf("</td>", StringComparison.Ordinal);
					time = time.Substring(0, timeEndIndex);
					startTime = DateTime.Parse($"{dateString} {time}");

					// End time
					var durationStartIndex = program.IndexOf("<td class=\"sc_duration\">", StringComparison.Ordinal) + 24;
					duration = program.Substring(durationStartIndex);
					var durationEndIndex = duration.IndexOf("</td>", StringComparison.Ordinal);
					duration = duration.Substring(0, durationEndIndex);
					var minutes = int.Parse(duration);
					endTime = startTime.AddMinutes(minutes);

					// Title and description
					var titleStartIndex = program.IndexOf("<h4>", StringComparison.Ordinal) + 4;
					var titleAndDesc = program.Substring(titleStartIndex);
					var titleEndIndex = titleAndDesc.IndexOf("</span>", StringComparison.Ordinal);
					titleAndDesc = titleAndDesc.Substring(0, titleEndIndex);
					titleAndDesc = titleAndDesc.Replace("<i>", "").Replace("</i>", "").Replace("<em>", "").Replace("</em>", "");
					titleAndDesc = HttpUtility.HtmlDecode(titleAndDesc);
					var split = titleAndDesc.Split(new[] { "</h4>" }, StringSplitOptions.None);
					title = split[0];
					desc = split[1];
				}

				var programInfo = new ProgramInfo
				{
					Title = title,
					Description = desc,
					StartTime = startTime,
					EndTime = endTime
				};

				schedule.Add(programInfo);
			}

			return schedule;
		}
	}
}
