import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiClientService } from './services/api-client.service';
import { AuthService } from './services/auth.service';
import { ErrorHandlerService } from './services/error-handler.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ApiClientService,
    AuthService,
    ErrorHandlerService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() core: CoreModule ){
    if (core) {
      throw new Error("You should import core module only in the root module");
    }
  }
}
