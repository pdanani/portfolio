import React from 'react';

const Profile = ({ profile }) => {
  const { fullName, profilePicture, githubLink, linkedinLink, email } = profile;

  return (
    <div>
      <h1>{fullName}</h1>
      <img src={profilePicture} alt={fullName} />
      <div>
        <a href={githubLink} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href={linkedinLink} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href={`mailto:${email}`}>Email</a>
      </div>
    </div>
  );
};

export default Profile;
