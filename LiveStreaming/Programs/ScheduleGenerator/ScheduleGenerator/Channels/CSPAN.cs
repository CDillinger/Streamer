using System;
using System.Collections.Generic;
using System.Net;
using System.Web;
using ScheduleGenerator.Models;

namespace ScheduleGenerator.Channels
{
	public class CSPAN
	{
		public static Channel GetCSPAN1Schedule()
		{
			var channel = new Channel()
			{
				Name = "C-SPAN",
				ID = "cspan1",
				TimeZoneOffset = "-0500",
				Programs = GetCSPANSchedule(1)
			};

			return channel;
		}

		public static Channel GetCSPAN2Schedule()
		{
			var channel = new Channel()
			{
				Name = "C-SPAN 2",
				ID = "cspan2",
				TimeZoneOffset = "-0500",
				Programs = GetCSPANSchedule(2)
			};

			return channel;
		}

		public static Channel GetCSPAN3Schedule()
		{
			var channel = new Channel()
			{
				Name = "C-SPAN 3",
				ID = "cspan3",
				TimeZoneOffset = "-0500",
				Programs = GetCSPANSchedule(3)
			};

			return channel;
		}

		private static List<ProgramInfo> GetCSPANSchedule(int channelNumber)
		{
			var schedule = new List<ProgramInfo>();

			var client = new WebClient();
			var sourceCode = client.DownloadString($"https://www.c-span.org/schedule/?channel={channelNumber}");
			var programDataStartIndex = sourceCode.IndexOf("<!-- Calendar Days -->", StringComparison.Ordinal) + 23;
			sourceCode = sourceCode.Substring(programDataStartIndex);
			var programDataEndIndex = sourceCode.IndexOf("<!-- / Calendar Days -->", StringComparison.Ordinal);
			sourceCode = sourceCode.Substring(0, programDataEndIndex);

			var dailyPrograms = sourceCode.Split(new[] { "</section>\n" }, StringSplitOptions.RemoveEmptyEntries);

			foreach (var day in dailyPrograms)
			{
				var dateIndex = day.IndexOf("<section class=\"schedule-day\" id=\"", StringComparison.Ordinal) + 34;
				var date = day.Substring(dateIndex, 10); // YYYY-MM-DD format

				var programData = day.Split(new[] { "</li>\n<li>\n" }, StringSplitOptions.RemoveEmptyEntries);
				programData[0] = programData[0].Substring(programData[0].IndexOf("<span", StringComparison.Ordinal));

				foreach (var program in programData)
				{
					var time = "";
					var duration = "";
					var title = "";
					var desc = "";

					// Start time
					var timeStartIndex = program.IndexOf("<time>", StringComparison.Ordinal) + 6;
					time = program.Substring(timeStartIndex);
					var timeEndIndex = time.IndexOf("</time>", StringComparison.Ordinal);
					time = time.Substring(0, timeEndIndex);
					if (time == "TBD")
						time = "11:59pm";
					var startTime = DateTime.Parse($"{date} {time}");

					// Duration
					var durationStartIndex = program.IndexOf("<span class=\"duration\">", StringComparison.Ordinal) + 23;
					duration = program.Substring(durationStartIndex);
					var durationEndIndex = duration.IndexOf("</span>", StringComparison.Ordinal);
					duration = duration.Substring(0, durationEndIndex);

					// End time
					var endTime = startTime;
					var durations = duration.Split(new[] { ", " }, StringSplitOptions.None);
					foreach (var dur in durations)
					{
						var d = dur.ToLower();
						if (d.Contains("minute"))
						{
							var minutesEndIndex = d.IndexOf(" minute", StringComparison.Ordinal);
							var minutesString = d.Substring(0, minutesEndIndex);
							var minutes = int.Parse(minutesString);

							endTime = endTime.AddMinutes(minutes);
						}
						if (d.Contains("hour"))
						{
							var hourEndIndex = d.IndexOf(" hour", StringComparison.Ordinal);
							var hourString = d.Substring(0, hourEndIndex);
							var hours = int.Parse(hourString);

							endTime = endTime.AddHours(hours);
						}
						if (d.Contains("day"))
						{
							var dayEndIndex = d.IndexOf(" day", StringComparison.Ordinal);
							var dayString = d.Substring(0, dayEndIndex);
							var days = int.Parse(dayString);

							endTime = endTime.AddDays(days);
						}
					}

					// Title
					var titleStartIndex = program.IndexOf("<h4 class=\"title\">", StringComparison.Ordinal) + 18;
					title = program.Substring(titleStartIndex);
					var titleEndIndex = title.IndexOf("</h4>", StringComparison.Ordinal);
					title = title.Substring(0, titleEndIndex);
					title = title.Replace("<i>", "").Replace("</i>", "").Replace("<em>", "").Replace("</em>", "");
					if (title.Contains("<a"))
					{
						titleEndIndex = title.IndexOf("</a>", StringComparison.Ordinal);
						title = title.Substring(0, titleEndIndex);
						titleStartIndex = title.LastIndexOf(">", StringComparison.Ordinal) + 1;
						title = title.Substring(titleStartIndex);
					}
					title = HttpUtility.HtmlDecode(title);

					// Description
					var descStartIndex = program.IndexOf("<p>", StringComparison.Ordinal) + 3;
					if (descStartIndex != 2)
					{
						desc = program.Substring(descStartIndex);
						var descEndIndex = desc.IndexOf("</p>", StringComparison.Ordinal);
						desc = desc.Substring(0, descEndIndex);
						desc = desc.Replace("<i>", "").Replace("</i>", "").Replace("<em>", "").Replace("</em>", "");
					}
					desc = HttpUtility.HtmlDecode(desc);

					var programInfo = new ProgramInfo
					{
						Title = title,
						Description = desc,
						StartTime = startTime,
						EndTime = endTime
					};

					schedule.Add(programInfo);
				}
			}

			return schedule;
		}
	}
}
