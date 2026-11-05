import React from 'react';
import styled from 'styled-components';
import { useNotes } from '../hooks/notes';
import * as MdIcons from 'react-icons/md';

const { MdArrowBack, MdInfo, MdSchool, MdStorage } = MdIcons as any;

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
    { name: 'Preto Elegante', color: '#202124' },
  ];

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Segoe UI, sans-serif' }}>
      <button onClick={() => window.location.href = '/'} style={{ background: '#f1f3f4', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px' }}>
        <MdArrowBack /> Voltar ao Início
      </button>

      <h1>Configurações do Sistema</h1>
      <p style={{ color: '#5f6368' }}>Personalize a identidade visual e consulte as informações institucionais do projeto.</p>
      
      <h3 style={{ marginTop: '30px' }}>Tema e Cores</h3>
      <ColorGrid>
        {themes.map(t => (
          <ThemeBtn key={t.name} col={t.color} onClick={() => setThemeColor(t.color)}>
            {t.name}
          </ThemeBtn>
        ))}
      </ColorGrid>

      <h3 style={{ marginTop: '50px' }}>Informações e Créditos do TCC</h3>
      <div style={{ marginTop: '15px', padding: '24px', background: '#f1f3f4', borderRadius: '16px', border: '1px solid #e0e0e0', lineHeight: '1.6' }}>
         <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 10px 0' }}>
           <MdInfo color="#1a73e8" size={20} /> <strong>IFkeep — Sistema de Organização de Notas e Estudos</strong>
         </p>
         <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 10px 0' }}>
           <MdSchool color="#1a73e8" size={20} /> Desenvolvido para Trabalho de Conclusão de Curso (TCC) — IFPR
         </p>
         <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 10px 0' }}>
           <MdStorage color="#1a73e8" size={20} /> Arquitetura: React (Frontend) | Node.js / Express (Backend) | MySQL & Docker
         </p>
         <hr style={{ border: '0', borderTop: '1px solid #ccc', margin: '15px 0' }} />
         <p style={{ margin: 0, fontSize: '13px', color: '#5f6368' }}>
           Ano de Referência: 2026. Todos os direitos reservados à instituição e aos autores do projeto.
         </p>
      </div>
    </div>
  );
};