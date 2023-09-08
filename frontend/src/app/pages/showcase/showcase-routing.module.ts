import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageComponent } from './pages/image/image.component';
import { VoiceComponent } from './pages/voice/voice.component';

/**
 * showcaseRoutes refers to routes that are part of the main routing (what the user controls and where he 
 * can redirect intentionally)
 */
export const showcaseRoutes: Routes = [
  { path: 'image', component: ImageComponent, data: { animation: 0 } },
  { path: 'voice', component: VoiceComponent, data: { animation: 1 } },
];

const routes: Routes = [
  ...showcaseRoutes,
  { path: '', redirectTo: 'image', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowcaseRoutingModule { }
