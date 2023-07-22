import { GitHub } from 'react-feather';

const ProjectCard = ({
  title,
  description,
  githubURL,
  demoURL,
}) => {
  return (
    <div className="bg-black bg-opacity-10 backdrop-filter backdrop-blur-lg shadow-md p-4">
      <h3 className="text-2xl font-extrabold text-white font-poppins">{title}</h3>
      <p className="text-xl text-white font-poppins">{description}</p>
      <div className="mt-4 flex items-center">
        <a href={demoURL} target="_blank" rel="noopener noreferrer">
          <button className="border-2 border-blue-500 hover:border-blue-600 bg-transparent text-blue-500 hover:text-blue-600 font-bold py-2 px-4 rounded font-poppins">
            Demo
          </button>
        </a>
        <a href={githubURL} target="_blank" rel="noopener noreferrer">
          <button className="inline-flex items-center justify-center border-2 border-white hover:border-white bg-transparent text-white hover:text-white font-bold py-2 px-4 rounded ml-2 font-poppins">
            <GitHub className="mr-2 self-center" size={16} /> GitHub
          </button>
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
