import { Jeu } from './jeu.model'

export class Zone {
  readonly nom: string
  readonly jeux: Jeu[]

  constructor(nom: string, jeux: Jeu[]) {
    this.nom = nom
    this.jeux = jeux
  }

  get nbJeux(): number {
    return this.jeux.reduce((s, j) => s + j.nbJeux, 0)
  }

  get nbTables(): number {
    return this.jeux.reduce((s, j) => s + j.nbTables, 0)
  }
}
