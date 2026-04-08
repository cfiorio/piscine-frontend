import { Pipe, PipeTransform } from '@angular/core'

/**
 * Formate un nombre : entier → affiché sans décimale, sinon arrondi à 1 chiffre après la virgule.
 * Usage : {{ valeur | quantite }}
 */
@Pipe({ name: 'quantite' })
export class QuantitePipe implements PipeTransform {
  transform(value: number | string): string {
    const n = Number(value)
    return Number.isInteger(n) ? String(n) : n.toFixed(1)
  }
}
