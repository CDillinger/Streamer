using System;
using System.Collections.Generic;
using System.Net;
using Newtonsoft.Json;
using ScheduleGenerator.Models;
using ScheduleGenerator.Models.NASA.Calender;
using ScheduleGenerator.Models.NASA.Event;

namespace ScheduleGenerator.Channels
{
	public class NASA
	{
		public static Channel GetNASAPublicSchedule()
		{
			var channel = new Channel()
			{
				Name = "NASA TV Public",
				ID = "nasa-public",
				TimeZoneOffset = "-0500",
				Programs = GetNASASchedule(6092)
			};

			return channel;
		}

		public static Channel GetNASAMediaSchedule()
		{
			var channel = new Channel()
			{
				Name = "NASA TV Media",
				ID = "nasa-media",
				TimeZoneOffset = "-0500",
				Programs = GetNASASchedule(6094)
			};

			return channel;
		}

		private static List<ProgramInfo> GetNASASchedule(int calenderID)
		{
			var client = new WebClient();
			var schedule = new List<ProgramInfo>();

			var timeRange = DateTime.Today.ToString("yyyyMMdd0000") + "--" + DateTime.Today.AddDays(2).ToString("yyyyMMdd0000");

			var url = $"http://www.nasa.gov/api/1/query/calendar.json?timeRange={timeRange}&calendars={calenderID}";

			var events = JsonConvert.DeserializeObject<CalenderEvents>(client.DownloadString(url));

			foreach (var e in events.CalendarEvents)
			{
				var data = JsonConvert.DeserializeObject<EventData>(client.DownloadString(e.GetUrl()));

				var title = data.CalenderEvent.Title;
				var desc = data.CalenderEvent.Description;
				foreach (var date in data.CalenderEvent.EventDates)
				{
					var startTime = date.StartTime;
					var endTime = date.EndTime;

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
