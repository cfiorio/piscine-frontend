import { inject } from '@angular/core'
import { type CanActivateFn, Router } from '@angular/router'
import { AuthService } from '../services/auth.service'

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService)
  const router = inject(Router)
  return auth.isAdmin() ? true : router.createUrlTree(['/'])
}
