import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { MatTableModule } from '@angular/material/table'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { ZoneService } from '../../core/services/zone.service'
import { AuthService } from '../../core/services/auth.service'
import { QuantitePipe } from '../../core/pipes/quantite.pipe'

const COLONNES_BASE = ['nom', 'editeur', 'nbJeux', 'nbTables'] as const
const COLONNES_ADMIN = [...COLONNES_BASE, 'plan', 'anim', 'recu'] as const

@Component({
  selector: 'app-zones',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatIconModule, MatProgressSpinnerModule, QuantitePipe],
  templateUrl: './zones.html',
  styleUrl: './zones.scss',
})
export class Zones {
  private readonly zoneService = inject(ZoneService)
  private readonly auth = inject(AuthService)

  protected readonly isLoading = this.zoneService.isLoading
  protected readonly error = this.zoneService.error
  protected readonly zones = this.zoneService.zones
  protected readonly colonnes = computed<string[]>(() =>
    this.auth.isAdmin() ? [...COLONNES_ADMIN] : [...COLONNES_BASE],
  )
}
