// JSON state file with checked channels
var channelStateFile = 'channels/channels.json';

// Channels array will be populated from JSON state file
var channels = [];

var player = null;
var channelNumber = 0;
var maxChannel = 0;
var playInterval = null;

// Channel number input
var typedChannelNumber = '';
var channelInputTimeout = null;

// Load last watched channel from localStorage
function getLastChannel() {
	try {
		var saved = localStorage.getItem('lastChannel');
		return saved ? parseInt(saved) : 0;
	} catch (e) {
		return 0;
	}
}

// Save current channel to localStorage
function saveLastChannel(chNum) {
	try {
		localStorage.setItem('lastChannel', chNum.toString());
	} catch (e) {
		// Ignore errors (private browsing, etc.)
	}
}

// Channel Search
var searchActive = false;
var searchSelectedIndex = 0;
var searchResults = [];

function fuzzySearch(query) {
	if (!query || query.length === 0) {
		return [];
	}

	query = query.toLowerCase();
	var results = [];

	channels.forEach(function(channel, index) {
		var name = channel.name.toLowerCase();
		var category = (channel.category || '').toLowerCase();

		// Score the match
		var score = 0;

		// Exact match gets highest score
		if (name === query) {
			score = 1000;
		}
		// Starts with query
		else if (name.startsWith(query)) {
			score = 500;
		}
		// Contains query
		else if (name.indexOf(query) !== -1) {
			score = 100;
		}
		// Fuzzy match - check if all characters appear in order
		else {
			var nameIndex = 0;
			var matched = true;
			for (var i = 0; i < query.length; i++) {
				var charIndex = name.indexOf(query[i], nameIndex);
				if (charIndex === -1) {
					matched = false;
					break;
				}
				nameIndex = charIndex + 1;
			}
			if (matched) {
				score = 50;
			}
		}

		// Also check category
		if (category.indexOf(query) !== -1) {
			score += 25;
		}

		if (score > 0) {
			results.push({
				channel: channel,
				index: index,
				score: score
			});
		}
	});

	// Sort by score descending
	results.sort(function(a, b) {
		return b.score - a.score;
	});

	return results.slice(0, 20); // Return top 20 results
}

function openSearch() {
	searchActive = true;
	searchSelectedIndex = 0;
	searchResults = [];

	$('#channel-search').show();
	$('#search-input').val('').focus();
	$('#search-results').html('');
}

function closeSearch() {
	searchActive = false;
	$('#channel-search').hide();
	$('#search-input').val('');
	$('#search-results').html('');
}

function updateSearchResults() {
	var query = $('#search-input').val();
	searchResults = fuzzySearch(query);
	searchSelectedIndex = 0;

	var resultsHtml = '';

	if (searchResults.length === 0 && query.length > 0) {
		resultsHtml = '<div class="no-results">No channels found</div>';
	} else {
		searchResults.forEach(function(result, idx) {
			var selectedClass = idx === searchSelectedIndex ? 'selected' : '';
			resultsHtml += '<div class="search-result-item ' + selectedClass + '" data-index="' + idx + '">' +
				'<span class="search-result-number">#' + result.index + '</span>' +
				'<div class="search-result-name">' + result.channel.name + '</div>' +
				'<div class="search-result-category">' + (result.channel.category || 'Other') + '</div>' +
			'</div>';
		});
	}

	$('#search-results').html(resultsHtml);

	// Add click handlers
	$('.search-result-item').click(function() {
		var idx = parseInt($(this).attr('data-index'));
		selectSearchResult(idx);
	});
}

function selectSearchResult(idx) {
	if (idx >= 0 && idx < searchResults.length) {
		var channelIndex = searchResults[idx].index;
		closeSearch();
		setChannel(channelIndex);
	}
}

function moveSearchSelection(direction) {
	if (searchResults.length === 0) return;

	searchSelectedIndex += direction;
	if (searchSelectedIndex < 0) {
		searchSelectedIndex = searchResults.length - 1;
	} else if (searchSelectedIndex >= searchResults.length) {
		searchSelectedIndex = 0;
	}

	// Update UI
	$('.search-result-item').removeClass('selected');
	$('.search-result-item').eq(searchSelectedIndex).addClass('selected');

	// Scroll into view
	var selectedElem = $('.search-result-item').eq(searchSelectedIndex);
	if (selectedElem.length) {
		selectedElem[0].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
	}
}

// Load channels from JSON state file
function loadChannels(callback) {
	var allChannels = [];

	// Load channels from JSON state file
	fetch(channelStateFile)
		.then(function(response) {
			if (!response.ok) {
				throw new Error('Failed to load channel state file');
			}
			return response.json();
		})
		.then(function(state) {
			console.log('Loaded channel state file');
			console.log('Success channels available:', state.success.length);

			// Convert successful channels to our format
			state.success.forEach(function(channel) {
				// Use final_url if redirect occurred, otherwise use url
				var streamUrl = channel.final_url || channel.url;

				allChannels.push({
					name: channel.name,
					category: channel.category || 'Other',
					source: streamUrl,
					logo: channel.logo || '',
					site: '',
					redirected: channel.redirected || false
				});
			});

			callback(allChannels);
		})
		.catch(function(error) {
			console.error('Error loading channel state file:', error);
			callback(allChannels);
		});
}

// Initialize player
function initPlayer() {
	player = videojs('player', {
		autoplay: true,
		muted: true,
		controls: true,
		fluid: false,
		fill: true,
		liveui: true,
		responsive: false
	});

	player.ready(function() {
		console.log("Successfully created Video.js player instance");
		setChannel(channelNumber);
	});
}

// Load channels on page load
onload = function() {
	console.log("Loading channels from JSON state file...");
	loadChannels(function(loadedChannels) {
		channels = loadedChannels;
		maxChannel = channels.length - 1;
		console.log("Loaded " + channels.length + " channels");

		if (channels.length === 0) {
			console.error("No channels loaded!");
			return;
		}

		// Restore last watched channel
		var lastChannel = getLastChannel();
		if (lastChannel >= 0 && lastChannel <= maxChannel) {
			channelNumber = lastChannel;
			console.log("Resuming from channel " + channelNumber);
		} else {
			channelNumber = 0;
		}

		initPlayer();

		// Initialize search
		$('#search-input').on('input', function() {
			updateSearchResults();
		});
	});
};

Element.prototype.remove = function () {
	this.parentElement.removeChild(this);
};

function playStream(hlsSource) {
	// Clear any existing play interval from previous stream
	if (playInterval) {
		clearInterval(playInterval);
		playInterval = null;
	}

	if (player) {
		// Set new source - autoplay is enabled so it will play automatically
		player.src({
			src: hlsSource,
			type: 'application/x-mpegURL'
		});
	}
};
			
function setChannel(chNum)
{
	if (chNum < 0 || chNum >= channels.length) {
		console.error("Invalid channel number: " + chNum);
		return;
	}

	var channel = channels[chNum];
	if (!channel) {
		console.error("Channel " + chNum + " not found");
		return;
	}

	channelNumber = chNum;
	load(channelNumber);

	// Save to localStorage
	saveLastChannel(channelNumber);

	// Update and show channel text
	$('#channel-text').html(channelNumber + ' - ' + channel.name);
	$('#channel-text').css('opacity', '1');

	// Fade out after 3 seconds (but still visible on hover)
	setTimeout(function() {
		$('#channel-text').css('opacity', '0');
	}, 3000);
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

	if (!channel) {
		console.error("Channel " + chNum + " not found");
		return;
	}

	playStream(channel.source);
}

document.onkeydown = function(evt)
{
	evt = evt || window.event;

	// Handle search mode
	if (searchActive) {
		if (evt.keyCode == 27) { // ESC
			closeSearch();
			return false;
		}
		else if (evt.keyCode == 38) { // Up arrow
			moveSearchSelection(-1);
			return false;
		}
		else if (evt.keyCode == 40) { // Down arrow
			moveSearchSelection(1);
			return false;
		}
		else if (evt.keyCode == 13) { // Enter
			selectSearchResult(searchSelectedIndex);
			return false;
		}
		// Let other keys pass through to the input field
		return;
	}

	// Open search with '/' or 's'
	if (evt.keyCode == 191 || evt.keyCode == 83) { // '/' or 's'
		openSearch();
		return false;
	}

	// Handle number keys (0-9) for direct channel entry
	if ((evt.keyCode >= 48 && evt.keyCode <= 57) || (evt.keyCode >= 96 && evt.keyCode <= 105))
	{
		// Get the digit (works for both main keyboard and numpad)
		var digit = evt.keyCode >= 96 ? (evt.keyCode - 96).toString() : String.fromCharCode(evt.keyCode);

		// Add digit to typed channel number
		typedChannelNumber += digit;

		// Show the typed number in channel text
		$('#channel-text').html('Channel: ' + typedChannelNumber).css('opacity', '1');

		// Clear existing timeout
		if (channelInputTimeout) {
			clearTimeout(channelInputTimeout);
		}

		// Set timeout to switch channel after 2 seconds of no input
		channelInputTimeout = setTimeout(function() {
			var targetChannel = parseInt(typedChannelNumber);
			if (targetChannel >= 0 && targetChannel <= maxChannel) {
				setChannel(targetChannel);
			} else {
				// Invalid channel, show error briefly
				$('#channel-text').html('Invalid channel: ' + typedChannelNumber);
				setTimeout(function() {
					$('#channel-text').html(channelNumber + ' - ' + channels[channelNumber].name).css('opacity', '0');
				}, 1500);
			}
			typedChannelNumber = '';
		}, 2000);

		return false;
	}

	// Handle Enter key to navigate immediately
	if (evt.keyCode == 13) // Enter
	{
		if (typedChannelNumber !== '') {
			// Clear timeout
			if (channelInputTimeout) {
				clearTimeout(channelInputTimeout);
				channelInputTimeout = null;
			}

			// Navigate to channel immediately
			var targetChannel = parseInt(typedChannelNumber);
			if (targetChannel >= 0 && targetChannel <= maxChannel) {
				setChannel(targetChannel);
			} else {
				// Invalid channel, show error briefly
				$('#channel-text').html('Invalid channel: ' + typedChannelNumber);
				setTimeout(function() {
					$('#channel-text').html(channelNumber + ' - ' + channels[channelNumber].name).css('opacity', '0');
				}, 1500);
			}
			typedChannelNumber = '';
			return false;
		}
	}

	// Clear typed channel number if any other key is pressed
	if (typedChannelNumber !== '') {
		typedChannelNumber = '';
		if (channelInputTimeout) {
			clearTimeout(channelInputTimeout);
			channelInputTimeout = null;
		}
		$('#channel-text').html(channelNumber + ' - ' + channels[channelNumber].name).css('opacity', '0');
	}

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
		if (player) {
			if (player.paused()) {
				player.play();
			} else {
				player.pause();
			}
		}
		return false;
	}
};