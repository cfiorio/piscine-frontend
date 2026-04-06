import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  authRequired: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Jeux par éditeur', icon: 'business',     route: '/jeux-editeur', authRequired: false },
  { label: 'Jeux',             icon: 'extension',     route: '/jeux',         authRequired: false },
  { label: 'Zones',            icon: 'map',           route: '/zones',        authRequired: false },
  { label: 'Sessions',         icon: 'schedule',      route: '/sessions',     authRequired: true  },
  { label: 'Bénévoles',        icon: 'volunteer_activism', route: '/benevoles', authRequired: true },
  { label: 'Statistiques',     icon: 'bar_chart',     route: '/statistiques', authRequired: true  },
];

@Component({
  selector: 'app-side-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule, MatDividerModule, MatChipsModule],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.scss',
})
export class SideNav {
  protected readonly auth = inject(AuthService);

  /** Nom fictif du dernier festival — sera remplacé par un appel API */
  protected readonly festivalName = 'FJM 2025';

  protected readonly visibleItems = NAV_ITEMS.filter(
    (item) => !item.authRequired || this.auth.isAuthenticated(),
  );

  protected readonly navItems = NAV_ITEMS;

  protected isItemVisible(item: NavItem): boolean {
    return !item.authRequired || this.auth.isAuthenticated();
  }
}