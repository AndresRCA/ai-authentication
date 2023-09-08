import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiClientService } from 'src/app/core/services/api-client.service';

@Component({
  selector: 'app-voice',
  templateUrl: './voice.component.html',
  styleUrls: ['./voice.component.scss']
})
export class VoiceComponent {
  @ViewChild('recordEl') recordEl!: ElementRef<HTMLButtonElement>;

  private mediaRecorder!: MediaRecorder;
  private currentAudio!: Blob;
  private formData: FormData = new FormData();

  constructor (private apiClientService: ApiClientService) {
    // audio setup
    let audioChunks: Blob[] = [];

    navigator.mediaDevices.getUserMedia({ audio: true }).then((audioStream) => {
      this.mediaRecorder = new MediaRecorder(audioStream);

      this.mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      this.mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        // save current recording
        this.currentAudio = audioBlob;
        console.log('audioBlob', audioBlob);
        this.formData = new FormData();
        this.formData.append("audio", audioBlob);
        console.log('formData', this.formData);

        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play(); // play audio after recording stops

        // create audio file
        const blob = new Blob(audioChunks, { type: "audio/ogg; codecs=opus" });
        audioChunks = []; // reset audio chunks

        const url = URL.createObjectURL(blob);
        console.log('audio blob url', url);

        // download the audio
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recording.ogg';
        document.body.appendChild(a);
        a.click();
      });
    });
  }
  
  recordVoice() {
    if (this.mediaRecorder.state === "inactive") {
      this.mediaRecorder.start();
      this.recordEl.nativeElement.textContent = "Stop";
      // add recording animation
      this.recordEl.nativeElement.classList.add("active");
    } else {
      this.mediaRecorder.stop();
      this.recordEl.nativeElement.textContent = "Record";
      // remove recording animation
      this.recordEl.nativeElement.classList.remove("active");
    }
  }
  
  sendAudioToServer() {
    this.apiClientService.http.post('/sounds', this.currentAudio);
  }
}
