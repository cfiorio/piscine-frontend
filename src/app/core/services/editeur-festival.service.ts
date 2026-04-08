import { Injectable, computed, inject } from '@angular/core'
import { httpResource } from '@angular/common/http'
import { EditeurFestival } from '../models/editeur-festival.model'
import type { EditeurFestivalDTO } from '../models/editeur-festival.model'
import { FestivalService } from './festival.service'

@Injectable({ providedIn: 'root' })
export class EditeurFestivalService {
  private readonly festivalService = inject(FestivalService)

  private readonly resource = httpResource<EditeurFestivalDTO[]>(() => {
    const id = this.festivalService.selectedFestival()?.idFestival
    return id != null
      ? `/api/jeux/festival/${id}/editeurs`
      : '/api/jeux/festival/editeurs'
  })

  readonly isLoading = computed(() => this.resource.isLoading())
  readonly error = computed(() => this.resource.error())
  readonly editeurs = computed(
    () => (this.resource.value() ?? []).map((dto) => new EditeurFestival(dto)),
  )
}
