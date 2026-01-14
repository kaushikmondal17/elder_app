
import React from 'react';
import { ShieldCheck, Info, Heart, Globe, Building } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      <div className="text-center py-6">
        <div className="w-20 h-20 bg-blue-600 rounded-[2rem] mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-200 mb-4">
           <ShieldCheck className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Elder Connect</h2>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Enterprise Field Force v2.4.0</p>
      </div>

      <div className="space-y-6">
        <section>
          <div className="flex items-center space-x-3 mb-3 text-blue-600">
            <Building className="w-5 h-5" />
            <h4 className="font-bold">Our Company</h4>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Elder Laboratories is a leading name in the healthcare sector, dedicated to providing high-quality pharmaceutical products that improve the lives of millions across the globe.
          </p>
        </section>

        <section>
          <div className="flex items-center space-x-3 mb-3 text-red-500">
            <Heart className="w-5 h-5" />
            <h4 className="font-bold">Mission</h4>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our mission is to empower our field force with the best digital tools to ensure every healthcare provider gets timely access to our life-saving medicines.
          </p>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <a href="https://www.alventapharma.com/" className="flex items-center space-x-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
             <Globe className="w-5 h-5 text-slate-400" />
             <span className="text-xs font-bold text-slate-700">Official Website</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
             <Info className="w-5 h-5 text-slate-400" />
             <span className="text-xs font-bold text-slate-700">App Guidelines</span>
          </a>
        </div>
      </div>

      <div className="pt-8 text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest border-t border-slate-100">
        © 2024 Elder Laboratories <br />
        All Rights Reserved. <br />
        Secured by Biometric Cloud Sync.
      </div>
    </div>
  );
};

export default About;
