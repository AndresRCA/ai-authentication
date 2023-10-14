import { Injectable, OnDestroy } from '@angular/core';
import * as faceapi from 'face-api.js';

/**
 * Transient (non-singleton) service for face recognition
 */
@Injectable()
export class FaceRecognitionService implements OnDestroy {

  private faceDetectionInterval: NodeJS.Timer | undefined;

  constructor() { }

  ngOnDestroy(): void {
    if (this.faceDetectionInterval) clearInterval(this.faceDetectionInterval);
  }

  async loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('../../../assets/models');
  }

  startDetectingFaces(video: HTMLVideoElement) {
    const canvas = faceapi.createCanvasFromMedia(video);
    video.parentElement?.append(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    // set function to call to recognize faces
    this.faceDetectionInterval = setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
      console.log(detections)
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
    }, 100);
  }
}
