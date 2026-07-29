import { api } from './Api';
import type { Store } from './stores.service';

export interface ManagedAdmin { id: string; email: string; role: 'ADMIN'; storeId?: string | null; }
export interface ManagedStore extends Store { users: ManagedAdmin[]; }
export interface StoreInput { name: string; domain?: string; description?: string; email?: string; phone?: string; address?: string; logoUrl?: string; primaryColor?: string; secondaryColor?: string; adminIds?: string[]; }

export const getManagedStores = async (): Promise<ManagedStore[]> => (await api.get('/master/stores')).data;
export const getManagedAdmins = async (): Promise<ManagedAdmin[]> => (await api.get('/master/admins')).data;
export const createManagedStore = async (data: StoreInput): Promise<ManagedStore> => (await api.post('/master/stores', data)).data;
export const updateManagedStore = async (id: string, data: Partial<StoreInput>): Promise<ManagedStore> => (await api.patch(`/master/stores/${id}`, data)).data;
export const deleteManagedStore = async (id: string) => api.delete(`/master/stores/${id}`);
export const createManagedAdmin = async (email: string, password: string): Promise<ManagedAdmin> => (await api.post('/master/admins', { email, password })).data;
export const updateManagedAdmin = async (id: string, data: { email?: string; password?: string }): Promise<ManagedAdmin> => (await api.patch(`/master/admins/${id}`, data)).data;
export const assignManagedAdmin = async (id: string, storeId: string | null): Promise<ManagedAdmin> => (await api.patch(`/master/admins/${id}/store`, { storeId })).data;
