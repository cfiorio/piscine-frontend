import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

interface SectionCard {
  icon: string;
  title: string;
  description: string;
  route: string;
  ariaLabel: string;
}

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly festivalName = 'FJM 2025';
  protected readonly festivalDate = 'Du 15 au 18 mai 2025 — Montpellier';

  protected readonly sections: SectionCard[] = [
    {
      icon: 'business',
      title: 'Jeux par éditeur',
      description: 'Explorez le catalogue de jeux classés par maison d\'édition présente au festival.',
      route: '/jeux-editeur',
      ariaLabel: 'Voir les jeux par éditeur',
    },
    {
      icon: 'extension',
      title: 'Catalogue des jeux',
      description: 'Découvrez tous les jeux disponibles à l\'essai pendant le festival.',
      route: '/jeux',
      ariaLabel: 'Voir le catalogue des jeux',
    },
    {
      icon: 'map',
      title: 'Zones du festival',
      description: 'Retrouvez votre chemin parmi les différentes zones et espaces du festival.',
      route: '/zones',
      ariaLabel: 'Voir les zones du festival',
    },
  ];
}