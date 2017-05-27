using System;
using System.Collections.Generic;
using System.Net;
using Newtonsoft.Json;
using ScheduleGenerator.Models;

namespace ScheduleGenerator.Channels
{
	public class RT
	{
		public static Channel GetRTNewsSchedule()
		{
			var channel = new Channel()
			{
				Name = "RT News",
				ID = "rt-news",
				Programs = GetRTSchedule("http://www.rt.com/schedulejson/news")
			};

			return channel;
		}

		public static Channel GetRTUSASchedule()
		{
			var channel = new Channel()
			{
				Name = "RT USA",
				ID = "rt-usa",
				Programs = GetRTSchedule("http://www.rt.com/schedulejson/usa")
			};

			return channel;
		}

		public static Channel GetRTUKSchedule()
		{
			var channel = new Channel()
			{
				Name = "RT UK",
				ID = "rt-uk",
				Programs = GetRTSchedule("http://www.rt.com/schedulejson/uk")
			};

			return channel;
		}

		public static Channel GetRTSpanishSchedule()
		{
			var channel = new Channel()
			{
				Name = "RT Español",
				ID = "rt-es",
				Programs = GetRTSchedule("http://actualidad.rt.com/schedulejson/")
			};

			return channel;
		}


		private static List<ProgramInfo> GetRTSchedule(string baseURL)
		{
			var client = new WebClient();
			var schedule = new List<ProgramInfo>();
			var url = $"{baseURL}/{DateTime.Today.ToString("dd-MM-yyyy")}/";

			var programs = JsonConvert.DeserializeObject<List<Models.RT.ProgramInfo>>(client.DownloadString(url));

			foreach (var p in programs)
			{
				var programInfo = new ProgramInfo
				{
					Title = string.IsNullOrEmpty(p.SecondaryTitle) ? p.MainTitle : $"{p.MainTitle} - {p.SecondaryTitle}",
					Description = p.Summary,
					StartTime = DateTime.Today.AddSeconds(p.StartTimeSeconds)
				};

				schedule.Add(programInfo);
			}

			for (var i = 1; i < schedule.Count; i++)
				schedule[i - 1].EndTime = schedule[i].StartTime;
			schedule[schedule.Count - 1].EndTime = schedule[schedule.Count - 1].StartTime.Date.AddDays(1);

			return schedule;
		}
	}
}
