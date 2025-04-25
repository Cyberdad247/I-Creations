import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface AppLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const LayoutContainer = styled.div`
  display: grid;
  grid-template-areas:
    "sidebar header"
    "sidebar main"
    "sidebar footer";
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  background-color: #1a1b26;
  color: #c0caf5;
`;

const HeaderContainer = styled.header`
  grid-area: header;
  padding: 1rem 2rem;
  background-color: #24283b;
  border-bottom: 1px solid #363b54;
  z-index: 10;
`;

const SidebarContainer = styled.aside`
  grid-area: sidebar;
  width: 250px;
  background-color: #24283b;
  border-right: 1px solid #363b54;
  padding: 1.5rem 1rem;
  overflow-y: auto;
`;

const MainContainer = styled(motion.main)`
  grid-area: main;
  padding: 2rem;
  overflow-y: auto;
`;

const FooterContainer = styled.footer`
  grid-area: footer;
  padding: 1rem 2rem;
  background-color: #24283b;
  border-top: 1px solid #363b54;
  text-align: center;
`;

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  sidebar,
  header,
  footer,
}) => {
  return (
    <LayoutContainer>
      {sidebar && <SidebarContainer>{sidebar}</SidebarContainer>}
      {header && <HeaderContainer>{header}</HeaderContainer>}
      <MainContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </MainContainer>
      {footer && <FooterContainer>{footer}</FooterContainer>}
    </LayoutContainer>
  );
};