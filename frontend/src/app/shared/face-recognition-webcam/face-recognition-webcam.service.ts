import { Injectable, OnDestroy, signal } from '@angular/core';
import * as faceapi from 'face-api.js';

/**
 * Service used for the logic and processes used in the face recognition webcam component
 */
@Injectable()
export class FaceRecognitionWebcamService implements OnDestroy {

  private faceDetectionInterval: NodeJS.Timer | undefined;
  /**
   * array of canvases representing the detected images
   */
  public detectedFaces = signal<HTMLCanvasElement[]>([])

  constructor() { }

  ngOnDestroy(): void {
    this.stopFaceDetection();
  }

  public async loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('../../../assets/models');
  }

  /**
   * Starts the setInterval() which holds the face detection function and draws a bounding 
   * box on top of the video feed provided
   * @param video 
   */
  public startDetectingFaces(video: HTMLVideoElement) {
    // Create a canvas element to display face detections based on the video feed
    const canvas = faceapi.createCanvasFromMedia(video);
    // place the canvas element right below '<app-face-recognition-webcam></app-face-recognition-webcam>'
    video.parentElement?.parentElement?.append(canvas);

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    // set function to call to recognize faces
    this.faceDetectionInterval = setInterval(async () => {
      // get face detections
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());

      // get and store only the bounding box faces canvases
      const faces = await this.extractFacesFromBox(video, detections)
      this.detectedFaces.set(faces);

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
    }, 100);
  }

  /**
   * 
   * @param inputImage video to extract the image from
   * @param box dimensions for faces
   * @returns canvas representation of images
   */
  private async extractFacesFromBox(inputImage: HTMLVideoElement, detections: faceapi.FaceDetection[]): Promise<HTMLCanvasElement[]> {
    if (detections.length === 0) return [];

    const firstFace = detections[0];
    const regionsToExtract = [
      new faceapi.Rect(firstFace.box.x, firstFace.box.y, firstFace.box.width, firstFace.box.height)
    ]

    let faceImages = await faceapi.extractFaces(inputImage, regionsToExtract)

    if (faceImages.length == 0) {
      console.log('Face not found')
      return [];
    }
    else {
      return faceImages;
    }
  }

  /**
   * Use the identifier of the interval function to stop running it in the background
   */
  private stopFaceDetection() {
    if (this.faceDetectionInterval) {
      clearInterval(this.faceDetectionInterval);
    }
  }
}
