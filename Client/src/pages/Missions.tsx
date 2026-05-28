import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MissionsHub from '@/components/MissionsHub';
import { Target, ShieldCheck } from 'lucide-react';

const Missions = () => {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar dark={false} />
      
      <main className="pt-24 pb-20">
        {/* Header Section */}
        <div className="relative overflow-hidden mb-12">
          <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 mb-6"
            >
              <ShieldCheck className="w-4 h-4 text-red-600" />
              <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.3em]">Operative Assignments</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-4 leading-none text-slate-950">
              MY <span className="text-red-600">MISSIONS</span>
            </h1>
            
            <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed">
              Complete these tactical objectives to earn XP, increase your rank, and unlock higher-tier bounties. The grid waits for no one.
            </p>
          </div>
        </div>

        {/* Missions Hub Area */}
        <section id="missions-hub" className="px-6">
          <MissionsHub />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Missions;
