import { createFileRoute } from '@tanstack/react-router'
import { WavesHero } from '#/components/waves-hero'
import { ExperienceSection } from '#/components/sections/experience'
import { ProjectsSection } from '#/components/sections/projects'
import { SkillsSection } from '#/components/sections/skills'
import { ContactSection } from '#/components/sections/contact'
import { WaveDivider } from '#/components/wave-divider'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main>
      <WavesHero />
      {/* everything below the waterline: the sea darkening into night */}
      <div className="night-sea">
        <ExperienceSection />
        <WaveDivider />
        <ProjectsSection />
        <WaveDivider />
        <SkillsSection />
        <WaveDivider />
        <ContactSection />
      </div>
    </main>
  )
}
