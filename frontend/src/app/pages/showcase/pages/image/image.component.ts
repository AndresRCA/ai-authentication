import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ApiClientService } from 'src/app/core/services/api-client.service';
import { FaceRecognitionService } from 'src/app/core/transient-services/face-recognition.service';
import { WebcamService } from 'src/app/core/transient-services/webcam.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  providers: [WebcamService, FaceRecognitionService]
})
export class ImageComponent implements AfterViewInit {

  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;

  constructor (
    private apiClientService: ApiClientService,
    private webcamService: WebcamService,
    private faceRecognitionService: FaceRecognitionService
  ) {}

  async ngAfterViewInit() {
    try {
      // video setup
      const stream = await this.webcamService.getMediaStream();
      this.videoEl.nativeElement.srcObject = stream;

      // start face recognition
      await this.startFaceRecognition();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * used to load models and set the function that will be called constantly to detect faces
   */
  private async startFaceRecognition() {
    // load model for face detection
    await this.faceRecognitionService.loadModels();
    
    // set canvas over video feed to show bounding box
    this.videoEl.nativeElement.addEventListener('playing', () => {
      this.faceRecognitionService.startDetectingFaces(this.videoEl.nativeElement);
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
      
      let res = await this.apiClientService.http.get('/users/photos/verify/' + dataUrl);
      console.log(res.data);
    } catch (error) {
      console.error(error)
    }
  }
}
