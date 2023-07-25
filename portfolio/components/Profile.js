import React from 'react';
import Image from 'next/image'; // Import the next/image component

const Profile = ({ name, links }) => {
  return (
    <div className="text-center py-4">
      <div className="inline-block overflow-hidden rounded-full w-48 h-48 shadow-2xl border-2 border-gray-600">
        <Image
          src="/profile.jpg"
          alt={name}
          width={200}
          height={200}
          objectFit="cover"
        />
      </div>
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
