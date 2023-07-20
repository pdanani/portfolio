import React from 'react';

const Profile = ({ profile }) => {
  const { fullName, profilePicture, githubURL, linkedinURL, email } = profile;
  return (
    <div>
      <h1>{fullName}</h1>
      <img src={profilePicture} alt={'PD'} />
      <div>
        <a href={githubURL} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href={linkedinURL} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href={`mailto:${email}`}>Email</a>
      </div>
    </div>
  );
};

export default Profile;
