import data from '../data.json';
import { Avatar, Typography } from '@mui/material';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export default function Header() {
  return (
    <HeaderContainer>
      <Avatar src={data.picture} alt="My Picture" sx={{ width: 60, height: 60 }} />
      <Typography variant="h4">{data.name}</Typography>
    </HeaderContainer>
  );
}
