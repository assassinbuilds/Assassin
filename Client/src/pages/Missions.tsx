import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, Lock } from 'lucide-react';

const Missions = () => {
  return (
    <div className="min-h-screen bg-white text-slate-950 flex flex-col">
      <Navbar dark={false} />
      
      <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-20 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mt-16"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-200 shadow-sm"
          >
            <Lock className="w-10 h-10 text-slate-400" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 mb-6"
          >
            <ShieldCheck className="w-4 h-4 text-red-600" />
            <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.3em]">Classified Intel</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-black italic tracking-tighter mb-6 leading-none text-slate-950"
          >
            COMING <span className="text-red-600">SOON</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-600 text-lg max-w-xl mx-auto font-medium leading-relaxed"
          >
            The grid is currently securing new operative assignments. Stand by for the next wave of tactical bounties, challenges, and high-tier rewards.
          </motion.p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Missions;
