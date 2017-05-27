using System;
using System.Runtime.Serialization;

namespace ScheduleGenerator.Models.NASA.Event
{
	[DataContract]
	internal class EventDate
	{
		[DataMember(Name = "value")]
		public DateTime StartTime { get; set; }

		[DataMember(Name = "value2")]
		public DateTime EndTime { get; set; }

		[DataMember(Name = "rrule")]
		public string RRule { get; set; }

		[DataMember(Name = "timezone")]
		public string TimeZone { get; set; }

		[DataMember(Name = "timezone_db")]
		public string TimeZoneDB { get; set; }

		[DataMember(Name = "date_type")]
		public string DateType { get; set; }
	}
}
