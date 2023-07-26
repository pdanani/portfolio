import ExperienceCard from "./ExperienceCard";
import { useState } from "react";
import Modal from './Modal';

const Experience = ({ experience }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {experience.map((job, index) => (
                    <div key={index}>
                        <ExperienceCard
                            jobTitle={job.jobTitle}
                            company={job.company}
                            description={job.description}
                            startDate={job.startDate}
                            endDate={job.endDate}
                            summary={job.summary}
                            handleModal={handleModal}
                        />
                    </div>
                ))}
            </div>
            {isOpen && (
                <Modal onClose={closeModal}>
       
                </Modal>
            )}
        </div>
    );
};

export default Experience;
