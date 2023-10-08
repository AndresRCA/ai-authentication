import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AbstractFormBase } from 'src/abstract-classes/form-base.abstract';
import { AuthService } from 'src/app/core/services/auth.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends AbstractFormBase implements OnInit {

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService
  ) {
    super();
  }

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
      .catch((error) => {
        if (error.request.status === 401) {
          // in the case of just an unauthorized request (wrong username or password), check error for details about what field is wrong
          // ...
        } else {
          // errors other than "unauthorized" should be unexpected and dealt with using the handleServerErrorResponse method
          this.errorHandlerService.handleServerErrorResponse(error.request.status);
        }
      });
  }
}
