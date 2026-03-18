import { useState, useRef, useEffect } from 'react';
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

  // Efek untuk mengunci scroll pada level browser (body/html)
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const downloadPDF = async () => {
    const element = contentRef.current;
    const pdf = new jsPDF('p', 'mm', [210, 330]); 
    const pages = element.querySelectorAll('.page-break');
    
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { 
        scale: 2, // Scale 2 cukup untuk cetak tajam & hemat memori
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
    // Wrapper utama: Menutupi seluruh layar tanpa ampun
    wrapper: { 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#525659', 
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden', // Matikan scroll luar
      display: 'flex',
      flexDirection: 'column'
    },
    // Area ini adalah SATU-SATUNYA tempat scroll yang diizinkan
    mainViewer: {
      flex: 1,
      overflowY: 'auto', // Hanya ada satu scrollbar di sini
      padding: '20px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    page: {
      width: '210mm',
      height: '330mm',
      backgroundColor: 'white',
      marginBottom: '40px',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)', 
      gridTemplateRows: 'repeat(4, 1fr)',
      boxSizing: 'border-box',
      boxShadow: '0 0 15px rgba(0,0,0,0.3)',
      // Hilangkan overflow agar tidak ada scroll kecil di dalam halaman
      overflow: 'hidden', 
      flexShrink: 0 // Cegah flexbox mengecilkan halaman
    },
    cardSlot: (index) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      borderRight: (index % 2 === 0) ? '0.5mm dashed #ccc' : 'none', 
      borderBottom: (index < 6) ? '0.5mm dashed #ccc' : 'none',
    }),
    card: {
      width: '99mm', 
      height: '78mm', 
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '2.5mm',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
    },
    headerKop: { width: '100%', height: 'auto', maxHeight: '65px', marginBottom: '5px' },
    titleSection: { textAlign: 'center', marginBottom: '5px' },
    titleText: { fontSize: '9pt', fontWeight: 'bold', margin: '0', color: '#000' },
    mainContent: { display: 'flex', gap: '10px', marginTop: '5px' },
    fotoWrapper: {
      width: '20mm',
      height: '25mm',
      border: '1px solid #333',
      flexShrink: 0,
    },
    infoTable: { 
      fontSize: '8.5pt', 
      width: '100%',
      color: '#000',
      borderCollapse: 'collapse'
    },
    footerArea: {
      marginTop: 'auto',
      textAlign: 'right',
      fontSize: '8pt',
      color: '#000',
      paddingRight: '3mm'
    },
    signature: { fontWeight: 'bold', marginTop: '10mm' },
    btnDownload: {
      position: 'fixed', 
      bottom: '30px', 
      right: '30px', 
      padding: '15px 30px',
      backgroundColor: '#2ecc71', 
      color: 'white', 
      border: 'none', 
      borderRadius: '50px',
      cursor: 'pointer', 
      fontWeight: 'bold', 
      zIndex: 2000, 
      boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
      fontSize: '14px'
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
      <button style={styles.btnDownload} onClick={downloadPDF}>
        CETAK PDF (F4)
      </button>

      {/* Main Viewer hanya satu scrollbar di sini */}
      <div style={styles.mainViewer}>
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
                        <img 
                          src={std.foto} 
                          alt="User" 
                          style={{width: '100%', height: '100%', objectFit: 'cover'}} 
                        />
                      </div>
                      <table style={styles.infoTable}>
                        <tbody>
                          <tr style={{height: '20px'}}>
                            <td width="50">Nama</td><td width="5">:</td>
                            <td style={{fontWeight: 'bold'}}>{std.nama}</td>
                          </tr>
                          <tr style={{height: '20px'}}>
                            <td>Kelas</td><td>:</td>
                            <td>{std.kelas}</td>
                          </tr>
                          <tr style={{height: '20px'}}>
                            <td>No. Pst</td><td>:</td>
                            <td>{std.username}</td>
                          </tr>
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
      </div>
    </div>
  );
}

export default App;