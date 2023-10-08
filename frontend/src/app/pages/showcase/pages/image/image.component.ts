import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';
import { WebcamService } from 'src/app/core/services/webcam.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;

  constructor (private webcamService: WebcamService) {}

  async ngAfterViewInit() {
    try {
      // video setup
      const stream = await this.webcamService.getMediaStream();
      this.videoEl.nativeElement.srcObject = stream;

      // a timeout is needed to wait for the media to load...
      setTimeout(() => {
        // face recognition setup
        this.faceRecognition().catch((error) => console.error(error));
      }, 0);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * stop the webcam stream
   */
  ngOnDestroy(): void {
    this.webcamService.stopWebcam();
  }

  /**
   * used to load models and set the function that will be called constantly to detect faces
   */
  private async faceRecognition() {
    // load model for face detection
    await faceapi.nets.tinyFaceDetector.loadFromUri('../../../../../assets/models');
    
    // set canvas over video feed to show bounding box
    this.videoEl.nativeElement.addEventListener('playing', () => {
      const canvas = faceapi.createCanvasFromMedia(this.videoEl.nativeElement);
      this.videoEl.nativeElement.parentElement?.append(canvas);
      const displaySize = { width: this.videoEl.nativeElement.width, height: this.videoEl.nativeElement.height };
      faceapi.matchDimensions(canvas, displaySize);
  
      // set function to call to recognize faces
      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(this.videoEl.nativeElement, new faceapi.TinyFaceDetectorOptions());
        console.log(detections)
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
      }, 100);
    });
  }

  async takePhoto() {
    try {
      const dataUrl = await this.webcamService.captureWebcamPhoto(this.videoEl.nativeElement);

      // add this link to download the image
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'photo.png';
      document.body.appendChild(a);

      // click the empty link to initiate a download
      a.click();

      // clean DOM
      document.body.removeChild(a);
    } catch (error) {
      console.error(error)
    }
  }
}
