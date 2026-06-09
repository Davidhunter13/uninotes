// ============================================
// UniNotes - Auth Service
// Maneja registro, login, logout y perfil
// ============================================

import { User } from '../types';
import { StorageService, STORAGE_KEYS } from './storage.service';
import { v4 as uuidv4 } from 'uuid';

const AVATAR_COLORS = ['#2563EB', '#7C3AED', '#22C55E', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6'];

export class AuthService {
  /** Registrar un nuevo usuario */
  static register(name: string, email: string, password: string): { success: boolean; message: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const users = StorageService.getAll<User>(STORAGE_KEYS.USERS);
    const exists = users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (exists) {
      return { success: false, message: 'Este correo ya está registrado.' };
    }

    const newUser: User = {
      id: uuidv4(),
      name,
      email: normalizedEmail,
      password: normalizedPassword,
      career: '',
      semester: '',
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      createdAt: new Date().toISOString(),
    };

    StorageService.save<User>(STORAGE_KEYS.USERS, newUser);
    return { success: true, message: 'Cuenta creada exitosamente.' };
  }

  /** Iniciar sesión */
  static login(email: string, password: string): { success: boolean; message: string; user?: User } {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const users = StorageService.getAll<User>(STORAGE_KEYS.USERS);
    const user = users.find(
      u => u.email.toLowerCase() === normalizedEmail && u.password === normalizedPassword
    );

    if (!user) {
      return { success: false, message: 'Correo o contraseña incorrectos.' };
    }

    StorageService.setValue(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return { success: true, message: 'Inicio de sesión exitoso.', user };
  }

  /** Cerrar sesión */
  static logout(): void {
    StorageService.removeKey(STORAGE_KEYS.CURRENT_USER);
  }

  /** Obtener usuario actual */
  static getCurrentUser(): User | null {
    const data = StorageService.getValue(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }

  /** Verificar si hay sesión activa */
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /** Actualizar perfil del usuario */
  static updateProfile(userId: string, updates: Partial<User>): User | null {
    StorageService.update<User>(STORAGE_KEYS.USERS, userId, updates);
    const updatedUser = StorageService.getById<User>(STORAGE_KEYS.USERS, userId);
    if (updatedUser) {
      StorageService.setValue(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    }
    return updatedUser || null;
  }

  /** Recuperar contraseña (mock) */
  static recoverPassword(email: string): { success: boolean; message: string } {
    const users = StorageService.getAll<User>(STORAGE_KEYS.USERS);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, message: 'No se encontró una cuenta con este correo.' };
    }

    return { success: true, message: 'Se ha enviado un enlace de recuperación a tu correo.' };
  }
}
