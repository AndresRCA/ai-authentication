const video = document.getElementById("video");
const record = document.getElementById("record");

let mediaRecorder;
let chunks = [];

navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    // video
    video.srcObject = stream;
    video.play();

    // audio
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.addEventListener("dataavailable", (event) => {
      chunks.push(event.data);
    });
    mediaRecorder.addEventListener("stop", () => {
      const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
      chunks = [];

      const url = URL.createObjectURL(blob);
      audio.src = url;

      // download the audio
      var a = document.createElement('a');
      a.href = url;
      a.download = 'recording.ogg';
      document.body.appendChild(a);
      a.click();
    });
  })
  .catch((err) => console.log(err));

function takePhoto() {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.getContext("2d").drawImage(video, 0, 0);

  const data = canvas.toDataURL("image/png");
  
  // Add this line to download the image
  var a = document.createElement('a');
  a.href = data;
  a.download = 'photo.png';
  document.body.appendChild(a);
  a.click();
}

function recordVoice() {
  if (mediaRecorder.state === "inactive") {
    mediaRecorder.start();
    record.textContent = "Stop";
    // add recording animation
    record.classList.add("active");
  } else {
    mediaRecorder.stop();
    record.textContent = "Record";
    // remove animation
    record.classList.remove("active");
  }
}