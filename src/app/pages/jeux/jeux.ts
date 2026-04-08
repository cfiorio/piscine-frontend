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
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { JeuService } from '../../core/services/jeu.service'
import { Jeu } from '../../core/models/jeu.model'
import { JeuDetailDialog } from './jeu-detail-dialog/jeu-detail-dialog'

const COLUMNS = ['nom', 'editeur', 'auteur', 'typeJeu', 'theme', 'zones', 'nbJeux', 'nbTables'] as const
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
  protected readonly pageSizeOptions = [25, 50, 100, 200, 300, 400]

  protected readonly dataSource = new MatTableDataSource<Jeu>([])
  protected readonly filtre = signal('')
  protected readonly nbJeuxAffiches = computed(() => this.dataSource.filteredData.length)
  protected readonly totalJeux = computed(() => this.jeuService.jeux().length)

  // ViewChild pour accéder au MatSort et MatPaginator du template -> permet de les synchroniser avec le dataSource (tri + pagination) et entre eux (2 paginators)
  private readonly sort = viewChild(MatSort)
  // 2 paginators (haut + bas) pour une meilleure UX sur les grands tableaux : 
  // - le top est plus rapide d'accès pour changer de page ou de nombre d'items affichés, 
  // - le bottom est plus pratique pour voir où on en est dans la pagination et aussi pour les petits écrans où le top peut être hors écran après scroll
  // les deux sont synchronisés entre eux et avec le dataSource, donc ils fonctionnent de manière interchangeable
  private readonly paginatorTop = viewChild<MatPaginator>('paginatorTop')
  private readonly paginatorBottom = viewChild<MatPaginator>('paginatorBottom')

  constructor() {
    // Filtre personnalisé sur le texte agrégé de la classe Jeu
    this.dataSource.filterPredicate = (jeu: Jeu, filtre: string) =>
      jeu.searchableText.includes(filtre)

    // Sync des données — effect() en contexte d'injection (constructeur)
    // jeux() est un computed() qui map les DTOs du service en instances de Jeu, donc se met à jour automatiquement quand les données arrivent ou changent
    // l'effect provoque la mise à jour des données du dataSource, qui propage le changement à la table (tri + pagination + filtre)
    effect(() => {
      this.dataSource.data = this.jeuService.jeux()
    })

    // Sync du filtre
    // L'effect() se déclenche à chaque changement de filtre, met à jour le filtre du dataSource (qui propage à la table) et remet le paginator à la première page (sinon on peut se retrouver sur une page sans résultat après filtrage)
    effect(() => {
      this.dataSource.filter = this.filtre().trim().toLowerCase()
      this.dataSource.paginator?.firstPage()
    })

    // Connexion sort + paginator dès que les viewChild apparaissent dans le DOM
    // (le @if sur isLoading retarde leur création — afterNextRender() ne suffit pas)
    effect(() => {
      const sort = this.sort()
      const bottom = this.paginatorBottom()
      const top = this.paginatorTop()
      if (!sort || !bottom || !top) return // si aucun des éléments n'est dispo, on attend le prochain trigger de l'effect (après le rendu)
      // ils sont dipos, on peut connecter le dataSource et synchroniser les paginators entre eux
      this.dataSource.sortingDataAccessor = (jeu: Jeu, colonne: string) => { 
         // pour le tri, on doit retourner la valeur brute de la colonne (pas le texte affiché), sinon ça trie sur le texte et pas la valeur réelle (ex: zones affichent les noms,
         // mais on veut trier sur les tableaux de zones)
        switch (colonne as Colonne) {
          case 'nom': return jeu.nom
          case 'editeur': return jeu.editeur
          case 'auteur': return jeu.auteur
          case 'typeJeu': return jeu.typeJeu
          case 'theme': return jeu.theme
          case 'zones':    return jeu.zones.join(';')
          case 'nbJeux':   return jeu.nbJeux
          case 'nbTables': return jeu.nbTables
          default: return ''
        }
      }
      this.dataSource.sort = sort 
      this.dataSource.paginator = bottom // le dataSource est connecté au paginator du bas, qui émet les événements de pagination (page, pageSize) et affiche la pagination

      // Synchroniser le length du paginator du haut
      top.length = bottom.length 
      // le reste de la synchronisation (pageIndex, pageSize) se fait dans les handlers onPageTop et onPageBottom pour éviter les boucles d'events
      // (si on met la synchronisation dans les events, ça crée une boucle infinie d'events entre les deux paginators)
    })
  }

  protected onFiltre(event: Event): void {
    this.filtre.set((event.target as HTMLInputElement).value)
  }

  protected clearFiltre(): void {
    this.filtre.set('')
  }

  // Paginator du haut → met à jour le bas et déclenche son Observable (écouté par dataSource)
  // la liaison entre les paginators et les handlers d'events est faite dans le template html par (page)="onPageTop($event)" et (page)="onPageBottom($event)"
  protected onPageTop(event: PageEvent): void {
    const bottom = this.paginatorBottom()
    if (!bottom) return
    bottom.pageIndex = event.pageIndex
    bottom.pageSize = event.pageSize
    bottom.page.emit({ ...event, length: bottom.length })
  }

  // Paginator du bas → met à jour l'affichage du haut (pas d'emit, évite la boucle)
  protected onPageBottom(event: PageEvent): void {
    const top = this.paginatorTop()
    if (!top) return
    top.pageIndex = event.pageIndex
    top.pageSize = event.pageSize
    top.length = event.length
  }

  protected openDetail(jeu: Jeu): void {
    this.dialog.open(JeuDetailDialog, { data: jeu, maxWidth: '680px', width: '95vw' })
  }
}
