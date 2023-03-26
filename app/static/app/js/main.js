var mediaRecorder = null;

navigator.mediaDevices.getUserMedia({ video: true })
.then(function(stream) {
  var video = document.getElementById("video");
  video.srcObject = stream;

  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = function(e) {
      var url = window.URL.createObjectURL(e.data);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'recorded.webm';
      document.body.appendChild(a);
      a.click();
  };
})
.catch(function(err) {
  console.log("An error occurred! " + err);
});

function startRecording() {
  // Start recording
  var video = document.getElementById("video");
  video.play();
  mediaRecorder.start();
  console.log("Recording started");
}

function stopRecording() {
  // Stop recording
  if (mediaRecorder.state === 'inactive') return
  mediaRecorder.stop();
  console.log("Recording stopped");
  var video = document.getElementById("video");
  video.pause();
}