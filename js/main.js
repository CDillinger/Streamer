function loadStream(source)
{
	streamPlayerShow(source);
	ytPlayerHide();
}

// function loadYTChannel(channel)
// {
// 	ytPlayerShow('https://www.youtube.com/embed/live_stream?autoplay=1&controls=0&disablekb=1&enablejsapi=1&fs=0&modestbranding=1&rel=0&showinfo=0&channel=' + channel);
// 	streamPlayerHide();
// }

function loadYTVideo(video)
{
	ytPlayerShow(video);
	streamPlayerHide();
}

function streamPlayerHide()
{
	$('#stream-player').hide();
	$('#stream-player')[0].pause();
}

function streamPlayerShow(source)
{
	$('#stream-player').show();
	
	if(Hls.isSupported())
	{
		var hls = new Hls();
		hls.loadSource(source);
		hls.attachMedia($('#stream-player')[0]);
		hls.on(Hls.Events.MANIFEST_PARSED,function()
		{
			$('#stream-player')[0].play();
		});
	}
}

function ytPlayerHide()
{	
	var player = $('body').data('yt-player');
	if (player != null)
		player.destroy();
	$('body').data('yt-player', null);
}

function ytPlayerShow(id)
{
	var player = $('body').data('yt-player');
	if (player != null)
	{
		var player = $('body').data('yt-player');
		player.loadVideoById(id);
	}
	else
	{
		var player = new YT.Player('youtube-player',
		{
			width: '',
			height: '',
			playerVars: { 'autoplay': 1, 'controls': 0, 'disablekb': 1, 'enablejsapi': 1, 'modestbranding': 1, 'rel': 0, 'showinfo': 0 },
			events:
			{
				'onReady': function() { player.loadVideoById(id); }
			}
		});
		$('body').data('yt-player', player);
	}
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
			if (ch.needsCORS)
				break;
			loadStream(ch.source);
			$('body').data('player-type', 'video');
			break;
		case 'yt-channel':
			// loadYTChannel(ch.channel);
			// $('body').data('player-type', 'yt');
			// break;
		case 'yt-video':
			loadYTVideo(ch.video);
			$('body').data('player-type', 'yt');
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

$(document).ready(function()
{	
	var maxChannel = -1;

	var channels =
	[
		// News
		{name:'Al Jazeera', category:'news', type:'hls', needsCORS:false, source:'http://aljazeera-eng-hd-live.hls.adaptive.level3.net/aljazeera/english2/index.m3u8', site:'http://www.aljazeera.com/live/'},
		{name:'CBS News', category:'news', type:'hls', needsCORS:false, source:'http://cbsnewshd-lh.akamaihd.net/i/CBSNHD_7@199302/master.m3u8', site:'http://www.cbsnews.com/live/'},
		{name:'France24', category:'news', type:'yt-channel', video:'2JnKgrsMZXQ', channel:'UCQfwfsi5VrQ8yKZ-UWmAEFg', site:'http://www.france24.com/en/livefeed'},
		{name:'i24 News', category:'news', type:'yt-channel', video:'Wx9dkJW-SRY', channel:'UCvHDpsWKADrDia0c99X37vg', site:'http://www.i24news.tv/en/tv/live'},
		{name:'NewsMax', category:'news', type:'yt-channel', video:'a4uUEXZjigo', channel:'UCx6h-dWzJ5NpAlja1YsApdg', site:'http://www.newsmaxtv.com/'},
		{name:'Press TV', category:'news', type:'hls', needsCORS:false, source:'http://178.32.255.199:1935/live/ptven/playlist.m3u8', site:'http://www.presstv.com/Default/Live'},
		// {name:'RT News', category:'news', type:'hls', needsCORS:true, source:'http://rtcdn.ashttp14.visionip.tv/live/rtcdn-rtcdn-rt-hsslive-25f-16x9-HD/playlist.m3u8', site:'https://www.rt.com/on-air/'},
		// {name:'RT America', category:'news', type:'hls', needsCORS:true, source:'http://rtcdn.ashttp14.visionip.tv/live/rtcdn-rtcdn-usa-hsslive-25f-16x9-HD/playlist.m3u8', site:'https://www.rt.com/on-air/rt-america-air/'},
		// {name:'RT UK', category:'news', type:'hls', needsCORS:true, source:'http://rtcdn.ashttp14.visionip.tv/live/rtcdn-rtcdn-uk-hsslive-25f-16x9-HD/playlist.m3u8', site:'https://www.rt.com/on-air/rt-uk-air/'},
		{name:'Sky News', category:'news', type:'yt-video', video:'y60wDzZt8yg', site:'http://news.sky.com/watch-live'},
		
		// Music
		{name:'1HD', category:'music', type:'hls', needsCORS:false, source:'http://80.250.191.10:8090/hls/mystream.m3u8', site:'http://1hd.ru/video.php'},
		// {name:'1HD Secondary', category:'music', type:'hls', needsCORS:true, source:'http://80.250.191.10:1935/live/hlsstream343/playlist.m3u8', site:'http://1hd.ru/video.php'},
		{name:'Arirang Radio', category:'music', type:'hls', source:'http://amdlive.ctnd.com.edgesuite.net/arirang_3ch/smil:arirang_3ch.smil/playlist.m3u8', site:'http://www.arirang.com/player/onair_radio.asp'},
		{name:'Beatz HD', category:'music', type:'hls', needsCORS:false, source:'http://rtmp.infomaniak.ch/livecast/beats_1/playlist.m3u8', site:'http://www.radiopilatus.ch/livecenter/2'},
		{name:'Capital TV', category:'music', type:'hls', needsCORS:false, source:'http://ooyalahd2-f.akamaihd.net/i/globalradio01_delivery@156521/master.m3u8', site:'http://www.capitalfm.com/tv/'},
		{name:'Chillhop Cafe', category:'music', type:'yt-channel', video:'DCoY5ot8zg4', channel:'UCOxqgCwgOqC2lMqC5PYz_Dg', site:'https://www.youtube.com/channel/UCOxqgCwgOqC2lMqC5PYz_Dg'},
		// {name:'DJing', category:'music', type:'hls', needsCORS:true, source:'http://www.djing.com/tv/live.m3u8', site:'http://www.djing.com/?channel=live'},
		// {name:'DJing Animation', category:'music', type:'hls', needsCORS:true, source:'http://www.djing.com/tv/a-05.m3u8', site:'http://www.djing.com/?channel=animation'},
		// {name:'DJing Classic', category:'music', type:'hls', needsCORS:true, source:'http://www.djing.com/tv/i-05.m3u8', site:'http://www.djing.com/?channel=classics'},
		// {name:'DJing Ibiza', category:'music', type:'hls', needsCORS:true, source:'http://www.djing.com/tv/d-05.m3u8', site:'http://www.djing.com/?channel=ibiza'},
		// {name:'DJing Underground', category:'music', type:'hls', needsCORS:true, source:'http://www.djing.com/tv/u-05.m3u8', site:'http://www.djing.com/?channel=underground'},
		// {name:'Dot Dance', category:'music', type:'hls', needsCORS:true, source:'http://live.dotdance.cdnvideo.ru/dotdance/dotdance.sdp/chunklist.m3u8', site:'http://dotdance.tv/'},
		{name:'The Grand Sound', category:'music', type:'yt-channel', video:'Hzr6MoqYFV0', channel:'UC14ap4T608Zz_Mz4eezhIqw', site:'https://www.youtube.com/channel/UC14ap4T608Zz_Mz4eezhIqw'},
		{name:'Heart TV', category:'music', type:'hls', needsCORS:false, source:'http://ooyalahd2-f.akamaihd.net/i/globalradio02_delivery@156522/master.m3u8', site:'http://www.heart.co.uk/tv/player/'},
		{name:'Kronehit TV', category:'music', type:'hls', needsCORS:false, source:'http://bitcdn-kronehit-live.bitmovin.com/hls/1500k/bitcodin.m3u8', site:'http://www.kronehit.at/alles-ueber-kronehit/tv/'},
		{name:'Monstercat FM', category:'music', type:'yt-channel', video:'4R-JGw3VTuY', channel:'UCJ6td3C9QlPO9O_J5dF4ZzA', site:'http://live.monstercat.com/'},
		{name:'PowerTurk TV', category:'music', type:'hls', needsCORS:false, source:'http://powertv.cdnturk.com/powertv/powerturktv.smil/playlist.m3u8', site:'http://www.powerapp.com.tr/tv/powerTurkTV'},
		{name:'RadioU TV', category:'music', type:'hls', needsCORS:false, source:'http://cdn.rbm.tv/rightbrainmedia-live-109/_definst_/smil:radioutv_all.smil/playlist.m3u8', site:'http://radiou.com/tv/'},
		{name:'Silk Radio', category:'music', type:'yt-channel', video:'5Y-hyFU_8bk', channel:'UCX4sShAQf01LYjYQhG2ZgKg', site:'https://www.youtube.com/channel/UCX4sShAQf01LYjYQhG2ZgKg'},
		
		{name:'Arirang Korea', category:'network', type:'hls', needsCORS:false, source:'http://amdlive.ctnd.com.edgesuite.net/arirang_4ch/smil:arirang_4ch.smil/playlist.m3u8', site:'http://www.arirang.com/player/onair_tv.asp?Channel=CH_K'},
		{name:'Arirang UN', category:'network', type:'hls', needsCORS:false, source:'http://amdlive.ctnd.com.edgesuite.net/arirang_2ch/smil:arirang_2ch.smil/playlist.m3u8', site:'http://www.arirang.com/player/onair_tv.asp?Channel=CH_Z'},
		{name:'Arirang World', category:'network', type:'hls', needsCORS:false, source:'http://amdlive.ctnd.com.edgesuite.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8', site:'http://www.arirang.com/player/onair_tv.asp?Channel=CH_W'},
		{name:'BYU TV', category:'network', type:'hls', needsCORS:false, source:'http://byuhd2-lh.akamaihd.net/i/byutvhd2_live@103136/master.m3u8', site:'http://www.byutv.org/watch/livetv'},
		{name:'NHK World', category:'network', type:'hls', needsCORS:false, source:'http://nhkwglobal-i.akamaihd.net/hls/live/225446/nhkwstv/index.m3u8', site:'http://www3.nhk.or.jp/nhkworld/en/live/'},
	];
	
	$('body').data('channels', channels);
	
	maxChannel = channels.length - 1;
	$('body').data('maxChannel', maxChannel);
	
	setChannel(0);
	
	$('body').flowtype({ fontRatio: 60 });
	
	setInterval(function(){ window.focus(); }, 200);
});