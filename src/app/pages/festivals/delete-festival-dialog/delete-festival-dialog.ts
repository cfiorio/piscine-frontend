import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { FestivalService } from '../../../core/services/festival.service'
import type { FestivalWithStats } from '../../../core/models/festival.model'

@Component({
  selector: 'app-delete-festival-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './delete-festival-dialog.html',
  styleUrl: './delete-festival-dialog.scss',
})
export class DeleteFestivalDialog {
  private readonly dialogRef = inject(MatDialogRef<DeleteFestivalDialog>)
  private readonly festivalService = inject(FestivalService)
  protected readonly festival = inject<FestivalWithStats>(MAT_DIALOG_DATA)

  protected readonly step = signal<1 | 2>(1)
  protected readonly isLoading = signal(false)
  protected readonly errorMessage = signal<string | null>(null)

  protected onCancel(): void {
    this.dialogRef.close(false)
  }

  protected onFirstConfirm(): void {
    this.step.set(2)
  }

  protected async onFinalConfirm(): Promise<void> {
    if (this.isLoading()) return
    this.isLoading.set(true)
    this.errorMessage.set(null)

    try {
      await this.festivalService.delete(this.festival.idFestival)
      this.dialogRef.close(true)
    } catch {
      this.errorMessage.set('Impossible de supprimer le festival. Vérifiez qu\'il n\'a pas de sessions associées.')
      this.isLoading.set(false)
    }
  }
}
