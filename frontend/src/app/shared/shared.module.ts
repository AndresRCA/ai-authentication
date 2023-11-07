import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaceRecognitionWebcamComponent } from './face-recognition-webcam/face-recognition-webcam.component';



@NgModule({
  declarations: [
    FaceRecognitionWebcamComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FaceRecognitionWebcamComponent
  ]
})
export class SharedModule { }
