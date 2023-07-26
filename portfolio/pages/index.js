import React from 'react';
import Layout from '../components/Layout';
import Experience from '../components/Experience';
import data from '../data/data.json';
import Profile from '../components/Profile';
import Projects from '../components/Projects';
import { useState } from 'react';
import Modal from '../components/Modal';
const IndexPage = () => {
  const { projects, profile, experience } = data;
  console.log(experience, 'exp')

  const [isOpen, setIsOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  const handleModal = (description, jobTitle) => {
    setIsOpen(true);
    setJobDescription(description);
    setJobTitle(jobTitle);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Layout>
      <Profile name={profile.name} links={profile.links} />
      <Projects projects={projects} />
      <Experience experience={experience} handleModal={handleModal} />
      {/* <h2>Currently Listening</h2> */}
      {/* <Listening /> */}

      {isOpen && (
        <Modal onClose={closeModal}>
          {jobDescription}
          {jobTitle}
        </Modal>
      )}
    </Layout>
  );
};

export default IndexPage;
