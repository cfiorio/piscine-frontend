import { Injectable, computed, inject } from '@angular/core'
import { httpResource } from '@angular/common/http'
import { Jeu } from '../models/jeu.model'
import type { JeuFestivalDTO } from '../models/jeu.model'
import { FestivalService } from './festival.service'
import { AuthService } from './auth.service'

@Injectable({ providedIn: 'root' })
export class JeuService {
  private readonly festivalService = inject(FestivalService)
  private readonly auth = inject(AuthService)

  private readonly festivalJeuxResource = httpResource<JeuFestivalDTO[]>(() => {
    const id = this.festivalService.selectedFestival()?.idFestival
    // La route /:id est protégée (admin uniquement) — les visiteurs utilisent /latest
    return id != null && this.auth.isAdmin()
      ? `/api/jeux/festival/${id}`
      : '/api/jeux/festival/latest'
  })

  readonly isLoading = computed(() => this.festivalJeuxResource.isLoading())
  readonly error = computed(() => this.festivalJeuxResource.error())
  readonly jeux = computed(
    () => (this.festivalJeuxResource.value() ?? []).map((dto) => new Jeu(dto)),
  )
}
