import { computed, inject, Injectable } from '@angular/core'
import { JeuService } from './jeu.service'
import { Jeu } from '../models/jeu.model'
import { Zone } from '../models/zone.model'

@Injectable({ providedIn: 'root' })
export class ZoneService {
  private readonly jeuService = inject(JeuService)

  readonly isLoading = this.jeuService.isLoading
  readonly error = this.jeuService.error

  readonly zones = computed<Zone[]>(() => {
    const map = new Map<string, Jeu[]>()
    for (const jeu of this.jeuService.jeux()) {
      for (const nomZone of jeu.zones) {
        if (!map.has(nomZone)) map.set(nomZone, [])
        map.get(nomZone)!.push(jeu)
      }
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b, 'fr'))
      .map(([nom, jeuxZone]) => new Zone(nom, jeuxZone))
  })
}
