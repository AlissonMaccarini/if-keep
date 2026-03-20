import React from 'react';
import styled from 'styled-components';
import { useNotes } from '../hooks/notes';
import * as MdIcons from 'react-icons/md';

const MdUnarchive = MdIcons.MdUnarchive as any;
const MdDeleteForever = MdIcons.MdDeleteForever as any;

const Container = styled.div`padding: 60px; background: #f8f9fa; min-height: 100vh;`;

export const Archived: React.FC = () => {
  const { subjects, unarchiveSubject, unarchiveNote, removeSubject, removeNote } = useNotes();
  
  const archivedSubjects = subjects.filter((s: any) => s.isArchived);
  const archivedNotes = subjects.flatMap((s: any) => 
    (s.notes || []).filter((n: any) => n.isArchived).map((n: any) => ({ ...n, subjectId: s.id }))
  );

  return (
    <Container>
      <h1 style={{ color: '#5f6368', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Arquivados</h1>
      
      <section style={{ marginTop: '30px' }}>
        <h3>Matérias Arquivadas</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {archivedSubjects.length === 0 && <p>Nenhuma matéria arquivada.</p>}
          {archivedSubjects.map((sub: any) => (
            <div key={sub.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #ddd' }}>
              <h4>{sub.name}</h4>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button onClick={() => unarchiveSubject(sub.id)} style={{ flex: 1 }}><MdUnarchive /> Restaurar</button>
                <button onClick={() => removeSubject(sub.id)} style={{ color: 'red' }}><MdDeleteForever /> Apagar</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '50px' }}>
        <h3>Notas Arquivadas</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {archivedNotes.length === 0 && <p>Nenhuma nota arquivada.</p>}
          {archivedNotes.map((note: any) => (
            <div key={note.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #ddd' }}>
              <h4>{note.title}</h4>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button onClick={() => unarchiveNote(note.subjectId, note.id)} style={{ flex: 1 }}><MdUnarchive /> Restaurar</button>
                <button onClick={() => removeNote(note.subjectId, note.id)} style={{ color: 'red' }}><MdDeleteForever /> Apagar</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
};