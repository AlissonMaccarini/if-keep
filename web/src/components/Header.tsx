import React from 'react';
import styled from 'styled-components';
import * as MdIcons from 'react-icons/md';

const Container = styled.header`
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  justify-content: space-between;
`;

export const Header: React.FC = () => {
  // Driblando o erro de JSX component
  const MenuIcon = MdIcons.MdMenu as any;
  const RefreshIcon = MdIcons.MdRefresh as any;
  const SettingsIcon = MdIcons.MdSettings as any;

  return (
    <Container>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <MenuIcon size={24} color="#5f6368" />
        <img src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png" alt="Logo" style={{ width: '40px' }} />
        <span style={{ fontSize: '22px', color: '#5f6368' }}>IFkeep</span>
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <RefreshIcon size={24} color="#5f6368" />
        <SettingsIcon size={24} color="#5f6368" />
      </div>
    </Container>
  );
};