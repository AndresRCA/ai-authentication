import { Injectable, OnDestroy } from '@angular/core';

/**
 * Transient (non-singleton) service for webcam usage inside a component
 */
@Injectable()
export class WebcamService implements OnDestroy {

  /**
   * Source of the video
   */
  private mediaStream: MediaStream | null = null;

  constructor() { }
  
  ngOnDestroy(): void {
    this.stopWebcam();
  }

  /**
   * Starts webcam and returns the media stream
   * @returns media stream to insert into the video html element
   */
  async getMediaStream(): Promise<MediaStream> {
    this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    return this.mediaStream;
  }

  /**
   * Stops video feed and resets stored values that reference the video
   */
  stopWebcam(): void {
    const tracks = this.mediaStream?.getTracks();
    tracks?.forEach((track) => track.stop());

    // clear values
    this.mediaStream = null;
  }

  /**
   * Function to capture a photo from the webcam
   * @returns base64 string value of the picture (DataURL)
   */
  async captureWebcamPhoto(video: HTMLVideoElement): Promise<string> {
    // Create a canvas to capture the video frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');

    // Draw the video frame onto the canvas
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photoDataUrl = canvas.toDataURL('image/jpeg'); // Convert to base64 data URL
      return photoDataUrl;
    }

    throw new Error('An unexpected error has occurred.', { cause: context })
  }
}
