import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TopNavbar } from './layout/top-navbar/top-navbar';
import { SideNav } from './layout/side-nav/side-nav';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, MatSidenavModule, TopNavbar, SideNav],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly breakpointObserver = inject(BreakpointObserver);

  /** true = mobile : sidenav en mode overlay, fermé par défaut */
  protected readonly isMobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(map((r) => r.matches)),
    { initialValue: false },
  );

  protected readonly sidenavMode = computed(() => (this.isMobile() ? 'over' : 'side'));
  protected readonly sidenavOpened = computed(() => !this.isMobile());

  /** état du sidenav en mode mobile (piloté par le bouton burger) */
  protected readonly mobileDrawerOpen = signal(false);

  protected readonly drawerOpened = computed(() =>
    this.isMobile() ? this.mobileDrawerOpen() : true,
  );

  protected onMenuToggle(): void {
    this.mobileDrawerOpen.update((v) => !v);
  }

  protected onDrawerClose(): void {
    if (this.isMobile()) {
      this.mobileDrawerOpen.set(false);
    }
  }
}