import { Component, ElementRef, Injector, OnInit, ViewChild, effect, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AbstractFormBase } from 'src/abstract-classes/form-base.abstract';
import { IUser } from 'src/app/core/interfaces/IUser.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { WebcamService } from 'src/app/core/services/webcam.service';
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
  // Property to hold the unique name of the image taken by the webcam
  private webcamPhotoName = signal<string | null>(null);

  // Reference to video element for the webcam feed
  @ViewChild('webcamVideo') webcamVideoEl!: ElementRef<HTMLVideoElement>;

  constructor(
    private injector: Injector, // used to declare a function used as an effect for signals
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private webcamService: WebcamService,
    private errorHandlerService: ErrorHandlerService
  ) {
    super();
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

    this.webcamPhotoTakenEffect();
  }

  /**
   * When a photo is taken or deleted, the value of `webcamPhotoName` gets altered, thus triggers an effect that handles
   * changes done to the form validation options 
   */
  private webcamPhotoTakenEffect(): void {
    effect(() => {
      if (this.webcamPhotoName()) {
        // disable required validation for "Choose File" input ("photo" control) when a picture was taken using the webcam
        this.form.controls['photo'].clearValidators();
      } else {
        // if webcam photo was taken and the cleared before the user closed the webcam, make it so it's required again to use the "Choose file" option
        this.form.controls['photo'].setValidators([Validators.required]);
      }
      this.form.controls['photo'].updateValueAndValidity();
    }, { injector: this.injector });
  }

  /**
   * Function to handle displaying and storing the selected image
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
  async toggleWebcam(): Promise<void> {
    this.showWebcam = !this.showWebcam;

    if (this.showWebcam) {
      // If showing webcam, start capturing the video stream
      try {
        const stream = await this.webcamService.startWebcam();
        this.webcamVideoEl.nativeElement.srcObject = stream;
      } catch (error) {
        console.error('Error starting webcam.', error);
      }
    } else {
      // If hiding webcam, stop the video stream
      this.webcamService.stopWebcam();
    }
  }

  /**
   * Function to capture a photo from the webcam
   */
  async captureWebcamPhoto() {
    try {
      const photoDataUrl = await this.webcamService.captureWebcamPhoto(this.webcamVideoEl.nativeElement);
      // Set the captured photo URL
      this.photoDataUrl = photoDataUrl;
    
      // Generate a unique string for the photo name that will be sent to the server
      const uniqueFileName = `${uuidv4()}_${new Date().toISOString()}`;
      this.webcamPhotoName.set(uniqueFileName);

      // if there already was photo uploaded using the "Choose a file" control, clear the previous value
      if (this.form.controls['photo'].value) this.form.controls['photo'].setValue('');
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Set the preview image source to `null` and empties the <input type="file">'s value as well as every other property
   * used to store the image's properties
   */
  clearImage(): void {
    this.photoDataUrl = null;
    if (this.webcamPhotoName()) this.webcamPhotoName.set(null);
    if (this.form.controls['photo'].value) this.form.controls['photo'].setValue('');
  }

  signUp(): void {
    if (this.form.invalid || !this.photoDataUrl) {
      this.displayValidationErrors();
      return;
    }

    const { username, password, photo } = this.form.value;
    let fileName: string;
    if (photo) {
      // if photo was taken from the "Choose file" form control
      fileName = this.extractFileName(photo);
    } else if (this.webcamPhotoName()) {
      // if photo was taken from the "Use Webcam" feature
      fileName = this.webcamPhotoName() as string;
    } else {
      // this should never occur if validation is working properly
      console.error('Unexpected error has ocurred.')
      return;
    }
    
    // const fileName = this.extractFileName(photo);
    const photoDataUrl = this.photoDataUrl!
    const newUser = {
      username,
      password,
      fileName,
      photoDataUrl
    };
    console.log('new user credentials', newUser)

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
   * Given a generic path, returns the file name belonging in that path
   * @param filePath 
   * @returns file name without extension
   */
  private extractFileName(filePath: string): string {
    const pathComponents = filePath.split(/[\\\/]/);

    // Get the last component from the array, which is the file name.
    const file = pathComponents[pathComponents.length - 1];

    // Split the filename by dots to handle filenames with multiple dots.
    const fileNameComponents = file.split('.');

    // Remove the last component which is the file extension.
    fileNameComponents.pop();

    // Join the remaining components to get the file name without extension.
    const fileName = fileNameComponents.join('.');

    return fileName;
  }
}
