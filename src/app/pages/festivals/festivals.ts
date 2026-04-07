import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { httpResource } from '@angular/common/http'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatDialog } from '@angular/material/dialog'
import { FestivalService } from '../../core/services/festival.service'
import { Festival } from '../../core/models/festival.model'
import type { FestivalWithStatsDTO } from '../../core/models/festival.model'
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
  private readonly festivalsResource = httpResource<FestivalWithStatsDTO[]>(
    () => '/api/festivals/stats',
  )

  protected readonly isLoading = computed(() => this.festivalsResource.isLoading())
  protected readonly error = computed(() => this.festivalsResource.error())
  protected readonly festivals = computed(
    () => (this.festivalsResource.value() ?? []).map((dto) => new Festival(dto)),
  )

  protected openDeleteDialog(festival: Festival): void {
    this.dialog
      .open(DeleteFestivalDialog, {
        width: '480px',
        maxWidth: '95vw',
        data: festival,
        ariaLabel: 'Confirmer la suppression du festival',
      })
      .afterClosed()
      // afterClosed() est Observable<any> — on narrow via comparaison stricte
      .subscribe((result: unknown) => {
        if (result !== true) return
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
      // afterClosed() est Observable<any> — instanceof garantit le type à runtime
      .subscribe((result: unknown) => {
        if (!(result instanceof Festival)) return
        this.festivalsResource.reload()
        this.festivalService.select(result)
      })
  }

  protected isSelected(festival: Festival): boolean {
    return this.festivalService.selectedFestival()?.idFestival === festival.idFestival
  }

  protected select(festival: Festival): void {
    this.festivalService.select(festival)
  }

  protected onCardKeydown(festival: Festival, event: KeyboardEvent): void {
    if (event.key === ' ') event.preventDefault()
    if (event.key === 'Enter' || event.key === ' ') this.select(festival)
  }
}
