import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required]
      }
    )
  }

  login(): void {
    console.log(this.form.value);
    if (this.form.invalid) {
      this.displayValidationErrors();
      return;
    }

    const { username, password } = this.form.value;
    const userCredentials = {
      username,
      password
    };

    this.authService.login(userCredentials)
      .then(() => {
        // after a succesful login, redirect to main page
        this.router.navigateByUrl('/showcase');
      })
      .catch((error: any) => {
        if (error.request.status === 401) {
          this.displayValidationErrors();
        } else {
          this.errorHandlerService.handleServerErrorResponse(error.request.status);
        }
      });
  }

  /**
   * When the user tries to submit the form (login), shows the alerts indicating what control is missing requirements all at once
   */
  private displayValidationErrors() {
    // set controls as dirty here so the html can show the validation messages
  }
}
