import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  // in the router we specify by default that an unmatched route equals "Not Found", so we set the default values here as "page not found"
  public statusCode: number = 404;
  public errorTitle: string = 'Page not found.';
  public errorDescription: string = `The page you are looking for may have been deleted, had its name changed, or is no longer available.`;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log(this.route.snapshot.queryParams['status_code']);
    let statusCode: string | undefined = this.route.snapshot.queryParams['status_code'];
    if (!statusCode) return; // return and keep component default values

    this.statusCode = +statusCode; // convert string to number and assign (on Angular V16 this.statusCode would be a signal)
    switch (this.statusCode) {
      case 401:
        this.errorTitle = 'Non Authorized.';
        this.errorDescription = `You are not authorized to access the requested resource. This can occur for several reasons, such as:

        - You have not provided any authentication credentials.
        - Your session has expired or has been invalidated.
        - You do not have the necessary permissions or roles to access the resource.
        
        We apologize for any inconvenience caused by this error. Please try again later or contact our support team if the problem persists.`
        break;

      case 403:
        this.errorTitle = 'Forbidden.';
        this.errorDescription = `This action is prohibited.`
        break;

      case 404:
        // no need to put this here but I leave it for consistency
        this.errorTitle = 'Page not found.';
        this.errorDescription = `The page you are looking for may have been deleted, had its name changed, or is no longer available.`;
        break;
    
      case 500:
        this.errorTitle = 'Internal server error';
        this.errorDescription = `Sorry, something has gone wrong. An internal server error occurred while processing your request. This is a temporary problem and we are working to fix it as soon as possible. Please try again later or contact our support team if the problem persists. Thank you for your patience and understanding.`
        break;

      case 503:
        this.errorTitle = 'Service Unavailable';
        this.errorDescription = `We are sorry, but our website is not available at this time. This means that we are not able to accommodate your request at this time. This may be because we are performing maintenance or we are experiencing a high volume of traffic. Please try again later.

        We apologize for any inconvenience this may cause. If you need immediate assistance, please contact us through one of our support channels. You can also check our social media accounts for updates on our status.`
        break;
    }
  }
}
