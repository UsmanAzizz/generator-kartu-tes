import { useState, useRef, useEffect } from 'react';
import { UserPlus, Trash2, IdCard, FileText, Eye, Download, X } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function App() {
  const [students, setStudents] = useState([
    { id: 1, nama: 'Budi Santoso', nisn: '12345678', ruang: 'Lab Komputer 1' },
    { id: 2, nama: 'Siti Aminah', nisn: '87654321', ruang: 'Lab Komputer 2' },
  ]);

  const [form, setForm] = useState({ nama: '', nisn: '', ruang: '' });
  const [pdfUrl, setPdfUrl] = useState(null); // State untuk menyimpan URL PDF
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef(null);

  // FUNGSI PREVIEW PDF
  const generatePreview = async () => {
    if (!contentRef.current) return;
    setIsGenerating(true);

    try {
      const element = contentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Membuat Blob URL untuk ditampilkan di iframe
      const blob = pdf.output('bloburl');
      setPdfUrl(blob);
    } catch (error) {
      console.error("Gagal preview PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      {/* MODAL PENAMPIL PDF */}
      {pdfUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col p-4 md:p-10">
          <div className="flex justify-between items-center mb-4 text-white">
            <h2 className="text-xl font-bold">Preview Dokumen PDF</h2>
            <div className="flex gap-4">
               <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = pdfUrl;
                  link.download = 'Kartu_Ujian.pdf';
                  link.click();
                }}
                className="bg-emerald-600 px-4 py-2 rounded flex items-center gap-2 hover:bg-emerald-700"
               >
                 <Download size={18} /> Simpan Sekarang
               </button>
               <button 
                onClick={() => setPdfUrl(null)}
                className="bg-red-600 p-2 rounded-full hover:bg-red-700"
               >
                 <X size={24} />
               </button>
            </div>
          </div>
          <iframe src={pdfUrl} className="w-full h-full rounded-lg bg-white" title="PDF Preview"></iframe>
        </div>
      )}

      <header className="max-w-6xl mx-auto mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-800 flex items-center gap-3">
            <FileText size={40} className="text-blue-600" /> PDF Studio
          </h1>
          <p className="text-slate-500">Buat, Cek, lalu Download.</p>
        </div>
        
        <button 
          onClick={generatePreview}
          disabled={students.length === 0 || isGenerating}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 disabled:bg-slate-300 transition"
        >
          {isGenerating ? "Menyusun PDF..." : <><Eye size={20} /> Preview PDF</>}
        </button>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* INPUT PANEL - Tetap sama seperti sebelumnya */}
        <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-2xl shadow-xl">
                <h2 className="text-xl font-bold mb-4">Data Siswa</h2>
                <form className="space-y-3" onSubmit={(e) => {
                    e.preventDefault();
                    setStudents([...students, {...form, id: Date.now()}]);
                    setForm({nama:'', nisn:'', ruang:''});
                }}>
                    <input className="w-full p-2 border rounded" placeholder="Nama" value={form.nama} onChange={e=>setForm({...form, nama: e.target.value})} />
                    <input className="w-full p-2 border rounded" placeholder="NISN" value={form.nisn} onChange={e=>setForm({...form, nisn: e.target.value})} />
                    <input className="w-full p-2 border rounded" placeholder="Ruang" value={form.ruang} onChange={e=>setForm({...form, ruang: e.target.value})} />
                    <button className="w-full bg-slate-800 text-white py-2 rounded font-bold uppercase text-sm">Tambah</button>
                </form>
            </div>
        </div>

        {/* PREVIEW KARTU DI HALAMAN (EDITOR) */}
        <div className="lg:col-span-8 overflow-auto max-h-[80vh] bg-slate-300 p-8 rounded-2xl border-4 border-dashed border-slate-400">
           <div className="mb-4 text-center text-slate-600 text-sm font-bold uppercase tracking-widest">Lembar Kerja (A4)</div>
           {/* Area Render A4 */}
           <div 
            ref={contentRef} 
            className="bg-white w-[210mm] min-h-[297mm] p-[10mm] mx-auto grid grid-cols-2 gap-4"
           >
             {students.map((s) => (
               <div key={s.id} className="relative border-2 border-slate-800 h-[55mm] w-[90mm] p-2 flex flex-col justify-between">
                  <div className="text-center border-b border-slate-800 pb-1">
                    <h4 className="text-[10pt] font-bold">KARTU PESERTA UJIAN</h4>
                    <p className="text-[8pt]">TP. 2025/2026</p>
                  </div>
                  <div className="flex gap-2 py-2">
                    <div className="w-20 h-24 bg-slate-100 border border-slate-300 flex items-center justify-center text-[7pt]">FOTO</div>
                    <div className="flex-1 text-[9pt] space-y-1">
                        <p>Nama: <b>{s.nama}</b></p>
                        <p>NISN: {s.nisn}</p>
                        <p>Ruang: {s.ruang}</p>
                    </div>
                  </div>
                  <button onClick={() => setStudents(students.filter(x => x.id !== s.id))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full data-html2canvas-ignore"><X size={10}/></button>
               </div>
             ))}
           </div>
        </div>
      </main>
    </div>
  );
}

export default App;