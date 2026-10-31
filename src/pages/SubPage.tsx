import Navbar from "../components/Navbar";
import useDocumentTitle from "../hooks/useDocumentTitle";

type SubPageProps = {
  title: string;
  description: string;
  pageTitle: string;
  backgroundImage?: string;
};

const SubPage = ({ title, description, pageTitle, backgroundImage }: SubPageProps) => {
  useDocumentTitle(pageTitle);

  return (
    <section
      className="relative min-h-screen w-full bg-black bg-cover bg-center"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      <Navbar />
      <div className="flex min-h-screen flex-col items-start justify-center px-6 md:px-24 pt-24">
        <h1 className="hero-title text-white font-medium text-[12vw] md:text-[6vw]">{title}</h1>
        <p className="mt-6 max-w-lg text-white/70 text-base md:text-lg leading-relaxed">{description}</p>
      </div>
    </section>
  );
};

export default SubPage;
