import { useEffect, useState, type FormEvent } from 'react';
import {
  assignManagedAdmin, createManagedAdmin, createManagedStore, deleteManagedStore,
  getManagedAdmins, getManagedStores, updateManagedAdmin, updateManagedStore,
  type ManagedAdmin, type ManagedStore, type StoreInput,
} from '../../services/master.service';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const initialStore: StoreInput = { name: '', domain: '', description: '', email: '', phone: '', address: '', primaryColor: '#2563EB', secondaryColor: '#F8FAFC', adminIds: [] };

export default function Master() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stores, setStores] = useState<ManagedStore[]>([]);
  const [admins, setAdmins] = useState<ManagedAdmin[]>([]);
  const [storeForm, setStoreForm] = useState<StoreInput>(initialStore);
  const [editingStore, setEditingStore] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const load = async () => { try { const [loadedStores, loadedAdmins] = await Promise.all([getManagedStores(), getManagedAdmins()]); setStores(loadedStores); setAdmins(loadedAdmins); } catch { setError('Não foi possível carregar a gestão das lojas.'); } };
  useEffect(() => { load(); }, []);
  const availableFor = (id?: string) => admins.filter((admin) => !admin.storeId || admin.storeId === id);
  function setField(field: keyof StoreInput, value: string) { setStoreForm((current) => ({ ...current, [field]: value })); }
  function toggleAdmin(id: string) { setStoreForm((current) => ({ ...current, adminIds: current.adminIds?.includes(id) ? current.adminIds.filter((item) => item !== id) : [...(current.adminIds || []), id] })); }
  async function saveStore(event: FormEvent) { event.preventDefault(); setError(''); try { if (editingStore) await updateManagedStore(editingStore, storeForm); else await createManagedStore(storeForm); setStoreForm(initialStore); setEditingStore(null); await load(); } catch (err: any) { setError(err.response?.data?.message || 'Não foi possível salvar a loja.'); } }
  async function saveAdmin(event: FormEvent) { event.preventDefault(); setError(''); try { await createManagedAdmin(adminEmail, adminPassword); setAdminEmail(''); setAdminPassword(''); await load(); } catch (err: any) { setError(err.response?.data?.message || 'Não foi possível cadastrar o administrador.'); } }
  function editStore(store: ManagedStore) { setEditingStore(store.id); setStoreForm({ name: store.name, domain: store.domain || '', description: store.description || '', email: store.email || '', phone: store.phone || '', address: store.address || '', logoUrl: store.logoUrl || '', primaryColor: store.primaryColor, secondaryColor: store.secondaryColor, adminIds: store.users.map((admin) => admin.id) }); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  async function removeStore(store: ManagedStore) { if (!window.confirm(`Excluir a loja ${store.name}? Produtos e pedidos dela também serão removidos.`)) return; try { await deleteManagedStore(store.id); await load(); } catch { setError('Não foi possível excluir a loja.'); } }
  async function changeAdmin(admin: ManagedAdmin) { const email = window.prompt('E-mail do administrador:', admin.email); if (!email) return; const password = window.prompt('Nova senha (deixe em branco para manter):') || undefined; try { await updateManagedAdmin(admin.id, { email, password }); await load(); } catch (err: any) { setError(err.response?.data?.message || 'Não foi possível editar o administrador.'); } }
  async function detachAdmin(admin: ManagedAdmin) { if (!window.confirm(`Remover ${admin.email} desta loja?`)) return; try { await assignManagedAdmin(admin.id, null); await load(); } catch { setError('Não foi possível remover o vínculo.'); } }
  function leave() { logout(); localStorage.removeItem('tenantId'); navigate('/login', { replace: true }); }
  return <main className="container" style={{ padding: '2rem', maxWidth: 1100, margin: 'auto' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h1>Administração Master</h1><button className="btn-secondary" onClick={leave}>Sair</button></div><p>Gerencie lojas e administradores do sistema.</p>{error && <p style={{ color: 'var(--error)' }}>{error}</p>}
    <section className="card" style={{ marginBottom: '2rem', padding: '1rem' }}><h2>{editingStore ? 'Editar loja' : 'Nova loja'}</h2><form onSubmit={saveStore} style={{ display: 'grid', gap: '.7rem' }}><input required placeholder="Nome da loja" value={storeForm.name} onChange={(e) => setField('name', e.target.value)} /><input placeholder="Domínio" value={storeForm.domain} onChange={(e) => setField('domain', e.target.value)} /><textarea placeholder="Descrição" value={storeForm.description} onChange={(e) => setField('description', e.target.value)} /><input placeholder="E-mail" value={storeForm.email} onChange={(e) => setField('email', e.target.value)} /><input placeholder="Telefone" value={storeForm.phone} onChange={(e) => setField('phone', e.target.value)} /><input placeholder="Endereço" value={storeForm.address} onChange={(e) => setField('address', e.target.value)} /><input placeholder="URL do logo (opcional)" value={storeForm.logoUrl} onChange={(e) => setField('logoUrl', e.target.value)} /><div style={{ display: 'flex', gap: '1rem' }}><label>Cor primária<input type="color" value={storeForm.primaryColor} onChange={(e) => setField('primaryColor', e.target.value)} /></label><label>Cor secundária<input type="color" value={storeForm.secondaryColor} onChange={(e) => setField('secondaryColor', e.target.value)} /></label></div><fieldset><legend>Administradores disponíveis</legend>{availableFor(editingStore || undefined).length ? availableFor(editingStore || undefined).map((admin) => <label key={admin.id} style={{ display: 'block' }}><input type="checkbox" checked={storeForm.adminIds?.includes(admin.id)} onChange={() => toggleAdmin(admin.id)} /> {admin.email}</label>) : <p>Nenhum administrador disponível.</p>}</fieldset><div><button>{editingStore ? 'Salvar loja' : 'Criar loja'}</button>{editingStore && <button type="button" className="btn-secondary" onClick={() => { setEditingStore(null); setStoreForm(initialStore); }}>Cancelar</button>}</div></form></section>
    <section className="card" style={{ marginBottom: '2rem', padding: '1rem' }}><h2>Novo administrador</h2><form onSubmit={saveAdmin} style={{ display: 'flex', gap: '.7rem', flexWrap: 'wrap' }}><input required type="email" placeholder="E-mail" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} /><input required minLength={6} type="password" placeholder="Senha" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} /><button>Cadastrar administrador</button></form></section>
    <section><h2>Lojas cadastradas</h2>{stores.length === 0 ? <p>Nenhuma loja cadastrada.</p> : stores.map((store) => <article key={store.id} className="card" style={{ padding: '1rem', marginBottom: '1rem' }}><h3>{store.name}</h3><p>{store.description}</p><p><strong>Administradores:</strong> {store.users.length ? store.users.map((admin) => <span key={admin.id} style={{ marginRight: '.5rem' }}>{admin.email} <button onClick={() => changeAdmin(admin)}>Editar</button> <button onClick={() => detachAdmin(admin)}>Remover vínculo</button></span>) : 'Nenhum'}</p><button onClick={() => editStore(store)}>Editar loja</button> <button className="btn-secondary" onClick={() => removeStore(store)}>Excluir loja</button></article>)}</section>
    <section><h2>Administradores sem loja</h2>{admins.filter((admin) => !admin.storeId).map((admin) => <p key={admin.id}>{admin.email} <button onClick={() => changeAdmin(admin)}>Editar</button></p>)}</section>
  </main>;
}
