document.getElementById("btn").addEventListener("click", handleSubmit);
function handleSubmit() {
  const val = document.getElementById('input').value
  console.log('获取input的值====>', val)

  sendMessageToContentScript({cmd:'test', value:val}, function(response) {
    console.log('来自content的回复：'+ response);
  });
}

function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
      if(callback) callback(response);
    });
  });
}