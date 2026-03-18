import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    pdf.save("id-cards.pdf");
  };

  const styles = {
    wrapper: {
      display: 'flex',
      flexDirection: 'row',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      fontFamily: 'sans-serif',
      padding: '20px',
      gap: '30px'
    },
    sidebar: {
      width: '320px',
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      height: 'fit-content',
      position: 'sticky',
      top: '20px'
    },
    inputGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      fontSize: '11px',
      fontWeight: 'bold',
      color: '#64748b',
      marginBottom: '5px',
      textTransform: 'uppercase'
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      boxSizing: 'border-box',
      fontSize: '14px'
    },
    btnAdd: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#1e293b',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '10px'
    },
    previewArea: {
      flex: 1,
      backgroundColor: '#cbd5e1',
      padding: '40px',
      borderRadius: '30px',
      display: 'flex',
      justifyContent: 'center',
      overflow: 'auto',
      maxHeight: '90vh'
    },
    a4Paper: {
      width: '210mm',
      minHeight: '297mm',
      backgroundColor: 'white',
      padding: '15mm',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10mm',
      alignContent: 'start',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
    },
    card: {
      height: '55mm',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
    },
    cardHeader: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '8px 15px',
      fontSize: '8px',
      fontWeight: 'bold',
      letterSpacing: '1px'
    },
    cardBody: {
      padding: '15px',
      display: 'flex',
      gap: '15px',
      alignItems: 'center',
      flex: 1
    },
    photo: {
      width: '60px',
      height: '80px',
      backgroundColor: '#f1f5f9',
      border: '1px dashed #cbd5e1',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '8px',
      color: '#94a3b8'
    },
    btnExport: {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      padding: '15px 30px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '50px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 10px 20px rgba(37, 99, 235, 0.3)',
      zIndex: 100
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Tombol Export Mengambang */}
      <button style={styles.btnExport} onClick={downloadPDF}>
        📥 Download PDF (A4)
      </button>

      {/* Input Data */}
      <div style={styles.sidebar}>
        <h2 style={{marginTop: 0, fontSize: '20px'}}>StudioCards</h2>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Nama Siswa</label>
          <input 
            style={styles.input}
            value={form.nama} 
            onChange={e => setForm({...form, nama: e.target.value.toUpperCase()})} 
            placeholder="NAMA LENGKAP"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>ID / NISN</label>
          <input 
            style={styles.input}
            value={form.nisn} 
            onChange={e => setForm({...form, nisn: e.target.value.toUpperCase()})} 
            placeholder="PX-000"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Ruangan</label>
          <input 
            style={styles.input}
            value={form.ruang} 
            onChange={e => setForm({...form, ruang: e.target.value.toUpperCase()})} 
            placeholder="ALPHA 01"
          />
        </div>
        <button style={styles.btnAdd} onClick={() => {
          if(!form.nama) return;
          setStudents([...students, {...form, id: Date.now()}]);
          setForm({nama:'', nisn:'', ruang:''});
        }}>+ Tambah Ke Antrean</button>
      </div>

      {/* Preview Kertas */}
      <div style={styles.previewArea}>
        <div ref={contentRef} style={styles.a4Paper}>
          {students.map(s => (
            <div key={s.id} style={styles.card}>
              <div style={styles.cardHeader}>OFFICIAL IDENTITY CARD</div>
              <div style={styles.cardBody}>
                <div style={styles.photo}>FOTO</div>
                <div style={{flex: 1}}>
                  <p style={{margin: 0, fontSize: '7px', fontWeight: 'bold', color: '#2563eb'}}>HOLDER NAME</p>
                  <h3 style={{margin: '2px 0 8px 0', fontSize: '14pt', color: '#1e293b'}}>{s.nama}</h3>
                  
                  <div style={{display: 'flex', gap: '15px'}}>
                    <div>
                      <p style={{margin: 0, fontSize: '6px', fontWeight: 'bold', color: '#94a3b8'}}>ACCESS ID</p>
                      <span style={{fontSize: '10pt', fontWeight: 'bold'}}>{s.nisn}</span>
                    </div>
                    <div>
                      <p style={{margin: 0, fontSize: '6px', fontWeight: 'bold', color: '#94a3b8'}}>SECTOR</p>
                      <span style={{fontSize: '10pt', fontWeight: 'bold', fontStyle: 'italic'}}>{s.ruang || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{padding: '8px 15px', backgroundColor: '#f8fafc', fontSize: '7px', color: '#cbd5e1', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between'}}>
                 <span>VERIFIED SYSTEM 2026</span>
                 <span onClick={() => setStudents(students.filter(x => x.id !== s.id))} style={{color: '#f87171', cursor: 'pointer', fontWeight: 'bold'}}>HAPUS</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;