import { Injectable, computed } from '@angular/core'
import { httpResource } from '@angular/common/http'
import { Jeu } from '../models/jeu.model'
import type { JeuFestivalDTO } from '../models/jeu.model'

@Injectable({ providedIn: 'root' })
export class JeuService {
  private readonly festivalJeuxResource = httpResource<JeuFestivalDTO[]>(
    () => '/api/jeux/festival/latest',
  )

  readonly isLoading = computed(() => this.festivalJeuxResource.isLoading())
  readonly error = computed(() => this.festivalJeuxResource.error())
  readonly jeux = computed(
    () => (this.festivalJeuxResource.value() ?? []).map((dto) => new Jeu(dto)),
  )
}
