import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class ErrorHandlerService {

  constructor(private router: Router) { }

  /**
   * Checks the status code and redirects the user accordingly.
   * @param errorStatus http status code
   * @param router used for redirecting
   * @returns 
   */
  public handleServerErrorResponse(errorStatus: number): void {
    switch (errorStatus) {
      case 401:
        // if user session is no longer active, redirect them to login
        this.router.navigate(['/login']);
        break;
      case 0:
      case 403:
      case 500:
      case 503:
        // if error is something fatal, show error page
        const code = errorStatus === 0 ? 503 : errorStatus; // code 0 is a special case (service isn't even running)
        this.router.navigate(['/error'], { queryParams : { code }});
        break;
      default:
        this.router.navigate(['/error']); // unknown error
    }
  };
}
