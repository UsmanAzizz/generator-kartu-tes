import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ nama: '', kelas: '', noPst: '', foto: null });
  const contentRef = useRef(null);

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, foto: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const downloadPDF = async () => {
    const canvas = await html2canvas(contentRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save("kartu-peserta-ujikom.pdf");
  };

  const s = {
    container: { display: 'flex', gap: '20px', padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
    formBox: { width: '300px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', height: 'fit-content', position: 'sticky', top: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    input: { width: '100%', padding: '8px', marginBottom: '10px', display: 'block', border: '1px solid #ccc', borderRadius: '4px' },
    a4: { width: '210mm', minHeight: '297mm', backgroundColor: 'white', padding: '10mm', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px', alignContent: 'start' },
    // Desain Kartu Sesuai Gambar
    card: { width: '62mm', height: '90mm', border: '1px solid #000', padding: '5px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', fontSize: '9px' },
    header: { textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '3px', marginBottom: '5px' },
    logo: { position: 'absolute', left: '2px', top: '2px', width: '35px' },
    fotoBox: { width: '20mm', height: '25mm', border: '1px solid #000', backgroundColor: '#ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    table: { width: '100%', marginTop: '5px', borderCollapse: 'collapse' },
    footer: { marginTop: 'auto', textAlign: 'right', paddingRight: '10px' }
  };

  return (
    <div style={s.container}>
      {/* PANEL KIRI: INPUT */}
      <div style={s.formBox}>
        <h3 style={{marginTop: 0}}>Input Data Peserta</h3>
        <label style={{fontSize:'12px'}}>Nama Lengkap:</label>
        <input style={s.input} value={form.nama} onChange={e => setForm({...form, nama: e.target.value.toUpperCase()})} />
        
        <label style={{fontSize:'12px'}}>Kelas:</label>
        <input style={s.input} value={form.kelas} onChange={e => setForm({...form, kelas: e.target.value.toUpperCase()})} />
        
        <label style={{fontSize:'12px'}}>No. Peserta:</label>
        <input style={s.input} value={form.noPst} onChange={e => setForm({...form, noPst: e.target.value.toUpperCase()})} />
        
        <label style={{fontSize:'12px'}}>Foto (Background Merah):</label>
        <input type="file" style={s.input} onChange={handleFoto} />

        <button style={{width:'100%', padding:'10px', backgroundColor:'#2ecc71', color:'white', border:'none', cursor:'pointer', fontWeight:'bold'}} 
          onClick={() => {
            setStudents([...students, {...form, id: Date.now()}]);
            setForm({nama:'', kelas:'', noPst:'', foto: null});
          }}>TAMBAH PESERTA</button>
        
        <button style={{width:'100%', padding:'10px', marginTop:'10px', backgroundColor:'#3498db', color:'white', border:'none', cursor:'pointer'}} 
          onClick={downloadPDF}>DOWNLOAD PDF (A4)</button>
      </div>

      {/* PANEL KANAN: PREVIEW A4 */}
      <div style={{overflow: 'auto', flex: 1}}>
        <div ref={contentRef} style={s.a4}>
          {students.map(std => (
            <div key={std.id} style={s.card}>
              {/* Kop Lembaga */}
              <div style={s.header}>
                <div style={{fontSize: '5px', fontWeight: 'bold'}}>LEMBAGA PENDIDIKAN MA'ARIF NU PCNU CILACAP</div>
                <div style={{fontSize: '7px', fontWeight: 'bold'}}>SMK DIPONEGORO CIPARI</div>
                <div style={{fontSize: '4px'}}>Jl. Diponegoro Desa Cipari Kec. Cipari Kab. Cilacap 53262</div>
              </div>

              <div style={{textAlign: 'center', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '2px', fontSize: '8px'}}>KARTU PESERTA</div>
              <div style={{textAlign: 'center', fontSize: '7px', marginBottom: '10px'}}>UJI KOMPETENSI KEAHLIAN</div>

              <div style={{display: 'flex', gap: '10px', padding: '0 5px'}}>
                {/* Foto */}
                <div style={s.fotoBox}>
                  {std.foto ? <img src={std.foto} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <span style={{color:'white', fontSize:'6px'}}>3x4</span>}
                </div>

                {/* Data */}
                <div style={{flex: 1, fontSize: '8px'}}>
                  <table style={s.table}>
                    <tbody>
                      <tr><td width="30">NAMA</td><td>: {std.nama}</td></tr>
                      <tr><td>KELAS</td><td>: {std.kelas}</td></tr>
                      <tr><td>NO. PST</td><td>: {std.noPst}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tanda Tangan */}
              <div style={s.footer}>
                <div style={{fontSize: '7px', marginBottom: '15px'}}>Kepala Sekolah</div>
                <div style={{fontSize: '7px', fontWeight: 'bold'}}>Lestari Kurniawati, S.Pd.</div>
              </div>

              {/* Tombol Hapus (Hanya di layar) */}
              <button className="hide-pdf" onClick={() => setStudents(students.filter(x => x.id !== std.id))} 
                style={{position:'absolute', top:0, right:0, background:'red', color:'white', border:'none', fontSize:'8px', cursor:'pointer'}}>X</button>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        @media print { .hide-pdf { display: none; } }
      `}</style>
    </div>
  );
}

export default App;