import React from 'react';
import { Card } from 'react-bootstrap';

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
    <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', padding: '1rem' }}>
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
