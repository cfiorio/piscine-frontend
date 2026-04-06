import { Injectable, linkedSignal } from '@angular/core'
import { httpResource } from '@angular/common/http'
import type { Festival, FestivalWithStats } from '../models/festival.model'

@Injectable({ providedIn: 'root' })
export class FestivalService {
  // Route publique — affichage du festival courant dans la sidebar
  private readonly latestResource = httpResource<Festival>(() => '/api/festivals/latest')

  /** Festival sélectionné — initialisé sur le dernier festival dès le chargement public */
  readonly selectedFestival = linkedSignal<Festival | null>(
    () => this.latestResource.value() ?? null,
  )

  select(festival: Festival | FestivalWithStats): void {
    this.selectedFestival.set(festival)
  }
}
