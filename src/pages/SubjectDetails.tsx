import React from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';
import * as MdIcons from 'react-icons/md';

const { MdArrowBack, MdAccessTime } = MdIcons as any;

const GlobalStyle = createGlobalStyle`
  body { margin: 0; background: ${p => p.theme.bg}; color: ${p => p.theme.text}; font-family: 'Segoe UI', sans-serif; }
`;

const Container = styled.div`padding: 40px; max-width: 800px; margin: 0 auto;`;
const Header = styled.div`display: flex; align-items: center; gap: 20px; margin-bottom: 30px; h1 { margin: 0; color: ${p => p.theme.primary}; }`;
const BackButton = styled.button`background: ${p => p.theme.hover}; border: 1px solid ${p => p.theme.border}; color: ${p => p.theme.text}; padding: 8px 16px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px;`;

export default function SubjectDetails() {
  // Fix TS2339: Definindo o tipo do parâmetro da URL
  const { id } = useParams<{ id: string }>(); 
  // Fix TS2305: Usando useHistory para compatibilidade com versões anteriores
  const history = useHistory(); 

  const theme: any = {
    isDark: false,
    primary: '#8a2be2',
    bg: '#f8f9fa',
    surface: '#ffffff',
    text: '#202124',
    textSec: '#5f6368',
    textSecondary: '#5f6368',
    sidebarBg: '#ffffff',
    border: '#e0e0e0',
    hover: '#f1f3f4',
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Header>
          <BackButton onClick={() => history.goBack()}>
            <MdArrowBack size={20} /> Voltar
          </BackButton>
          <h1>Detalhes da Matéria</h1>
        </Header>
        <div style={{ background: theme.surface, padding: '24px', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
          <h2>{id}</h2>
          <p>Visualização detalhada da disciplina de <strong>{id}</strong>.</p>
          <div style={{marginTop: 20, fontSize: 12, color: theme.textSecondary, display: 'flex', alignItems: 'center', gap: 5}}>
            <MdAccessTime size={14}/> Acessado em: {new Date().toLocaleDateString('pt-BR')}
          </div>
        </div>
      </Container>
    </ThemeProvider>
  );
}