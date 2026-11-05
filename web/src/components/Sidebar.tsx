import React from 'react';
import styled from 'styled-components';
import * as MdIcons from 'react-icons/md';

const { MdHome, MdSettings, MdDelete, MdLogout } = MdIcons as any;

const Container = styled.div`
  width: 260px; background: ${(p: any) => p.theme.sidebarBg}; 
  border-right: 1px solid ${(p: any) => p.theme.border}; 
  display: flex; flex-direction: column; padding: 20px 0;
`;
const Logo = styled.div`
  font-size: 24px; font-weight: 800; padding: 0 24px 30px; 
  cursor: pointer; display: flex; gap: 6px; justify-content: center;
`;
const NavItem = styled.div<{ active?: boolean }>`
  padding: 12px 24px; margin: 2px 12px; cursor: pointer; display: flex; 
  align-items: center; gap: 12px; border-radius: 12px; font-weight: 600; 
  background: ${(p: any) => p.active ? p.theme.primary + '15' : 'transparent'}; 
  color: ${(p: any) => p.active ? p.theme.primary : p.theme.textSecondary};
  &:hover { background: ${(p: any) => p.theme.hover}; }
`;

interface SidebarProps {
  subjects: string[];
  activeSub: string | null;
  onSelectSubject: (sub: string | null) => void;
  onDeleteSubject: (sub: string) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  subjects, activeSub, onSelectSubject, onDeleteSubject, onOpenSettings, onLogout
}) => {
  return (
    <Container>
      <Logo onClick={() => onSelectSubject(null)}>
        <span style={{ color: '#10b981' }}>IF</span> <span style={{ color: '#f59e0b' }}>Keep</span>
      </Logo>
      <NavItem active={activeSub === null} onClick={() => onSelectSubject(null)}>
        <MdHome size={22}/> Início
      </NavItem>
      
      <div style={{ padding: '25px 24px 10px', fontSize: 11, fontWeight: 'bold', opacity: 0.6 }}>
        MINHAS MATÉRIAS
      </div>
      
      {subjects.map(s => (
        <NavItem key={s} active={activeSub === s} onClick={() => onSelectSubject(s)}>
          <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{s}</div>
          <MdDelete size={16} onClick={(e: any) => { e.stopPropagation(); onDeleteSubject(s); }}/>
        </NavItem>
      ))}

      <div style={{ marginTop: 'auto' }}>
        <NavItem onClick={onOpenSettings}><MdSettings size={22}/> Configurações</NavItem>
        <NavItem onClick={onLogout} style={{ color: '#ef4444' }}><MdLogout size={22}/> Sair</NavItem>
      </div>
    </Container>
  );
};