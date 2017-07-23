var channels = [
	// News
	{ name:'Al Jazeera', category:'news', source:'http://aljazeera-eng-hd-live.hls.adaptive.level3.net/aljazeera/english2/index.m3u8', site:'http://www.aljazeera.com/live/' },
	{ name:'CBS News', category:'news', source:'http://cbsnewshd-lh.akamaihd.net/i/CBSNHD_7@199302/master.m3u8', site:'http://www.cbsnews.com/live/' },
	{ name:'Press TV', category:'news', source:'http://178.32.255.199:1935/live/ptven/playlist.m3u8', site:'http://www.presstv.com/Default/Live' },
	{ name:'NewsMax TV', category:'news', source:'http://ooyalahd2-f.akamaihd.net/i/newsmax02_delivery@119568/master.m3u8', site:'http://www.newsmaxtv.com' },
	
	// Music
	{ name:'1HD', category:'music', source:'https://cdn-01.bonus-tv.ru:8090/1HDmusic/tracks-v2a1/index.m3u8', site:'http://1hd.ru/video.php' },
	{ name:'Arirang Radio', category:'music', source:'http://amdlive.ctnd.com.edgesuite.net/arirang_3ch/smil:arirang_3ch.smil/playlist.m3u8', site:'http://www.arirang.com/player/onair_radio.asp' },
	{ name:'Beatz HD', category:'music', source:'https://livevideo.infomaniak.com/streaming/livecast/beats_1/playlist.m3u8', site:'http://www.radiopilatus.ch/livecenter/2' },
	{ name:'Capital TV', category:'music', source:'http://ooyalahd2-f.akamaihd.net/i/globalradio01_delivery@156521/master.m3u8', site:'http://www.capitalfm.com/tv/' },
	{ name:'DJing', category:'music', source:'http://www.djing.com/tv/live.m3u8', site:'http://www.djing.com/?channel=live' },
	{ name:'DJing Animation', category:'music', source:'http://www.djing.com/tv/a-05.m3u8', site:'http://www.djing.com/?channel=animation' },
	{ name:'DJing Classic', category:'music', source:'http://www.djing.com/tv/i-05.m3u8', site:'http://www.djing.com/?channel=classics' },
	{ name:'DJing Ibiza', category:'music', source:'http://www.djing.com/tv/d-05.m3u8', site:'http://www.djing.com/?channel=ibiza' },
	{ name:'DJing Underground', category:'music', source:'http://www.djing.com/tv/u-05.m3u8', site:'http://www.djing.com/?channel=underground' },
	{ name:'Heart TV', category:'music', source:'http://ooyalahd2-f.akamaihd.net/i/globalradio02_delivery@156522/master.m3u8', site:'http://www.heart.co.uk/tv/player/' },
	{ name:'Kronehit TV', category:'music', source:'http://bitcdn-kronehit-live.bitmovin.com/hls/1500k/bitcodin.m3u8', site:'http://www.kronehit.at/alles-ueber-kronehit/tv/' },
	{ name:'PowerTurk TV', category:'music', source:'http://powertv.cdnturk.com/powertv/powerturktv.smil/playlist.m3u8', site:'http://www.powerapp.com.tr/tv/powerTurkTV' },
	{ name:'SLAM!TV', category:'music', source:'https://hls.slam.nl/streaming/hls/SLAM!/playlist.m3u8', site:'https://live.slam.nl/slam-webcam/' },
	
	// Politics
	{ name:'C-SPAN', category:'politics', source:'http://cspan1-lh.akamaihd.net/i/cspan1_1@304727/master.m3u8', site:'https://www.c-span.org/networks/?channel=c-span' },
	{ name:'C-SPAN2', category:'politics', source:'http://cspan2-lh.akamaihd.net/i/cspan2_1@304728/master.m3u8', site:'https://www.c-span.org/networks/?channel=c-span-2' },
	{ name:'C-SPAN3', category:'politics', source:'http://cspan3-lh.akamaihd.net/i/cspan3_1@304729/master.m3u8', site:'https://www.c-span.org/networks/?channel=c-span-3' },
	
	// Entertainment
	{ name:'NBC Golf', category:'entertainment', source:'http://tvegolf-i.akamaihd.net/hls/live/218225/golfx/4296k/prog.m3u8', site:'http://www.golfchannel.com/liveextra/' },
	{ name:'Insight TV', category:'entertainment', source:'http://ooyalahd2-f.akamaihd.net/i/intv02_delivery@346464/master.m3u8', site:'https://www.insight.tv/' },
	{ name:'Red Bull TV', category:'entertainment', source:'https://rbtvdiglinear-i.akamaihd.net/hls/live/241719/ATfallback/master.m3u8', site:'https://www.redbull.tv/tv' },
	
	// Regional
	{ name:'Arirang Korea', category:'network', source:'http://amdlive.ctnd.com.edgesuite.net/arirang_4ch/smil:arirang_4ch.smil/playlist.m3u8', site:'http://www.arirang.com/player/onair_tv.asp?Channel=CH_K' },
	{ name:'Arirang UN', category:'network', source:'http://amdlive.ctnd.com.edgesuite.net/arirang_2ch/smil:arirang_2ch.smil/playlist.m3u8', site:'http://www.arirang.com/player/onair_tv.asp?Channel=CH_Z' },
	{ name:'Arirang World', category:'network', source:'http://amdlive.ctnd.com.edgesuite.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8', site:'http://www.arirang.com/player/onair_tv.asp?Channel=CH_W' },
	{ name:'BYU TV', category:'network', source:'https://byubhls-i.akamaihd.net/hls/live/267187/byutvhls/master.m3u8', site:'http://www.byutv.org/watch/livetv' },
	{ name:'NHK World', category:'network', source:'https://nhkworld.webcdn.stream.ne.jp/www11/nhkworld-tv/global/263941/live_wa_s.m3u8', site:'http://www3.nhk.or.jp/nhkworld/en/live/' },
	
	// Non-English
	{ name:'La Sexta', category:'non-english', source:'http://a3live-lh.akamaihd.net/i/lasexta_1@35272/master.m3u8', site:'http://www.lasexta.com/' },
	{ name:'L!FE', category:'non-english', source:'http://tv.life.ru/lifetv/720p/index.m3u8', site:'https://life.ru/streams' },
	{ name:'L!FE 78', category:'non-english', source:'http://tv78.life.ru/lifetv/720p/index.m3u8', site:'https://life.ru/streams' },
	{ name:'TRT1', category:'non-english', source:'http://trtcanlitv-lh.akamaihd.net/i/TRT1HD_1@181842/master.m3u8', site:'http://www.trt.net.tr/anasayfa/canli.aspx?y=tv&k=trt1' },
];

var player = null;
var channelNumber = 0;
var maxChannel = channels.length - 1;

onload = function() {
	player = bitmovin.player("player");
	player.setup({
		playback: { autoplay: true, muted: false, },
		cast: { enable: true }
	}).then(function(value) {
		console.log("Successfully created bitmovin player instance");
	}, function(reason) {
		console.log("Error while creating bitmovin player instance");
	});
	setTimeout(function () {
		$(".bitmovinplayer-container").css("position", "");
		$("#bmpui-id-139").remove();
		setChannel(channelNumber);
	}, 500);
	
	// Check for fullscreen
	setInterval(function() {
		if (document.webkitIsFullScreen) {
			$('.bitmovinplayer-container').css({"top": "0", "left": "0", "transform": "none"});
		}
		else {
			$('.bitmovinplayer-container').css({"position": "absolute", "top": "50%", "left": "50%", "transform": "translateX(-50%) translateY(-50%)", "max-height": "100vh"});
		}
	}, 25);
};

Element.prototype.remove = function () {
	this.parentElement.removeChild(this);
};

function playStream(hlsSource) {
	player.load({ hls: hlsSource });
	var playInterval = setInterval(function() {
		if (player.isReady() && !player.isStalled() && !player.isPlaying()) {
			clearInterval(playInterval);
			player.play();
		}
	}, 100);
};
			
function setChannel(chNum)
{
	var channel = channels[chNum];
	channelNumber = chNum;
	$.doTimeout("#channel-text"); // cancel channel number fadeout
	$("#channel-text").stop(true, true).fadeTo(0, 1).show(); // reshow channel number
	load(channelNumber);
	
	$('#channel-text').html(channelNumber + ' - ' + channel.name);
	$.doTimeout("#channel-text", 3000, function(){ $("#channel-text").fadeOut(500); }); // fade channel number out after 3 seconds
}

function channelUp()
{
	channelNumber++;
	if (channelNumber > maxChannel)
		channelNumber = 0;
	setChannel(channelNumber);
}

function channelDown()
{
	channelNumber--;
	if (channelNumber < 0)
		channelNumber = maxChannel;
	setChannel(channelNumber);
}

function load(chNum)
{
	var channel = channels[chNum];
	
	
	playStream(channel.source);
}

document.onkeydown = function(evt)
{
	evt = evt || window.event;
	
	if (evt.keyCode == 38) // up arrow
	{
		channelUp();
		return false;
	}
	if (evt.keyCode == 40) // down arrow
	{
		channelDown();
		return false;
	}
	if (evt.keyCode == 32) // space
	{
		var playerType = $('body').data('player-type');
		if (playerType == 'video')
		{
			var player = $('#stream-player')[0];
			if (player.paused)
				player.play();
			else
				player.pause();
		}
		else if (playerType == 'yt')
		{
			var player = $('body').data('yt-player');
			var state = player.getPlayerState();
			if (state == 1 || state == 3)
				player.pauseVideo();
			else
				player.playVideo();
		}
		return false;
	}
};