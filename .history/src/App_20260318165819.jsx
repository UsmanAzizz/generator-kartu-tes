import { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

import kopImage from './image.png'; 
import dummyFoto from './aji.jpg'; 

function App() {
  const [students, setStudents] = useState([]);
  const [photoMap, setPhotoMap] = useState({});
  const contentRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  // --- LOGIKA IMPORT ---

const downloadTemplate = () => {
  const data = [
    { Nama: "AJENG SETIA RAHAYU", Kelas: "X AKL", No_Pst: "2025/UKK/101" }, // Header adalah No_Pst
  ];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data_Siswa");
    XLSX.writeFile(workbook, "template_ukk.xlsx");
  };

const handleExcelUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    const bstr = evt.target.result;
    const wb = XLSX.read(bstr, { type: 'binary' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws);
    
    const mapped = data.map((item, index) => ({
      id: index + 1,
      nama: item.Nama || item.nama || "NAMA TIDAK ADA",
      kelas: item.Kelas || item.kelas || "-",
      // Coba baca No_Pst atau No_pst atau No Pst
      username: item.No_Pst || item.No_pst || item['No Pst'] || item['Nomor Peserta'] || "-", 
    }));
    setStudents(mapped);
  };
  reader.readAsBinaryString(file);
};

  const handleFolderUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotoMap = {};
    files.forEach(file => {
      const nameOnly = file.name.replace(/\.[^/.]+$/, "").toUpperCase().trim();
      newPhotoMap[nameOnly] = URL.createObjectURL(file);
    });
    setPhotoMap(newPhotoMap);
  };

  const downloadPDF = async () => {
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

  // --- STYLING (MEMPERTAHANKAN PREVIEW ANDA) ---

  const styles = {
    wrapper: { 
      backgroundColor: '#525659', 
      height: '100vh', 
      width: '100vw', 
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden', 
      display: 'flex' 
    },
    sidebar: {
      width: '300px',
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      zIndex: 1000,
      boxShadow: '2px 0 10px rgba(0,0,0,0.3)'
    },
    previewArea: {
      flex: 1,
      overflowY: 'auto',
      padding: '40px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
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
    sideBtn: { padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#3498db', color: 'white' }
  };

  const chunkData = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
  };

  const pages = chunkData(students, 8);

  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR PANEL */}
      <div style={styles.sidebar}>
        <h3 style={{margin: '0 0 10px 0'}}>Panel Admin</h3>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
          <label style={{fontSize: '11px', color: '#bdc3c7'}}>1. Format Data</label>
          <button style={styles.sideBtn} onClick={downloadTemplate}>Download Template Excel</button>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
          <label style={{fontSize: '11px', color: '#bdc3c7'}}>2. Import Excel</label>
          <input type="file" accept=".xlsx" onChange={handleExcelUpload} style={{fontSize: '12px'}} />
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
          <label style={{fontSize: '11px', color: '#bdc3c7'}}>3. Import Folder Foto</label>
          <input type="file" webkitdirectory="true" multiple onChange={handleFolderUpload} style={{fontSize: '12px'}} />
          <small style={{fontSize: '9px', color: '#ecf0f1'}}>*Nama file harus sama dengan Nama Siswa</small>
        </div>

        <button 
          style={{...styles.sideBtn, backgroundColor: '#27ae60', marginTop: 'auto', fontSize: '16px'}} 
          onClick={downloadPDF}
        >
          CETAK PDF F4
        </button>
      </div>

      {/* PREVIEW AREA (TETAP SEPERTI ASLI) */}
      <div style={styles.previewArea}>
        <div ref={contentRef}>
          {pages.map((pageStudents, pageIdx) => (
            <div key={pageIdx} className="page-break" style={styles.page}>
              {pageStudents.map((std, index) => {
                const photoSrc = photoMap[std.nama.toUpperCase().trim()] || dummyFoto;
                return (
                  <div key={std.id} style={styles.cardSlot(index)}>
                    <div style={styles.card}>
                      <img src={kopImage} alt="KOP" style={styles.headerKop} />
                      <div style={styles.titleSection}>
                        <p style={styles.titleText}>KARTU PESERTA</p>
                        <p style={styles.titleText}>UJI KOMPETENSI KEAHLIAN</p>
                      </div>
                      <div style={styles.mainContent}>
                        <div style={styles.fotoWrapper}>
                          <img src={photoSrc} alt="User" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
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
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;