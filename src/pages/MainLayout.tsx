import React, { useState } from 'react';
import styled from 'styled-components';
import { useNotes } from '../hooks/notes';
import { Link, useLocation } from 'react-router-dom';
import * as MdIcons from 'react-icons/md';

const BookIcon = MdIcons.MdBook as any;
const HomeIcon = MdIcons.MdHome as any;
const ArchiveIcon = MdIcons.MdArchive as any;
const SettingsIcon = MdIcons.MdSettings as any;
const PlusIcon = MdIcons.MdAdd as any;

const LayoutContainer = styled.div`display: flex; min-height: 100vh; font-family: 'Segoe UI', sans-serif;`;
const Sidebar = styled.aside`width: 280px; background: #fff; border-right: 1px solid #e0e0e0; display: flex; flex-direction: column;`;
const MainContent = styled.main`flex: 1; background: #f8f9fa; overflow-y: auto;`;

const NavLink = styled(Link)<{ active: boolean; themeColor: string }>`
  display: flex; align-items: center; gap: 12px; padding: 12px 20px;
  text-decoration: none; color: ${props => props.active ? props.themeColor : '#5f6368'};
  background: ${props => props.active ? `${props.themeColor}15` : 'transparent'};
  border-radius: 0 25px 25px 0; margin-right: 10px; font-weight: 500;
  &:hover { background: #f1f3f4; }
`;

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { subjects, themeColor, addSubject } = useNotes();
  const [subName, setSubName] = useState('');
  const location = useLocation();

  const handleCreate = () => {
    if (subName.trim()) {
      addSubject(subName);
      setSubName('');
    }
  };

  return (
    <LayoutContainer>
      <Sidebar>
        <div style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookIcon size={32} color={themeColor} />
          <h2 style={{ margin: 0, color: '#5f6368', fontSize: '22px' }}>IFkeep</h2>
        </div>

        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ position: 'relative' }}>
            <input 
              placeholder="Nova matéria..." 
              value={subName} 
              onChange={e => setSubName(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleCreate()}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
            />
            <button onClick={handleCreate} style={{ position: 'absolute', right: '5px', top: '5px', background: themeColor, color: 'white', border: 'none', borderRadius: '6px', padding: '7px', cursor: 'pointer' }}>
              <PlusIcon />
            </button>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          <NavLink to="/" active={location.pathname === '/'} themeColor={themeColor}>
            <HomeIcon size={20} /> Início
          </NavLink>
          <div style={{ padding: '20px 20px 10px', fontSize: '11px', color: '#999', fontWeight: 'bold', textTransform: 'uppercase' }}>Disciplinas</div>
          {subjects.filter(s => !s.isArchived).map(s => (
            <NavLink key={s.id} to={`/subject/${s.id}`} active={location.pathname === `/subject/${s.id}`} themeColor={themeColor}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: themeColor }} /> {s.name}
            </NavLink>
          ))}
          <div style={{ marginTop: 'auto', borderTop: '1px solid #eee' }}>
            <NavLink to="/archived" active={location.pathname === '/archived'} themeColor={themeColor}>
              <ArchiveIcon size={20} /> Arquivados
            </NavLink>
            <NavLink to="/settings" active={location.pathname === '/settings'} themeColor={themeColor}>
              <SettingsIcon size={20} /> Configurações
            </NavLink>
          </div>
        </nav>
      </Sidebar>
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
};