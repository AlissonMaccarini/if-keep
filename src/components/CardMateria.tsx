import React, { useState } from 'react';
import styled from 'styled-components';
import * as MdIcons from 'react-icons/md';

const MoreIcon = MdIcons.MdMoreVert as any;
const FolderIcon = MdIcons.MdFolderOpen as any;
const DeleteIcon = MdIcons.MdDelete as any;
const ArchiveIcon = MdIcons.MdArchive as any;

const Card = styled.div`
  background: white; border-radius: 8px; border: 1px solid #dadce0;
  width: 100%; max-width: 300px; cursor: pointer; overflow: hidden;
  transition: 0.2s; position: relative;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
`;

const Header = styled.div<{ color: string }>`
  background: ${props => props.color}; padding: 16px; color: white; height: 80px;
  display: flex; justify-content: space-between;
  h3 { margin: 0; font-size: 22px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
`;

const Content = styled.div`
  padding: 16px; height: 110px; position: relative;
  display: flex; flex-direction: column; justify-content: space-between;
`;

const Avatar = styled.div<{ color: string }>`
  width: 60px; height: 60px; border-radius: 50%; background: ${props => props.color};
  position: absolute; top: -30px; right: 16px; border: 2px solid white;
  display: flex; align-items: center; justify-content: center; color: white; 
  font-size: 24px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const MenuPopup = styled.div`
  position: absolute; right: 10px; top: 45px; background: white; 
  box-shadow: 0 2px 10px rgba(0,0,0,0.2); border-radius: 4px; z-index: 20;
`;

export const CardMateria: React.FC<{ materia: any, onClick: () => void, onDelete: () => void, onArchive: () => void }> = ({ materia, onClick, onDelete, onArchive }) => {
  const [showMenu, setShowMenu] = useState(false);
  const qtdNotas = materia.notes ? materia.notes.length : 0;

  return (
    <Card onClick={onClick}>
      <Header color={materia.color}>
        <h3>{materia.name}</h3>
        <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}>
          <MoreIcon size={24} />
        </button>
      </Header>

      {showMenu && (
        <MenuPopup>
          <button onClick={(e) => { e.stopPropagation(); onArchive(); }} style={{padding: '12px 20px', border:'none', background:'none', cursor:'pointer', width:'100%', textAlign:'left', display:'flex', gap:'10px'}}><ArchiveIcon size={18}/> Arquivar</button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} style={{padding: '12px 20px', border:'none', background:'none', cursor:'pointer', color:'red', width:'100%', textAlign:'left', display:'flex', gap:'10px'}}><DeleteIcon size={18}/> Excluir</button>
        </MenuPopup>
      )}

      <Content>
        <Avatar color={materia.color}>{materia.name.charAt(0).toUpperCase()}</Avatar>
        <p style={{ margin: 0, color: '#5f6368', fontSize: '13px', marginTop: '20px' }}>
          {qtdNotas} atividade{qtdNotas !== 1 ? 's' : ''}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e0e0e0', paddingTop: '8px' }}>
          <FolderIcon size={20} color="#5f6368" />
        </div>
      </Content>
    </Card>
  );
};