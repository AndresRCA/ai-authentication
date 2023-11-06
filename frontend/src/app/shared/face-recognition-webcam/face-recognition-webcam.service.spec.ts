import { TestBed } from '@angular/core/testing';

import { FaceRecognitionWebcamService } from './face-recognition-webcam.service';

describe('FaceRecognitionWebcamService', () => {
  let service: FaceRecognitionWebcamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaceRecognitionWebcamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
