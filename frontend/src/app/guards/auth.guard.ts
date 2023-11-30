import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

/**
 * Basic authentication guard, checks is user is defined in AuthService and if the user session is active.
 * For example, let's assume the odd case that a user stays on the page for 1 week (time a session takes to expire), 
 * what should happen if that user tries to access a resource when their cookie is already expired? they shouldn't be able to right?
 * In that case the user would be redirected to the login page.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  async canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // first, check if user session is still active
    const isUserActive = await this.authService.isUserSessionActive();
    if (!isUserActive) {
      console.error('session is not active');
      this.router.navigateByUrl('/login');
      return false;
    }

    return true;
  }
}
