import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './App.css'; // Pastikan CSS di atas sudah di-save ke file ini

function App() {
  const [students, setStudents] = useState([
    { id: 1, nama: 'JULIAN RICCI', nisn: 'PX-99021', ruang: 'ALPHA CORE' },
  ]);
  const [form, setForm] = useState({ nama: '', nisn: '', ruang: '' });
  const contentRef = useRef(null);

  const downloadPDF = async () => {
    const canvas = await html2canvas(contentRef.current, { scale: 3 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save("kartu-siswa.pdf");
  };

  return (
    <div className="main-wrapper">
      <button className="btn-export" onClick={downloadPDF}>Export PDF</button>

      <div className="container">
        {/* SIDEBAR INPUT */}
        <div className="sidebar">
          <h2>Input Data</h2>
          <div className="input-group">
            <label>Nama Lengkap</label>
            <input 
              value={form.nama} 
              onChange={e => setForm({...form, nama: e.target.value.toUpperCase()})} 
              placeholder="Contoh: ADRIAN SMITH"
            />
          </div>
          <div className="input-group">
            <label>Access ID / NISN</label>
            <input 
              value={form.nisn} 
              onChange={e => setForm({...form, nisn: e.target.value.toUpperCase()})} 
              placeholder="ID-001"
            />
          </div>
          <div className="input-group">
            <label>Ruangan / Sektor</label>
            <input 
              value={form.ruang} 
              onChange={e => setForm({...form, ruang: e.target.value.toUpperCase()})} 
              placeholder="Ruang 01"
            />
          </div>
          <button className="btn-add" onClick={() => {
            if(!form.nama) return;
            setStudents([...students, {...form, id: Date.now()}]);
            setForm({nama:'', nisn:'', ruang:''});
          }}>Tambah Kartu</button>
        </div>

        {/* PREVIEW KERTAS A4 */}
        <div className="preview-container">
          <div ref={contentRef} className="a4-paper">
            {students.map(s => (
              <div key={s.id} className="id-card">
                <div className="card-header">Official Identity Card</div>
                <div className="card-body">
                  <div className="photo-box">FOTO</div>
                  <div className="info">
                    <p style={{fontSize: '7px', fontWeight: 'bold', color: '#2563eb'}}>HOLDER NAME</p>
                    <h3>{s.nama}</h3>
                    <div style={{marginTop: '10px', display: 'flex', gap: '15px'}}>
                      <div>
                        <p style={{fontSize: '6px', fontWeight: 'bold'}}>ID NUMBER</p>
                        <span style={{fontSize: '9pt', fontWeight: 'bold'}}>{s.nisn}</span>
                      </div>
                      <div>
                        <p style={{fontSize: '6px', fontWeight: 'bold'}}>SECTOR</p>
                        <span style={{fontSize: '9pt', fontWeight: 'bold'}}>{s.ruang || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  Verified System • 2026
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;