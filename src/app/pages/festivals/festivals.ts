import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { httpResource } from '@angular/common/http'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { FestivalService } from '../../core/services/festival.service'
import type { FestivalWithStats } from '../../core/models/festival.model'

@Component({
  selector: 'app-festivals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './festivals.html',
  styleUrl: './festivals.scss',
})
export class Festivals {
  private readonly festivalService = inject(FestivalService)

  // Chargé uniquement à la navigation vers cette page (admin garanti par le guard)
  protected readonly festivalsResource = httpResource<FestivalWithStats[]>(
    () => '/api/festivals/stats',
  )

  protected isSelected(festival: FestivalWithStats): boolean {
    return this.festivalService.selectedFestival()?.idFestival === festival.idFestival
  }

  protected select(festival: FestivalWithStats): void {
    this.festivalService.select(festival)
  }

  protected onCardKeydown(festival: FestivalWithStats, event: KeyboardEvent): void {
    if (event.key === ' ') event.preventDefault()
    if (event.key === 'Enter' || event.key === ' ') this.select(festival)
  }

  protected restentPremium(f: FestivalWithStats): number {
    return f.nbEmplPremium - (f.totalNbEmplPremium + Math.ceil(f.totalNbm2Premium / 4.5))
  }

  protected restentStandard(f: FestivalWithStats): number {
    return f.nbEmplStandard - (f.totalNbEmplacement + Math.ceil(f.totalNbm2 / 4.5))
  }

  protected restentPromo(f: FestivalWithStats): number {
    return f.nbEmplPromo - (f.totalNbEmplPromo + Math.ceil(f.totalNbm2Promo / 4.5))
  }

  protected totalRestant(f: FestivalWithStats): number {
    return this.restentPremium(f) + this.restentStandard(f) + this.restentPromo(f)
  }
}
