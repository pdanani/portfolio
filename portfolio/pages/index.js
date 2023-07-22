import React from 'react';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
// import Listening from '../components/Listening';
import data from '../data.json';
import Profile from '../components/Profile';
import Projects from '../components/Projects';
const IndexPage = () => {
  const { name, projects, profile } = data;
  return (
    <Layout>
      <Profile profile={profile} />
      <Projects projects={projects} />

      <h2>Currently Listening</h2>
      {/* <Listening /> */}
    </Layout>
  );
};

export default IndexPage;
