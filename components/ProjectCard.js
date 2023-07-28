import { GitHub } from 'react-feather';

const ProjectCard = ({
  title,
  description,
  githubURL,
  demoURL,
}) => {
  return (
    <div className="bg-black bg-opacity-10 backdrop-filter backdrop-blur-lg shadow-md p-4 flex flex-col h-full">
      <h3 className="text-2xl font-extrabold text-white font-poppins">{title}</h3>
      <div className="flex-grow flex flex-col justify-center">
        <p className="text-sm text-white font-poppins pt-2">{description}</p>
      </div>
      <div className="mt-auto flex justify-center items-center pt-3">
        {demoURL && 
          <a href={demoURL} target="_blank" rel="noopener noreferrer">
            <button className="border-2 border-blue-500 hover:border-blue-600 bg-transparent text-blue-500 hover:text-blue-600 font-bold py-2 px-4 rounded font-poppins">
              Demo
            </button>
          </a>
        }
        {githubURL && 
          <a href={githubURL} target="_blank" rel="noopener noreferrer">
            <button className="inline-flex items-center justify-center border-2 border-white hover:border-gray-500 bg-transparent text-white hover:text-gray-500 font-bold py-2 px-4 rounded ml-2 font-poppins">
              <GitHub className="mr-2 self-center" size={16} /> GitHub
            </button>
          </a>
        }
      </div>
    </div>
  );
};

export default ProjectCard;
