import React from 'react';

const Card = ({ cardWidth, children }) => {
  return (
    <div className={`col-md-${cardWidth} card-col`}>
      <div className="card">
        <div className="card-block">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;
