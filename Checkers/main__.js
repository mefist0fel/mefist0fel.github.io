var localPeerConnection, remotePeerConnection, sendChannel, receiveChannel;

localPeerConnection = new RTCPeerConnection(null, {
  optional: [{
    RtpDataChannels: true
  }]
});

localPeerConnection.onicecandidate = function(event) {
  if (event.candidate) {
    remotePeerConnection.addIceCandidate(event.candidate);
  }
};

sendChannel = localPeerConnection.createDataChannel("CHANNEL_NAME", {
  reliable: false
});

sendChannel.onopen = function(event) {
  var readyState = sendChannel.readyState;
  if (readyState == "open") {
    sendChannel.send("Hello");
  }
};

remotePeerConnection = new RTCPeerConnection(null, {
  optional: [{
    RtpDataChannels: true
  }]
});

remotePeerConnection.onicecandidate = function(event) {
  if (event.candidate) {
    localPeerConnection.addIceCandidate(event.candidate);
  }
};

remotePeerConnection.ondatachannel = function(event) {
  receiveChannel = event.channel;
  receiveChannel.onmessage = function(event) {
	  console.log(event.data);
    alert(event.data);
  };
};


var startButton = document.querySelector('button#startButton');

startButton.onclick = createConnection;

function createConnection() {
	console.log("fff");
	localPeerConnection.createOffer(function(desc) {
	  localPeerConnection.setLocalDescription(desc);
	  remotePeerConnection.setRemoteDescription(desc);
	  remotePeerConnection.createAnswer(function(desc) {
		remotePeerConnection.setLocalDescription(desc);
		localPeerConnection.setRemoteDescription(desc);
	  });
	});
}