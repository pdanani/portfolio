import React from 'react';

const ProjectCard = ({
  title,
  description,
  githubURL,
  demoURL,
}) => {
  return (
    <div className="bg-black bg-opacity-10 backdrop-filter backdrop-blur-lg shadow-md p-4">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-white">{description}</p>
      <div className="mt-4">
        <a href={demoURL} target="_blank" rel="noopener noreferrer">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Demo
          </button>
        </a>
        <a href={githubURL} target="_blank" rel="noopener noreferrer">
          <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ml-2">
            GitHub
          </button>
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
