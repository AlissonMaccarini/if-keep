import React from 'react';
import styled from 'styled-components';
import * as MdIcons from 'react-icons/md';

const { MdClose, MdDarkMode, MdLightMode, MdInfo, MdSchool, MdStorage } = MdIcons as any;

const ModalOverlay = styled.div`position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px;`;
const Modal = styled.div`background: ${(p: any) => p.theme.surface}; padding: 30px; border-radius: 24px; width: 100%; max-width: 550px; border: 1px solid ${(p: any) => p.theme.border};`;

interface SettingsModalProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isDark, onToggleTheme, onClose }) => {
  const primary = '#10b981';

  return (
    <ModalOverlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>Ajustes e Configurações</h3>
          <MdClose size={24} cursor="pointer" onClick={onClose} />
        </div>
        
        <div onClick={onToggleTheme} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 15, cursor: 'pointer', marginBottom: 25, border: '1px solid #ddd' }}>
          <span style={{ fontWeight: 'bold' }}>{isDark ? 'Modo Escuro' : 'Modo Claro'}</span>
          {isDark ? <MdDarkMode size={22} color={primary} /> : <MdLightMode size={22} color={primary} />}
        </div>

        <h4 style={{ marginBottom: 10 }}>Informações e Créditos do TCC</h4>
        <div style={{ padding: '20px', borderRadius: '16px', border: '1px solid #ddd', lineHeight: '1.6', fontSize: 14 }}>
           <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 8px 0' }}>
             <MdInfo color={primary} size={18} /> <strong>IFkeep — Sistema de Organização de Notas e Estudos</strong>
           </p>
           <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 8px 0' }}>
             <MdSchool color={primary} size={18} /> Desenvolvido para Trabalho de Conclusão de Curso (TCC) — IFPR
           </p>
           <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 8px 0' }}>
             <MdStorage color={primary} size={18} /> Arquitetura: React (Frontend) | Node.js / Express (Backend) | MySQL & Docker
           </p>
           <hr style={{ border: '0', borderTop: '1px solid #ddd', margin: '12px 0' }} />
           <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>
             Ano de Referência: 2026. Todos os direitos reservados à instituição e aos autores do projeto.
           </p>
        </div>
      </Modal>
    </ModalOverlay>
  );
};