import { ApplicationConfig, LOCALE_ID } from '@angular/core'; // 1. Importa LOCALE_ID
import {
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

// 2. Importa el registro de datos de localización
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// 3. Registra el idioma español
registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    
    // 4. Provee el ID de localización como español globalmente
    { provide: LOCALE_ID, useValue: 'es' } 
  ],
};