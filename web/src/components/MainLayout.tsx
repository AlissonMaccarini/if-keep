import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useNotes } from '../hooks/notes';
import * as MdIcons from 'react-icons/md';

const LayoutGrid = styled.div` display: flex; height: 100vh; font-family: 'Roboto', sans-serif; `;

const Sidebar = styled.aside` 
  width: 280px; 
  background: #fff; 
  display: flex; 
  flex-direction: column; 
  padding: 12px 0;
  border-right: 1px solid #f1f3f4;
`;

const NavLink = styled(Link)<{ active?: boolean; themeCol: string }>` 
  display: flex; 
  align-items: center; 
  gap: 20px; 
  padding: 12px 24px; 
  text-decoration: none; 
  color: ${props => props.active ? props.themeCol : '#3c4043'}; 
  background: ${props => props.active ? `${props.themeCol}15` : 'transparent'};
  border-radius: 0 25px 25px 0; 
  font-weight: 500;
  margin-right: 8px;
  transition: all 0.2s;
  &:hover { background-color: #f1f3f4; } 
`;

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mudamos 'theme' para 'themeColor' aqui para sumir o erro!
  const { subjects, themeColor, addSubject } = useNotes(); 
  const [subName, setSubName] = useState('');
  const location = useLocation();
  
  const AddIcon = MdIcons.MdAdd as any;
  const HomeIcon = MdIcons.MdHome as any;
  const ArchiveIcon = MdIcons.MdArchive as any;
  const SettingsIcon = MdIcons.MdSettings as any;

  return (
    <LayoutGrid>
      <Sidebar>
        <div style={{ padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', fontSize: '22px', fontWeight: 'bold', color: themeColor }}>
            <img src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png" alt="logo" style={{width: 30, marginRight: 10}} />
            IFkeep
        </div>
        
        <NavLink to="/" themeCol={themeColor} active={location.pathname === '/'}>
            <HomeIcon size={24}/> Início
        </NavLink>

        <div style={{ padding: '20px 24px' }}>
          <input 
            placeholder="Nome da matéria..." 
            value={subName} 
            onChange={e => setSubName(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid #ddd`, outlineColor: themeColor }} 
          />
          <button 
            onClick={() => { if(subName) addSubject(subName); setSubName(''); }} 
            style={{ width: '100%', marginTop: '10px', padding: '10px', borderRadius: '8px', background: themeColor, color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontWeight: 'bold' }}
          >
            <AddIcon size={18}/> Criar Turma
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
            <p style={{ padding: '10px 24px', fontSize: '11px', fontWeight: 'bold', color: '#5f6368', textTransform: 'uppercase' }}>Minhas Inscrições</p>
            {subjects.filter((s: any) => !s.isArchived).map((s: any) => (
                <NavLink key={s.id} to={`/subject/${s.id}`} themeCol={themeColor} active={location.pathname === `/subject/${s.id}`}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: s.color }} />
                    {s.name}
                </NavLink>
            ))}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #f1f3f4', margin: '10px 0' }} />
        <NavLink to="/archived" themeCol={themeColor} active={location.pathname === '/archived'}>
            <ArchiveIcon size={24}/> Turmas arquivadas
        </NavLink>
        <NavLink to="/settings" themeCol={themeColor} active={location.pathname === '/settings'}>
            <SettingsIcon size={24}/> Configurações
        </NavLink>
      </Sidebar>
      
      <main style={{ flex: 1, overflowY: 'auto', background: '#f8f9fa', padding: '30px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {children}
        </div>
      </main>
    </LayoutGrid>
  );
};