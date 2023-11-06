import { Component, ViewChild } from '@angular/core';
import { ApiClientService } from 'src/app/core/services/api-client.service';
import { FaceRecognitionWebcamComponent } from 'src/app/shared/face-recognition-webcam/face-recognition-webcam.component';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {

  @ViewChild('faceRecognitionWebcam') faceRecognitionWebcam!: FaceRecognitionWebcamComponent;

  constructor(
    private apiClientService: ApiClientService
  ) { }

  async takePhoto() {
    try {
      // get the picture detected by the face recognition component
      const canvas = await this.faceRecognitionWebcam.getPictureOfFace();
      const dataUrl = canvas.toDataURL()

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
