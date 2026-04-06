import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login-dialog.html',
  styleUrl: './login-dialog.scss',
})
export class LoginDialog {
  private readonly dialogRef = inject(MatDialogRef<LoginDialog>);
  private readonly auth = inject(AuthService);

  protected readonly loginValue = signal('');
  protected readonly password = signal('');
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly showPassword = signal(false);

  protected onCancel(): void {
    this.dialogRef.close(false);
  }

  protected async onSubmit(): Promise<void> {
    if (!this.loginValue() || !this.password() || this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      await this.auth.login(this.loginValue(), this.password());
      this.dialogRef.close(true);
    } catch (err) {
      const code = err instanceof Error ? err.message : 'UNKNOWN_ERROR';
      this.errorMessage.set(this.resolveErrorMessage(code));
    } finally {
      this.isLoading.set(false);
    }
  }

  protected onErrorDismiss(): void {
    this.dialogRef.close(false);
  }

  private resolveErrorMessage(code: string): string {
    const messages: Record<string, string> = {
      INVALID_CREDENTIALS: 'Identifiants incorrects. Vérifiez votre login et mot de passe.',
      NETWORK_ERROR: 'Impossible de joindre le serveur. Vérifiez votre connexion.',
    };
    return messages[code] ?? 'Une erreur inattendue est survenue. Veuillez réessayer.';
  }
}
