console.log("ver 3")


//var pc_config = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
//var pc_constraints = {"optional": [{"DtlsSrtpKeyAgreement": true}]};
//pc = new RTCPeerConnection(pc_config, pc_constraints);
//pc.onicecandidate = onIceCandidate;
//pc.onaddstream = onRemoteStreamAdded;

  var servers = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
  var pcConstraint = {"optional": [{"DtlsSrtpKeyAgreement": true}]};
var localConnection;
var remoteConnection;
var sendChannel;
var receiveChannel;
var pcConstraint;
var dataConstraint;
//var dataChannelSend = document.querySelector('textarea#dataChannelSend');
//var dataChannelReceive = document.querySelector('textarea#dataChannelReceive');
var startButton = document.querySelector('button#startButton');
var connectButton = document.querySelector('button#connectButton');
var sendButton = document.querySelector('button#sendButton');
var localIceCandidates = []
//var closeButton = document.querySelector('button#closeButton');

startButton.onclick = createConnection;
connectButton.onclick = answerConnection;
sendButton.onclick = sendData;
//closeButton.onclick = closeDataChannels;
var temp = null;


function createConnection() {
  dataConstraint = null;
  // SCTP is supported from Chrome 31 and is supported in FF.
  // No need to pass DTLS constraint as it is on by default in Chrome 31.
  // For SCTP, reliable and ordered is true by default.
  // Add localConnection to global scope to make it visible
  // from the browser console.
  window.localConnection = localConnection = new RTCPeerConnection(servers, pcConstraint);
  
  sendChannel = localConnection.createDataChannel('sendDataChannel', dataConstraint);

  localConnection.onicecandidate = onLocalIceCandidate;

  sendChannel.onopen = onSendChannelStateChange;
  sendChannel.onclose = onSendChannelStateChange;
  localConnection.ondatachannel = receiveChannelCallback;
  //
  localConnection.createOffer().then(
    function(description) {
		console.log("create offer");
		console.log(description);
		temp = description;
		localConnection.setLocalDescription(description);
	},
    onCreateSessionDescriptionError
  );
  //remoteConnection.ondatachannel = receiveChannelCallback;
}
function answerConnection() {
	window.remoteConnection = remoteConnection = new RTCPeerConnection(servers, pcConstraint);

	remoteConnection.onicecandidate = onRemoteIceCandidate;
	remoteConnection.ondatachannel = receiveChannelCallback;

	remoteConnection.setRemoteDescription(temp);
	remoteConnection.createAnswer().then(
		function(desc2) {
			console.log("create answer");
			console.log(desc2);
			localIceCandidates.forEach(function(item, i, arr) {
				if (item != null) {
					console.log(item);
					remoteConnection.addIceCandidate(item);
				}
			});
			remoteConnection.setLocalDescription(desc2);
			localConnection.setRemoteDescription(desc2);
		},
		onCreateSessionDescriptionError
	);
}

function onCreateSessionDescriptionError(error) {
  trace('Failed to create session description: ' + error.toString());
}

function sendData() {
  sendChannel.send("123");
}

function closeDataChannels() {
  trace('Closing data channels');
  sendChannel.close();
  trace('Closed data channel with label: ' + sendChannel.label);
  receiveChannel.close();
  trace('Closed data channel with label: ' + receiveChannel.label);
  localConnection.close();
  remoteConnection.close();
  localConnection = null;
  remoteConnection = null;
  trace('Closed peer connections');
  startButton.disabled = false;
  sendButton.disabled = true;
  closeButton.disabled = true;
  dataChannelSend.value = '';
  dataChannelReceive.value = '';
  dataChannelSend.disabled = true;
  disableSendButton();
  enableStartButton();
}

function gotDescriptionLocal(desc) {
  //localConnection.setLocalDescription(desc);
  console.log("gotDescriptionLocal");
  console.log(desc);
  //remoteConnection.setRemoteDescription(desc);
  //remoteConnection.createAnswer().then(
  //  gotDescription2,
  //  onCreateSessionDescriptionError
  //);
}

function gotDescription2(desc) {
  remoteConnection.setLocalDescription(desc);
  trace('Answer from remoteConnection \n' + desc.sdp);
  localConnection.setRemoteDescription(desc);
}

function getOtherPc(pc) {
  return (pc === localConnection) ? remoteConnection : localConnection;
}

function getName(pc) {
  return (pc === localConnection) ? 'localPeerConnection' :
      'remotePeerConnection';
}

function onLocalIceCandidate(event) {
	localIceCandidates.push(event.candidate);
}

function onRemoteIceCandidate(event) {
  console.log("onIceCandidate");
console.log(event);
//  getOtherPc(pc).addIceCandidate(event.candidate)
//  .then(
//    function() {},
//    function(error) {
//		console.log("add ice candidate error " + error);
//	}
//  );
}

function getOtherPc(pc) {
  return (pc === localConnection) ? remoteConnection : localConnection;
}

function onAddIceCandidateSuccess() {
  trace('AddIceCandidate success.');
}

function onAddIceCandidateError(error) {
  trace('Failed to add Ice Candidate: ' + error.toString());
}

function receiveChannelCallback(event) {
  console.log('Receive Channel Callback');
  console.log(event);
  receiveChannel = event.channel;
  receiveChannel.onmessage = onReceiveMessageCallback;
  receiveChannel.onopen = onReceiveChannelStateChange;
  receiveChannel.onclose = onReceiveChannelStateChange;
}

function onReceiveMessageCallback(event) {
  console.log(event.data);
  //trace('Received Message');
  //dataChannelReceive.value = event.data;
}

function onSendChannelStateChange() {
  var readyState = sendChannel.readyState;
  console.log('Send channel state is: ' + readyState);
//  if (readyState === 'open') {
//    dataChannelSend.disabled = false;
//    dataChannelSend.focus();
//    sendButton.disabled = false;
//    closeButton.disabled = false;
//  } else {
//    dataChannelSend.disabled = true;
//    sendButton.disabled = true;
//    closeButton.disabled = true;
//  }
}

function onReceiveChannelStateChange() {
  //var readyState = receiveChannel.readyState;
  //trace('Receive channel state is: ' + readyState);
}