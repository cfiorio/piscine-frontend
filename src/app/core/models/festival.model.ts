export interface Festival {
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

export interface FestivalWithStats extends Festival {
  totalNbEmplacement: number
  totalNbEmplPremium: number
  totalNbEmplPromo: number
  totalNbm2: number
  totalNbm2Premium: number
  totalNbm2Promo: number
}
