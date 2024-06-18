chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	sendResponse('我收到了该元素id' + request.value);
	if(request.cmd == 'test') {
		document.getElementById(request.value).style.backgroundColor = 'red'
	};
});
