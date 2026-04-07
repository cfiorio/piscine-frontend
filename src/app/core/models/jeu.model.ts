// --- DTO : structure brute retournée par /api/jeux/festival/latest ---

export interface JeuFestivalDTO {
  idJeu: number
  libelleJeu: string | null
  auteurJeu: string
  nbMinJoueurJeu: number | null
  nbMaxJoueurJeu: number | null
  noticeJeu: string | null
  idEditeur: number | null
  libelleEditeur: string | null
  idTypeJeu: number | null
  libelleTypeJeu: string | null
  agemini: number
  prototype: boolean
  duree: number
  theme: string
  description: string
  imageJeu: string
  videoRegle: string
  mecanismes: string
  zones: string
}

// --- Modèle métier ---

export class Jeu {
  readonly idJeu: number
  readonly nom: string
  readonly auteur: string
  readonly editeur: string
  readonly typeJeu: string
  readonly theme: string
  readonly description: string
  readonly nbMinJoueurs: number | null
  readonly nbMaxJoueurs: number | null
  readonly ageMini: number
  readonly duree: number
  readonly prototype: boolean
  readonly imageUrl: string
  readonly videoUrl: string
  readonly noticeUrl: string | null
  readonly mecanismes: string[]
  readonly zones: string[]

  constructor(dto: JeuFestivalDTO) {
    this.idJeu = dto.idJeu
    this.nom = dto.libelleJeu ?? '—'
    this.auteur = dto.auteurJeu || '—'
    this.editeur = dto.libelleEditeur ?? '—'
    this.typeJeu = dto.libelleTypeJeu ?? '—'
    this.theme = dto.theme || '—'
    this.description = dto.description
    this.nbMinJoueurs = dto.nbMinJoueurJeu
    this.nbMaxJoueurs = dto.nbMaxJoueurJeu
    this.ageMini = dto.agemini
    this.duree = dto.duree
    this.prototype = dto.prototype
    this.imageUrl = dto.imageJeu
    this.videoUrl = dto.videoRegle
    this.noticeUrl = dto.noticeJeu || null
    this.mecanismes = dto.mecanismes ? dto.mecanismes.split(';').filter(Boolean) : []
    this.zones = dto.zones ? dto.zones.split(';').filter(Boolean) : []
  }

  /** Affichage compact des joueurs : "2 – 5" ou "2" ou "—" */
  get joueurs(): string {
    if (this.nbMinJoueurs === null && this.nbMaxJoueurs === null) return '—'
    if (this.nbMinJoueurs === this.nbMaxJoueurs) return String(this.nbMinJoueurs ?? '—')
    return `${this.nbMinJoueurs ?? '?'} – ${this.nbMaxJoueurs ?? '?'}`
  }

  /** Texte recherchable agrégé pour le filtre global */
  get searchableText(): string {
    return [
      this.nom,
      this.auteur,
      this.editeur,
      this.typeJeu,
      this.theme,
      this.zones.join(' '),
      this.mecanismes.join(' '),
    ]
      .join(' ')
      .toLowerCase()
  }
}
