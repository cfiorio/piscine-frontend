import { Injectable, computed } from '@angular/core'
import { httpResource } from '@angular/common/http'
import { EditeurFestival } from '../models/editeur-festival.model'
import type { EditeurFestivalDTO } from '../models/editeur-festival.model'

@Injectable({ providedIn: 'root' })
export class EditeurFestivalService {
  private readonly resource = httpResource<EditeurFestivalDTO[]>(
    () => '/api/jeux/festival/editeurs',
  )

  readonly isLoading = computed(() => this.resource.isLoading())
  readonly error = computed(() => this.resource.error())
  readonly editeurs = computed(
    () => (this.resource.value() ?? []).map((dto) => new EditeurFestival(dto)),
  )
}
