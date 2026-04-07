// --- DTOs : structures brutes retournées par l'API ---

export interface FestivalDTO {
  idFestival: number
  anneeFestival: string | null
  nbEmplacementTotal: number | null
  nbEmplPremium: number
  nbEmplStandard: number
  nbEmplPromo: number
  prixEmplacementFestival: number | null
  prixEmplacementPremium: number
  prixEmplacementPromo: number
  m2EmplacementStandard: number | null
  m2EmplacementPremium: number | null
  m2EmplacementPromo: number | null
  nomEmplPremium: string
  nomEmplStandard: string
  nomEmplPromo: string
}

export interface FestivalWithStatsDTO extends FestivalDTO {
  totalNbEmplacement: number
  totalNbEmplPremium: number
  totalNbEmplPromo: number
  totalNbm2: number
  totalNbm2Premium: number
  totalNbm2Promo: number
}

// --- Modèle métier ---

export class Festival {
  /** Surface moyenne d'une table en m² (constante métier) */
  static readonly FACTEUR_M2 = 4.5

  readonly idFestival: number
  readonly anneeFestival: string | null
  readonly nbEmplacementTotal: number | null
  readonly nbEmplPremium: number
  readonly nbEmplStandard: number
  readonly nbEmplPromo: number
  readonly prixEmplacementFestival: number | null
  readonly prixEmplacementPremium: number
  readonly prixEmplacementPromo: number
  readonly m2EmplacementStandard: number | null
  readonly m2EmplacementPremium: number | null
  readonly m2EmplacementPromo: number | null
  readonly nomEmplPremium: string
  readonly nomEmplStandard: string
  readonly nomEmplPromo: string

  readonly totalNbEmplacement: number
  readonly totalNbEmplPremium: number
  readonly totalNbEmplPromo: number
  readonly totalNbm2: number
  readonly totalNbm2Premium: number
  readonly totalNbm2Promo: number

  constructor(dto: FestivalDTO | FestivalWithStatsDTO) {
    this.idFestival = dto.idFestival
    this.anneeFestival = dto.anneeFestival
    this.nbEmplacementTotal = dto.nbEmplacementTotal
    this.nbEmplPremium = dto.nbEmplPremium
    this.nbEmplStandard = dto.nbEmplStandard
    this.nbEmplPromo = dto.nbEmplPromo
    this.prixEmplacementFestival = dto.prixEmplacementFestival
    this.prixEmplacementPremium = dto.prixEmplacementPremium
    this.prixEmplacementPromo = dto.prixEmplacementPromo
    this.m2EmplacementStandard = dto.m2EmplacementStandard
    this.m2EmplacementPremium = dto.m2EmplacementPremium
    this.m2EmplacementPromo = dto.m2EmplacementPromo
    this.nomEmplPremium = dto.nomEmplPremium
    this.nomEmplStandard = dto.nomEmplStandard
    this.nomEmplPromo = dto.nomEmplPromo

    if ('totalNbEmplacement' in dto) {
      this.totalNbEmplacement = dto.totalNbEmplacement
      this.totalNbEmplPremium = dto.totalNbEmplPremium
      this.totalNbEmplPromo = dto.totalNbEmplPromo
      this.totalNbm2 = dto.totalNbm2
      this.totalNbm2Premium = dto.totalNbm2Premium
      this.totalNbm2Promo = dto.totalNbm2Promo
    } else {
      this.totalNbEmplacement = 0
      this.totalNbEmplPremium = 0
      this.totalNbEmplPromo = 0
      this.totalNbm2 = 0
      this.totalNbm2Premium = 0
      this.totalNbm2Promo = 0
    }
  }

  get restentPremium(): number {
    return this.nbEmplPremium - (this.totalNbEmplPremium + Math.ceil(this.totalNbm2Premium / Festival.FACTEUR_M2))
  }

  get restentStandard(): number {
    return this.nbEmplStandard - (this.totalNbEmplacement + Math.ceil(this.totalNbm2 / Festival.FACTEUR_M2))
  }

  get restentPromo(): number {
    return this.nbEmplPromo - (this.totalNbEmplPromo + Math.ceil(this.totalNbm2Promo / Festival.FACTEUR_M2))
  }

  get totalRestant(): number {
    return this.restentPremium + this.restentStandard + this.restentPromo
  }
}
