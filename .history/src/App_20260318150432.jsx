import { useState, useRef } from 'react';
import { UserPlus, IdCard, FileText, Eye, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PdfPreview from 'PdfPreview'; // Import komponen baru

function App() {
  const [students, setStudents] = useState([
    { id: 1, nama: 'Budi Santoso', nisn: '12345678', ruang: 'Lab Komputer 1' },
  ]);
  const [form, setForm] = useState({ nama: '', nisn: '', ruang: '' });
  
  // State untuk mengontrol Preview
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef(null);

  const generatePreview = async () => {
    if (!contentRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      
      const blob = pdf.output('bloburl');
      setPdfUrl(blob); // Set URL untuk memunculkan modal
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic">CARD<span className="text-blue-600">PRO</span></h1>
        <button 
          onClick={generatePreview}
          disabled={isGenerating}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 disabled:bg-slate-400 transition-all shadow-lg shadow-blue-200"
        >
          {isGenerating ? <Loader2 className="animate-spin" /> : <Eye size={20} />}
          Preview PDF
        </button>
      </div>

      <main className="max-w-6xl mx-auto grid grid-cols-12 gap-8">
        {/* Sisi Kiri: Form Input (Sama seperti sebelumnya) */}
        <div className="col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <h2 className="font-bold mb-4 flex items-center gap-2 text-slate-700"><UserPlus size={18}/> Tambah Peserta</h2>
             <div className="space-y-3">
                <input className="w-full border p-2 rounded-lg text-sm" placeholder="Nama" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} />
                <input className="w-full border p-2 rounded-lg text-sm" placeholder="NISN" value={form.nisn} onChange={e => setForm({...form, nisn: e.target.value})} />
                <input className="w-full border p-2 rounded-lg text-sm" placeholder="Ruang" value={form.ruang} onChange={e => setForm({...form, ruang: e.target.value})} />
                <button 
                  onClick={() => { setStudents([...students, {...form, id: Date.now()}]); setForm({nama:'',nisn:'',ruang:''}); }}
                  className="w-full bg-slate-800 text-white py-2 rounded-lg font-bold hover:bg-black transition-colors"
                >
                  Tambah Siswa
                </button>
             </div>
          </div>
        </div>

        {/* Sisi Kanan: Lembar Kerja */}
        <div className="col-span-8 bg-white p-10 rounded-2xl shadow-inner border border-slate-200 overflow-auto max-h-[75vh]">
           <div ref={contentRef} className="w-[210mm] min-h-[297mm] mx-auto grid grid-cols-2 gap-4 p-4 bg-white ring-1 ring-slate-200">
              {students.map(s => (
                <div key={s.id} className="border-2 border-slate-900 h-[55mm] w-full p-3 flex flex-col justify-between">
                   <div className="text-center font-bold text-xs border-b-2 border-slate-900 pb-1">KARTU PESERTA UJIAN</div>
                   <div className="flex-1 py-2 text-[10pt] font-mono uppercase">
                      <p>Nama: {s.nama}</p>
                      <p>NISN: {s.nisn}</p>
                      <p>Ruang: {s.ruang}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </main>

      {/* KOMPONEN PREVIEW MODAL */}
      <PdfPreview url={pdfUrl} onClose={() => setPdfUrl(null)} />
    </div>
  );
}

export default App;