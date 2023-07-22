import React from 'react';

const Profile = ({ image, name, links }) => {
  return (
    <div className="text-center py-4">
      <img className="mx-auto h-32 w-32 rounded-full" src={image} alt={name} />
      <h2 className="text-3xl font-bold mt-4 font-poppins">{name}</h2>
      <p className="mt-2 text-lg font-poppins">
        {links.map((link, index) => (
          <span key={index}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
              {link.name}
            </a>
            {index < links.length - 1 && <span className="mx-2">•</span>}
          </span>
        ))}
      </p>
    </div>
  );
};

export default Profile;
