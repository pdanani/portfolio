import ProjectCard from "./ProjectCard";

const Projects = ({ projects }) => {
    return (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project, index) => (
                    <div key={index}>
                        <ProjectCard
                            title={project.title}
                            description={project.description}
                            githubURL={project.githubURL}
                            demoURL={project.demoURL}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;