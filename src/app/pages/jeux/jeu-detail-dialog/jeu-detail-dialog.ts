import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatDividerModule } from '@angular/material/divider'
import { Jeu } from '../../../core/models/jeu.model'

@Component({
  selector: 'app-jeu-detail-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './jeu-detail-dialog.html',
  styleUrl: './jeu-detail-dialog.scss',
})
export class JeuDetailDialog {
  // MAT_DIALOG_DATA est InjectionToken<any> — cast explicite à la frontière framework
  protected readonly jeu = inject(MAT_DIALOG_DATA) as Jeu
}
