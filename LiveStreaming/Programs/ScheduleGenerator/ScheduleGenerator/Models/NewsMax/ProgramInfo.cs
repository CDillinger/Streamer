using System;
using System.Runtime.Serialization;

namespace ScheduleGenerator.Models.NewsMax
{
	[DataContract]
	internal class ProgramInfo
	{
		[DataMember(Name = "TLN_DATETIME")]
		public DateTime StartTime { get; set; }

		[DataMember(Name = "TLN_DURATION")]
		public int Duration { get; set; }

		[DataMember(Name = "BV_ASSET_PROGRAM")]
		public AssetInfo Info { get; set; }
	}
}
