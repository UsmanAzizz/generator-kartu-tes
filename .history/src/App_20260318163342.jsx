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

  // MENGUNCI SCROLL BROWSER TOTAL
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    };
  }, []);

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
      height: '100vh',           // Tinggi tepat satu layar
      width: '100vw',            // Lebar tepat satu layar
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden',        // MATIKAN SCROLL DI SINI
      position: 'fixed',         // Kunci posisi agar tidak bergeser
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    // Container kartu tetap ada di DOM tapi tidak bisa di-scroll manual oleh user
    // html2canvas tetap bisa mengambil data meskipun elemennya 'hidden' atau di luar viewport
    containerHide: {
      position: 'absolute',
      top: '100vh',              // Lempar ke bawah layar agar tidak terlihat
      left: 0
    },
    page: {
      width: '210mm',
      height: '330mm',
      backgroundColor: 'white',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)', 
      gridTemplateRows: 'repeat(4, 1fr)',
      boxSizing: 'border-box',
      overflow: 'hidden',
    },
    cardSlot: (index) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      height: '100%',
      width: '100%',
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
    },
    headerKop: { width: '100%', height: '70px', marginBottom: '6px' },
    titleSection: { textAlign: 'center', marginBottom: '8px' },
    titleText: { fontSize: '9pt', fontWeight: 'bold', margin: '0', lineHeight: '1.2', color: '#000' },
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
      height: '90%',
      textAlign: 'left',
      borderCollapse: 'collapse',
      color: '#000'
    },
    footerArea: {
      marginTop: 'auto',
      textAlign: 'right',
      fontSize: '8pt',
      lineHeight: '1.1',
      color: '#000'
    },
    signature: { fontWeight: 'bold', marginTop: '10mm' },
    btnDownload: {
      padding: '15px 30px',
      fontSize: '16px',
      backgroundColor: '#27ae60', 
      color: 'white', 
      border: 'none', 
      borderRadius: '8px',
      cursor: 'pointer', 
      fontWeight: 'bold',
      marginTop: 'auto',
      marginBottom: 'auto' // Menaruh tombol di tengah layar yang kosong
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
      <h2 style={{color: 'white', marginTop: '20px'}}>Sistem Cetak Kartu UKK</h2>
      <p style={{color: '#ccc'}}>Klik tombol di bawah untuk mengunduh PDF F4</p>
      
      <button style={styles.btnDownload} onClick={downloadPDF}>
        DOWNLOAD PDF (F4)
      </button>

      {/* Konten kartu disembunyikan dari pandangan mata tapi tetap ada untuk PDF */}
      <div style={styles.containerHide}>
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
      </div>
    </div>
  );
}

export default App;