import React from 'react';
import { Calendar } from 'react-feather';

const ExperienceCard = ({
  jobTitle,
  company,
  description,
  startDate,
  endDate,
  summary,
  handleModal
}) => {

  return (
    <div className="bg-black bg-opacity-10 backdrop-filter backdrop-blur-lg shadow-md p-4">
      <h3 className="text-2xl font-extrabold text-white font-poppins">{jobTitle}</h3>
      <h4 className="text-lg text-white font-poppins">{company}</h4>
      <div className="mt-2 flex justify-center items-center">
        <Calendar className="mr-2 self-center" size={16} />
        <span className="text-sm text-white font-poppins">
          {`${new Date(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${endDate
            ? new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            : 'Present'
            }`}
        </span>
      </div>

      <p className="mt-4 text-lg text-white font-poppins">{summary}</p>
      <button className="mt-4 border-2 border-blue-500 hover:border-blue-600 bg-transparent text-blue-500 hover:text-blue-600 font-bold py-2 px-4 rounded font-poppins"
        onClick={() => handleModal(description, jobTitle)}>
        Full Description
      </button>


    </div>
  );
};

export default ExperienceCard;
