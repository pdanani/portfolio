import React from 'react';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
// import Listening from '../components/Listening';
import data from '../data.json';

const IndexPage = () => {
  const { name, projects } = data;

  return (
    <Layout>
      <h1>{name}</h1>

      <h2>Projects</h2>
      {projects.map((project, index) => (
        <ProjectCard
          key={index}
          title={project.title}
          leftButtonHref={project.leftButtonHref}
          leftButtonText={project.leftButtonText}
          rightButtonHref={project.rightButtonHref}
          rightButtonText={project.rightButtonText}
          cardWidth={project.cardWidth}
          rocketcrab={project.rocketcrab}
        >
          {project.description}
        </ProjectCard>
      ))}

      <h2>Currently Listening</h2>
      {/* <Listening /> */}
    </Layout>
  );
};

export default IndexPage;
