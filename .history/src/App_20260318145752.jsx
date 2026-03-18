import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, UserPlus, Trash2 } from 'lucide-react';
import './App.css';

function App() {
  // State untuk menampung daftar siswa
  const [students, setStudents] = useState([
    { id: 1, nama: 'Budi Santoso', nisn: '12345678', ruang: 'Lab Komputer 1' },
  ]);

  // State untuk form input
  const [form, setForm] = useState({ nama: '', nisn: '', ruang: '' });

  // Referensi untuk area yang akan dicetak
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Kartu_Ujian_Siswa',
  });

  const addStudent = (e) => {
    e.preventDefault();
    if (!form.nama || !form.nisn) return;
    setStudents([...students, { ...form, id: Date.now() }]);
    setForm({ nama: '', nisn: '', ruang: '' }); // Reset form
  };

  const removeStudent = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <header className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-600">CardGen 📇</h1>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Printer size={20} /> Cetak Kartu
        </button>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* PANEL INPUT */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-md h-fit">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UserPlus size={20} /> Tambah Siswa
          </h2>
          <form onSubmit={addStudent} className="space-y-4">
            <input
              type="text"
              placeholder="Nama Lengkap"
              className="w-full p-2 border rounded"
              value={form.nama}
              onChange={(e) => setForm({...form, nama: e.target.value})}
            />
            <input
              type="text"
              placeholder="NISN / No Peserta"
              className="w-full p-2 border rounded"
              value={form.nisn}
              onChange={(e) => setForm({...form, nisn: e.target.value})}
            />
            <input
              type="text"
              placeholder="Ruang Ujian"
              className="w-full p-2 border rounded"
              value={form.ruang}
              onChange={(e) => setForm({...form, ruang: e.target.value})}
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Tambah ke Daftar
            </button>
          </form>
        </div>

        {/* AREA PREVIEW & CETAK */}
        <div className="md:col-span-2">
          <div ref={componentRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white rounded-xl shadow-inner border border-dashed border-gray-300">
            {students.length === 0 && <p className="text-gray-400 col-span-2 text-center py-10">Belum ada data siswa.</p>}
            
            {students.map((student) => (
              <div key={student.id} className="relative group border-2 border-blue-800 rounded-md overflow-hidden bg-white w-full h-48 shadow-sm print:shadow-none print:m-0">
                {/* Header Kartu */}
                <div className="bg-blue-800 text-white text-center py-2 px-1">
                  <h3 className="text-xs font-bold uppercase">Kartu Tanda Peserta Ujian</h3>
                  <p className="text-[10px]">SMK NEGERI PRESTASI TINGGI</p>
                </div>

                {/* Isi Kartu */}
                <div className="p-3 flex gap-3">
                  <div className="w-20 h-24 bg-gray-200 border border-gray-400 flex items-center justify-center text-[8px] text-gray-500">
                    Foto 2x3
                  </div>
                  <div className="flex-1 text-xs space-y-1">
                    <p><span className="font-bold inline-block w-12">Nama</span>: {student.nama}</p>
                    <p><span className="font-bold inline-block w-12">No</span>: {student.nisn}</p>
                    <p><span className="font-bold inline-block w-12">Ruang</span>: {student.ruang}</p>
                    <div className="mt-4 pt-2 border-t border-gray-200 text-right italic text-[9px]">
                      Panitia Ujian
                    </div>
                  </div>
                </div>

                {/* Tombol Hapus (Hilang saat diprint) */}
                <button 
                  onClick={() => removeStudent(student.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition print:hidden"
                >
                  <Trash2 size={14} />
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