import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AbstractFormBase } from 'src/abstract-classes/form-base.abstract';
import { IUser } from 'src/app/core/interfaces/IUser.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { v4 as uuidv4 } from 'uuid';

/**
 * Custom validator to match a control value with another control's value. For example a password that needs confirmation
 * @param controlName the name of the control you want to match
 * @param matchingControlName in the case of a password confirmation this would be the confirm password control
 * @returns 
 */
function matchValidator(matchingControlName: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const matchingControlValue = control.parent?.get(matchingControlName)?.value;
    
    if (control.value === matchingControlValue) {
      return null; // Passwords match, return null for no error
    } else {
      return { match: true }; // Passwords do not match, return an error object
    }
  };
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent extends AbstractFormBase implements OnInit {
  // Property to hold the selected image DataUrl
  photoDataUrl: string | null = null;
  // Property to control webcam visibility
  showWebcam: boolean = false;
  // Property to hold the photo taken via webcam
  // webcamPhoto: string | null = null;
  // Reference to video element for the webcam feed
  @ViewChild('webcamVideo') webcamVideoEl!: ElementRef<HTMLVideoElement>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService
  ) {
    super();
  }

  test() {
    console.log(this.form.get('confirmPassword'))
  }
  
  ngOnInit(): void {
    this.form = this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', [Validators.required, matchValidator('password')]],
        photo: ['', Validators.required] // This will hold the uploaded photo's path, use it to store the name of the file
      }
    );
    
    // when the value of password changes, check for the validity of confirmPassword
    this.form.controls['password'].valueChanges.subscribe(() => {
      this.form.controls['confirmPassword'].updateValueAndValidity();
    });
  }

  /**
   * Function to handle displaying the selected image
   * @param event 
   */
  displaySelectedImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      // set event for when I read the file
      reader.onload = (e: any) => {
        this.photoDataUrl = e.target.result;
      };
      // read the file
      reader.readAsDataURL(file);
    } else {
      this.photoDataUrl = null;
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
      this.photoDataUrl = photoDataUrl;
    }

    // Generate a unique string for the 'photo' control
    // const uniqueFileName = `${uuidv4()}_${new Date().toISOString()}`;
    // this.webcamPhoto = uniqueFileName;
  }

  signUp(): void {
    if (this.form.invalid || !this.photoDataUrl) {
      this.displayValidationErrors();
      return;
    }

    const { username, password, photo } = this.form.value;
    const fileName = this.extractFileName(photo);
    const photoDataUrl = this.photoDataUrl!
    const newUser = {
      username,
      password,
      fileName,
      photoDataUrl
    };

    this.authService.signUp(newUser)
      .then((createdUser: IUser) => {
        // set the newly created user to the service
        this.authService.initUser(createdUser);
        
        // show a notification of success (use a modal instead later)
        alert('New user was successfully created');
        this.router.navigateByUrl('/showcase');
      })
      .catch((error) => {
        if (error.request.status === 409) {
          // in the case of just a "conflict" status, check if username is taken
          alert('that username is already taken');
        } else {
          // errors other than "conflict" should be unexpected and dealt with using the handleServerErrorResponse method
          this.errorHandlerService.handleServerErrorResponse(error.request.status);
        }
      });
  }

  /**
   * Given a generic path, return the last element of it including the extension
   * @param filePath 
   * @returns file name with extension
   */
  private extractFileName(filePath: string): string {
    // Split the file path by the backslash (\) or forward slash (/) to get an array of path components.
    const pathComponents = filePath.split(/[\\\/]/);
    
    // Get the last component from the array, which is the file name.
    const fileName = pathComponents[pathComponents.length - 1];
    
    return fileName;
  }
}
