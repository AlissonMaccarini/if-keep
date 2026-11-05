import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import * as MdIcons from 'react-icons/md';

const { MdUnarchive, MdDeleteForever, MdArrowBack, MdWarning } = MdIcons as any;

const Container = styled.div`padding: 40px; background: #f8f9fa; min-height: 100vh; font-family: 'Segoe UI', sans-serif;`;
const NoteCard = styled.div`background: white; padding: 20px; border-radius: 12px; border: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.05);`;
const WarningText = styled.p`color: #d93025; font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 5px; margin-top: 10px;`;

export const Archived: React.FC = () => {
  const [archivedNotes, setArchivedNotes] = useState<any[]>([]);
  const token = localStorage.getItem('token');

  const fetchArchivedNotes = async () => {
    try {
      const res = await fetch('http://localhost:3001/notes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setArchivedNotes(data.filter((n: any) => n.archived === 1));
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchArchivedNotes(); }, []);

  const handleUnarchive = async (id: number) => {
    await fetch(`http://localhost:3001/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ archived: 0 })
    });
    fetchArchivedNotes();
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:3001/notes/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchArchivedNotes();
  };

  const calculateDaysRemaining = (archivedAt: string) => {
    if (!archivedAt) return 10;
    const archivedDate = new Date(archivedAt).getTime();
    const expiryDate = archivedDate + (10 * 24 * 60 * 60 * 1000);
    const now = new Date().getTime();
    const diffDays = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <Container>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
        <button onClick={() => window.location.href = '/'} style={{ background: '#f1f3f4', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <MdArrowBack /> Voltar
        </button>
        <h1 style={{ color: '#5f6368', margin: 0 }}>Notas Arquivadas</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {archivedNotes.length === 0 && <p>Nenhuma nota arquivada no momento.</p>}
        {archivedNotes.map((note: any) => {
          const daysLeft = calculateDaysRemaining(note.archived_at);
          return (
            <NoteCard key={note.id}>
              <h3 style={{ margin: '0 0 10px 0' }}>{note.title}</h3>
              <p style={{ color: '#5f6368', margin: '0 0 15px 0' }}>{note.content}</p>
              
              <WarningText>
                <MdWarning size={16} /> Exclusão automática em {daysLeft} {daysLeft === 1 ? 'dia' : 'dias'}.
              </WarningText>

              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button onClick={() => handleUnarchive(note.id)} style={{ flex: 1, padding: '8px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #ccc', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                  <MdUnarchive /> Restaurar
                </button>
                <button onClick={() => handleDelete(note.id)} style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', border: 'none', background: '#fce8e6', color: '#d93025', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MdDeleteForever size={18} />
                </button>
              </div>
            </NoteCard>
          );
        })}
      </div>
    </Container>
  );
};