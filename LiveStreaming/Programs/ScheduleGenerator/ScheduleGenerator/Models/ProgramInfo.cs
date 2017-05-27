using System;

namespace ScheduleGenerator.Models
{
	public class ProgramInfo
	{
		public string Title { get; set; }

		public string Description { get; set; }

		public DateTime StartTime { get; set; }

		public DateTime EndTime { get; set; }

		public override string ToString()
		{
			return $"{StartTime} - {Title}";
		}
	}
}
