import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowcaseComponent } from './showcase.component';
import { RouterModule } from '@angular/router';
import { ShowcaseRoutingModule } from './showcase-routing.module';



@NgModule({
  declarations: [
    ShowcaseComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ShowcaseRoutingModule
  ]
})
export class ShowcaseModule { }
