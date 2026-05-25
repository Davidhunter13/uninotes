// ============================================
// UniNotes - Reminder Service
// Gestión de recordatorios de tareas
// ============================================

import { Reminder } from '../types';
import { StorageService, STORAGE_KEYS } from './storage.service';
import { v4 as uuidv4 } from 'uuid';

export class ReminderService {
  /** Obtener todos los recordatorios */
  static getAll(userId: string): Reminder[] {
    return StorageService.getAll<Reminder>(STORAGE_KEYS.REMINDERS)
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /** Obtener recordatorios activos */
  static getActive(userId: string): Reminder[] {
    return this.getAll(userId).filter(r => r.active);
  }

  /** Obtener recordatorios próximos (dentro de N días) */
  static getUpcoming(userId: string, days: number = 3): Reminder[] {
    const now = new Date();
    const limit = new Date();
    limit.setDate(now.getDate() + days);

    return this.getActive(userId).filter(r => {
      const date = new Date(r.date);
      return date >= now && date <= limit;
    });
  }

  /** Crear recordatorio */
  static create(data: Omit<Reminder, 'id'>): Reminder {
    const reminder: Reminder = {
      ...data,
      id: uuidv4(),
    };
    StorageService.save<Reminder>(STORAGE_KEYS.REMINDERS, reminder);
    return reminder;
  }

  /** Activar/desactivar recordatorio */
  static toggle(id: string): void {
    const reminder = StorageService.getById<Reminder>(STORAGE_KEYS.REMINDERS, id);
    if (reminder) {
      StorageService.update<Reminder>(STORAGE_KEYS.REMINDERS, id, { active: !reminder.active } as Partial<Reminder>);
    }
  }

  /** Eliminar recordatorio */
  static delete(id: string): void {
    StorageService.remove<Reminder>(STORAGE_KEYS.REMINDERS, id);
  }
}
