// --- DTO : structure brute retournée par /api/jeux/festival/editeurs ---

export interface EditeurFestivalDTO {
  idEditeur: number
  libelleEditeur: string
  jeux: string          // noms séparés par ';'
  nbJeux: number
  nbTables: number
  dateMiseAJour: string | null
}

// --- Modèle métier ---

export class EditeurFestival {
  readonly idEditeur: number
  readonly libelleEditeur: string
  readonly jeux: string[]
  readonly nbJeux: number
  readonly nbTables: number
  readonly dateMiseAJour: Date | null

  constructor(dto: EditeurFestivalDTO) {
    this.idEditeur = dto.idEditeur
    this.libelleEditeur = dto.libelleEditeur
    this.jeux = dto.jeux ? dto.jeux.split(';').filter(Boolean) : []
    this.nbJeux = dto.nbJeux
    this.nbTables = dto.nbTables
    this.dateMiseAJour = dto.dateMiseAJour ? new Date(dto.dateMiseAJour) : null
  }

  /** Texte recherchable agrégé pour le filtre global */
  get searchableText(): string {
    return [this.libelleEditeur, ...this.jeux].join(' ').toLowerCase()
  }

  /** Noms des jeux sous forme de texte lisible */
  get jeuxTexte(): string {
    return this.jeux.join(', ')
  }

  /** Date formatée JJ/MM/AAAA */
  get dateMiseAJourFormatee(): string {
    if (!this.dateMiseAJour) return '—'
    return this.dateMiseAJour.toLocaleDateString('fr-FR')
  }
}
