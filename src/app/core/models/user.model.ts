/** Forme brute retournée par POST /api/auth/login et GET /api/auth/me */
export interface UserInfoDto {
  nom: string | null
  prenom: string | null
  login: string
  admin: number | null
}

export class User {
  readonly nom: string | null
  readonly prenom: string | null
  readonly login: string
  readonly admin: number | null

  constructor(dto: UserInfoDto) {
    this.nom = dto.nom
    this.prenom = dto.prenom
    this.login = dto.login
    this.admin = dto.admin
  }

  get isAdmin(): boolean {
    return this.admin === 1
  }

  get displayName(): string {
    const parts = [this.prenom, this.nom].filter(Boolean)
    return parts.length > 0 ? parts.join(' ') : 'Organisateur'
  }
}
