import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { FestivalService } from '../../core/services/festival.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  authRequired: boolean;
  adminRequired: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Jeux par éditeur', icon: 'business',          route: '/jeux-editeur', authRequired: false, adminRequired: false },
  { label: 'Jeux',             icon: 'extension',          route: '/jeux',         authRequired: false, adminRequired: false },
  { label: 'Zones',            icon: 'map',                route: '/zones',        authRequired: false, adminRequired: false },
  { label: 'Sessions',         icon: 'schedule',           route: '/sessions',     authRequired: true,  adminRequired: false },
  { label: 'Bénévoles',        icon: 'volunteer_activism', route: '/benevoles',    authRequired: true,  adminRequired: false },
  { label: 'Statistiques',     icon: 'bar_chart',          route: '/statistiques', authRequired: true,  adminRequired: false },
  { label: 'Festivals',        icon: 'celebration',        route: '/festivals',    authRequired: true,  adminRequired: true  },
];

@Component({
  selector: 'app-side-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule, MatDividerModule],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.scss',
})
export class SideNav {
  protected readonly auth = inject(AuthService);
  private readonly festivalService = inject(FestivalService);

  /** Nom du festival sélectionné, issu de l'API */
  protected readonly festivalName = computed(
    () => this.festivalService.selectedFestival()?.anneeFestival ?? 'Chargement…',
  );

  /** Liste réactive : se recalcule automatiquement à chaque changement d'authentification */
  protected readonly visibleItems = computed(() =>
    NAV_ITEMS.filter((item) => {
      if (item.adminRequired) return this.auth.isAdmin();
      if (item.authRequired) return this.auth.isAuthenticated();
      return true;
    }),
  );
}