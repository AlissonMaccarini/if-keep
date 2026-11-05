import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';
import * as MdIcons from 'react-icons/md';

const { MdArrowBack, MdEdit, MdSave, MdCancel } = MdIcons as any;

const GlobalStyle = createGlobalStyle`
  body { margin: 0; background: ${(p: any) => p.theme.bg || '#f8f9fa'}; color: ${(p: any) => p.theme.text || '#202124'}; font-family: 'Segoe UI', sans-serif; }
`;

const Container = styled.div`padding: 40px; max-width: 900px; margin: 0 auto;`;
const Header = styled.div`display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px;`;
const BackButton = styled.button`background: ${(p: any) => p.theme.hover || '#f1f3f4'}; border: 1px solid ${(p: any) => p.theme.border || '#ccc'}; color: ${(p: any) => p.theme.text || '#202124'}; padding: 8px 16px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px;`;
const NoteCard = styled.div`background: ${(p: any) => p.theme.surface || '#fff'}; padding: 20px; border-radius: 12px; border: 1px solid ${(p: any) => p.theme.border || '#ccc'}; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);`;
const ActionBtn = styled.button`background: transparent; border: none; cursor: pointer; color: ${(p: any) => p.theme.textSec || '#5f6368'}; display: flex; align-items: center; gap: 5px; font-weight: 600; &:hover { color: ${(p: any) => p.theme.primary || '#1a73e8'}; }`;

export default function SubjectDetails() {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [notes, setNotes] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState(id);

  const token = localStorage.getItem('token');

  const fetchNotes = async () => {
    try {
      const res = await fetch('http://localhost:3001/notes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setNotes(data.filter((n: any) => n.subject === id && n.archived === 0));
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchNotes(); }, [id]);

  const handleUpdateNote = async (noteId: number) => {
    try {
      const res = await fetch(`http://localhost:3001/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: editTitle, content: editContent })
      });
      if (res.ok) {
        setEditingId(null);
        fetchNotes();
      }
    } catch (err) { console.error(err); }
  };

  const handleRenameSubject = async () => {
    if (!newSubjectName.trim()) return;
    try {
      const res = await fetch(`http://localhost:3001/subjects/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ newName: newSubjectName })
      });
      if (res.ok) {
        setIsEditingSubject(false);
        history.push(`/subject/${encodeURIComponent(newSubjectName)}`);
      }
    } catch (err) { console.error(err); }
  };

  const theme: any = {
    primary: '#1a73e8',
    bg: '#f8f9fa',
    surface: '#ffffff',
    text: '#202124',
    textSec: '#5f6368',
    border: '#e0e0e0',
    hover: '#f1f3f4',
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Header>
          <BackButton onClick={() => history.push('/')}>
            <MdArrowBack size={20} /> Voltar ao Início
          </BackButton>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isEditingSubject ? (
              <>
                <input 
                  value={newSubjectName} 
                  onChange={e => setNewSubjectName(e.target.value)} 
                  style={{ padding: '8px', fontSize: '18px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <ActionBtn onClick={handleRenameSubject}><MdSave size={20} /> Salvar</ActionBtn>
                <ActionBtn onClick={() => setIsEditingSubject(false)}><MdCancel size={20} /></ActionBtn>
              </>
            ) : (
              <>
                <h1 style={{ margin: 0, color: theme.primary }}>{id}</h1>
                <ActionBtn onClick={() => setIsEditingSubject(true)} title="Renomear Matéria"><MdEdit size={20} /></ActionBtn>
              </>
            )}
          </div>
        </Header>

        <h3 style={{ marginTop: '30px', color: theme.textSec }}>Notas desta Matéria</h3>
        {notes.length === 0 && <p>Nenhuma nota cadastrada nesta matéria ainda.</p>}

        {notes.map(note => (
          <NoteCard key={note.id}>
            {editingId === note.id ? (
              <div>
                <input 
                  value={editTitle} 
                  onChange={e => setEditTitle(e.target.value)} 
                  style={{ width: '100%', padding: '10px', marginBottom: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <textarea 
                  value={editContent} 
                  onChange={e => setEditContent(e.target.value)} 
                  rows={4} 
                  style={{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <ActionBtn onClick={() => handleUpdateNote(note.id)}><MdSave size={18} /> Salvar Alterações</ActionBtn>
                  <ActionBtn onClick={() => setEditingId(null)}><MdCancel size={18} /> Cancelar</ActionBtn>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: '0 0 10px 0' }}>{note.title}</h3>
                  <ActionBtn onClick={() => { setEditingId(note.id); setEditTitle(note.title); setEditContent(note.content); }}>
                    <MdEdit size={18} /> Editar Nota
                  </ActionBtn>
                </div>
                <p style={{ margin: 0, color: theme.textSec, whiteSpace: 'pre-wrap' }}>{note.content}</p>
              </div>
            )}
          </NoteCard>
        ))}
      </Container>
    </ThemeProvider>
  );
}