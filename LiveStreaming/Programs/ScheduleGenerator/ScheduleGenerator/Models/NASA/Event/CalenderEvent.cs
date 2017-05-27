using System.Collections.Generic;
using System.Runtime.Serialization;

namespace ScheduleGenerator.Models.NASA.Event
{
	[DataContract]
	internal class CalenderEvent
	{
		[DataMember(Name = "title")]
		public string Title { get; set; }

		[DataMember(Name = "nid")]
		public int ID { get; set; }

		[DataMember(Name = "type")]
		public string Type { get; set; }

		[DataMember(Name = "changed")]
		public long Changed { get; set; } // DateTime - Unix timestamp

		[DataMember(Name = "uuid")]
		public string UUID { get; set; }

		[DataMember(Name = "name")]
		public string Name { get; set; }

		[DataMember(Name = "calendarName")]
		public List<int> IncludedCalenders { get; set; }

		[DataMember(Name = "description")]
		public string Description { get; set; }

		[DataMember(Name = "eventDate")]
		public List<EventDate> EventDates { get; set; }

		[DataMember(Name = "masterImage")]
		public string MasterImage { get; set; }

		[DataMember(Name = "subtitle")]
		public string Subtitle { get; set; }

		[DataMember(Name = "isAllDay")]
		public bool IsAllDay { get; set; }
	}
}
