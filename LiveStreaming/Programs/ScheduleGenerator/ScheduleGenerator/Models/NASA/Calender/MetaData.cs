using System.Runtime.Serialization;

namespace ScheduleGenerator.Models.NASA.Calender
{
	[DataContract]
	internal class MetaData
	{
		[DataMember(Name = "total_rows")]
		public int NumberOfEvents { get; set; }
	}
}
