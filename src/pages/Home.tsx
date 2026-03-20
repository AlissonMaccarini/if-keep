import React from 'react';
import styled from 'styled-components';
import { useNotes } from '../hooks/notes';
import { Link } from 'react-router-dom';
import * as MdIcons from 'react-icons/md';

const MdDelete = MdIcons.MdDelete as any;
const MdArchive = MdIcons.MdArchive as any;
const MdSchool = MdIcons.MdSchool as any;
const MdAssignment = MdIcons.MdAssignment as any;

const Container = styled.div`
  padding: 60px;
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: 'Google Sans', Roboto, Arial, sans-serif;
`;

const WelcomeHeader = styled.div`
  margin-bottom: 40px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 20px;
  h1 { color: #1a73e8; font-size: 32px; font-weight: 400; margin: 0; }
  p { color: #5f6368; margin-top: 10px; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #dadce0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 280px;

  &:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    transform: translateY(-4px);
  }
`;

const CardHeader = styled(Link)`
  height: 100px;
  background-color: #1a73e8;
  background-image: url('https://www.gstatic.com/classroom/themes/img_graduation.jpg');
  background-size: cover;
  padding: 20px;
  text-decoration: none;
  position: relative;
  
  &::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(26, 115, 232, 0.7);
  }

  h2 { color: white; margin: 0; position: relative; z-index: 2; font-size: 22px; font-weight: 500; }
  span { color: white; position: relative; z-index: 2; font-size: 14px; opacity: 0.9; }
`;

const CardBody = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #3c4043;
  font-size: 14px;
`;

const CardActions = styled.div`
  border-top: 1px solid #e8eaed;
  padding: 8px 15px;
  display: flex;
  justify-content: flex-end;
  gap: 5px;
`;

const IconButton = styled.button<{ color?: string }>`
  background: none;
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  color: ${props => props.color || '#5f6368'};
  display: flex;
  align-items: center;
  transition: background 0.2s;

  &:hover { background-color: #f1f3f4; color: #1a73e8; }
`;

export const Home: React.FC = () => {
  const { subjects, archiveSubject, removeSubject } = useNotes();
  const activeSubjects = subjects.filter(s => !s.isArchived);

  const handleArchive = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    if (window.confirm(`Deseja arquivar a matéria "${name}"?`)) {
      archiveSubject(id);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    if (window.confirm(`PERIGO: Deseja excluir permanentemente a matéria "${name}"?`)) {
      removeSubject(id);
    }
  };

  return (
    <Container>
      <WelcomeHeader>
        <h1>Minhas Matérias</h1>
        <p>Acesse seus conteúdos e atividades de 2026</p>
      </WelcomeHeader>

      {activeSubjects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <MdSchool size={64} color="#dadce0" />
          <p style={{ color: '#70757a', fontSize: '18px' }}>Nenhuma matéria ativa. Comece criando uma nova turma!</p>
        </div>
      ) : (
        <Grid>
          {activeSubjects.map(sub => (
            <Card key={sub.id}>
              <CardHeader to={`/subject/${sub.id}`}>
                <h2>{sub.name}</h2>
                <span>Turma Regular • Ano Letivo</span>
              </CardHeader>
              <CardBody>
                <StatRow>
                  <MdAssignment size={18} color="#1a73e8" />
                  <span>{sub.notes?.length || 0} atividades postadas</span>
                </StatRow>
              </CardBody>
              <CardActions>
                <IconButton onClick={(e) => handleArchive(e, sub.id, sub.name)} title="Arquivar">
                  <MdArchive size={20} />
                </IconButton>
                <IconButton color="#d93025" onClick={(e) => handleDelete(e, sub.id, sub.name)} title="Excluir">
                  <MdDelete size={20} />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Grid>
      )}
    </Container>
  );
};