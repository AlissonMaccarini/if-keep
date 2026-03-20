import React from 'react';
import { useNotes } from '../hooks/notes';
import styled from 'styled-components';

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const ThemeBtn = styled.button<{ col: string }>`
  background: ${props => props.col};
  color: white;
  border: none;
  padding: 20px;
  border-radius: 16px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  &:hover { filter: brightness(1.1); }
`;

export const Settings: React.FC = () => {
  const { setThemeColor } = useNotes();
  
  const themes = [
    { name: 'Azul Google', color: '#1a73e8' },
    { name: 'Verde Floresta', color: '#1e8e3e' },
    { name: 'Vermelho Intenso', color: '#d93025' },
    { name: 'Roxo Royal', color: '#8e24aa' },
    { name: 'Laranja Vibrante', color: '#f9ab00' },
    { name: 'Rosa Choque', color: '#e91e63' },
    { name: 'Preto Elegante', color: '#202124' },
    { name: 'Ciano Mar', color: '#00acc1' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Personalizar Sistema</h1>
      <p>Escolha a cor principal das suas turmas e botões:</p>
      
      <ColorGrid>
        {themes.map(t => (
          <ThemeBtn key={t.name} col={t.color} onClick={() => setThemeColor(t.color)}>
            {t.name}
          </ThemeBtn>
        ))}
      </ColorGrid>

      <div style={{ marginTop: '100px', padding: '20px', background: '#f1f3f4', borderRadius: '16px', opacity: 0.8 }}>
         <p><strong>IFkeep v2.0</strong></p>
         <p>Desenvolvido por Alisson e Lucas Corsico | IFPR 2023-2026</p>
      </div>
    </div>
  );
};