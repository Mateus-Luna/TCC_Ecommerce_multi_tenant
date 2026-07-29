import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerCustomer } from '../../services/auth.service';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  async function submit(event: FormEvent) {
    event.preventDefault(); setError('');
    if (password.length < 6) return setError('A senha precisa ter pelo menos 6 caracteres.');
    if (password !== confirmation) return setError('As senhas não coincidem.');
    setSaving(true);
    try { await registerCustomer({ email, password }); navigate('/login', { state: { message: 'Cadastro realizado. Faça seu login.' } }); }
    catch (err: any) { setError(err.response?.data?.message || 'Não foi possível realizar o cadastro.'); }
    finally { setSaving(false); }
  }
  return <div className="login-page"><form onSubmit={submit} className="login-card"><h1 className="login-title">Criar conta</h1>{error && <p style={{ color: 'var(--error)' }}>{error}</p>}<label>E-mail</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /><label>Senha</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /><label>Confirmar senha</label><input type="password" required value={confirmation} onChange={(e) => setConfirmation(e.target.value)} /><button disabled={saving}>{saving ? 'Cadastrando…' : 'Cadastrar'}</button><Link to="/login">Já possui cadastro? Entrar</Link></form></div>;
}
