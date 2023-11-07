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
    console.log('starting webcam.')
    return this.mediaStream;
  }

  /**
   * Stops video feed and resets stored values that reference the video
   */
  private stopWebcam(): void {
    console.log('stopping webcam.')
    const tracks = this.mediaStream?.getTracks();
    tracks?.forEach((track) => track.stop());

    // clear values
    this.mediaStream = null;
  }
}
