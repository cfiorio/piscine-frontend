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
import { EditeurFestivalService } from '../../core/services/editeur-festival.service'
import { AuthService } from '../../core/services/auth.service'
import { EditeurFestival } from '../../core/models/editeur-festival.model'

const COLUMNS_PUBLIC  = ['libelleEditeur', 'jeux', 'nbJeux', 'nbTables'] as const
const COLUMNS_AUTH    = [...COLUMNS_PUBLIC, 'dateMiseAJour'] as const
type Colonne = (typeof COLUMNS_AUTH)[number]

@Component({
  selector: 'app-jeux-editeur',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './jeux-editeur.html',
  styleUrl: './jeux-editeur.scss',
})
export class JeuxEditeur {
  private readonly editeurService = inject(EditeurFestivalService)
  private readonly auth = inject(AuthService)

  protected readonly isLoading = this.editeurService.isLoading
  protected readonly error = this.editeurService.error
  protected readonly pageSizeOptions = [25, 50, 100, 200, 300, 400]

  protected readonly colonnes = computed<Colonne[]>(() =>
    this.auth.isAuthenticated() ? [...COLUMNS_AUTH] : [...COLUMNS_PUBLIC],
  )

  protected readonly dataSource = new MatTableDataSource<EditeurFestival>([])
  protected readonly filtre = signal('')
  protected readonly nbAffiches = computed(() => this.dataSource.filteredData.length)
  protected readonly total = computed(() => this.editeurService.editeurs().length)

  private readonly sort = viewChild(MatSort)
  private readonly paginatorTop = viewChild<MatPaginator>('paginatorTop')
  private readonly paginatorBottom = viewChild<MatPaginator>('paginatorBottom')

  constructor() {
    this.dataSource.filterPredicate = (e: EditeurFestival, f: string) =>
      e.searchableText.includes(f)

    effect(() => {
      this.dataSource.data = this.editeurService.editeurs()
    })

    effect(() => {
      this.dataSource.filter = this.filtre().trim().toLowerCase()
      this.dataSource.paginator?.firstPage()
    })

    effect(() => {
      const sort = this.sort()
      const bottom = this.paginatorBottom()
      const top = this.paginatorTop()
      if (!sort || !bottom || !top) return

      this.dataSource.sortingDataAccessor = (e: EditeurFestival, col: string) => {
        switch (col as Colonne) {
          case 'libelleEditeur': return e.libelleEditeur
          case 'jeux':           return e.jeuxTexte
          case 'nbJeux':         return e.nbJeux
          case 'nbTables':       return e.nbTables
          case 'dateMiseAJour':  return e.dateMiseAJour?.getTime() ?? 0
          default:               return ''
        }
      }
      this.dataSource.sort = sort
      this.dataSource.paginator = bottom
      top.length = bottom.length
    })
  }

  protected onFiltre(event: Event): void {
    this.filtre.set((event.target as HTMLInputElement).value)
  }

  protected clearFiltre(): void {
    this.filtre.set('')
  }

  protected onPageTop(event: PageEvent): void {
    const bottom = this.paginatorBottom()
    if (!bottom) return
    bottom.pageIndex = event.pageIndex
    bottom.pageSize = event.pageSize
    bottom.page.emit({ ...event, length: bottom.length })
  }

  protected onPageBottom(event: PageEvent): void {
    const top = this.paginatorTop()
    if (!top) return
    top.pageIndex = event.pageIndex
    top.pageSize = event.pageSize
    top.length = event.length
  }
}
