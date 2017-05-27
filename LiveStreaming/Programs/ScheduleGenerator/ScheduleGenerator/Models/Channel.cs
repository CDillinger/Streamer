using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace ScheduleGenerator.Models
{
	public class Channel
	{
		public string Name { get; set; }

		public string ID { get; set; }

		public string TimeZoneOffset { get; set; }
		
		public List<ProgramInfo> Programs { get; set; }

		public override string ToString()
		{
			return Name;
		}

		public static void ChannelsToXml(IEnumerable<Channel> channels, string savePath)
		{
			var writer = new XmlTextWriter(savePath, Encoding.Default);
			writer.Formatting = Formatting.Indented;
			writer.WriteStartElement("tv");
			foreach (var channel in channels)
				WriteXmlChannel(writer, channel);
			foreach (var channel in channels)
				WriteXmlPrograms(writer, channel);

			writer.WriteEndElement(); // </tv>
			writer.Close();
		}

		private static void WriteXmlChannel(XmlWriter writer, Channel channel)
		{
			writer.WriteStartElement("channel");
			writer.WriteAttributeString("id", channel.ID);
			writer.WriteElementString("display-name", channel.Name);
			writer.WriteEndElement(); // </channel>
		}

		private static void WriteXmlPrograms(XmlWriter writer, Channel channel)
		{
			foreach (var program in channel.Programs)
			{
				writer.WriteStartElement("programme");
				writer.WriteAttributeString("start", program.StartTime.ToString("yyyyMMddhhmmss ") + channel.TimeZoneOffset);
				writer.WriteAttributeString("stop", program.EndTime.ToString("yyyyMMddhhmmss ") + channel.TimeZoneOffset);
				writer.WriteAttributeString("channel", channel.ID);

				writer.WriteStartElement("title");
				writer.WriteAttributeString("lang", "en");
				writer.WriteString(program.Title);
				writer.WriteEndElement(); // </title>

				writer.WriteStartElement("desc");
				writer.WriteAttributeString("lang", "en");
				writer.WriteString(program.Description);
				writer.WriteEndElement(); // </desc>

				writer.WriteEndElement(); // </programme>
			}
		}
	}
}
