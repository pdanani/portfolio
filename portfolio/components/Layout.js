import { Container } from '@mui/material';
import styled from 'styled-components';

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("https://source.unsplash.com/random");
  background-size: cover;
  z-index: -1;
`;

const LayoutContainer = styled(Container)`
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  margin-top: 32px;
`;

export default function Layout({ children }) {
  return (
    <LayoutContainer maxWidth="sm">
      <Background />
      {children}
    </LayoutContainer>
  );
}
