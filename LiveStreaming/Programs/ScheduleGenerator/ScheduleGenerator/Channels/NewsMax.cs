using System;
using System.Collections.Generic;
using System.Net;
using Newtonsoft.Json;
using ScheduleGenerator.Models;

namespace ScheduleGenerator.Channels
{
	public class NewsMax
	{
		public static Channel GetSchedule()
		{
			var client = new WebClient();
			var schedule = new List<ProgramInfo>();
			const string url = "http://cdn-api.newsmaxtv.com/api/timeline/1011/schedule";

			var programs = JsonConvert.DeserializeObject<List<Models.NewsMax.ProgramInfo>>(client.DownloadString(url));

			foreach (var p in programs)
			{

				var programInfo = new ProgramInfo
				{
					Title = p.Info.Title,
					Description = p.Info.Synopsis,
					StartTime = p.StartTime,
					EndTime = p.StartTime.AddSeconds(p.Duration)
				};

				schedule.Add(programInfo);
			}

			var channel = new Channel()
			{
				Name = "NewsMax",
				ID = "newsmax",
				TimeZoneOffset = "-0500",
				Programs = schedule
			};

			return channel;
		}
	}
}
