import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorComponent } from './pages/error/error.component';
import { ImageComponent } from './pages/showcase/pages/image/image.component';
import { VoiceComponent } from './pages/showcase/pages/voice/voice.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigurationService } from './services/configuration.service';

function initializeApp(configurationService: ConfigurationService) {
  return () => configurationService.loadConfigurationData();
}

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    ImageComponent,
    VoiceComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    ConfigurationService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp, // Fetch data before app inits
      deps: [ConfigurationService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
