using System.Runtime.Serialization;

namespace ScheduleGenerator.Models.NewsMax
{
	[DataContract]
	internal class AssetInfo
	{
		[DataMember(Name = "ASS_TITLELISTING")]
		public string Title { get; set; }

		[DataMember(Name = "ASS_SYNOPSIS")]
		public string Synopsis { get; set; }
	}
}
