import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import Nora from '@primeuix/themes/nora';
import { routes } from './app.routes';
import { palette } from '@primeuix/themes';
import { definePreset } from '@primeuix/themes'; // Ensure this is imported

// 1. Define the customized preset explicitly using definePreset
const MyCustomPreset = definePreset(Aura, {
  semantic: {
    primary: palette('{zinc}') // Or any other palette like {indigo}, {purple}
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: MyCustomPreset, // 2. Pass your custom preset here instead of Aura
        options: {
          darkModeSelector: 'system'
        }
      }
    })
  ]
};
