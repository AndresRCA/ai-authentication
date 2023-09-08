import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;
  /**
   * source of the video
   */
  private mediaStream!: MediaStream;

  constructor () {}

  ngAfterViewInit(): void {
    // video setup
    navigator.mediaDevices.getUserMedia({ video: true }).then((mediaStream) => {
      this.mediaStream = mediaStream;
      this.videoEl.nativeElement.srcObject = mediaStream;
      this.videoEl.nativeElement.play(); // start webcam video
    });
  }

  ngOnDestroy(): void {
    this.mediaStream.getVideoTracks()[0].stop();
  }

  takePhoto() {
    const canvas = document.createElement("canvas");
    canvas.width = this.videoEl.nativeElement.videoWidth;
    canvas.height = this.videoEl.nativeElement.videoHeight;
  
    canvas.getContext("2d")!.drawImage(this.videoEl.nativeElement, 0, 0);
  
    const data = canvas.toDataURL("image/png");
    
    // Add this line to download the image
    const a = document.createElement('a');
    a.href = data;
    a.download = 'photo.png';
    document.body.appendChild(a);
    a.click();
  }
}
