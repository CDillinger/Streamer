using System.Runtime.Serialization;

namespace ScheduleGenerator.Models.RT
{
	[DataContract]
	internal class ProgramInfo
	{
		[DataMember(Name = "timeLabel")]
		public string TimeString { get; set; }

		[DataMember(Name = "time")]
		public int StartTimeSeconds { get; set; }

		[DataMember(Name = "programTitle")]
		public string MainTitle { get; set; }

		[DataMember(Name = "telecastTitle")]
		public string SecondaryTitle { get; set; }

		[DataMember(Name = "summary")]
		public string Summary { get; set; }
	}
}
