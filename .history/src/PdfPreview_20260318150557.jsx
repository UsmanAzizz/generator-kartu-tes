import { Download, X, FileText } from 'lucide-react';

const PdfPreview = ({ url, onClose }) => {
  if (!url) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `Kartu_Ujian_${Date.now()}.pdf`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex flex-col p-4 md:p-8">
      {/* Header Modal */}
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center mb-4 bg-slate-800 p-4 rounded-t-xl border-b border-slate-700 shadow-2xl">
        <div className="flex items-center gap-3 text-white">
          <div className="bg-red-500 p-2 rounded-lg">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="font-bold leading-none">Preview Dokumen</h2>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">PDF Ready to Print</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-lg active:scale-95"
          >
            <Download size={18} /> Simpan PDF
          </button>
          
          <button 
            onClick={onClose}
            className="bg-slate-700 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Konten PDF */}
      <div className="max-w-5xl mx-auto w-full h-full bg-white rounded-b-xl overflow-hidden shadow-2xl">
        <iframe 
          src={url} 
          className="w-full h-full border-none" 
          title="PDF Viewer"
        />
      </div>
      
      <p className="text-center text-slate-500 text-xs mt-4">
        Gunakan menu printer di dalam viewer jika ingin langsung mencetak ke kertas.
      </p>
    </div>
  );
};

export default PdfPreview;