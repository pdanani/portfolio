import data from '../data.json';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import styled from 'styled-components';

const ProjectsContainer = styled.div`
  margin-top: 32px;
`;

const ProjectCard = styled(Card)`
  min-width: 275px;
  margin-bottom: 2px;
  background-color: rgba(255, 255, 255, 0.8);
`;

export default function Projects() {
  return (
    <ProjectsContainer>
      {data.projects.map((project) => (
        <ProjectCard key={project.id}>
          <CardContent>
            <Typography variant="h5" component="div">{project.title}</Typography>
          </CardContent>
          <CardActions>
            <Button size="small" href={project.github}>Go to GitHub</Button>
          </CardActions>
        </ProjectCard>
      ))}
    </ProjectsContainer>
  );
}
