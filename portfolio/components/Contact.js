import data from '../data.json';
import { Link } from '@mui/material';
import styled from 'styled-components';
const ContactContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
`;

export default function Contact() {
  return (
    <ContactContainer>
      <Link href={`mailto:${data.email}`}>{data.email}</Link>
      <Link href={data.github}>GitHub</Link>
      <Link href={data.linkedin}>LinkedIn</Link>
    </ContactContainer>
  );
}
