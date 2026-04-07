import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../core/services/auth.service';
import { LoginDialog } from '../../core/auth/login-dialog/login-dialog';

@Component({
  selector: 'app-top-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    NgOptimizedImage,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './top-navbar.html',
  styleUrl: './top-navbar.scss',
})
export class TopNavbar {
  protected readonly auth = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  readonly menuToggle = output<void>();

  protected onMenuToggle(): void {
    this.menuToggle.emit();
  }

  protected onLogin(): void {
    this.dialog.open(LoginDialog, {
      width: '420px',
      disableClose: true,
      ariaLabel: 'Fenêtre de connexion',
    });
  }

  protected async onLogout(): Promise<void> {
    await this.auth.logout();
  }
}