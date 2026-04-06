import { Injectable, computed, inject, signal } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, catchError, firstValueFrom, of, tap } from 'rxjs'
import { User, type UserInfoDto } from '../models/user.model'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient)
  private readonly _user = signal<User | null>(null)

  readonly user = this._user.asReadonly()
  readonly isAuthenticated = computed(() => this._user() !== null)
  readonly isAdmin = computed(() => this._user()?.isAdmin ?? false)
  readonly displayName = computed(() => this._user()?.displayName ?? null)

  async login(login: string, motDePasse: string): Promise<void> {
    try {
      const dto = await firstValueFrom(
        this.http.post<UserInfoDto>('/api/auth/login', { login, motDePasse }),
      )
      this._user.set(new User(dto))
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        throw new Error((err.error as { error?: string })?.error ?? 'INVALID_CREDENTIALS')
      }
      throw new Error('NETWORK_ERROR')
    }
  }

  async logout(): Promise<void> {
    await firstValueFrom(
      this.http.post<void>('/api/auth/logout', {}).pipe(catchError(() => of(undefined))),
    )
    this._user.set(null)
  }

  /** Appelé au bootstrap pour restaurer la session depuis le cookie HttpOnly. */
  async checkSession(): Promise<void> {
    await firstValueFrom(
      this.http.get<UserInfoDto>('/api/auth/me').pipe(
        tap((dto) => this._user.set(new User(dto))),
        catchError(() => {
          this._user.set(null)
          return of(undefined)
        }),
      ),
    )
  }

  /** Utilisé par l'intercepteur pour renouveler l'accessToken via le refreshToken. */
  refresh(): Observable<void> {
    return this.http.post<void>('/api/auth/refresh', {})
  }

  clearUser(): void {
    this._user.set(null)
  }
}
