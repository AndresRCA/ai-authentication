import { Component, ElementRef, OnDestroy, ViewChild, computed } from '@angular/core';
import { WebcamService } from 'src/app/core/transient-services/webcam.service';
import { FaceRecognitionWebcamService } from './face-recognition-webcam.service';

@Component({
  selector: 'app-face-recognition-webcam',
  template: `<video #videoEl autoplay muted width="720" height="560"></video>`,
  styleUrls: ['./face-recognition-webcam.component.scss'],
  providers: [
    WebcamService, // for accessing the webcam
    FaceRecognitionWebcamService // this component's service for background logic
  ]
})
export class FaceRecognitionWebcamComponent implements OnDestroy {
  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;
  /**
   * Photo is takeable when our face recognition service recognizes and has a face in storage
   */
  public isPhotoTakeable = computed(() => this.faceRecognitionWebcamService.detectedFaces().length === 0);

  constructor(
    private webcamService: WebcamService,
    private faceRecognitionWebcamService: FaceRecognitionWebcamService
  ) { }

  async ngAfterViewInit() {
    try {
      await this.initVideo();
      await this.startFaceRecognition();
    } catch (error) {
      console.error(error);
    }
  }

  ngOnDestroy(): void {
    // this.webcamService.stopWebcam();
    // throw new Error('Method not implemented.');
  }

  /**
   * video setup
   */
  private async initVideo() {
    const stream = await this.webcamService.getMediaStream();
    this.videoEl.nativeElement.srcObject = stream;
  }

  /**
   * used to load models and set the function that will be called constantly to detect faces
   */
  private async startFaceRecognition() {
    // load model for face detection
    await this.faceRecognitionWebcamService.loadModels();

    // set canvas over video feed to show bounding box
    this.videoEl.nativeElement.addEventListener('playing', () => {
      this.faceRecognitionWebcamService.startDetectingFaces(this.videoEl.nativeElement);
    });
  }

  /**
   * Function called by the parent component that desires to obtain the picture of the 
   * face of the user
   * @returns the canvas that contains the face of the user
   */
  public async getPictureOfFace(): Promise<HTMLCanvasElement> {
    // get the picture detected by the face recognition service
    const imgCanvases = this.faceRecognitionWebcamService.detectedFaces();

    if (imgCanvases.length === 0) {
      throw new Error('Unknown error has ocurred. No face was detected', { cause: imgCanvases });
    }

    return imgCanvases[0]; // get the first face
  }
}
