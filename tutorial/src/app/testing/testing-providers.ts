import { provideRouter } from '@angular/router';
import { routes } from '../app.routes';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Housing } from '../service/housing.service';

export const testingProviders = [
  provideRouter(routes),
  provideHttpClientTesting(),
  Housing,
];
