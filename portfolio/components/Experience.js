import data from '../data.json';
import { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import styled from 'styled-components';

const ExperienceContainer = styled.div`
  margin-top: 32px;
`;

const ExperienceCard = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.8);
`;

export default function Experience() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState(null);

  const openModal = (experience) => {
    setCurrentExperience(experience);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <ExperienceContainer>
      {data.experiences.map((experience) => (
        <ExperienceCard key={experience.id}>
          <DialogTitle>{experience.title}</DialogTitle>
          <Button variant="contained" onClick={() => openModal(experience)}>More Info</Button>
        </ExperienceCard>
      ))}

      <Dialog open={modalIsOpen} onClose={closeModal}>
        <DialogTitle>{currentExperience?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{currentExperience?.description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </ExperienceContainer>
  );
}
