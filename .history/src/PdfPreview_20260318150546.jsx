import { Download, X, FileText, Printer } from 'lucide-react';

const PdfPreview = ({ url, onClose }) => {
  if (!url) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `Kartu_Ujian_${Date.now()}.pdf`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-[999] bg-slate-900 flex flex-col">
      {/* TOOLBAR ATAS (FULL WIDTH) */}
      <div className="w-full bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <FileText size={24} />
          </div>
          <div className="hidden md:block">
            <h2 className="text-white font-bold text-lg leading-none">Pratinjau Dokumen</h2>
            <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider font-semibold">
              Format: A4 Standard • Siap Cetak
            </p>
          </div>
        </div>

        {/* GRUP TOMBOL AKSI */}
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-blue-900/20"
          >
            <Download size={18} /> 
            <span className="hidden sm:inline">Download PDF</span>
          </button>
          
          <div className="h-8 w-[1px] bg-slate-700 mx-2 hidden sm:block"></div>

          <button 
            onClick={onClose}
            className="bg-slate-700 hover:bg-red-600 text-white p-2.5 rounded-xl transition-all group"
            title="Tutup Preview"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* AREA PDF (FULL SCREEN REMAINDER) */}
      <div className="flex-1 bg-slate-900 overflow-hidden relative">
        <iframe 
          src={`${url}#toolbar=1&view=FitH`} 
          className="w-full h-full border-none shadow-2xl" 
          title="Full Page PDF Viewer"
        />
        
        {/* Overlay Label (Opsional) */}
        <div className="absolute bottom-6 right-8 hidden lg:block pointer-events-none">
          <div className="bg-slate-800/80 backdrop-blur-md text-slate-400 px-4 py-2 rounded-full text-[10px] font-bold border border-slate-700">
            VIEWER MODE: FULL RESOLUTION
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfPreview;