import { Injectable, signal, computed } from '@angular/core';

export interface UserInfo {
  nom: string | null;
  prenom: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<UserInfo | null>(null);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly displayName = computed(() => {
    const u = this._user();
    if (!u) return null;
    const parts = [u.prenom, u.nom].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'Organisateur';
  });

  async login(login: string, motDePasse: string): Promise<void> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ login, motDePasse }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string })?.error ?? 'INVALID_CREDENTIALS');
    }

    const data = await res.json() as { nom: string | null; prenom: string | null };
    this._user.set({ nom: data.nom, prenom: data.prenom });
  }

  async logout(): Promise<void> {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(() => undefined);
    this._user.set(null);
  }
}