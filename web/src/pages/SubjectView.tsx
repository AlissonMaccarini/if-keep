import React, { useState } from 'react';
import styled from 'styled-components';
import * as MdIcons from 'react-icons/md';
import { Note } from '../types';

const { MdEdit, MdSave, MdClose, MdWarning, MdContentCopy, MdUnarchive, MdArchive, MdDelete } = MdIcons as any;

const NoteCard = styled.div<{ noteColor: string }>`
  background: ${(p: any) => p.noteColor === 'transparent' ? p.theme.surface : p.noteColor}; color: ${(p: any) => p.noteColor === 'transparent' ? p.theme.text : '#202124'}; 
  padding: 20px; border-radius: 16px; border: 1px solid ${(p: any) => p.theme.border}; display: flex; flex-direction: column; position: relative; transition: 0.2s;
`;
const WarningText = styled.p`color: #ef4444; font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 5px; margin-top: 10px;`;
const ActionBtn = styled.button`background: transparent; border: none; cursor: pointer; display: flex; align-items: center; gap: 5px; font-weight: 600;`;

interface SubjectViewProps {
  activeSub: string;
  notes: Note[];
  view: 'active' | 'archived';
  setView: (v: 'active' | 'archived') => void;
  onSaveNote: () => void;
  onUpdateNote: (id: number, fields: Partial<Note>) => void;
  onRenameSubject: (oldName: string, newName: string) => void;
  onDuplicateNote: (note: Note) => void;
  onDeleteNote: (id: number) => void;
  onEditNoteModal: (note: Note) => void;
}

export const SubjectView: React.FC<SubjectViewProps> = ({
  activeSub, notes, view, setView, onSaveNote, onUpdateNote, onRenameSubject, onDuplicateNote, onDeleteNote, onEditNoteModal
}) => {
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [editedSubjectName, setEditedSubjectName] = useState(activeSub);

  const calculateDaysRemaining = (archivedAt?: string) => {
    if (!archivedAt) return 10;
    const archivedDate = new Date(archivedAt).getTime();
    const expiryDate = archivedDate + (10 * 24 * 60 * 60 * 1000);
    const now = new Date().getTime();
    const diffDays = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const filteredNotes = notes.filter(n => n.subject === activeSub && (view === 'active' ? !n.archived : n.archived));

  return (
    <div style={{ width: '100%', maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isEditingSubject ? (
            <>
              <input value={editedSubjectName} onChange={e => setEditedSubjectName(e.target.value)} style={{ padding: '6px 12px', fontSize: 24, fontWeight: 'bold', borderRadius: 8 }} />
              <ActionBtn onClick={() => { onRenameSubject(activeSub, editedSubjectName); setIsEditingSubject(false); }}><MdSave size={20} /> Salvar</ActionBtn>
              <ActionBtn onClick={() => setIsEditingSubject(false)}><MdClose size={20} /></ActionBtn>
            </>
          ) : (
            <>
              <h1 style={{ margin: 0 }}>{activeSub}</h1>
              <ActionBtn onClick={() => { setIsEditingSubject(true); setEditedSubjectName(activeSub); }}><MdEdit size={18} /></ActionBtn>
            </>
          )}
        </div>

        <div style={{ display: 'flex', padding: 4, borderRadius: 12, border: '1px solid #ccc' }}>
          <button onClick={() => setView('active')} style={{ border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', background: view === 'active' ? '#10b981' : 'transparent', color: view === 'active' ? 'white' : 'inherit', fontWeight: 'bold' }}>Ativas</button>
          <button onClick={() => setView('archived')} style={{ border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', background: view === 'archived' ? '#10b981' : 'transparent', color: view === 'archived' ? 'white' : 'inherit', fontWeight: 'bold' }}>Arquivo</button>
        </div>
      </div>

      {view === 'active' && (
        <div style={{ padding: 20, borderRadius: 16, border: `2px solid #ddd`, marginBottom: 40 }}>
          <input placeholder="Título da nota..." id="noteTitle" style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontWeight: 'bold', fontSize: 18, marginBottom: 10 }} />
          <textarea placeholder="Escreva sua ideia aqui..." id="noteContent" style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: 16, resize: 'none', minHeight: 60 }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={onSaveNote} style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 25px', borderRadius: 10, fontWeight: 'bold', cursor: 'pointer' }}>Salvar Nota</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
        {filteredNotes.map((n) => {
          const daysLeft = calculateDaysRemaining(n.archived_at);
          return (
            <NoteCard key={n.id} noteColor={n.color}>
              <div style={{ flex: 1, cursor: 'pointer', overflow: 'hidden' }} onClick={() => onEditNoteModal(n)}>
                <h3 style={{ margin: '0 0 10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title || 'Sem título'}</h3>
                <p style={{ margin: 0, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.content}</p>
              </div>

              {n.archived && (
                <WarningText>
                  <MdWarning size={16} /> Exclusão automática em {daysLeft} {daysLeft === 1 ? 'dia' : 'dias'}.
                </WarningText>
              )}
              
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, opacity: 0.6, fontWeight: 'bold' }}>{n.date}</span>
                <div style={{ display: 'flex', gap: 10 }}>
                  <MdContentCopy size={18} cursor="pointer" onClick={() => onDuplicateNote(n)} />
                  <div onClick={() => onUpdateNote(n.id, { archived: !n.archived })}>
                    {n.archived ? <MdUnarchive size={18} cursor="pointer"/> : <MdArchive size={18} cursor="pointer"/>}
                  </div>
                  <MdDelete size={18} cursor="pointer" onClick={() => onDeleteNote(n.id)}/>
                </div>
              </div>
            </NoteCard>
          );
        })}
      </div>
    </div>
  );
};