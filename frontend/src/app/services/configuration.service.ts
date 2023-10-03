import { Injectable, isDevMode } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { ErrorHandlerService } from '../core/services/error-handler.service';

@Injectable()
export class ConfigurationService {

  constructor(
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService
  ) { }

  /**
   * Sets the values for every service that involves user data.
   * @returns 
   */
  public async loadConfigurationData(): Promise<void> {
    // attempt session retrieval
    try {
      if (!isDevMode()) await this.authService.resumeUserSession();
      // user could retrieve session safely
      console.log('user session resumed');
    }
    catch(error: any) {
      this.errorHandlerService.handleServerErrorResponse(error.request.status);
    }
  }
}
