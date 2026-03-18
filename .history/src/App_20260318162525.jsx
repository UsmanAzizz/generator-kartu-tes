import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import kopImage from './image.png'; 
import dummyFoto from './aji.jpg'; 

function App() {
  const [students] = useState(Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    nama: i % 2 === 0 ? "AJENG SETIA RAHAYU" : "ALYA JESIKA",
    kelas: i % 2 === 0 ? "X AKL" : "XII TJKT 2",
    username: `PESERTA ${i + 1}`,
 
    noPst: `2025/UKK/${100 + i}`,
    foto: dummyFoto
  })));

  const contentRef = useRef(null);

  const downloadPDF = async () => {
    const element = contentRef.current;
    const pdf = new jsPDF('p', 'mm', [210, 330]); 

    const pages = element.querySelectorAll('.page-break');
    
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { 
        scale: 3, 
        useCORS: true,
        logging: false 
      });
      const imgData = canvas.toDataURL('image/png');
      if (i > 0) pdf.addPage('p', 'mm', [210, 330]);
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 330);
    }
    pdf.save("kartu-peserta-ukk-f4.pdf");
  };

  const styles = {
    wrapper: { 
      backgroundColor: '#525659', 
      padding: '40px 0', 
      minHeight: '100vh', 
      fontFamily: 'Arial, sans-serif' 
    },
    page: {
      width: '210mm',
      height: '330mm',
      backgroundColor: 'white',
      margin: '0 auto 40px auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)', 
      gridTemplateRows: 'repeat(4, 1fr)',
      boxSizing: 'border-box',
      boxShadow: '0 0 20px rgba(0,0,0,0.5)',
      overflow: 'hidden',
    },
    // LOGIKA GARIS POTONG DALAM SAJA
    cardSlot: (index) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      height: '100%',
      width: '100%',
      // Garis putus-putus hanya di sisi dalam (tengah horizontal & vertikal)
      borderRight: (index % 2 === 0) ? '0.5mm dashed #ccc' : 'none', 
      borderBottom: (index < 6) ? '0.5mm dashed #ccc' : 'none',
    }),
    card: {
      width: '99mm', 
      height: '78mm', 
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '10px',
      padding: '2mm',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)', 
    },
    headerKop: { width: '100%', marginBottom: '6px' },
    titleSection: { textAlign: 'center', marginBottom: '8px' },
    titleText: { fontSize: '9pt', fontWeight: 'bold', margin: '0', lineHeight: '1.2',   color: '#000' },
    mainContent: { display: 'flex', gap: '12px', marginTop: '5px' },
    fotoWrapper: {
      width: '18mm',
      height: '24mm',
      flexShrink: 0,
      overflow: 'hidden',
      marginLeft: '1.5mm'
    },
  infoTable: { 
      fontSize: '9pt', 
      width: '100%',
      height: '100%',
      textAlign: 'left',
      borderCollapse: 'collapse',
      color: '#000'
   
    },
    footerArea: {
      marginTop: 'auto',
      textAlign: 'right',
      fontSize: '8pt',
      lineHeight: '1.2',
        color: '#000'
    },
    signature: { fontWeight: 'bold', marginTop: '10mm' },
    btnDownload: {
      position: 'fixed', top: '20px', right: '20px', padding: '12px 24px',
      backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '30px',
      cursor: 'pointer', fontWeight: 'bold', zIndex: 1000
    }
  };

  const chunkData = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  const pages = chunkData(students, 8);

  return (
    <div style={styles.wrapper}>
      <button style={styles.btnDownload} onClick={downloadPDF}>DOWNLOAD PDF F4</button>
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
                  {/* Kotak Ruang seperti di contoh */}
            
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
    </div>
  );
}

export default App;