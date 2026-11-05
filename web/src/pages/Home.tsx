import React from 'react';
import styled from 'styled-components';
import * as MdIcons from 'react-icons/md';
import { Note } from '../types';

const { MdChevronRight, MdAdd } = MdIcons as any;

const SubjectCard = styled.div`
  background: ${(p: any) => p.theme.surface}; border: 1px solid ${(p: any) => p.theme.border}; padding: 30px; border-radius: 20px; cursor: pointer; transition: 0.3s;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  &:hover { transform: translateY(-8px); box-shadow: 0 12px 20px rgba(0,0,0,0.1); border-color: ${(p: any) => p.theme.primary}; }
  h2 { margin: 0; font-size: 18px; text-align: center; }
`;

interface HomeProps {
  username: string;
  subjects: string[];
  notes: Note[];
  onSelectSubject: (sub: string) => void;
  onOpenCreateModal: () => void;
}

export const Home: React.FC<HomeProps> = ({ username, subjects, notes, onSelectSubject, onOpenCreateModal }) => {
  const primary = '#10b981';

  return (
    <div style={{ width: '100%', maxWidth: 1000 }}>
      <h1>Olá, {username}! 👋</h1>
      <p style={{ marginBottom: 40, opacity: 0.7 }}>Suas anotações estão seguras aqui.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 25 }}>
        {subjects.map(s => (
          <SubjectCard key={s} onClick={() => onSelectSubject(s)}>
            <div style={{ background: primary + '20', padding: 20, borderRadius: '50%', color: primary }}><MdChevronRight size={30}/></div>
            <h2>{s}</h2>
            <span style={{ fontSize: 12, opacity: 0.7 }}>{notes.filter(n => n.subject === s && !n.archived).length} notas ativas</span>
          </SubjectCard>
        ))}
        <SubjectCard style={{ borderStyle: 'dashed', background: 'transparent' }} onClick={onOpenCreateModal}>
          <MdAdd size={40} /><h2>Nova Matéria</h2>
        </SubjectCard>
      </div>
    </div>
  );
};