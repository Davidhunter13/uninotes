// ============================================
// UniNotes - Schedule Service
// CRUD para horario académico semanal
// ============================================

import { ScheduleEntry, WeekDay } from '../types';
import { StorageService, STORAGE_KEYS } from './storage.service';
import { v4 as uuidv4 } from 'uuid';

const DAY_ORDER: WeekDay[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export class ScheduleService {
  /** Obtener todas las entradas del horario */
  static getAll(userId: string): ScheduleEntry[] {
    return StorageService.getAll<ScheduleEntry>(STORAGE_KEYS.SCHEDULE)
      .filter(s => s.userId === userId);
  }

  /** Obtener entradas por día de la semana */
  static getByDay(userId: string, day: WeekDay): ScheduleEntry[] {
    return this.getAll(userId)
      .filter(s => s.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  /** Obtener entradas agrupadas por día */
  static getGroupedByDay(userId: string): Record<WeekDay, ScheduleEntry[]> {
    const all = this.getAll(userId);
    const grouped = {} as Record<WeekDay, ScheduleEntry[]>;

    DAY_ORDER.forEach(day => {
      grouped[day] = all
        .filter(s => s.day === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    return grouped;
  }

  /** Obtener entradas por materia */
  static getBySubject(userId: string, subjectId: string): ScheduleEntry[] {
    return this.getAll(userId).filter(s => s.subjectId === subjectId);
  }

  /** Obtener la clase actual o próxima del día */
  static getCurrentOrNext(userId: string): ScheduleEntry | null {
    const days: WeekDay[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const today = days[new Date().getDay() - 1];
    if (!today) return null;

    const now = new Date().toTimeString().slice(0, 5);
    const todayClasses = this.getByDay(userId, today);

    // Buscar clase actual
    const current = todayClasses.find(s => s.startTime <= now && s.endTime > now);
    if (current) return current;

    // Buscar próxima clase del día
    const next = todayClasses.find(s => s.startTime > now);
    return next || null;
  }

  /** Crear entrada de horario */
  static create(data: Omit<ScheduleEntry, 'id'>): ScheduleEntry {
    const entry: ScheduleEntry = {
      ...data,
      id: uuidv4(),
    };
    StorageService.save<ScheduleEntry>(STORAGE_KEYS.SCHEDULE, entry);
    return entry;
  }

  /** Actualizar entrada */
  static update(id: string, data: Partial<ScheduleEntry>): void {
    StorageService.update<ScheduleEntry>(STORAGE_KEYS.SCHEDULE, id, data);
  }

  /** Eliminar entrada */
  static delete(id: string): void {
    StorageService.remove<ScheduleEntry>(STORAGE_KEYS.SCHEDULE, id);
  }
}
