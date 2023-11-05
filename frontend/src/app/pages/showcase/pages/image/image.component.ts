import { AfterViewInit, Component, ElementRef, ViewChild, computed } from '@angular/core';
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
  /**
   * Photo is takeable when our face recognition service recognizes and has a face in storage
   */
  public isPhotoTakeable = computed(() => this.faceRecognitionService.detectedFaces().length === 0);

  constructor(
    private apiClientService: ApiClientService,
    private webcamService: WebcamService,
    private faceRecognitionService: FaceRecognitionService
  ) {}

  async ngAfterViewInit() {
    try {
      await this.initVideo();
      await this.startFaceRecognition();
    } catch (error) {
      console.error(error);
    }
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
    await this.faceRecognitionService.loadModels();

    // set canvas over video feed to show bounding box
    this.videoEl.nativeElement.addEventListener('playing', () => {
      this.faceRecognitionService.startDetectingFaces(this.videoEl.nativeElement);
    });
  }

  async takePhoto() {
    try {
      // get the picture detected by the face recognition service
      const imgCanvases = this.faceRecognitionService.detectedFaces();

      if (imgCanvases.length === 0) {
        throw new Error('Unknown error has ocurred. No face was detected', { cause: imgCanvases });
      }

      const dataUrl = imgCanvases[0].toDataURL(); // get the first face

      const a = this.createPhotoDownloadLink(dataUrl);
      document.body.appendChild(a); // add this link to download the image
      // click the empty link to initiate a download
      a.click();
      // clean DOM
      document.body.removeChild(a);

      let res = await this.apiClientService.http.post('/auth/users/photos/verify', { photo_data_url: dataUrl });
      console.log(res.data);
    } catch (error) {
      console.error(error)
    }
  }

  private createPhotoDownloadLink(dataUrl: string): HTMLAnchorElement {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'photo.png';
    return a;
  }
}
