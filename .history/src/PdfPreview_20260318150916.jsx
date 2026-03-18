import { ArrowLeft, Download, FileText } from 'lucide-react';

const PdfPreview = ({ url, onClose }) => {
  return (
    <div className="h-screen w-screen bg-[#0f172a] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-8 py-4 flex justify-between items-center">
        <button 
          onClick={onClose}
          className="flex items-center gap-3 text-slate-400 hover:text-white transition-all group font-bold text-sm uppercase tracking-widest"
        >
          <div className="p-2 rounded-full border border-slate-800 group-hover:border-slate-600 transition-colors">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          Exit Editor
        </button>

        <button 
          onClick={() => {
            const link = document.createElement('a'); link.href = url; link.download = 'Studio_Result.pdf'; link.click();
          }}
          className="bg-white text-slate-950 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          <Download size={18} /> Download Asset
        </button>
      </div>

      <div className="flex-1 bg-[#020617] p-8 flex justify-center items-center">
        <div className="w-full max-w-5xl h-full rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.1)] border border-slate-800">
          <iframe src={`${url}#view=FitH`} className="w-full h-full border-none" title="Viewer" />
        </div>
      </div>
    </div>
  );
};

export default PdfPreview;