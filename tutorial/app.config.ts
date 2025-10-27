import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { routes } from './app.routes';
import { ConfigService } from '../config.service';

/**
 * This is a factory function. Its job is to create another function that Angular will run during its startup process. 
 * - It takes an instance of ConfigService as an argument, which Angular's dependency injection system provides.
 * - It returns a new function: () => configService.loadConfig(). This is the actual function that will be executed during app initialization.
 */
function initializeApp(configService: ConfigService) {
  return () => configService.loadConfig();
}

/**
 * This is the main configuration object for your application. It's passed to the bootstrapApplication function in main.ts to set up the root injector with all the necessary providers.
 * 
 * When your application starts:
 * 1. Angular processes the appConfig providers.
 * 2. It sees the APP_INITIALIZER and knows it has a startup task to run.
 * 3. It creates an instance of ConfigService and passes it to the initializeApp factory.
 * 4. The factory returns the function () => configService.loadConfig().
 * 5. Angular executes this function, which calls loadConfig() on your ConfigService.
 * 6. The loadConfig() method makes an HTTP request to fetch your config.json file and returns a Promise.
 * 7. Crucially, Angular pauses the application's startup process until this Promise is resolved.
 * 8. Once config.json is successfully fetched and loaded into the ConfigService, the promise resolves, and Angular continues to bootstrap and render your main AppComponent.
 * 
 * In short, this setup ensures that your runtime configuration (like the apiUrl) is loaded and available before any part of your application tries to use it.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    // new provider for application initialize defined here.
    { 
      provide: APP_INITIALIZER, 
      useFactory: initializeApp, 
      deps: [ConfigService], 
      multi: true 
    }
  ]
};