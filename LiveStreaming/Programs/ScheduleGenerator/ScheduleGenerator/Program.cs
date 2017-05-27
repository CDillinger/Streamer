using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Windows.Forms;
using ScheduleGenerator.Channels;
using ScheduleGenerator.Models;

namespace ScheduleGenerator
{
	public class Program
	{
		
		[STAThread]
		static void Main(string[] args)
		{
			var stopWatch = Stopwatch.StartNew();
			var channels = new List<Channel>();

			Console.Write("Getting data for Arirang Korea...");
			stopWatch.Restart();
			var arirangKorea = Arirang.GetArirangKoreaSchedule();
			channels.Add(arirangKorea);
			Console.WriteLine($" Grabbed {arirangKorea.Programs.Count} programs in {TimeSpanToString(stopWatch.Elapsed)}");

			Console.Write("Getting data for Arirang World...");
			stopWatch.Restart();
			var arirangWorld = Arirang.GetArirangWorldSchedule();
			channels.Add(arirangWorld);
			Console.WriteLine($" Grabbed {arirangWorld.Programs.Count} programs in {TimeSpanToString(stopWatch.Elapsed)}");

			Console.Write("Getting data for Arirang UN...");
			stopWatch.Restart();
			var arirangUN = Arirang.GetArirangUNSchedule();
			channels.Add(arirangUN);
			Console.WriteLine($" Grabbed {arirangUN.Programs.Count} programs in {TimeSpanToString(stopWatch.Elapsed)}");

			Console.Write("Getting data for Arirang DirecTV...");
			stopWatch.Restart();
			var arirangDTV = Arirang.GetArirangDirecTVSchedule();
			channels.Add(arirangDTV);
			Console.WriteLine($" Grabbed {arirangDTV.Programs.Count} programs in {TimeSpanToString(stopWatch.Elapsed)}");


			Console.Write("Getting data for C-SPAN...");
			stopWatch.Restart();
			var cspan1 = CSPAN.GetCSPAN1Schedule();
			channels.Add(cspan1);
			Console.WriteLine($" Grabbed {cspan1.Programs.Count} programs in {TimeSpanToString(stopWatch.Elapsed)}");

			Console.Write("Getting data for C-SPAN 2...");
			stopWatch.Restart();
			var cspan2 = CSPAN.GetCSPAN2Schedule();
			channels.Add(cspan2);
			Console.WriteLine($" Grabbed {cspan2.Programs.Count} programs in {TimeSpanToString(stopWatch.Elapsed)}");

			Console.Write("Getting data for C-SPAN 3...");
			stopWatch.Restart();
			var cspan3 = CSPAN.GetCSPAN3Schedule();
			channels.Add(cspan3);
			Console.WriteLine($" Grabbed {cspan3.Programs.Count} programs in {TimeSpanToString(stopWatch.Elapsed)}");


			Console.Write("Getting data for NASA Public...");
			stopWatch.Restart();
			var nasaPublic = NASA.GetNASAPublicSchedule();
			channels.Add(nasaPublic);
			Console.WriteLine($" Grabbed {nasaPublic.Programs.Count} programs in {TimeSpanToString(stopWatch.Elapsed)}");

			Console.Write("Getting data for NASA Media...");
			stopWatch.Restart();
			var nasaMedia = NASA.GetNASAMediaSchedule();
			channels.Add(nasaMedia);
			Console.WriteLine($" Grabbed {nasaMedia.Programs.Count} programs in {TimeSpanToString(stopWatch.Elapsed)}");


			Console.Write("Getting data for NewsMax...");
			stopWatch.Restart();
			var newsMax = NewsMax.GetSchedule();
			channels.Add(newsMax);
			Console.WriteLine($" Grabbed {newsMax.Programs.Count} programs in {TimeSpanToString(stopWatch.Elapsed)}");


			Console.Write("Getting data for RT News...");
			stopWatch.Restart();
			var rtInt = RT.GetRTNewsSchedule();
			channels.Add(rtInt);
			Console.WriteLine($" Grabbed {rtInt.Programs.Count} programs in {TimeSpanToString(stopWatch.Elapsed)}");

			Console.Write("Getting data for RT USA...");
			stopWatch.Restart();
			var rtUSA = RT.GetRTUSASchedule();
			channels.Add(rtUSA);
			Console.WriteLine($" Grabbed {rtUSA.Programs.Count} programs in {TimeSpanToString(stopWatch.Elapsed)}");

			Console.Write("Getting data for RT UK...");
			stopWatch.Restart();
			var rtUK = RT.GetRTUKSchedule();
			channels.Add(rtUK);
			Console.WriteLine($" Grabbed {rtUK.Programs.Count} programs in {TimeSpanToString(stopWatch.Elapsed)}");

			Console.Write("Getting data for RT Español...");
			stopWatch.Restart();
			var rtEsp = RT.GetRTSpanishSchedule();
			channels.Add(rtEsp);
			Console.WriteLine($" Grabbed {rtEsp.Programs.Count} programs in {TimeSpanToString(stopWatch.Elapsed)}");


			var dialog = new SaveFileDialog
			{
				AddExtension = true,
				FileName = "guide.xml",
				Filter = "XML files (*.xml)|*.xml"
			};
			if (dialog.ShowDialog() != DialogResult.OK)
				return;

			Channel.ChannelsToXml(channels, $"C:\\Users\\{Environment.UserName}\\Desktop\\guide.xml");
		}

		static string TimeSpanToString(TimeSpan timeSpan)
		{
			if (timeSpan.TotalMilliseconds < 900)
				return $"{timeSpan.TotalMilliseconds.ToString("F2")}ms";
			if (timeSpan.TotalSeconds < 59)
				return $"{timeSpan.TotalSeconds.ToString("F2")}s";
			if (timeSpan.TotalMinutes < 60)
				return $"{timeSpan.Minutes}:{timeSpan.TotalSeconds.ToString("F2")}";
			return $"{timeSpan.Hours}:{timeSpan.Minutes}:{timeSpan.TotalSeconds.ToString("F2")}";
		}
	}
}
