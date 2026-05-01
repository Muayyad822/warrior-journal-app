import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto relative overflow-hidden bg-slate-50 border-t border-slate-200/60 pb-20 md:pb-0">
      <div className="absolute inset-0 bg-gradient-to-t from-primary-50/50 to-transparent pointer-events-none"></div>
      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">The Warrior's Journal</h3>
            <p className="text-sm text-slate-500 mt-1">Empowering sickle cell warriors daily.</p>
          </div>
          
          <div className="flex items-center text-sm font-medium text-slate-600 bg-white/60 px-4 py-2 rounded-2xl border border-slate-200 shadow-sm backdrop-blur-md">
            Built with <Heart className="w-4 h-4 mx-1.5 text-primary-500 fill-primary-100" /> by{" "}
            <a
              href="https://abdulmuizjimoh.vercel.app/"
              className="ml-1 text-primary-600 font-bold hover:text-primary-500 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Muayyad
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} The Warrior's Journal. All rights reserved.</p>
          <p className="max-w-md text-center md:text-right">
            Not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
