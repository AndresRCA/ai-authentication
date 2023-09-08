import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiClientService } from './services/api-client.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [ ApiClientService ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() core: CoreModule ){
    if (core) {
      throw new Error("You should import core module only in the root module");
    }
  }
}
