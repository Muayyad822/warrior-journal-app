const Footer = () => {
  return (
    <footer className="mt-auto pt-8 pb-6">
      <div className="glass border-t border-slate-200 p-6 text-center">
        <p className="text-slate-500 text-sm">
          Built with care by{" "}
          <a
            href="https://abdulmuizjimoh.vercel.app/"
            className="text-primary-600 font-medium hover:text-primary-700 hover:underline transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            Muayyad
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
