import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, UserPlus, Trash2, IdCard } from 'lucide-react';

function App() {
  // 1. State untuk menampung daftar siswa
  const [students, setStudents] = useState([
    { id: 1, nama: 'Budi Santoso', nisn: '12345678', ruang: 'Lab Komputer 1' },
    { id: 2, nama: 'Siti Aminah', nisn: '87654321', ruang: 'Lab Komputer 2' },
  ]);

  // 2. State untuk form input
  const [form, setForm] = useState({ nama: '', nisn: '', ruang: '' });

  // 3. Konfigurasi Print (Versi Terbaru)
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: 'Daftar_Kartu_Ujian',
  });

  // Fungsi Tambah Siswa
  const addStudent = (e) => {
    e.preventDefault();
    if (!form.nama || !form.nisn) return alert("Nama dan NISN wajib diisi!");
    
    const newStudent = {
      ...form,
      id: Date.now(),
    };
    
    setStudents([...students, newStudent]);
    setForm({ nama: '', nisn: '', ruang: '' }); // Reset form
  };

  // Fungsi Hapus Siswa
  const removeStudent = (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-800">
      {/* HEADER */}
      <header className="max-w-5xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-indigo-600 flex items-center gap-3">
            <IdCard size={40} /> CardGen
          </h1>
          <p className="text-slate-500">Generator Kartu Ujian Otomatis</p>
        </div>
        
        <button 
          onClick={() => handlePrint()}
          disabled={students.length === 0}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-emerald-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          <Printer size={20} /> Cetak Semua Kartu ({students.length})
        </button>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* PANEL KIRI: INPUT DATA */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 sticky top-10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <UserPlus className="text-indigo-500" /> Input Data Siswa
            </h2>
            <form onSubmit={addStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-600">Nama Siswa</label>
                <input
                  type="text"
                  placeholder="Contoh: Ahmad Subarjo"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  value={form.nama}
                  onChange={(e) => setForm({...form, nama: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-600">NISN / No. Peserta</label>
                <input
                  type="text"
                  placeholder="Contoh: 0098221"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  value={form.nisn}
                  onChange={(e) => setForm({...form, nisn: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-600">Ruang / Kelas</label>
                <input
                  type="text"
                  placeholder="Contoh: Ruang 01"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  value={form.ruang}
                  onChange={(e) => setForm({...form, ruang: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-md"
              >
                Tambah Ke Daftar
              </button>
            </form>
          </div>
        </div>

        {/* PANEL KANAN: PREVIEW KARTU */}
        <div className="lg:col-span-8">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-700">Preview Kartu</h2>
            <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">
              {students.length} Siswa
            </span>
          </div>

          {/* AREA INI YANG AKAN DIPRINT */}
          <div 
            ref={contentRef} 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-200 rounded-2xl min-h-[400px] print:bg-white print:p-0 print:gap-2"
          >
            {students.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                <IdCard size={80} strokeWidth={1} />
                <p className="mt-2 font-medium">Belum ada data untuk ditampilkan</p>
              </div>
            ) : (
              students.map((student) => (
                <div 
                  key={student.id} 
                  className="relative group bg-white border-2 border-slate-800 rounded-lg overflow-hidden shadow-lg print:shadow-none print:break-inside-avoid print:w-[8.5cm] print:h-[5.5cm]"
                >
                  {/* Header Kartu */}
                  <div className="bg-slate-800 text-white p-3 text-center">
                    <h3 className="text-sm font-bold tracking-widest uppercase">Kartu Peserta Ujian</h3>
                    <p className="text-[10px] opacity-80">TAHUN PELAJARAN 2025/2026</p>
                  </div>

                  {/* Body Kartu */}
                  <div className="p-4 flex gap-4">
                    {/* Placeholder Foto */}
                    <div className="w-20 h-24 bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 text-center px-1">
                      Foto 3x4
                    </div>
                    
                    {/* Detail Data */}
                    <div className="flex-1 space-y-2">
                      <div className="border-b border-slate-100 pb-1">
                        <p className="text-[9px] uppercase font-bold text-slate-400">Nama Lengkap</p>
                        <p className="text-xs font-bold text-slate-800 leading-tight">{student.nama}</p>
                      </div>
                      <div className="border-b border-slate-100 pb-1">
                        <p className="text-[9px] uppercase font-bold text-slate-400">Nomor Induk / NISN</p>
                        <p className="text-xs font-mono font-semibold text-slate-700">{student.nisn}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase font-bold text-slate-400">Lokasi / Ruang</p>
                        <p className="text-xs font-semibold text-slate-700">{student.ruang || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Kartu */}
                  <div className="px-4 py-2 bg-slate-50 flex justify-between items-center">
                    <div className="text-[8px] font-bold text-indigo-600">CARDGEN-APP</div>
                    <div className="text-[8px] italic text-slate-400 text-right">Dicetak Sistem</div>
                  </div>

                  {/* Tombol Hapus (Hanya muncul saat hover & Hilang saat print) */}
                  <button 
                    onClick={() => removeStudent(student.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 print:hidden shadow-md"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <footer className="mt-20 text-center text-slate-400 text-sm">
        <p>&copy; 2024 Generator Kartu Ujian - Dibuat dengan React & Tailwind</p>
      </footer>
    </div>
  );
}

export default App;