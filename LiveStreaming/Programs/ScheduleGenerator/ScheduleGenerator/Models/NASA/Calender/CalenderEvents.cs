using System.Collections.Generic;
using System.Net.Http;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using ScheduleGenerator.Models.NASA.Event;

namespace ScheduleGenerator.Models.NASA.Calender
{
	[DataContract]
	internal class CalenderEvents
	{
		[DataMember(Name = "calendarEvents")]
		public List<CalenderEventMinimal> CalendarEvents { get; set; }

		[DataMember(Name = "meta")]
		public MetaData Meta { get; set; }
	}
}
