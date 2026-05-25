// ============================================
// UniNotes - Generic LocalStorage Service
// Provee operaciones CRUD tipadas sobre localStorage
// ============================================

export class StorageService {
  /** Obtener todos los items de una colección */
  static getAll<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  /** Obtener un item por ID */
  static getById<T extends { id: string }>(key: string, id: string): T | undefined {
    const items = this.getAll<T>(key);
    return items.find(item => item.id === id);
  }

  /** Guardar un nuevo item en la colección */
  static save<T extends { id: string }>(key: string, item: T): void {
    const items = this.getAll<T>(key);
    items.push(item);
    localStorage.setItem(key, JSON.stringify(items));
  }

  /** Actualizar un item existente */
  static update<T extends { id: string }>(key: string, id: string, updatedItem: Partial<T>): void {
    const items = this.getAll<T>(key);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedItem };
      localStorage.setItem(key, JSON.stringify(items));
    }
  }

  /** Eliminar un item por ID */
  static remove<T extends { id: string }>(key: string, id: string): void {
    const items = this.getAll<T>(key);
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
  }

  /** Guardar una colección completa (reemplaza) */
  static setAll<T>(key: string, items: T[]): void {
    localStorage.setItem(key, JSON.stringify(items));
  }

  /** Obtener un valor simple (no-array) */
  static getValue(key: string): string | null {
    return localStorage.getItem(key);
  }

  /** Guardar un valor simple */
  static setValue(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  /** Eliminar una clave */
  static removeKey(key: string): void {
    localStorage.removeItem(key);
  }
}

// Claves de almacenamiento
export const STORAGE_KEYS = {
  USERS: 'uninotes_users',
  CURRENT_USER: 'uninotes_current_user',
  SUBJECTS: 'uninotes_subjects',
  TASKS: 'uninotes_tasks',
  GRADES: 'uninotes_grades',
  SCHEDULE: 'uninotes_schedule',
  REMINDERS: 'uninotes_reminders',
  DARK_MODE: 'uninotes_dark_mode',
  DATA_INITIALIZED: 'uninotes_data_initialized',
};
