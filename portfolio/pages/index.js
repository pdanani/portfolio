import React from 'react';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
// import Listening from '../components/Listening';
import data from '../data/data.json';
import Profile from '../components/Profile';
import Projects from '../components/Projects';
const IndexPage = () => {
  const { projects, profile } = data;
  return (
    <Layout>
      <Profile  name={profile.name} links={profile.links} />
      <Projects projects={projects} />
      <h2>Currently Listening</h2>
      {/* <Listening /> */}
    </Layout>
  );
};

export default IndexPage;
