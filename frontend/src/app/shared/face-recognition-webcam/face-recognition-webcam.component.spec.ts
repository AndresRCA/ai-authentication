import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceRecognitionWebcamComponent } from './face-recognition-webcam.component';

describe('FaceRecognitionWebcamComponent', () => {
  let component: FaceRecognitionWebcamComponent;
  let fixture: ComponentFixture<FaceRecognitionWebcamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaceRecognitionWebcamComponent]
    });
    fixture = TestBed.createComponent(FaceRecognitionWebcamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
