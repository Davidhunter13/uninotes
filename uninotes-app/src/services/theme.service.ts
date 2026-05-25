// ============================================
// UniNotes - Theme Service
// Gestión de modo oscuro/claro
// ============================================

import { StorageService, STORAGE_KEYS } from './storage.service';

export class ThemeService {
  /** Inicializar tema según preferencia guardada */
  static initialize(): void {
    const darkMode = this.isDarkMode();
    this.applyTheme(darkMode);
  }

  /** Verificar si el modo oscuro está activo */
  static isDarkMode(): boolean {
    const stored = StorageService.getValue(STORAGE_KEYS.DARK_MODE);
    if (stored !== null) {
      return stored === 'true';
    }
    // Default: seguir preferencia del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /** Cambiar entre modo oscuro y claro */
  static toggle(): boolean {
    const current = this.isDarkMode();
    const newValue = !current;
    StorageService.setValue(STORAGE_KEYS.DARK_MODE, String(newValue));
    this.applyTheme(newValue);
    return newValue;
  }

  /** Aplicar tema al DOM */
  private static applyTheme(dark: boolean): void {
    document.body.classList.toggle('dark', dark);
  }
}
