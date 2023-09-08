import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './pages/error/error.component';
import { ShowcaseComponent } from './pages/showcase/showcase.component';

const routes: Routes = [
  {
    path: 'showcase',
    component: ShowcaseComponent,
    loadChildren: () => import('./pages/showcase/showcase.module').then(m => m.ShowcaseModule)
  },
  { path: 'error', component: ErrorComponent },
  { path: '', redirectTo: 'showcase', pathMatch: 'full' },
  { path: '**', redirectTo: 'error' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
