import React from 'react';
import Card from './Card';

const ProjectCard = ({
  title,
  description,
  leftButtonHref,
  leftButtonText,
  rightButtonHref,
  rightButtonText,
  cardWidth = '6'
}) => {
  return (
    <Card cardWidth={cardWidth}>
      <h3 className="card-title">{title}</h3>
      <p className="card-text">{description}</p>
      <div>
        <a href={leftButtonHref} target="_blank">
          <button type="button" className="btn btn-outline-light">
            {leftButtonText}
          </button>
        </a>
        {rightButtonHref && (
          <a href={rightButtonHref} target="_blank">
            <button type="button" className="btn btn-outline-light">
              {rightButtonText}
            </button>
          </a>
        )}
      </div>
    </Card>
  );
};

export default ProjectCard;
