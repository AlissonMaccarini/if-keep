import React, { useState } from 'react';
import styled from 'styled-components';
import { useNotes } from '../hooks/notes';
import * as MdIcons from 'react-icons/md';

const SendIcon = MdIcons.MdSend as any;

const Bar = styled.div`
  background: white; padding: 15px 25px; border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 30px;
  display: flex; gap: 15px; align-items: center;
`;

const Input = styled.input`
  flex: 1; border: none; outline: none; font-size: 16px;
  &::placeholder { color: #999; }
`;

export const CreateNoteBar: React.FC<{ subjectId: string }> = ({ subjectId }) => {
  const [title, setTitle] = useState('');
  const { addNoteToSubject, themeColor } = useNotes();

  const handleSave = () => {
    if (title.trim()) {
      // CHAMADA COM 4 ARGUMENTOS CONFORME O NOVO HOOK
      addNoteToSubject(subjectId, title, "Inicie o conteúdo aqui...", "#ffffff");
      setTitle('');
    }
  };

  return (
    <Bar>
      <Input 
        placeholder="Título da nova anotação ou aviso..." 
        value={title} 
        onChange={e => setTitle(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && handleSave()}
      />
      <button 
        onClick={handleSave}
        style={{ background: themeColor, color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}
      >
        <SendIcon size={20} />
      </button>
    </Bar>
  );
};