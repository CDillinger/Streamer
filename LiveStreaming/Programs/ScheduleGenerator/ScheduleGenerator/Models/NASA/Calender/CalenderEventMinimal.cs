using System.Runtime.Serialization;

namespace ScheduleGenerator.Models.NASA.Calender
{
	[DataContract]
	internal class CalenderEventMinimal
	{
		[DataMember(Name = "type")]
		public string Type { get; set; }

		[DataMember(Name = "nid")]
		public int ID { get; set; }

		[DataMember(Name = "urlQuery")]
		public string UrlQuery { get; set; }

		public string GetUrl()
		{
			return $"http://www.nasa.gov/api/1/query/node/{ID}.json?{UrlQuery}";
		}
	}
}
