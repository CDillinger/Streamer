function loadStream(source)
{
	streamPlayerShow(source);
	ytPlayerHide();
}

function loadYTChannel(channel)
{
	ytPlayerShow('https://www.youtube.com/embed/live_stream?autoplay=1&enablejsapi=1&showinfo=0&color=white&rel=0&channel=' + channel);
	streamPlayerHide();
}

function loadYTVideo(video)
{
	ytPlayerShow('https://www.youtube.com/embed/' + video + '?autoplay=1');
	streamPlayerHide();
}

function streamPlayerHide()
{
	if(Hls.isSupported())
	{
		var video = document.getElementById('stream-player');
		var hls = new Hls();
		hls.attachMedia(video);
		hls.on(Hls.Events.MANIFEST_PARSED,function()
		{
			video.load();
			video.pause();
		});
	}
	
	
	var vid = document.getElementById('stream-player'); 
	vid.style.display = 'none';
	vid.load();
	vid.pause();
}

function streamPlayerShow(source)
{
	if(Hls.isSupported())
	{
		var video = document.getElementById('stream-player');
		var hls = new Hls();
		hls.loadSource(source);
		hls.attachMedia(video);
		hls.on(Hls.Events.MANIFEST_PARSED,function()
		{
			video.play();
		});
	}

	var vid = document.getElementById('stream-player'); 
	vid.style.display = '';
}

function ytPlayerHide()
{
	var vid = document.getElementById('youtube-player');
	vid.style.display = 'none';
	var element = document.getElementById('youtube-player'); 
	element.setAttribute('src', ''); // remove source (get rid of audio)
}

function ytPlayerShow(source)
{
	$('#youtube-player').attr('src', source);
	document.getElementById('youtube-player').style.display = '';
}

function setChannel(chNum)
{
	$.doTimeout("#channel-text"); // cancel channel number fadeout
	$("#channel-text").stop(true, true).fadeTo(0, 1).show(); // reshow channel number
	load(chNum);
	$('body').data('chNum', chNum);
	
	var channels = $('body').data('channels');
	var ch = channels[chNum];
	$('#channel-text').html(chNum + ' - ' + ch.name);
	$.doTimeout("#channel-text", 3000, function(){ $("#channel-text").fadeOut(500); }); // fade channel number out after 3 seconds
}

function channelUp()
{
	var chNum = $('body').data('chNum');
	var maxChannel = $('body').data('maxChannel');
	chNum++;
	if (chNum > maxChannel)
		chNum = 0;
	setChannel(chNum);
}

function channelDown()
{
	var chNum = $('body').data('chNum');
	var maxChannel = $('body').data('maxChannel');
	chNum--;
	if (chNum < 0)
		chNum = maxChannel;
	setChannel(chNum);
}

function load(chNum)
{
	var channels = $('body').data('channels');
	var ch = channels[chNum];
	
	switch (ch.type)
	{
		case 'hls':
			loadStream(ch.source);
			break;
		case 'yt-channel':
			loadYTChannel(ch.channel);
			break;
		case 'yt-video':
			loadYTVideo(ch.video);
			break;
	}
	
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
};

$(document).ready(function()
{
	var maxChannel = -1;

	var channels =
	[
		// News
		{name:'Al Jazeera', category:'news', type:'hls', source:'http://aljazeera-eng-hd-live.hls.adaptive.level3.net/aljazeera/english2/index.m3u8', site:'http://www.aljazeera.com/live/'},
		{name:'Arirang Korea', category:'news', type:'hls', source:'http://amdlive.ctnd.com.edgesuite.net/arirang_4ch/smil:arirang_4ch.smil/playlist.m3u8', site:'http://www.arirang.com/player/onair_tv.asp?Channel=CH_K'},
		{name:'Arirang UN', category:'news', type:'hls', source:'http://amdlive.ctnd.com.edgesuite.net/arirang_2ch/smil:arirang_2ch.smil/playlist.m3u8', site:'http://www.arirang.com/player/onair_tv.asp?Channel=CH_Z'},
		{name:'Arirang World', category:'news', type:'hls', source:'http://amdlive.ctnd.com.edgesuite.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8', site:'http://www.arirang.com/player/onair_tv.asp?Channel=CH_W'},
		{name:'CBS News', category:'news', type:'hls', source:'http://cbsnewshd-lh.akamaihd.net/i/CBSNHD_7@199302/master.m3u8', site:'http://www.cbsnews.com/live/'},
		{name:'France24', category:'news', type:'yt-channel', channel:'UCQfwfsi5VrQ8yKZ-UWmAEFg', site:'http://www.france24.com/en/livefeed'},
		{name:'i24 News', category:'news', type:'yt-channel', channel:'UCvHDpsWKADrDia0c99X37vg', site:'http://www.i24news.tv/en/tv/live'},
		{name:'NewsMax', category:'news', type:'yt-channel', channel:'UCx6h-dWzJ5NpAlja1YsApdg', site:'http://www.newsmaxtv.com/'},
		{name:'NHK World', category:'news', type:'hls', source:'http://nhkwglobal-i.akamaihd.net/hls/live/225446/nhkwstv/index.m3u8', site:'http://www3.nhk.or.jp/nhkworld/en/live/'},
		{name:'Press TV', category:'news', type:'hls', source:'http://178.32.255.199:1935/live/ptven/playlist.m3u8', site:'http://www.presstv.com/Default/Live'},
		{name:'RT News', category:'news', type:'hls', source:'http://rtcdn.ashttp14.visionip.tv/live/rtcdn-rtcdn-rt-hsslive-25f-16x9-HD/playlist.m3u8', site:'https://www.rt.com/on-air/'},
		{name:'RT America', category:'news', type:'hls', source:'http://rtcdn.ashttp14.visionip.tv/live/rtcdn-rtcdn-usa-hsslive-25f-16x9-HD/playlist.m3u8', site:'https://www.rt.com/on-air/rt-america-air/'},
		{name:'RT UK', category:'news', type:'hls', source:'http://rtcdn.ashttp14.visionip.tv/live/rtcdn-rtcdn-uk-hsslive-25f-16x9-HD/playlist.m3u8', site:'https://www.rt.com/on-air/rt-uk-air/'},
		{name:'Sky News', category:'news', type:'yt-video', video:'y60wDzZt8yg', site:'http://news.sky.com/watch-live'},
		{name:'TRT World', category:'news', type:'hls', source:'http://trtcanlitv-lh.akamaihd.net/i/TRTWORLD_1@321783/master.m3u8', site:'http://www.trtworld.com/live'},
		
		// Music
		{name:'1HD', category:'music', type:'hls', source:'http://80.250.191.10:8090/hls/mystream.m3u8', site:'http://1hd.ru/video.php'},
		{name:'1HD Secondary', category:'music', type:'hls', source:'http://80.250.191.10:1935/live/hlsstream343/playlist.m3u8', site:'http://1hd.ru/video.php'},
		{name:'Arirang Radio', category:'music', type:'hls', source:'http://amdlive.ctnd.com.edgesuite.net/arirang_3ch/smil:arirang_3ch.smil/playlist.m3u8', site:'http://www.arirang.com/player/onair_radio.asp'},
		{name:'Beatz HD', category:'music', type:'hls', source:'http://rtmp.infomaniak.ch/livecast/beats_1/playlist.m3u8', site:'http://www.radiopilatus.ch/livecenter/2'},
		{name:'Capital TV', category:'music', type:'hls', source:'http://ooyalahd2-f.akamaihd.net/i/globalradio01_delivery@156521/master.m3u8', site:'http://www.capitalfm.com/tv/'},
		{name:'Chillhop Cafe', category:'music', type:'yt-channel', channel:'UCOxqgCwgOqC2lMqC5PYz_Dg', site:'https://www.youtube.com/channel/UCOxqgCwgOqC2lMqC5PYz_Dg'},
		// {name:'DJing', category:'music', type:'hls', source:'http://www.djing.com/tv/live.m3u8', site:'http://www.djing.com/?channel=live'},
		// {name:'DJing Animation', category:'music', type:'hls', source:'http://www.djing.com/tv/a-05.m3u8', site:'http://www.djing.com/?channel=animation'},
		// {name:'DJing Classic', category:'music', type:'hls', source:'http://www.djing.com/tv/i-05.m3u8', site:'http://www.djing.com/?channel=classics'},
		// {name:'DJing Ibiza', category:'music', type:'hls', source:'http://www.djing.com/tv/d-05.m3u8', site:'http://www.djing.com/?channel=ibiza'},
		// {name:'DJing Underground', category:'music', type:'hls', source:'http://www.djing.com/tv/u-05.m3u8', site:'http://www.djing.com/?channel=underground'},
		// {name:'Dot Dance', category:'music', type:'hls', source:'http://live.dotdance.cdnvideo.ru/dotdance/dotdance.sdp/chunklist.m3u8', site:'http://dotdance.tv/'},
		{name:'The Grand Sound', category:'music', type:'yt-channel', channel:'UC14ap4T608Zz_Mz4eezhIqw', site:'https://www.youtube.com/channel/UC14ap4T608Zz_Mz4eezhIqw'},
		{name:'Heart TV', category:'music', type:'hls', source:'http://ooyalahd2-f.akamaihd.net/i/globalradio02_delivery@156522/master.m3u8', site:'http://www.heart.co.uk/tv/player/'},
		{name:'Kronehit TV', category:'music', type:'hls', source:'http://bitcdn-kronehit-live.bitmovin.com/hls/1500k/bitcodin.m3u8', site:'http://www.kronehit.at/alles-ueber-kronehit/tv/'},
		{name:'Magical Music Radio', category:'music', type:'yt-channel', channel:'UCwPomyIUWBsysfwuEfMx_3A', site:'https://www.youtube.com/channel/UCwPomyIUWBsysfwuEfMx_3A'},
		{name:'Monstercat FM', category:'music', type:'yt-channel', channel:'UCJ6td3C9QlPO9O_J5dF4ZzA', site:'http://live.monstercat.com/'},
		{name:'PowerTurk TV', category:'music', type:'hls', source:'http://powertv.cdnturk.com/powertv/powerturktv.smil/playlist.m3u8', site:'http://www.powerapp.com.tr/tv/powerTurkTV'},
		{name:'RadioU TV', category:'music', type:'hls', source:'http://cdn.rbm.tv/rightbrainmedia-live-109/_definst_/smil:radioutv_all.smil/playlist.m3u8', site:'http://radiou.com/tv/'},
		{name:'Silk Radio', category:'music', type:'yt-channel', channel:'UCX4sShAQf01LYjYQhG2ZgKg', site:'https://www.youtube.com/channel/UCX4sShAQf01LYjYQhG2ZgKg'},
	];
	
	$('body').data('channels', channels);
	
	maxChannel = channels.length - 1;
	$('body').data('maxChannel', maxChannel);
	setInterval(function(){ window.focus(); }, 200);
	
	setChannel(0);
	
	$('body').flowtype({ fontRatio: 60 });
});