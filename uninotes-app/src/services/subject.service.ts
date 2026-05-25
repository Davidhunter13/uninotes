// ============================================
// UniNotes - Subject Service
// CRUD para materias académicas
// ============================================

import { Subject } from '../types';
import { StorageService, STORAGE_KEYS } from './storage.service';
import { v4 as uuidv4 } from 'uuid';

export class SubjectService {
  /** Obtener todas las materias del usuario */
  static getAll(userId: string): Subject[] {
    return StorageService.getAll<Subject>(STORAGE_KEYS.SUBJECTS)
      .filter(s => s.userId === userId);
  }

  /** Obtener materia por ID */
  static getById(id: string): Subject | undefined {
    return StorageService.getById<Subject>(STORAGE_KEYS.SUBJECTS, id);
  }

  /** Crear nueva materia */
  static create(data: Omit<Subject, 'id' | 'createdAt'>): Subject {
    const subject: Subject = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    StorageService.save<Subject>(STORAGE_KEYS.SUBJECTS, subject);
    return subject;
  }

  /** Actualizar materia */
  static update(id: string, data: Partial<Subject>): void {
    StorageService.update<Subject>(STORAGE_KEYS.SUBJECTS, id, data);
  }

  /** Eliminar materia */
  static delete(id: string): void {
    StorageService.remove<Subject>(STORAGE_KEYS.SUBJECTS, id);
  }
}
