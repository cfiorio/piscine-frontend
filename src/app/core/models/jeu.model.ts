// --- DTO : structure brute retournée par /api/jeux/festival ---
// Les champs admin (placeJeu, besoinAnimJeu, receptionJeuReserver) sont absents
// de la route publique /latest — ils ne sont présents que sur la route admin /:id

export interface JeuFestivalDTO {
  idJeu: number
  libelleJeu: string | null
  auteurJeu: string
  nbMinJoueurJeu: number | null
  nbMaxJoueurJeu: number | null
  noticeJeu: string | null
  idEditeur?: number | null
  libelleEditeur: string | null
  logoEditeur: string | null
  idTypeJeu?: number | null
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
  nbJeux: number
  nbTables: number
  placeJeu?: number
  besoinAnimJeu?: number
  receptionJeuReserver?: number
}

// --- Modèle métier ---

export class Jeu {
  readonly idJeu: number
  readonly nom: string
  readonly auteur: string
  readonly editeur: string
  readonly logoEditeur: string | null
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
  readonly nbJeux: number
  readonly nbTables: number
  readonly plan: boolean
  readonly anim: boolean
  readonly recu: boolean

  constructor(dto: JeuFestivalDTO) {
    this.idJeu = dto.idJeu
    this.nom = dto.libelleJeu ?? '—'
    this.auteur = dto.auteurJeu || '—'
    this.editeur = dto.libelleEditeur ?? '—'
    this.logoEditeur = dto.logoEditeur || null
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
    this.nbJeux = dto.nbJeux
    this.nbTables = dto.nbTables
    this.plan = Boolean(dto.placeJeu)
    this.anim = Boolean(dto.besoinAnimJeu)
    this.recu = Boolean(dto.receptionJeuReserver)
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
