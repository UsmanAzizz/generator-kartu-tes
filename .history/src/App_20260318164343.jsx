import { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

import kopImage from './image.png'; 
import dummyFoto from './aji.jpg'; 

function App() {
  // State students sekarang dinamis dari Excel
  const [students, setStudents] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  // --- LOGIKA EXCEL ---
  
  // 1. Download Template Excel
  const downloadTemplate = () => {
    const data = [
      { Nama: "AJENG SETIA RAHAYU", Kelas: "X AKL", Nomor_Peserta: "PESERTA 01" },
      { Nama: "ALYA JESIKA", Kelas: "XII TJKT 2", Nomor_Peserta: "PESERTA 02" }
    ];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "template_peserta_ukk.xlsx");
  };

  // 2. Unggah File Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      // Mapping data Excel ke format Card
      const mappedData = data.map((item, index) => ({
        id: index + 1,
        nama: item.Nama || "Tanpa Nama",
        kelas: item.Kelas || "-",
        username: item.Nomor_Peserta || "-",
        foto: dummyFoto // Default foto karena Excel tidak menyimpan gambar
      }));

      setStudents(mappedData);
    };
    reader.readAsBinaryString(file);
  };

  const downloadPDF = async () => {
    if (students.length === 0) return alert("Unggah data Excel terlebih dahulu!");
    const element = contentRef.current;
    const pdf = new jsPDF('p', 'mm', [210, 330]); 
    const pages = element.querySelectorAll('.page-break');
    
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { scale: 3, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      if (i > 0) pdf.addPage('p', 'mm', [210, 330]);
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 330);
    }
    pdf.save("kartu-peserta-ukk-f4.pdf");
  };

  const styles = {
    wrapper: { 
      backgroundColor: '#525659', 
      height: '100vh', 
      width: '100vw',
      fontFamily: 'Arial, sans-serif',
      display: 'flex', // Menggunakan flex untuk sidebar & content
      overflow: 'hidden',
    },
    sidebar: {
      width: '300px',
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '25px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
      zIndex: 100
    },
    previewArea: {
      flex: 1,
      overflowY: 'auto', 
      padding: '40px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    sideBtn: {
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: '0.3s'
    },
    page: {
      width: '210mm', height: '330mm',
      backgroundColor: 'white', marginBottom: '40px',
      display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(4, 1fr)',
      boxSizing: 'border-box', boxShadow: '0 0 20px rgba(0,0,0,0.5)',
      overflow: 'hidden', flexShrink: 0 
    },
    cardSlot: (index) => ({
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxSizing: 'border-box', height: '100%', width: '100%',
      borderRight: (index % 2 === 0) ? '0.5mm dashed #ccc' : 'none', 
      borderBottom: (index < 6) ? '0.5mm dashed #ccc' : 'none',
    }),
    card: {
      width: '99mm', height: '78mm', backgroundColor: 'white', border: '1px solid #ddd',
      borderRadius: '10px', padding: '2mm', boxSizing: 'border-box', display: 'flex',
      flexDirection: 'column', position: 'relative',
    },
    headerKop: { width: '100%', height: '70px', marginBottom: '6px' },
    titleSection: { textAlign: 'center', marginBottom: '8px' },
    titleText: { fontSize: '9pt', fontWeight: 'bold', margin: '0', lineHeight: '1.2', color: '#000' },
    mainContent: { display: 'flex', gap: '12px', marginTop: '5px' },
    fotoWrapper: { width: '18mm', height: '24mm', flexShrink: 0, overflow: 'hidden', marginLeft: '1.5mm' },
    infoTable: { fontSize: '9pt', width: '100%', height: '90%', textAlign: 'left', borderCollapse: 'collapse', color: '#000' },
    footerArea: { marginTop: 'auto', textAlign: 'right', fontSize: '8pt', lineHeight: '1.1', color: '#000' },
    signature: { fontWeight: 'bold', marginTop: '10mm' },
  };

  const chunkData = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
  };

  const pages = chunkData(students, 8);

  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR PANEL */}
      <div style={styles.sidebar}>
        <h2 style={{fontSize: '1.2rem', marginBottom: '10px'}}>Panel Kontrol</h2>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
          <label style={{fontSize: '0.8rem', color: '#bdc3c7'}}>Langkah 1:</label>
          <button style={{...styles.sideBtn, backgroundColor: '#34495e', color: 'white'}} onClick={downloadTemplate}>
            Download Template
          </button>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
          <label style={{fontSize: '0.8rem', color: '#bdc3c7'}}>Langkah 2:</label>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} style={{fontSize: '0.8rem'}} />
        </div>

        <div style={{marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <hr style={{borderColor: '#7f8c8d', width: '100%'}} />
          <button style={{...styles.sideBtn, backgroundColor: '#27ae60', color: 'white'}} onClick={downloadPDF}>
            Download PDF (F4)
          </button>
          <p style={{fontSize: '0.7rem', textAlign: 'center', color: '#bdc3c7'}}>Total: {students.length} Siswa</p>
        </div>
      </div>
      
      {/* AREA PREVIEW */}
      <div style={styles.previewArea}>
        {students.length === 0 ? (
          <div style={{color: 'white', marginTop: '20%'}}>Silahkan unggah file Excel untuk melihat pratinjau.</div>
        ) : (
          <div ref={contentRef}>
            {pages.map((pageStudents, pageIdx) => (
              <div key={pageIdx} className="page-break" style={styles.page}>
                {pageStudents.map((std, index) => (
                  <div key={std.id} style={styles.cardSlot(index)}>
                    <div style={styles.card}>
                      <img src={kopImage} alt="KOP" style={styles.headerKop} />
                      <div style={styles.titleSection}>
                        <p style={styles.titleText}>KARTU PESERTA</p>
                        <p style={styles.titleText}>UJI KOMPETENSI KEAHLIAN</p>
                      </div>
                      <div style={styles.mainContent}>
                        <div style={styles.fotoWrapper}>
                          <img src={std.foto} alt="User" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        </div>
                        <table style={styles.infoTable}>
                          <tbody>
                            <tr><td width="60">Nama</td><td width="10">:</td><td>{std.nama}</td></tr>
                            <tr><td>Kelas</td><td>:</td><td>{std.kelas}</td></tr>
                            <tr><td>No. Pst.</td><td>:</td><td>{std.username}</td></tr>
                          </tbody>
                        </table>
                      </div>
                      <div style={styles.footerArea}>
                        <div>Cipari, 18 Maret 2026</div>
                        <div>Kepala Sekolah,</div>
                        <div style={styles.signature}>Lestari Kurniawati, S.Pd.</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;