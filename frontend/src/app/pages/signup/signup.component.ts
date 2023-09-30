import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';

/**
 * Custom validator to match a control value with another control's value. For example a password that needs confirmation
 * @param controlName the name of the control you want to match
 * @param matchingControlName in the case of a password confirmation this would be the confirm password control
 * @returns 
 */
function matchValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (control: AbstractControl): Observable<{[key: string]: any}> | Observable<null> => {
    const controlValue = control.parent?.get(controlName)?.value;
    const matchingControlValue = control.get(matchingControlName)?.value;
    return controlValue === matchingControlValue ? of(null) : of({ match: true });
  };
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterViewInit {
  public form!: FormGroup;
  // Property to hold the selected image URL
  photoUrl: string | null = null;
  // Property to control webcam visibility
  showWebcam: boolean = false;
  // Reference to video element for the webcam feed
  @ViewChild('webcamVideo') webcamVideoEl!: ElementRef<HTMLVideoElement>;

  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.form = this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required, matchValidator('password', 'confirmPassword')],
        photo: [null, Validators.required] // This will hold the uploaded photo, might be DataURL string
      }
    )
  }

  /**
   * Function to handle displaying the selected image
   * @param event 
   */
  displaySelectedImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.photoUrl = null;
    }
  }

  /**
   * Function to toggle webcam visibility
   */
  toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;

    // If showing webcam, start capturing the video stream
    if (this.showWebcam) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (this.webcamVideoEl.nativeElement) {
            this.webcamVideoEl.nativeElement.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error('Error accessing webcam:', error);
        });
    } else {
      // If hiding webcam, stop the video stream
      const stream = this.webcamVideoEl.nativeElement.srcObject;
      if (stream instanceof MediaStream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    }
  }

  /**
   * Function to capture a photo from the webcam
   */
  captureWebcamPhoto(): void {
    const videoElement = this.webcamVideoEl.nativeElement;

    // Create a canvas to capture the video frame
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext('2d');

    // Draw the video frame onto the canvas
    if (context) {
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      const photoDataUrl = canvas.toDataURL('image/jpeg'); // Convert to base64 data URL

      // Set the captured photo URL
      this.photoUrl = photoDataUrl;
      console.log(this.photoUrl)
    }
  }

  submitForm(): void {
    console.log(this.form.value);
    if (this.isFormValid()) {
      console.log('data to send to the API', this.form.value);
    }
  }

  isFormValid(): boolean {
    if (this.form.invalid) return false;
    return true;
  }

  ngAfterViewInit(): void {
  }
}
