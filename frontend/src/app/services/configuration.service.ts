import { Injectable, isDevMode } from '@angular/core';
import { IUser } from '../core/interfaces/IUser.interface';
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
    let user: IUser;

    // attempt session retrieval
    try {
      if (isDevMode()) {
        // in dev mode the user will always exist, not convenient if you want to test user authentication
        user = { id: 1, username: 'admin' };
      } else {
        user = await this.authService.getUserSession();
      }
    }
    catch(error: any) {
      this.errorHandlerService.handleServerErrorResponse(error.request.status);
      return;
    }

    // user could retrieve session safely
    console.log('user session resumed');
  }
}
