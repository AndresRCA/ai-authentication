import { Injectable, isDevMode } from '@angular/core';
import { IUser } from '../interfaces/IUser.interface';
import { ApiClientService } from './api-client.service';

@Injectable()
export class AuthService {

  public user: IUser | undefined;

  constructor(
    private apiClientService: ApiClientService
  ) { 
    if (isDevMode()) this.initUser({id: 0, username: 'dev_user'});
  }

  /**
   * Make a POST request to the server to sign up the user
   * @param credentials 
   * @returns 
   */
  public async signUp(credentials: {username: string, password: string}): Promise<any> {
    return this.apiClientService.http.post('/auth/signup', credentials);
  }

  /**
   * Make a POST request to the server to log in the user. The user object is also stored in the service during this.
   * HTTP responses for the status code should either be 200 or 401
   * @param credentials 
   * @returns 
   */
  public async login(credentials: {username: string, password: string}): Promise<void> {
    let res = await this.apiClientService.http.post('/auth/login', credentials);
    console.log('user object', res.data);
    const { user } = res.data;
    this.initUser(user);
  }

  /**
   * Make a PUT request to the server to log out the user (should delete cookies that contain authentication)
   * @returns 
   */
  public async logout(): Promise<void> {
    await this.apiClientService.http.put('/auth/logout');
  }

  /**
   * Request user data (client sends session id through cookies and '/auth/user-session' checks for user with the same session id).
   * The user object is also stored in the service during this.
   * HTTP responses for the status code should be 200 or 
   * @returns user data
   */
   public async resumeUserSession(): Promise<void> {
    let res = await this.apiClientService.http.get('/auth/user-session');
    console.log('user object retrieved from session', res.data);
    let { user } = res.data; 
    this.initUser(user); // set user in Auth
  }

  /**
   * Sends a request to check if session is still active for this user
   * HTTP response should either be 200(OK) or 403(Forbidden)
   * @returns boolean which determines if the user session is still active
   */
  public async isUserSessionActive(): Promise<boolean> {
    try {
      await this.apiClientService.http.get('/auth/session/check-session');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Set user initial data
   * @param userData data for user sent from the backend
   */
  private initUser(userData: IUser): void {
    if (!this.user) this.user = userData;
  }
}
