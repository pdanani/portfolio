import React from 'react';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
// import Listening from '../components/Listening';
import data from '../data.json';
import Profile from '../components/Profile';

const IndexPage = () => {
  const { name, projects, profile } = data;
  console.log(projects, 'projects')
  console.log('data', data)
  console.log('profile', profile)
  return (
    <Layout>
      <Profile profile={profile} />
      {projects.map((project, index) => (

        <ProjectCard
          key={index}
          title={project.title}
          demoLink={project.leftButtonHref}
          demoText={`Try ${project.leftButtonText}`}
          rightButtonH={project.rightButtonHref}
          githubText={project.rightButtonText}
          cardWidth={project.cardWidth}
          rocketcrab={project.rocketcrab}
        >
          {project.description}
          {console.log(name)}
        </ProjectCard>
      ))}

      <h2>Currently Listening</h2>
      {/* <Listening /> */}
    </Layout>
  );
};

export default IndexPage;
