import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core'
import { MatTableModule, MatTableDataSource } from '@angular/material/table'
import { MatSortModule, MatSort } from '@angular/material/sort'
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { JeuService } from '../../core/services/jeu.service'
import { Jeu } from '../../core/models/jeu.model'
import { JeuDetailDialog } from './jeu-detail-dialog/jeu-detail-dialog'

const COLUMNS = ['nom', 'editeur', 'auteur', 'typeJeu', 'theme', 'zones'] as const
type Colonne = (typeof COLUMNS)[number]

@Component({
  selector: 'app-jeux',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './jeux.html',
  styleUrl: './jeux.scss',
})
export class Jeux {
  private readonly jeuService = inject(JeuService)
  private readonly dialog = inject(MatDialog)

  protected readonly isLoading = this.jeuService.isLoading
  protected readonly error = this.jeuService.error
  protected readonly colonnes: Colonne[] = [...COLUMNS]

  protected readonly dataSource = new MatTableDataSource<Jeu>([])
  protected readonly filtre = signal('')
  protected readonly nbJeuxAffiches = computed(() => this.dataSource.filteredData.length)
  protected readonly totalJeux = computed(() => this.jeuService.jeux().length)

  private readonly sort = viewChild(MatSort)
  private readonly paginator = viewChild(MatPaginator)

  constructor() {
    // Filtre personnalisé sur le texte agrégé de la classe Jeu
    this.dataSource.filterPredicate = (jeu: Jeu, filtre: string) =>
      jeu.searchableText.includes(filtre)

    // Sync des données — effect() en contexte d'injection (constructeur)
    effect(() => {
      this.dataSource.data = this.jeuService.jeux()
    })

    // Sync du filtre
    effect(() => {
      this.dataSource.filter = this.filtre().trim().toLowerCase()
      this.dataSource.paginator?.firstPage()
    })

    // Connexion sort + paginator dès que les viewChild apparaissent dans le DOM
    // (le @if sur isLoading retarde leur création — afterNextRender() ne suffit pas)
    effect(() => {
      const sort = this.sort()
      const paginator = this.paginator()
      if (!sort || !paginator) return

      this.dataSource.sortingDataAccessor = (jeu: Jeu, colonne: string) => {
        switch (colonne as Colonne) {
          case 'nom': return jeu.nom
          case 'editeur': return jeu.editeur
          case 'auteur': return jeu.auteur
          case 'typeJeu': return jeu.typeJeu
          case 'theme': return jeu.theme
          case 'zones': return jeu.zones.join(';')
          default: return ''
        }
      }
      this.dataSource.sort = sort
      this.dataSource.paginator = paginator
    })
  }

  protected onFiltre(event: Event): void {
    this.filtre.set((event.target as HTMLInputElement).value)
  }

  protected clearFiltre(): void {
    this.filtre.set('')
  }

  protected openDetail(jeu: Jeu): void {
    this.dialog.open(JeuDetailDialog, { data: jeu, maxWidth: '680px', width: '95vw' })
  }
}
