import { ArrowLeft, Download, FileText, Printer } from 'lucide-react';

const PdfPreview = ({ url, onClose }) => {
  return (
    <div className="h-screen w-screen bg-slate-900 flex flex-col overflow-hidden">
      {/* HEADER NAVIGASI BALIK */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group font-semibold"
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Editor
          </button>
          <div className="h-6 w-[1px] bg-slate-600 mx-2"></div>
          <div className="flex items-center gap-2 text-white">
            <FileText size={18} className="text-blue-400" />
            <span className="text-sm font-medium">Draft_Kartu_Ujian.pdf</span>
          </div>
        </div>

        <button 
          onClick={() => {
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Kartu_Ujian_Siswa.pdf';
            link.click();
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <Download size={18} />
          Unduh Sekarang
        </button>
      </div>

      {/* VIEWER PDF PENUH */}
      <div className="flex-1 w-full relative bg-slate-900">
        <iframe 
          src={`${url}#view=FitH&toolbar=1`} 
          className="w-full h-full border-none" 
          title="Full PDF Viewer"
        />
      </div>
    </div>
  );
};

export default PdfPreview;