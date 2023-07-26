import React from 'react';
import Layout from '../components/Layout';
import Experience from '../components/Experience';
import data from '../data/data.json';
import Profile from '../components/Profile';
import Projects from '../components/Projects';
const IndexPage = () => {
  const { projects, profile ,experience} = data;
console.log(experience,'exp')
  return (
    <Layout>
      <Profile name={profile.name} links={profile.links} />
      <Projects projects={projects} />
      <Experience experience={experience} />
      <h2>Currently Listening</h2>
      {/* <Listening /> */}
    </Layout>
  );
};

export default IndexPage;
