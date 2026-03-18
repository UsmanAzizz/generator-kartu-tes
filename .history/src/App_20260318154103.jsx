import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Import aset dari path lokal D:\DATA2\generator-kartu\src\
import kopImage from './image.png'; 
import dummyFoto from './aji.jpg'; 

function App() {
  // Data Dummy 16 Orang (Cukup untuk 2 Halaman F4)
  const [students] = useState(Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    nama: i % 2 === 0 ? "AJENG SETIA RAHAYU" : "ALYA JESIKA",
    kelas: i % 2 === 0 ? "X AKL" : "XII TJKT 2",
    username: `USER00${i + 1}`,
    password: "1234",
    noPst: `2025/UKK/${100 + i}`,
    foto: dummyFoto
  })));

  const contentRef = useRef(null);

  const downloadPDF = async () => {
    const element = contentRef.current;
    // Ukuran F4 Portrait: 210mm x 330mm
    const pdf = new jsPDF('p', 'mm', [210, 330]); 

    const pages = element.querySelectorAll('.page-break');
    
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { 
        scale: 2.5, // Kualitas tinggi agar tidak pecah saat diprint
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
      gridTemplateColumns: 'repeat(2, 1fr)', // 2 Kolom
      gridTemplateRows: 'repeat(4, 1fr)',    // 4 Baris
      padding: '5mm', 
      boxSizing: 'border-box',
      boxShadow: '0 0 20px rgba(0,0,0,0.5)',
      overflow: 'hidden',
      gap: '0' 
    },
    // AREA GARIS POTONG (PUTUS-PUTUS)
    cardSlot: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '0.4px dashed #bbb', // Garis panduan potong
      boxSizing: 'border-box',
      height: '100%',
      width: '100%',
    },
    // KARTU FISIK
    card: {
      width: '92mm', 
      height: '75mm', 
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '12px', // Sudut membulat seperti contoh
      padding: '3mm',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
    },
    headerKop: {
      width: '100%',
      marginBottom: '6px'
    },
    titleSection: {
      textAlign: 'center',
      marginBottom: '8px'
    },
    titleText: {
      fontSize: '8.5pt',
      fontWeight: 'bold',
      margin: '0',
      lineHeight: '1.2'
    },
    mainContent: {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      paddingLeft: '5px'
    },
    fotoWrapper: {
      width: '22mm',
      height: '28mm',
      border: '1px solid #000',
      backgroundColor: '#f0f0f0',
      flexShrink: 0,
      overflow: 'hidden'
    },
    infoTable: {
      fontSize: '8.5pt',
      fontWeight: '600',
      borderCollapse: 'collapse',
      width: '100%',
    },
    footerArea: {
      marginTop: 'auto',
      textAlign: 'right',
      paddingRight: '10px',
      fontSize: '8pt',
      lineHeight: '1.3'
    },
    signature: {
      fontWeight: 'bold',
      textDecoration: 'underline',
      marginTop: '10mm'
    },
    btnDownload: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 24px',
      backgroundColor: '#27ae60',
      color: 'white',
      border: 'none',
      borderRadius: '30px',
      cursor: 'pointer',
      fontWeight: 'bold',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
      zIndex: 1000
    }
  };

  // Logic membagi data 8 kartu per halaman
  const chunkData = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  const pages = chunkData(students, 8);

  return (
    <div style={styles.wrapper}>
      <button style={styles.btnDownload} onClick={downloadPDF}>
        DOWNLOAD PDF (F4)
      </button>

      <div ref={contentRef}>
        {pages.map((pageStudents, pageIdx) => (
          <div key={pageIdx} className="page-break" style={styles.page}>
            {pageStudents.map((std) => (
              <div key={std.id} style={styles.cardSlot}>
                
                {/* Visual Kartu */}
                <div style={styles.card}>
                  <img src={kopImage} alt="KOP" style={styles.headerKop} />
                  
                  <div style={styles.titleSection}>
                    <p style={styles.titleText}>Kartu Peserta ASTS 2</p>
                    <p style={styles.titleText}>TAHUN PELAJARAN 2025/2026</p>
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
                        <tr>
                          <td width="60">Nama</td>
                          <td width="10">:</td>
                          <td>{std.nama}</td>
                        </tr>
                        <tr>
                          <td>Kelas</td>
                          <td>:</td>
                          <td>{std.kelas}</td>
                        </tr>
                        <tr>
                          <td>Username</td>
                          <td>:</td>
                          <td>{std.username}</td>
                        </tr>
                        <tr>
                          <td>Password</td>
                          <td>:</td>
                          <td>{std.password}</td>
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
  );
}

export default App;