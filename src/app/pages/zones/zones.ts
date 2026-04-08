import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatTableModule } from '@angular/material/table'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { ZoneService } from '../../core/services/zone.service'
import { QuantitePipe } from '../../core/pipes/quantite.pipe'

const COLONNES = ['nom', 'editeur', 'nbJeux', 'nbTables'] as const

@Component({
  selector: 'app-zones',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatIconModule, MatProgressSpinnerModule, QuantitePipe],
  templateUrl: './zones.html',
  styleUrl: './zones.scss',
})
export class Zones {
  private readonly zoneService = inject(ZoneService)

  protected readonly isLoading = this.zoneService.isLoading
  protected readonly error = this.zoneService.error
  protected readonly zones = this.zoneService.zones
  protected readonly colonnes: string[] = [...COLONNES]
}
