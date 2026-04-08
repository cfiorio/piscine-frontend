import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners, provideAppInitializer, PLATFORM_ID } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { provideRouter, withComponentInputBinding } from '@angular/router'
import { provideClientHydration, withEventReplay } from '@angular/platform-browser'
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'

import { routes } from './app.routes'
import { authInterceptor } from './core/interceptors/auth.interceptor'
import { AuthService } from './core/services/auth.service'

export const appConfig: ApplicationConfig = {
   providers: [
      provideBrowserGlobalErrorListeners(),
      provideRouter(routes, withComponentInputBinding()),
      provideClientHydration(withEventReplay()),
      provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
      // checkSession uniquement côté navigateur — pas de cookie HttpOnly en SSR
      provideAppInitializer(() => {
        if (isPlatformBrowser(inject(PLATFORM_ID))) {
          return inject(AuthService).checkSession()
        }
        return
      }),
   ],
}