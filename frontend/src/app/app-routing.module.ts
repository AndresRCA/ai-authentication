import { NgModule, isDevMode } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './pages/error/error.component';
import { ShowcaseComponent } from './pages/showcase/showcase.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', title: 'Login', component: LoginComponent },
  { path: 'signup', title: 'Signup', component: SignupComponent },
  {
    path: 'showcase',
    canActivateChild: isDevMode() ? [] : [AuthGuard],
    component: ShowcaseComponent,
    loadChildren: () => import('./pages/showcase/showcase.module').then(m => m.ShowcaseModule)
  },
  { path: 'error', title: 'Error', component: ErrorComponent },
  { path: '', redirectTo: 'showcase', pathMatch: 'full' },
  { path: '**', redirectTo: 'error' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
