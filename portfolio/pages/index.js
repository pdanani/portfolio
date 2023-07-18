import Layout from '../components/Layout';
import Header from '../components/Header';
import Contact from '../components/Contact';
import Experience from '../components/Experience';
import Projects from '../components/Projects';

export default function Home() {
  return (
    <Layout>
      <Header />
      <Contact />
      <Experience />
      <Projects />
    </Layout>
  );
}