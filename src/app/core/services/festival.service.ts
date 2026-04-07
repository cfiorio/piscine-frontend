import { Injectable, inject, linkedSignal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { httpResource } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import { Festival } from '../models/festival.model'
import type { FestivalDTO } from '../models/festival.model'

@Injectable({ providedIn: 'root' })
export class FestivalService {
  private readonly http = inject(HttpClient)

  // Route publique — affichage du festival courant dans la sidebar
  private readonly latestResource = httpResource<FestivalDTO>(() => '/api/festivals/latest')

  /** Festival sélectionné — initialisé sur le dernier festival dès le chargement public */
  readonly selectedFestival = linkedSignal<Festival | null>(
    () => {
      const dto = this.latestResource.value()
      return dto ? new Festival(dto) : null
    },
  )

  select(festival: Festival): void {
    this.selectedFestival.set(festival)
  }

  async create(data: FestivalCreateInput): Promise<Festival> {
    const dto = await firstValueFrom(this.http.post<FestivalDTO>('/api/festivals', data))
    return new Festival(dto)
  }

  delete(idFestival: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`/api/festivals/${idFestival}`))
  }

  reloadLatest(): void {
    this.latestResource.reload()
  }
}

export interface FestivalCreateInput {
  anneeFestival?: string | null
  nbEmplacementTotal?: number | null
  nbEmplPremium: number
  nbEmplStandard: number
  nbEmplPromo: number
  prixEmplacementFestival?: number | null
  prixEmplacementPremium: number
  prixEmplacementPromo: number
  m2EmplacementStandard?: number | null
  m2EmplacementPremium?: number | null
  m2EmplacementPromo?: number | null
  nomEmplPremium: string
  nomEmplStandard: string
  nomEmplPromo: string
}
