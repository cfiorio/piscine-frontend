import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { httpResource } from '@angular/common/http'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatDialog } from '@angular/material/dialog'
import { FestivalService } from '../../core/services/festival.service'
import type { Festival, FestivalWithStats } from '../../core/models/festival.model'
import { CreateFestivalDialog } from './create-festival-dialog/create-festival-dialog'
import { DeleteFestivalDialog } from './delete-festival-dialog/delete-festival-dialog'

@Component({
  selector: 'app-festivals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './festivals.html',
  styleUrl: './festivals.scss',
})
export class Festivals {
  private readonly festivalService = inject(FestivalService)
  private readonly dialog = inject(MatDialog)

  // Chargé uniquement à la navigation vers cette page (admin garanti par le guard)
  protected readonly festivalsResource = httpResource<FestivalWithStats[]>(
    () => '/api/festivals/stats',
  )

  protected openDeleteDialog(festival: FestivalWithStats): void {
    this.dialog
      .open(DeleteFestivalDialog, {
        width: '480px',
        maxWidth: '95vw',
        data: festival,
        ariaLabel: 'Confirmer la suppression du festival',
      })
      .afterClosed()
      .subscribe((deleted: boolean) => {
        if (!deleted) return
        this.festivalsResource.reload()
        if (this.festivalService.selectedFestival()?.idFestival === festival.idFestival) {
          this.festivalService.reloadLatest()
        }
      })
  }

  protected openCreateDialog(): void {
    this.dialog
      .open(CreateFestivalDialog, {
        width: '640px',
        maxWidth: '95vw',
        disableClose: true,
        ariaLabel: 'Créer un nouveau festival',
      })
      .afterClosed()
      .subscribe((festival: Festival | null) => {
        if (!festival) return
        this.festivalsResource.reload()
        this.festivalService.select(festival)
      })
  }

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
