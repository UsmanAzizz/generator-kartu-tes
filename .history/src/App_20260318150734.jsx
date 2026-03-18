import { useState, useRef } from 'react';
import { UserPlus, IdCard, FileText, Eye, Loader2, Plus, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PdfPreview from './PdfPreview';

function App() {
  const [students, setStudents] = useState([
    { id: 1, nama: 'Budi Santoso', nisn: '12345678', ruang: 'Lab Komputer 1' },
  ]);
  const [form, setForm] = useState({ nama: '', nisn: '', ruang: '' });
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef(null);

  const generatePreview = async () => {
    if (!contentRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(contentRef.current, { scale: 2, useCORS: true });
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
      const blob = pdf.output('bloburl');
      setPdfUrl(blob);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- JIKA PDF_URL ADA, TAMPILKAN HALAMAN PREVIEW SAJA ---
  if (pdfUrl) {
    return <PdfPreview url={pdfUrl} onClose={() => setPdfUrl(null)} />;
  }

  // --- JIKA TIDAK, TAMPILKAN HALAMAN DASHBOARD EDITOR ---
  return (
    <div className="min-h-screen bg-slate-50">
      {/* NAVBAR Sederhana */}
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-black text-slate-800 tracking-tighter">
          CARD<span className="text-blue-600">PRO</span>
        </h1>
        <button 
          onClick={generatePreview}
          disabled={isGenerating || students.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Eye size={18} />}
          Lihat Hasil PDF
        </button>
      </nav>

      <main className="max-w-7xl mx-auto p-8 grid grid-cols-12 gap-8">
        {/* PANEL INPUT */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Plus size={18} className="text-blue-600"/> Tambah Peserta
            </h2>
            <div className="space-y-3">
              <input 
                className="w-full border border-slate-200 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="Nama Lengkap" 
                value={form.nama} 
                onChange={e => setForm({...form, nama: e.target.value})} 
              />
              <input 
                className="w-full border border-slate-200 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="NISN / Nomor Peserta" 
                value={form.nisn} 
                onChange={e => setForm({...form, nisn: e.target.value})} 
              />
              <input 
                className="w-full border border-slate-200 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="Ruang Ujian" 
                value={form.ruang} 
                onChange={e => setForm({...form, ruang: e.target.value})} 
              />
              <button 
                onClick={() => {
                  if(!form.nama) return;
                  setStudents([...students, {...form, id: Date.now()}]);
                  setForm({nama:'', nisn:'', ruang:''});
                }}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg"
              >
                Simpan ke Daftar
              </button>
            </div>
          </div>
        </div>

        {/* AREA LEMBAR KERJA (A4 PREVIEW) */}
        <div className="col-span-12 lg:col-span-8 overflow-x-auto bg-slate-200 p-8 rounded-3xl shadow-inner min-h-[80vh]">
          <div className="mb-4 text-center font-bold text-slate-500 text-xs uppercase tracking-[0.2em]">
            Layout Editor (Mode A4)
          </div>
          <div 
            ref={contentRef} 
            className="w-[210mm] min-h-[297mm] mx-auto grid grid-cols-2 gap-4 p-8 bg-white shadow-2xl"
          >
            {students.map(s => (
              <div key={s.id} className="group relative border-2 border-slate-900 h-[55mm] w-full p-4 flex flex-col justify-between hover:bg-blue-50/30 transition-colors">
                <div className="text-center font-black text-sm border-b-2 border-slate-900 pb-1 italic">
                  KARTU PESERTA UJIAN
                </div>
                <div className="flex-1 py-3 text-[10pt] font-mono leading-tight">
                  <p>NAMA : <span className="font-bold">{s.nama}</span></p>
                  <p>NISN : {s.nisn}</p>
                  <p>RNG  : {s.ruang || '-'}</p>
                </div>
                <div className="text-[8pt] text-right italic font-bold">PANITIA @ 2026</div>
                
                {/* Tombol Hapus (Hanya muncul saat hover) */}
                <button 
                  onClick={() => setStudents(students.filter(x => x.id !== s.id))} 
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md hover:scale-110"
                >
                  <Trash2 size={12}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;