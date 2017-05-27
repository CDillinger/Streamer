using System.Collections.Generic;
using System.Runtime.Serialization;

namespace ScheduleGenerator.Models.NASA.Event
{
	[DataContract]
	internal class EventData
	{
		[DataMember(Name = "images")]
		public List<object> Images { get; set; }

		[DataMember(Name = "calendarEvent")]
		public CalenderEvent CalenderEvent { get; set; }
	}
}
