import { Download, X, Printer, FileText } from 'lucide-react';

const PdfPreview = ({ url, onClose }) => {
  if (!url) return null;

  return (
    // fixed inset-0 memastikan menempel di pojok layar
    // z-[9999] memastikan berada di atas segalanya
    <div className="fixed inset-0 z-[9999] bg-slate-900 flex flex-col w-full h-full overflow-hidden">
      
      {/* TOOLBAR ATAS */}
      <div className="w-full bg-slate-800 p-4 flex justify-between items-center shadow-2xl border-b border-slate-700">
        <div className="flex items-center gap-3 text-white">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileText size={20} />
          </div>
          <span className="font-bold hidden sm:block">Pratinjau Kartu Ujian</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const link = document.createElement('a');
              link.href = url;
              link.download = 'Kartu_Ujian.pdf';
              link.click();
            }}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-bold transition-all"
          >
            <Download size={18} /> Simpan PDF
          </button>
          
          <button 
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-transform hover:scale-110"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* AREA PDF - FULL HEIGHT */}
      <div className="flex-1 w-full bg-slate-700 relative">
        <iframe 
          src={`${url}#view=FitH`} 
          className="absolute inset-0 w-full h-full border-none"
          title="PDF Viewer"
        />
      </div>
    </div>
  );
};

export default PdfPreview;