import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatDividerModule } from '@angular/material/divider'
import { form, FormField, required, min, submit } from '@angular/forms/signals'
import { FestivalService } from '../../../core/services/festival.service'
import type { Festival } from '../../../core/models/festival.model'

interface FestivalDraft {
  anneeFestival: string
  nbEmplPremium: number
  nbEmplStandard: number
  nbEmplPromo: number
  nomEmplPremium: string
  nomEmplStandard: string
  nomEmplPromo: string
  prixEmplacementFestival: number | null
  prixEmplacementPremium: number
  prixEmplacementPromo: number
  m2EmplacementStandard: number | null
  m2EmplacementPremium: number | null
  m2EmplacementPromo: number | null
}

@Component({
  selector: 'app-create-festival-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    FormField,
  ],
  templateUrl: './create-festival-dialog.html',
  styleUrl: './create-festival-dialog.scss',
})
export class CreateFestivalDialog {
  private readonly dialogRef = inject(MatDialogRef<CreateFestivalDialog>)
  private readonly festivalService = inject(FestivalService)

  protected readonly isLoading = signal(false)
  protected readonly errorMessage = signal<string | null>(null)

  private readonly model = signal<FestivalDraft>({
    anneeFestival: new Date().getFullYear().toString(),
    nbEmplPremium: 180,
    nbEmplStandard: 160,
    nbEmplPromo: 10,
    nomEmplPremium: 'Étage 3: Esplanade',
    nomEmplStandard: 'Étage 2: Antigone',
    nomEmplPromo: 'Étage 1: Joffre',
    prixEmplacementPremium: 130,
    prixEmplacementFestival: 120,
    prixEmplacementPromo: 110,
    m2EmplacementPremium: 29,
    m2EmplacementStandard: 27,
    m2EmplacementPromo: 25,
  })

  protected readonly festivalForm = form(this.model, (path) => {
    required(path.anneeFestival)
    min(path.nbEmplPremium, 100)
    min(path.nbEmplStandard, 100)
    min(path.nbEmplPromo, 0)
    required(path.nomEmplPremium)
    required(path.nomEmplStandard)
    required(path.nomEmplPromo)
    min(path.prixEmplacementPremium, 100)
    min(path.prixEmplacementFestival, 100)
    min(path.prixEmplacementPromo, 100)
  })

  protected onCancel(): void {
    this.dialogRef.close(null)
  }

  protected async onSubmit(): Promise<void> {
    if (this.isLoading()) return
    this.errorMessage.set(null)

    await submit(this.festivalForm, async () => {
      this.isLoading.set(true)
      try {
        const festival: Festival = await this.festivalService.create(this.model())
        this.dialogRef.close(festival)
      } catch {
        this.errorMessage.set('Une erreur est survenue lors de la création du festival.')
        this.isLoading.set(false)
      }
    })
  }
}
