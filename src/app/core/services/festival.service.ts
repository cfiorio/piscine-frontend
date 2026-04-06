import { Injectable, inject, linkedSignal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { httpResource } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import type { Festival, FestivalWithStats } from '../models/festival.model'

@Injectable({ providedIn: 'root' })
export class FestivalService {
  private readonly http = inject(HttpClient)

  // Route publique — affichage du festival courant dans la sidebar
  private readonly latestResource = httpResource<Festival>(() => '/api/festivals/latest')

  /** Festival sélectionné — initialisé sur le dernier festival dès le chargement public */
  readonly selectedFestival = linkedSignal<Festival | null>(
    () => this.latestResource.value() ?? null,
  )

  select(festival: Festival | FestivalWithStats): void {
    this.selectedFestival.set(festival)
  }

  create(data: FestivalCreateInput): Promise<Festival> {
    return firstValueFrom(this.http.post<Festival>('/api/festivals', data))
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
