import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider, createGlobalStyle, DefaultTheme } from 'styled-components';
import * as MdIcons from 'react-icons/md';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

declare module 'styled-components' {
  export interface DefaultTheme {
    isDark: boolean; primary: string; bg: string; surface: string;
    text: string; border: string; hover: string;
    sidebarBg: string; textSecondary: string; radius: string; shadow: string;
  }
}

const { 
  MdHome, MdSettings, MdDelete, MdArchive, MdUnarchive, MdAdd, MdClose,
  MdPalette, MdChevronRight, MdContentCopy, MdLogout, MdEdit, MdSave, 
  MdWarning, MdInfo, MdSchool, MdStorage, MdPushPin
} = MdIcons as any;

const GlobalStyle = createGlobalStyle`
  body { margin: 0; font-family: 'Inter', sans-serif; background: ${(p: any) => p.theme.bg}; color: ${(p: any) => p.theme.text}; transition: 0.3s ease; }
  * { box-sizing: border-box; }
`;

const NOTE_COLORS = [
  { name: 'Padrão', color: 'transparent' }, { name: 'Coral', color: '#f28b82' }, { name: 'Ouro', color: '#fbbc04' },
  { name: 'Amarelo', color: '#fff475' }, { name: 'Verde', color: '#ccff90' }, { name: 'Azul', color: '#aecbfa' },
  { name: 'Roxo', color: '#d7aefb' }, { name: 'Rosa', color: '#fdcfe8' },
];

const themesList = [
  { 
    id: 'emerald', name: 'Verde Esmeralda (IFPR)', primary: '#10b981', isDark: false, 
    bg: '#f4f7fb', surface: '#ffffff', sidebarBg: '#ffffff', text: '#0f172a', 
    textSecondary: '#64748b', border: '#e2e8f0', hover: '#f1f5f9', radius: '16px', shadow: '0 4px 20px rgba(0,0,0,0.03)' 
  },
  { 
    id: 'ocean', name: 'Azul Executivo', primary: '#2563eb', isDark: false, 
    bg: '#f0f4f8', surface: '#ffffff', sidebarBg: '#ffffff', text: '#1e293b', 
    textSecondary: '#64748b', border: '#cbd5e1', hover: '#e2e8f0', radius: '12px', shadow: '0 4px 15px rgba(37,99,235,0.06)' 
  },
  { 
    id: 'cyberpunk', name: 'Cyberpunk Neon', primary: '#f59e0b', isDark: true, 
    bg: '#090d16', surface: '#111827', sidebarBg: '#0f172a', text: '#f3f4f6', 
    textSecondary: '#9ca3af', border: '#374151', hover: '#1f2937', radius: '8px', shadow: '0 0 20px rgba(245,158,11,0.15)' 
  },
  { 
    id: 'purple', name: 'Roxo Místico', primary: '#8b5cf6', isDark: true, 
    bg: '#0b0f19', surface: '#131c31', sidebarBg: '#0f172a', text: '#f8fafc', 
    textSecondary: '#94a3b8', border: '#2d3748', hover: '#1a2234', radius: '20px', shadow: '0 8px 30px rgba(139,92,246,0.12)' 
  },
  { 
    id: 'minimal', name: 'Minimalista Neutro', primary: '#4b5563', isDark: false, 
    bg: '#fafafa', surface: '#ffffff', sidebarBg: '#f4f4f5', text: '#18181b', 
    textSecondary: '#71717a', border: '#e4e4e7', hover: '#f4f4f5', radius: '14px', shadow: 'none' 
  }
];

const Layout = styled.div`display: flex; height: 100vh; overflow: hidden;`;
const Sidebar = styled.div`width: 260px; background: ${(p: any) => p.theme.sidebarBg}; border-right: 1px solid ${(p: any) => p.theme.border}; display: flex; flex-direction: column; padding: 20px 0;`;
const Logo = styled.div`font-size: 24px; font-weight: 800; padding: 0 24px 30px; cursor: pointer; display: flex; gap: 6px; justify-content: center; letter-spacing: -0.5px;`;

const NavItem = styled.div<{ active?: boolean }>`
  padding: 12px 24px; margin: 4px 12px; cursor: pointer; display: flex; align-items: center; gap: 12px; 
  background: ${(p: any) => p.active ? p.theme.primary + '15' : 'transparent'}; 
  color: ${(p: any) => p.active ? p.theme.primary : p.theme.textSecondary}; 
  border-radius: ${(p: any) => p.theme.radius}; font-weight: 600; font-size: 14px; transition: 0.2s; 
  &:hover { background: ${(p: any) => p.theme.hover}; }
`;

const Main = styled.div`flex: 1; padding: 45px; overflow-y: auto; display: flex; flex-direction: column; align-items: center;`;

const WelcomeBanner = styled.div`
  width: 100%; max-width: 1000px; background: ${(p: any) => p.theme.surface}; border: 1px solid ${(p: any) => p.theme.border};
  border-radius: ${(p: any) => p.theme.radius}; padding: 30px 35px; margin-bottom: 35px; box-shadow: ${(p: any) => p.theme.shadow};
  display: flex; justify-content: space-between; align-items: center; position: relative; overflow: hidden;
  &::before { content: ''; position: absolute; top: 0; left: 0; width: 6px; height: 100%; background: ${(p: any) => p.theme.primary}; }
`;

const SubjectCard = styled.div`
  background: ${(p: any) => p.theme.surface}; border: 1px solid ${(p: any) => p.theme.border}; padding: 30px 20px; 
  border-radius: ${(p: any) => p.theme.radius}; cursor: pointer; transition: all 0.25s ease;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; box-shadow: ${(p: any) => p.theme.shadow};
  &:hover { transform: translateY(-6px); border-color: ${(p: any) => p.theme.primary}; box-shadow: 0 12px 30px rgba(0,0,0,0.08); }
  h2 { 
    margin: 0; font-size: 16px; font-weight: 700; text-align: center; 
    overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    word-break: break-word; max-width: 100%;
  }
`;

const NoteCard = styled.div<{ noteColor: string; pinned?: boolean }>`
  background: ${(p: any) => p.noteColor === 'transparent' ? p.theme.surface : p.noteColor}; 
  color: ${(p: any) => p.noteColor === 'transparent' ? p.theme.text : '#202124'}; 
  padding: 22px; border-radius: ${(p: any) => p.theme.radius}; border: 2px solid ${(p: any) => p.pinned ? p.theme.primary : p.theme.border}; 
  display: flex; flex-direction: column; position: relative; transition: 0.2s; box-shadow: ${(p: any) => p.theme.shadow};
  &:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
`;

const ColorMenu = styled.div`
  position: absolute; bottom: 45px; right: 10px; background: ${(p: any) => p.theme.surface}; padding: 8px; 
  border-radius: 12px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; 
  box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 50; border: 1px solid ${(p: any) => p.theme.border};
`;

const ModalOverlay = styled.div`position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px;`;
const Modal = styled.div`background: ${(p: any) => p.theme.surface}; padding: 35px; border-radius: ${(p: any) => p.theme.radius}; width: 100%; max-width: 480px; border: 1px solid ${(p: any) => p.theme.border}; box-shadow: 0 20px 40px rgba(0,0,0,0.15);`;

const AuthContainer = styled.div`height: 100vh; display: flex; align-items: center; justify-content: center; background: ${(p: any) => p.theme.bg};`;
const AuthCard = styled(Modal)`text-align: center;`;
const AuthInput = styled.input`width: 100%; padding: 14px 16px; margin-bottom: 16px; border-radius: 12px; border: 2px solid ${(p: any) => p.theme.border}; background: ${(p: any) => p.theme.bg}; color: ${(p: any) => p.theme.text}; outline: none; font-size: 15px; &:focus { border-color: ${(p: any) => p.theme.primary}; }`;
const AuthButton = styled.button`width: 100%; padding: 14px; background: ${(p: any) => p.theme.primary}; color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: bold; cursor: pointer; transition: 0.2s; &:hover { opacity: 0.9; }`;

const WarningText = styled.p`color: #ef4444; font-weight: 600; font-size: 12.5px; display: flex; align-items: center; gap: 5px; margin-top: 12px;`;
const ActionBtn = styled.button`background: transparent; border: none; cursor: pointer; color: ${(p: any) => p.theme.textSecondary}; display: flex; align-items: center; gap: 5px; font-weight: 600; &:hover { color: ${(p: any) => p.theme.primary}; }`;

interface Subject { id: number; name: string; }
interface Note { id: number; title: string; content: string; color: string; subject: string; archived: boolean; pinned: boolean; date: string; lastEdited?: string; archived_at?: string; }

export default function App() {
  const [currentThemeId, setCurrentThemeId] = useState<string>(localStorage.getItem('theme_id') || 'emerald');
  const activeThemeObj = themesList.find(t => t.id === currentThemeId) || themesList[0];

  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  
  const [authMode, setAuthMode] = useState<'login'|'register'|'reset'>('login');
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '', secret_word: '', newPassword: '' });
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [view, setView] = useState<'active' | 'archived'>('active');
  const [activeColorMenu, setActiveColorMenu] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'note' | 'subject', id: any } | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null); 

  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [editedSubjectName, setEditedSubjectName] = useState('');

  const theme: DefaultTheme = {
    isDark: activeThemeObj.isDark,
    primary: activeThemeObj.primary,
    bg: activeThemeObj.bg,
    surface: activeThemeObj.surface,
    sidebarBg: activeThemeObj.sidebarBg,
    text: activeThemeObj.text,
    textSecondary: activeThemeObj.textSecondary,
    border: activeThemeObj.border,
    hover: activeThemeObj.hover,
    radius: activeThemeObj.radius,
    shadow: activeThemeObj.shadow
  };

  const getTime = () => new Date().toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });

  const api = axios.create({ baseURL: API_URL, headers: { Authorization: `Bearer ${token}` } });

  useEffect(() => { if (token) fetchData(); }, [token]);

  const fetchData = async () => {
    try {
      const [resSub, resNotes] = await Promise.all([ api.get('/subjects'), api.get('/notes') ]);
      setSubjects(resSub.data); 
      setNotes(resNotes.data);
    } catch (err) { console.error("Erro ao carregar dados", err); }
  };

  const handleLoginRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = authMode === 'register' ? '/register' : '/login';
      const res = await axios.post(`${API_URL}${endpoint}`, authForm);
      if (authMode === 'register') {
        alert("Conta criada! Faça login agora.");
        setAuthMode('login');
      } else {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.username);
        setToken(res.data.token); setUsername(res.data.username);
      }
    } catch (err: any) { alert(err.response?.data?.error || "Erro de conexão."); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/reset-password`, authForm);
      alert("Senha atualizada com sucesso! Faça login.");
      setAuthMode('login');
    } catch (err: any) { alert(err.response?.data?.error || "Erro ao redefinir a senha."); }
  };

  const handleLogout = () => { 
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null); 
    setUsername(null); 
  };

  const handleAddSubject = async () => { 
    const trimmed = newSubName.trim();
    if (trimmed) { 
      try { 
        await api.post(`/subjects`, { name: trimmed.substring(0, 30) }); 
        setNewSubName(''); 
        setShowSubModal(false); 
        fetchData(); 
      } catch (err: any) { 
        alert(err.response?.data?.error || "Erro ao salvar matéria."); 
      } 
    } 
  };
  
  const handleSaveNote = async () => { 
    const tInput = document.getElementById('noteTitle') as HTMLInputElement; 
    const cInput = document.getElementById('noteContent') as HTMLTextAreaElement; 
    if (tInput.value || cInput.value) { 
      try { 
        await api.post(`/notes`, { title: tInput.value, content: cInput.value, color: 'transparent', subject: activeSub || 'Geral', archived: false, pinned: false, date: getTime() }); 
        fetchData(); 
        tInput.value = ''; cInput.value = ''; 
      } catch (err: any) { 
        alert(err.response?.data?.error || "Erro ao salvar a nota."); 
      } 
    } 
  };
  
  const handleUpdateNote = async (id: number, fields: Partial<Note>) => { 
    try { 
      await api.put(`/notes/${id}`, fields); 
      fetchData(); 
    } catch (err) {} 
  };

  const handleTogglePin = (note: Note) => {
    const pinnedCount = notes.filter(n => n.subject === activeSub && !n.archived && n.pinned).length;
    if (!note.pinned && pinnedCount >= 6) {
      alert("Você pode fixar no máximo 6 notas por matéria!");
      return;
    }
    handleUpdateNote(note.id, { pinned: !note.pinned });
  };

  const handleRenameSubject = async () => {
    const currentSubObj = subjects.find(s => s.name === activeSub);
    const trimmed = editedSubjectName.trim();
    if (!trimmed || !currentSubObj) return;
    try {
      await api.put(`/subjects/${currentSubObj.id}`, { name: trimmed.substring(0, 30) });
      setActiveSub(trimmed.substring(0, 30));
      setIsEditingSubject(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro ao renomear matéria.");
    }
  };

  const handleDuplicateNote = async (note: Note) => { 
    const { id, ...noteData } = note; 
    try { 
      await api.post(`/notes`, { ...noteData, title: `${note.title} (Cópia)`, date: getTime() }); 
      fetchData(); 
    } catch (err) {} 
  };

  const confirmDelete = async () => { 
    if (!deleteTarget) return; 
    try { 
      if (deleteTarget.type === 'note') { 
        await api.delete(`/notes/${deleteTarget.id}`); 
      } else { 
        await api.delete(`/subjects/${deleteTarget.id}`); 
        setActiveSub(null); 
      } 
      setDeleteTarget(null); 
      fetchData(); 
    } catch (err) {} 
  };

  const calculateDaysRemaining = (archivedAt?: string) => {
    if (!archivedAt) return 10;
    const archivedDate = new Date(archivedAt).getTime();
    const expiryDate = archivedDate + (10 * 24 * 60 * 60 * 1000);
    const now = new Date().getTime();
    const diffDays = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const filteredNotes = notes
    .filter(n => n.subject === activeSub && (view === 'active' ? !n.archived : n.archived))
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  if (!token) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <AuthContainer>
          <AuthCard>
            <Logo style={{marginBottom: 15}}><span style={{ color: '#10b981' }}>IF</span> <span style={{ color: '#f59e0b' }}>Keep</span></Logo>
            
            {(authMode === 'login' || authMode === 'register') && (
              <>
                <h2 style={{marginBottom: 25, fontWeight: 800}}>{authMode === 'register' ? 'Crie sua conta' : 'Acesse suas notas'}</h2>
                <form onSubmit={handleLoginRegister}>
                  {authMode === 'register' && <AuthInput placeholder="Nome de usuário" required onChange={e => setAuthForm({...authForm, username: e.target.value})} />}
                  
                  <AuthInput type="email" placeholder="E-mail" required onChange={e => setAuthForm({...authForm, email: e.target.value})} />
                  <AuthInput type="password" placeholder="Senha" required onChange={e => setAuthForm({...authForm, password: e.target.value})} />
                  
                  {authMode === 'register' && (
                    <AuthInput type="text" placeholder="Crie uma Palavra-Secreta (Recuperação)" required onChange={e => setAuthForm({...authForm, secret_word: e.target.value})} />
                  )}
                  
                  <AuthButton type="submit">{authMode === 'register' ? 'Cadastrar' : 'Entrar'}</AuthButton>
                </form>
                
                <div style={{marginTop: 20, fontSize: 14, color: theme.textSecondary, display: 'flex', flexDirection: 'column', gap: 10}}>
                  <span style={{cursor: 'pointer'}} onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
                    {authMode === 'register' ? 'Já tem conta? Faça Login' : 'Não tem conta? Cadastre-se'}
                  </span>
                  {authMode === 'login' && (
                    <span style={{cursor: 'pointer', color: activeThemeObj.primary, fontWeight: 'bold'}} onClick={() => setAuthMode('reset')}>
                      Esqueceu sua senha?
                    </span>
                  )}
                </div>
              </>
            )}

            {authMode === 'reset' && (
              <>
                <h2 style={{marginBottom: 10, fontWeight: 800}}>Recuperar Senha</h2>
                <p style={{color: theme.textSecondary, marginBottom: 20, fontSize: 14}}>Digite seu e-mail e a Palavra-Secreta.</p>
                <form onSubmit={handleResetPassword}>
                  <AuthInput type="email" placeholder="Seu E-mail" required onChange={e => setAuthForm({...authForm, email: e.target.value})} />
                  <AuthInput type="text" placeholder="Sua Palavra-Secreta" required onChange={e => setAuthForm({...authForm, secret_word: e.target.value})} />
                  <AuthInput type="password" placeholder="Sua Nova Senha" required onChange={e => setAuthForm({...authForm, newPassword: e.target.value})} />
                  <AuthButton type="submit">Atualizar Senha</AuthButton>
                </form>
                <p style={{marginTop: 20, fontSize: 14, color: theme.textSecondary, cursor: 'pointer', fontWeight: 'bold'}} onClick={() => setAuthMode('login')}>
                  Voltar para o Login
                </p>
              </>
            )}

          </AuthCard>
        </AuthContainer>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Layout>
        <Sidebar>
          <Logo onClick={() => setActiveSub(null)}><span style={{ color: '#10b981' }}>IF</span> <span style={{ color: '#f59e0b' }}>Keep</span></Logo>
          <NavItem active={activeSub === null} onClick={() => setActiveSub(null)}><MdHome size={20}/> Início</NavItem>
          
          <div style={{padding: '25px 24px 10px', fontSize: 11, fontWeight: 700, color: theme.textSecondary, letterSpacing: '0.5px'}}>MINHAS MATÉRIAS</div>
          
          <div style={{flex: 1, overflowY: 'auto'}}>
            {subjects.map(s => (
              <NavItem key={s.id} active={activeSub === s.name} onClick={() => {setActiveSub(s.name); setView('active'); setIsEditingSubject(false);}}>
                <div style={{flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{s.name}</div>
                <MdDelete size={16} onClick={(e: React.MouseEvent) => { e.stopPropagation(); setDeleteTarget({type: 'subject', id: s.id}); }}/>
              </NavItem>
            ))}
          </div>

          <div style={{marginTop: 'auto', borderTop: `1px solid ${theme.border}`, paddingTop: '10px'}}>
            <NavItem onClick={() => setShowSettings(true)}><MdSettings size={20}/> Configurações</NavItem>
            <NavItem onClick={handleLogout} style={{color: '#ef4444'}}><MdLogout size={20}/> Sair</NavItem>
          </div>
        </Sidebar>

        <Main>
          {!activeSub ? (
            <div style={{width: '100%', maxWidth: 1000}}>
              <WelcomeBanner>
                <div>
                  <h1 style={{margin: '0 0 6px 0', fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px'}}>Olá, {username || 'Estudante'}!</h1>
                  <p style={{color: theme.textSecondary, margin: 0, fontSize: '15px'}}>Seu painel de notas está organizado e sincronizado.</p>
                </div>
                <div style={{background: activeThemeObj.primary + '15', color: activeThemeObj.primary, padding: '8px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '13px'}}>
                  {subjects.length} Matérias cadastradas
                </div>
              </WelcomeBanner>

              <h3 style={{marginBottom: 20, fontSize: '18px', fontWeight: 700}}>Selecione uma Matéria</h3>
              
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 20}}>
                {subjects.map(s => (
                  <SubjectCard key={s.id} onClick={() => setActiveSub(s.name)}>
                    <div style={{background: activeThemeObj.primary + '15', padding: 16, borderRadius: '50%', color: activeThemeObj.primary}}><MdChevronRight size={26}/></div>
                    <h2>{s.name}</h2>
                    <span style={{fontSize: 12.5, color: theme.textSecondary, fontWeight: 500}}>{notes.filter(n => n.subject === s.name && !n.archived).length} notas ativas</span>
                  </SubjectCard>
                ))}
                <SubjectCard style={{borderStyle: 'dashed', background: 'transparent', boxShadow: 'none'}} onClick={() => setShowSubModal(true)}>
                  <div style={{background: theme.hover, padding: 16, borderRadius: '50%', color: theme.textSecondary}}><MdAdd size={26}/></div>
                  <h2 style={{color: theme.textSecondary}}>Nova Matéria</h2>
                </SubjectCard>
              </div>
            </div>
          ) : (
            <div style={{width: '100%', maxWidth: 900}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  {isEditingSubject ? (
                    <>
                      <input 
                        maxLength={30}
                        value={editedSubjectName} 
                        onChange={e => setEditedSubjectName(e.target.value)} 
                        style={{padding: '6px 12px', fontSize: 24, fontWeight: 'bold', borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.surface, color: theme.text, outline: 'none'}}
                      />
                      <ActionBtn onClick={handleRenameSubject}><MdSave size={20} /> Salvar</ActionBtn>
                      <ActionBtn onClick={() => setIsEditingSubject(false)}><MdClose size={20} /></ActionBtn>
                    </>
                  ) : (
                    <>
                      <h1 style={{margin: 0, fontSize: '24px', fontWeight: 800, wordBreak: 'break-word', maxWidth: '500px'}}>{activeSub}</h1>
                      <ActionBtn onClick={() => { setIsEditingSubject(true); setEditedSubjectName(activeSub); }} title="Renomear Matéria"><MdEdit size={18} /></ActionBtn>
                    </>
                  )}
                </div>

                <div style={{display: 'flex', background: theme.hover, padding: 4, borderRadius: 12, border: `1px solid ${theme.border}`}}>
                  <button onClick={() => setView('active')} style={{border:'none', padding:'8px 16px', borderRadius:8, cursor:'pointer', background: view === 'active' ? theme.surface : 'transparent', color: view === 'active' ? activeThemeObj.primary : theme.textSecondary, fontWeight: 'bold'}}>Ativas</button>
                  <button onClick={() => setView('archived')} style={{border:'none', padding:'8px 16px', borderRadius:8, cursor:'pointer', background: view === 'archived' ? theme.surface : 'transparent', color: view === 'archived' ? activeThemeObj.primary : theme.textSecondary, fontWeight: 'bold'}}>Arquivo</button>
                </div>
              </div>

              {view === 'active' && (
                <div style={{background: theme.surface, padding: 22, borderRadius: activeThemeObj.radius, border: `1px solid ${theme.border}`, marginBottom: 35, boxShadow: theme.shadow}}>
                    <input placeholder="Título da nota..." id="noteTitle" style={{width:'100%', border:'none', background:'transparent', outline:'none', fontWeight:'bold', fontSize:17, color:theme.text, marginBottom:10}} />
                    <textarea placeholder="Escreva sua ideia aqui..." id="noteContent" style={{width:'100%', border:'none', background:'transparent', outline:'none', fontSize:15, color:theme.text, resize:'none', minHeight: 65, lineHeight: '1.5'}} />
                    <div style={{display:'flex', justifyContent:'flex-end', borderTop: `1px solid ${theme.border}`, paddingTop: '12px', marginTop: '8px'}}>
                      <button onClick={handleSaveNote} style={{background:activeThemeObj.primary, color:'white', border:'none', padding:'10px 24px', borderRadius:10, fontWeight:'bold', cursor:'pointer'}}>Salvar Nota</button>
                    </div>
                </div>
              )}

              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20}}>
                {filteredNotes.map((n) => {
                  const daysLeft = calculateDaysRemaining(n.archived_at);
                  const isColorMenuOpen = Boolean(activeColorMenu === n.id);
                  return (
                    <NoteCard key={n.id} noteColor={n.color} pinned={n.pinned}>
                      <div style={{flex: 1, cursor: 'pointer', overflow: 'hidden'}} onClick={() => setEditingNote(n)}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: '10px'}}>
                          <h3 style={{margin: 0, fontSize: '16px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1}}>{n.title || 'Sem título'}</h3>
                          <MdPushPin size={18} color={n.pinned ? activeThemeObj.primary : theme.textSecondary} cursor="pointer" title={n.pinned ? "Desafixar nota" : "Fixar nota"} onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleTogglePin(n); }} />
                        </div>
                        <p style={{margin: 0, fontSize: '14px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{n.content}</p>
                      </div>

                      {Boolean(n.archived) && (
                        <WarningText>
                          <MdWarning size={16} /> {daysLeft > 0 ? `Exclusão automática em ${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'}.` : 'Exclusão automática hoje.'}
                        </WarningText>
                      )}
                      
                      <div style={{marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '10px'}}>
                        <span style={{fontSize: 10, color: n.color === 'transparent' ? theme.textSecondary : 'rgba(0,0,0,0.5)', fontWeight: 'bold'}}>
                          {n.lastEdited ? `Editado: ${n.lastEdited}` : `Criado: ${n.date}`}
                        </span>
                        <div style={{display: 'flex', gap: 10, color: n.color === 'transparent' ? theme.textSecondary : 'rgba(0,0,0,0.6)', position: 'relative'}}>
                          <MdPalette size={18} cursor="pointer" onClick={() => setActiveColorMenu(activeColorMenu === n.id ? null : n.id)}/>
                          {isColorMenuOpen && (
                            <ColorMenu>
                              {NOTE_COLORS.map(c => <div key={c.color} onClick={() => { handleUpdateNote(n.id, {color: c.color}); setActiveColorMenu(null); }} style={{width:24, height:24, borderRadius:'50%', background:c.color, border:'1px solid rgba(0,0,0,0.15)', cursor:'pointer'}} />)}
                            </ColorMenu>
                          )}
                          <MdContentCopy size={18} cursor="pointer" onClick={() => handleDuplicateNote(n)} />
                          <div onClick={() => handleUpdateNote(n.id, {archived: !n.archived})}>
                            {Boolean(n.archived) ? <MdUnarchive size={18} cursor="pointer"/> : <MdArchive size={18} cursor="pointer"/>}
                          </div>
                          <MdDelete size={18} cursor="pointer" onClick={() => setDeleteTarget({type: 'note', id: n.id})}/>
                        </div>
                      </div>
                    </NoteCard>
                  );
                })}
              </div>
            </div>
          )}
        </Main>

        {deleteTarget && (
          <ModalOverlay><Modal>
            <h3 style={{marginTop:0, fontWeight: 800}}>Confirmar Exclusão?</h3>
            <p style={{color: theme.textSecondary}}>Essa ação não pode ser desfeita.</p>
            <div style={{display:'flex', gap:10, marginTop:25}}>
              <button onClick={() => setDeleteTarget(null)} style={{flex:1, padding:12, borderRadius:12, border:'none', background: theme.hover, color: theme.text, fontWeight: 600, cursor: 'pointer'}}>Cancelar</button>
              <button onClick={confirmDelete} style={{flex:1, padding:12, borderRadius:12, border:'none', background:'#ef4444', color:'white', fontWeight:'bold', cursor:'pointer'}}>Excluir</button>
            </div>
          </Modal></ModalOverlay>
        )}

        {showSubModal && (
          <ModalOverlay><Modal>
            <h3 style={{marginTop:0, fontWeight: 800}}>Criar Nova Matéria</h3>
            <input maxLength={30} autoFocus value={newSubName} onChange={e => setNewSubName(e.target.value)} placeholder="Ex: Matemática (máx 30 caracteres)" style={{width:'100%', padding:12, borderRadius:12, border:`2px solid ${theme.border}`, background:theme.bg, color:theme.text, outline:'none', marginBottom:20}} />
            <div style={{display:'flex', gap:10}}>
              <button onClick={() => setShowSubModal(false)} style={{padding:12, borderRadius:12, border:'none', background: theme.hover, color: theme.text, fontWeight: 600, cursor: 'pointer'}}>Cancelar</button>
              <button onClick={handleAddSubject} style={{flex:1, padding:12, background:activeThemeObj.primary, color:'white', border:'none', borderRadius:12, fontWeight:'bold', cursor:'pointer'}}>Adicionar</button>
            </div>
          </Modal></ModalOverlay>
        )}

        {editingNote && (
          <ModalOverlay onClick={() => setEditingNote(null)}>
            <Modal onClick={e => e.stopPropagation()} style={{maxWidth: 600}}>
              <input value={editingNote.title} onChange={e => setEditingNote({...editingNote, title: e.target.value})} style={{width:'100%', border:'none', background:'transparent', fontSize:20, fontWeight:'bold', color:theme.text, outline:'none', marginBottom:15}} />
              <textarea value={editingNote.content} onChange={e => setEditingNote({...editingNote, content: e.target.value})} style={{width:'100%', border:'none', background:'transparent', fontSize:15, color:theme.text, outline:'none', minHeight:220, resize:'none', lineHeight: '1.6'}} />
              <div style={{display:'flex', justifyContent:'flex-end', marginTop:20, borderTop: `1px solid ${theme.border}`, paddingTop: '15px'}}>
                <button onClick={() => { handleUpdateNote(editingNote.id, {title: editingNote.title, content: editingNote.content, lastEdited: getTime()}); setEditingNote(null); }} style={{background:activeThemeObj.primary, color:'white', border:'none', padding:'10px 25px', borderRadius:10, fontWeight:'bold', cursor:'pointer'}}>Salvar Alterações</button>
              </div>
            </Modal>
          </ModalOverlay>
        )}

        {showSettings && (
          <ModalOverlay onClick={() => setShowSettings(false)}><Modal onClick={e => e.stopPropagation()} style={{maxWidth: 550}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
              <h3 style={{margin:0, fontWeight: 800}}>Configurações & Temas</h3>
              <MdClose size={22} cursor="pointer" onClick={() => setShowSettings(false)}/>
            </div>
            
            <h4 style={{marginBottom: 10, fontSize: '13px', fontWeight: 700, color: theme.textSecondary, letterSpacing: '0.5px'}}>SELECIONE O TEMA VISUAL</h4>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 25}}>
              {themesList.map(t => (
                <div key={t.id} onClick={() => { setCurrentThemeId(t.id); localStorage.setItem('theme_id', t.id); }} style={{padding: '12px 14px', borderRadius: '12px', border: `2px solid ${currentThemeId === t.id ? activeThemeObj.primary : theme.border}`, background: theme.hover, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600}}>
                  <div style={{width: 14, height: 14, borderRadius: '50%', background: t.primary}} />
                  {t.name}
                </div>
              ))}
            </div>

            <h4 style={{marginBottom: 10, fontSize: '13px', fontWeight: 700, color: theme.textSecondary, letterSpacing: '0.5px'}}>CRÉDITOS DO PROJETO & TCC</h4>
            <div style={{padding: '20px', background: theme.hover, borderRadius: '14px', border: `1px solid ${theme.border}`, lineHeight: '1.6', fontSize: 13.5}}>
               <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 8px 0' }}>
                 <MdInfo color={activeThemeObj.primary} size={18} /> <strong>IFkeep — Sistema de Organização de Notas</strong>
               </p>
               <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 8px 0' }}>
                 <MdSchool color={activeThemeObj.primary} size={18} /> Autor: <strong>Alisson Maccarini da Cunha</strong> | Turma: <strong>INFO 4</strong>
               </p>
               <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 8px 0' }}>
                 <MdStorage color={activeThemeObj.primary} size={18} /> Período: <strong>2023–2026</strong> | Instituição: <strong>IFPR</strong>
               </p>
               <hr style={{ border: '0', borderTop: `1px solid ${theme.border}`, margin: '12px 0' }} />
               <p style={{ margin: 0, fontSize: '11.5px', color: theme.textSecondary, fontWeight: 500 }}>
                 Trabalho de Conclusão de Curso (TCC). Todos os direitos reservados.
               </p>
            </div>
          </Modal></ModalOverlay>
        )}
      </Layout>
    </ThemeProvider>
  );
}