import { useState, useRef } from 'react';
import { UserPlus, Trash2, IdCard, FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function App() {
  const [students, setStudents] = useState([
    { id: 1, nama: 'Budi Santoso', nisn: '12345678', ruang: 'Lab Komputer 1' },
    { id: 2, nama: 'Siti Aminah', nisn: '87654321', ruang: 'Lab Komputer 2' },
  ]);

  const [form, setForm] = useState({ nama: '', nisn: '', ruang: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef(null);

  // FUNGSI GENERATE PDF
  const downloadPDF = async () => {
    if (!contentRef.current) return;
    setIsGenerating(true);

    try {
      const element = contentRef.current;
      // Membuat canvas dari element HTML
      const canvas = await html2canvas(element, {
        scale: 2, // Meningkatkan resolusi gambar agar tidak pecah
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // Lebar A4 dalam mm
      const pageHeight = 297; // Tinggi A4 dalam mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('Kartu_Ujian_Siswa.pdf');
    } catch (error) {
      console.error("Gagal membuat PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addStudent = (e) => {
    e.preventDefault();
    if (!form.nama || !form.nisn) return alert("Nama dan NISN wajib diisi!");
    setStudents([...students, { ...form, id: Date.now() }]);
    setForm({ nama: '', nisn: '', ruang: '' });
  };

  const removeStudent = (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-10">
      <header className="max-w-5xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-red-600 flex items-center gap-3">
            <FileText size={40} /> PDFCard
          </h1>
          <p className="text-slate-500">Ekspor Kartu Ujian ke PDF</p>
        </div>
        
        <button 
          onClick={downloadPDF}
          disabled={students.length === 0 || isGenerating}
          className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-red-700 disabled:bg-slate-300 transition"
        >
          {isGenerating ? "Processing..." : <><Download size={20} /> Download PDF</>}
        </button>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* INPUT PANEL */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <UserPlus className="text-red-500" /> Input Data
            </h2>
            <form onSubmit={addStudent} className="space-y-4">
              <input
                type="text"
                placeholder="Nama Siswa"
                className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                value={form.nama}
                onChange={(e) => setForm({...form, nama: e.target.value})}
              />
              <input
                type="text"
                placeholder="NISN"
                className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                value={form.nisn}
                onChange={(e) => setForm({...form, nisn: e.target.value})}
              />
              <input
                type="text"
                placeholder="Ruang"
                className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                value={form.ruang}
                onChange={(e) => setForm({...form, ruang: e.target.value})}
              />
              <button className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-black transition">
                Tambah Siswa
              </button>
            </form>
          </div>
        </div>

        {/* PREVIEW PANEL */}
        <div className="lg:col-span-8">
          <div 
            ref={contentRef} 
            className="grid grid-cols-2 gap-2 p-4 bg-white border border-gray-200 w-[210mm] min-h-[297mm] mx-auto shadow-2xl origin-top scale-[0.6] lg:scale-100"
          >
            {students.map((student) => (
              <div 
                key={student.id} 
                className="relative border-2 border-black w-[9.5cm] h-[6cm] p-0 overflow-hidden flex flex-col bg-white"
              >
                <div className="bg-red-700 text-white p-2 text-center border-b-2 border-black">
                  <h3 className="text-[12px] font-bold uppercase tracking-tighter">Kartu Tanda Peserta Ujian</h3>
                  <p className="text-[10px]">SMK NEGERI INDONESIA</p>
                </div>

                <div className="flex p-3 gap-3 flex-grow">
                   <div className="w-24 h-28 border-2 border-black flex items-center justify-center text-[10px] bg-slate-50">
                     FOTO 3X4
                   </div>
                   <div className="flex-1 space-y-1 text-[11px]">
                      <p><span className="font-bold w-12 inline-block">Nama</span>: {student.nama}</p>
                      <p><span className="font-bold w-12 inline-block">NISN</span>: {student.nisn}</p>
                      <p><span className="font-bold w-12 inline-block">Ruang</span>: {student.ruang}</p>
                      <div className="mt-6 text-right font-bold underline">
                        PANITIA UJIAN
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => removeStudent(student.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-700 data-html2canvas-ignore"
                >
                  <Trash2 size={12} />
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