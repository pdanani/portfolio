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
      <Experience experience={experience} handleModal={handleModal} />

      <Projects projects={projects} />
      {/* <h2>Currently Listening</h2> */}
      {/* <Listening /> */}

      {isOpen && (
        <Modal onClose={closeModal}>
          <h2 className="text-2xl font-bold mb-4">{jobTitle}</h2>
          <ul className="list-disc pl-6 space-y-3">
            {jobDescription.map((desc, index) => (
              <li key={index} className="text-base leading-relaxed">
                {desc}
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </Layout>
  );
};

export default IndexPage;
