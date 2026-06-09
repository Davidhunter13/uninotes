// ============================================
// UniNotes - Mock Data
// Datos de ejemplo para poblar la app en primer lanzamiento
// ============================================

import { User, Subject, Task, Grade, ScheduleEntry, Reminder } from '../types';
import { StorageService, STORAGE_KEYS } from '../services/storage.service';

const DEMO_USER_ID = 'demo-user-001';

const demoUser: User = {
  id: DEMO_USER_ID,
  name: 'David Parra',
  email: 'davidparrra13@gmail.com',
  password: '123456',
  career: 'Ingeniería de Sistemas',
  semester: '5to Semestre',
  avatarColor: '#2563EB',
  createdAt: '2026-01-15T10:00:00.000Z',
};

const demoSubjects: Subject[] = [
  {
    id: 'sub-001',
    name: 'Cálculo Diferencial',
    professor: 'Dr. Roberto García',
    color: '#2563EB',
    credits: 4,
    room: 'Aula 301',
    userId: DEMO_USER_ID,
    createdAt: '2026-01-20T08:00:00.000Z',
  },
  {
    id: 'sub-002',
    name: 'Programación Orientada a Objetos',
    professor: 'Ing. María López',
    color: '#7C3AED',
    credits: 4,
    room: 'Lab 102',
    userId: DEMO_USER_ID,
    createdAt: '2026-01-20T08:00:00.000Z',
  },
  {
    id: 'sub-003',
    name: 'Física Mecánica',
    professor: 'Dr. Andrés Peña',
    color: '#22C55E',
    credits: 3,
    room: 'Aula 205',
    userId: DEMO_USER_ID,
    createdAt: '2026-01-20T08:00:00.000Z',
  },
  {
    id: 'sub-004',
    name: 'Inglés Técnico',
    professor: 'Lic. Sarah Johnson',
    color: '#F59E0B',
    credits: 2,
    room: 'Aula 108',
    userId: DEMO_USER_ID,
    createdAt: '2026-01-20T08:00:00.000Z',
  },
  {
    id: 'sub-005',
    name: 'Base de Datos',
    professor: 'Ing. Pedro Ramírez',
    color: '#EF4444',
    credits: 3,
    room: 'Lab 204',
    userId: DEMO_USER_ID,
    createdAt: '2026-01-20T08:00:00.000Z',
  },
];

const demoTasks: Task[] = [
  {
    id: 'task-001',
    subjectId: 'sub-001',
    title: 'Taller de Derivadas',
    description: 'Resolver los ejercicios del capítulo 3 sobre derivadas parciales.',
    dueDate: '2026-05-28T23:59:00.000Z',
    priority: 'alta',
    completed: false,
    userId: DEMO_USER_ID,
    createdAt: '2026-05-20T10:00:00.000Z',
  },
  {
    id: 'task-002',
    subjectId: 'sub-002',
    title: 'Proyecto Final - Sistema de Inventario',
    description: 'Desarrollar un sistema de inventario usando POO en Java.',
    dueDate: '2026-06-05T23:59:00.000Z',
    priority: 'alta',
    completed: false,
    userId: DEMO_USER_ID,
    createdAt: '2026-05-18T10:00:00.000Z',
  },
  {
    id: 'task-003',
    subjectId: 'sub-003',
    title: 'Informe de Laboratorio #4',
    description: 'Escribir el informe sobre el laboratorio de fricción.',
    dueDate: '2026-05-26T23:59:00.000Z',
    priority: 'media',
    completed: false,
    userId: DEMO_USER_ID,
    createdAt: '2026-05-19T10:00:00.000Z',
  },
  {
    id: 'task-004',
    subjectId: 'sub-004',
    title: 'Presentación Oral',
    description: 'Preparar presentación sobre tecnologías emergentes.',
    dueDate: '2026-05-30T14:00:00.000Z',
    priority: 'media',
    completed: false,
    userId: DEMO_USER_ID,
    createdAt: '2026-05-15T10:00:00.000Z',
  },
  {
    id: 'task-005',
    subjectId: 'sub-005',
    title: 'Diseño ER del proyecto',
    description: 'Crear el diagrama entidad-relación para el proyecto de BD.',
    dueDate: '2026-05-27T23:59:00.000Z',
    priority: 'alta',
    completed: false,
    userId: DEMO_USER_ID,
    createdAt: '2026-05-17T10:00:00.000Z',
  },
  {
    id: 'task-006',
    subjectId: 'sub-001',
    title: 'Quiz de Integrales',
    description: 'Estudiar para el quiz sobre integrales definidas.',
    dueDate: '2026-05-25T08:00:00.000Z',
    priority: 'alta',
    completed: false,
    userId: DEMO_USER_ID,
    createdAt: '2026-05-20T10:00:00.000Z',
  },
  {
    id: 'task-007',
    subjectId: 'sub-002',
    title: 'Lectura Patrones de Diseño',
    description: 'Leer capítulo sobre patrón Observer y Strategy.',
    dueDate: '2026-05-29T23:59:00.000Z',
    priority: 'baja',
    completed: true,
    userId: DEMO_USER_ID,
    createdAt: '2026-05-10T10:00:00.000Z',
  },
  {
    id: 'task-008',
    subjectId: 'sub-003',
    title: 'Ejercicios de Cinemática',
    description: 'Resolver los problemas 1-15 del capítulo 2.',
    dueDate: '2026-05-22T23:59:00.000Z',
    priority: 'media',
    completed: true,
    userId: DEMO_USER_ID,
    createdAt: '2026-05-12T10:00:00.000Z',
  },
];

const demoGrades: Grade[] = [
  // Cálculo
  { id: 'grade-001', subjectId: 'sub-001', name: 'Parcial 1', score: 4.2, percentage: 25, userId: DEMO_USER_ID, createdAt: '2026-03-10T10:00:00.000Z' },
  { id: 'grade-002', subjectId: 'sub-001', name: 'Parcial 2', score: 3.8, percentage: 25, userId: DEMO_USER_ID, createdAt: '2026-04-15T10:00:00.000Z' },
  { id: 'grade-003', subjectId: 'sub-001', name: 'Talleres', score: 4.5, percentage: 20, userId: DEMO_USER_ID, createdAt: '2026-05-01T10:00:00.000Z' },
  // Programación
  { id: 'grade-004', subjectId: 'sub-002', name: 'Parcial 1', score: 4.8, percentage: 30, userId: DEMO_USER_ID, createdAt: '2026-03-12T10:00:00.000Z' },
  { id: 'grade-005', subjectId: 'sub-002', name: 'Proyecto 1', score: 4.5, percentage: 20, userId: DEMO_USER_ID, createdAt: '2026-04-20T10:00:00.000Z' },
  // Física
  { id: 'grade-006', subjectId: 'sub-003', name: 'Parcial 1', score: 3.5, percentage: 30, userId: DEMO_USER_ID, createdAt: '2026-03-14T10:00:00.000Z' },
  { id: 'grade-007', subjectId: 'sub-003', name: 'Laboratorios', score: 4.0, percentage: 20, userId: DEMO_USER_ID, createdAt: '2026-04-25T10:00:00.000Z' },
  // Inglés
  { id: 'grade-008', subjectId: 'sub-004', name: 'Speaking Test', score: 4.3, percentage: 30, userId: DEMO_USER_ID, createdAt: '2026-03-18T10:00:00.000Z' },
  { id: 'grade-009', subjectId: 'sub-004', name: 'Writing Essay', score: 4.0, percentage: 25, userId: DEMO_USER_ID, createdAt: '2026-04-22T10:00:00.000Z' },
  // Base de Datos
  { id: 'grade-010', subjectId: 'sub-005', name: 'Parcial 1', score: 4.6, percentage: 25, userId: DEMO_USER_ID, createdAt: '2026-03-20T10:00:00.000Z' },
  { id: 'grade-011', subjectId: 'sub-005', name: 'Proyecto SQL', score: 5.0, percentage: 20, userId: DEMO_USER_ID, createdAt: '2026-04-28T10:00:00.000Z' },
];

const demoSchedule: ScheduleEntry[] = [
  // Lunes
  { id: 'sch-001', subjectId: 'sub-001', day: 'Lunes', startTime: '07:00', endTime: '09:00', room: 'Aula 301', userId: DEMO_USER_ID },
  { id: 'sch-002', subjectId: 'sub-002', day: 'Lunes', startTime: '09:00', endTime: '11:00', room: 'Lab 102', userId: DEMO_USER_ID },
  { id: 'sch-003', subjectId: 'sub-004', day: 'Lunes', startTime: '14:00', endTime: '16:00', room: 'Aula 108', userId: DEMO_USER_ID },
  // Martes
  { id: 'sch-004', subjectId: 'sub-003', day: 'Martes', startTime: '07:00', endTime: '09:00', room: 'Aula 205', userId: DEMO_USER_ID },
  { id: 'sch-005', subjectId: 'sub-005', day: 'Martes', startTime: '09:00', endTime: '11:00', room: 'Lab 204', userId: DEMO_USER_ID },
  // Miércoles
  { id: 'sch-006', subjectId: 'sub-001', day: 'Miércoles', startTime: '07:00', endTime: '09:00', room: 'Aula 301', userId: DEMO_USER_ID },
  { id: 'sch-007', subjectId: 'sub-002', day: 'Miércoles', startTime: '09:00', endTime: '11:00', room: 'Lab 102', userId: DEMO_USER_ID },
  { id: 'sch-008', subjectId: 'sub-003', day: 'Miércoles', startTime: '14:00', endTime: '16:00', room: 'Aula 205', userId: DEMO_USER_ID },
  // Jueves
  { id: 'sch-009', subjectId: 'sub-004', day: 'Jueves', startTime: '07:00', endTime: '09:00', room: 'Aula 108', userId: DEMO_USER_ID },
  { id: 'sch-010', subjectId: 'sub-005', day: 'Jueves', startTime: '09:00', endTime: '11:00', room: 'Lab 204', userId: DEMO_USER_ID },
  // Viernes
  { id: 'sch-011', subjectId: 'sub-001', day: 'Viernes', startTime: '07:00', endTime: '09:00', room: 'Aula 301', userId: DEMO_USER_ID },
  { id: 'sch-012', subjectId: 'sub-005', day: 'Viernes', startTime: '09:00', endTime: '11:00', room: 'Lab 204', userId: DEMO_USER_ID },
];

const demoReminders: Reminder[] = [
  { id: 'rem-001', taskId: 'task-006', title: 'Quiz mañana', message: 'Recuerda estudiar para el quiz de integrales.', date: '2026-05-24T20:00:00.000Z', active: true, userId: DEMO_USER_ID },
  { id: 'rem-002', taskId: 'task-003', title: 'Informe pendiente', message: 'El informe de laboratorio se entrega en 2 días.', date: '2026-05-24T18:00:00.000Z', active: true, userId: DEMO_USER_ID },
  { id: 'rem-003', taskId: 'task-001', title: 'Taller de Derivadas', message: 'Entregar el taller antes del viernes.', date: '2026-05-27T08:00:00.000Z', active: true, userId: DEMO_USER_ID },
  { id: 'rem-004', taskId: 'task-005', title: 'Diagrama ER', message: 'Terminar el diagrama entidad-relación.', date: '2026-05-26T10:00:00.000Z', active: true, userId: DEMO_USER_ID },
];

/** Inicializar datos de demostración en primer lanzamiento */
export const initializeMockData = (): void => {
  const initialized = StorageService.getValue(STORAGE_KEYS.DATA_INITIALIZED);
  if (initialized) {
    // Recuperar usuario demo si el flag existe pero la colección quedó vacía o fue alterada.
    const users = StorageService.getAll<User>(STORAGE_KEYS.USERS);
    const hasDemoUser = users.some(user => user.id === DEMO_USER_ID);

    if (!hasDemoUser) {
      StorageService.save<User>(STORAGE_KEYS.USERS, demoUser);
    }

    return;
  }

  // Registrar usuario demo
  StorageService.save<User>(STORAGE_KEYS.USERS, demoUser);

  // Poblar colecciones
  StorageService.setAll<Subject>(STORAGE_KEYS.SUBJECTS, demoSubjects);
  StorageService.setAll<Task>(STORAGE_KEYS.TASKS, demoTasks);
  StorageService.setAll<Grade>(STORAGE_KEYS.GRADES, demoGrades);
  StorageService.setAll<ScheduleEntry>(STORAGE_KEYS.SCHEDULE, demoSchedule);
  StorageService.setAll<Reminder>(STORAGE_KEYS.REMINDERS, demoReminders);

  // Marcar como inicializado
  StorageService.setValue(STORAGE_KEYS.DATA_INITIALIZED, 'true');
};

/** Restablecer datos de la app y volver a cargar la cuenta demo */
export const resetToDemoData = (): void => {
  StorageService.removeKey(STORAGE_KEYS.CURRENT_USER);
  StorageService.removeKey(STORAGE_KEYS.USERS);
  StorageService.removeKey(STORAGE_KEYS.SUBJECTS);
  StorageService.removeKey(STORAGE_KEYS.TASKS);
  StorageService.removeKey(STORAGE_KEYS.GRADES);
  StorageService.removeKey(STORAGE_KEYS.SCHEDULE);
  StorageService.removeKey(STORAGE_KEYS.REMINDERS);
  StorageService.removeKey(STORAGE_KEYS.DATA_INITIALIZED);

  initializeMockData();
};
