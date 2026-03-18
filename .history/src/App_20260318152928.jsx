import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import kopImage from './image.png'; // Path: D:\DATA2\generator-kartu\src\image.png
import dummyFoto from './aji.jpg'; // Path: D:\DATA2\generator-kartu\src\aji.jpg

function App() {
  // Generate 16 Data Dummy (2 Halaman x 8 Kartu)
  const [students] = useState(Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    nama: i % 2 === 0 ? "SURYA SEPTA DWI PRAYOGI" : "VIVI MAY KUMALASARI",
    kelas: "XII TJKT 2",
    noPst: `2025/TJKT/${50 + i}`,
    foto: dummyFoto
  })));

  const contentRef = useRef(null);

  const downloadPDF = async () => {
    const element = contentRef.current;
    const pdf = new jsPDF('l', 'mm', [330, 210]); // F4 Landscape

    // Ambil semua halaman (grid-container)
    const pages = element.querySelectorAll('.page-break');
    
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { 
        scale: 2, 
        useCORS: true,
        logging: false 
      });
      const imgData = canvas.toDataURL('image/png');
      
      if (i > 0) pdf.addPage('l', 'mm', [210, 330]);
      pdf.addImage(imgData, 'PNG', 0, 0, 330, 210);
    }
    
    pdf.save("kartu-ujikom-f4.pdf");
  };

  const styles = {
    wrapper: { backgroundColor: '#525659', padding: '40px 0', minHeight: '100vh', fontFamily: 'Arial' },
    // Container Kertas F4 Landscape
    page: {
      width: '330mm',
      height: '210mm',
      backgroundColor: 'white',
      margin: '0 auto 20px auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)', // 4 Kolom
      gridTemplateRows: 'repeat(2, 1fr)',    // 2 Baris
      padding: '5mm',
      boxSizing: 'border-box',
      boxShadow: '0 0 10px rgba(0,0,0,0.5)',
      overflow: 'hidden'
    },
    // Desain Kartu Individu
    card: {
      border: '0.5px solid #000', // Garis potong
      padding: '5mm',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      height: '100mm' // Menyesuaikan grid agar pas di F4
    },
    kop: {
      width: '100%',
      marginBottom: '5px'
    },
    title: {
      textAlign: 'center',
      fontSize: '9pt',
      fontWeight: 'bold',
      textDecoration: 'underline',
      margin: '2px 0'
    },
    subTitle: {
      textAlign: 'center',
      fontSize: '8pt',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    mainContent: {
      display: 'flex',
      gap: '8px'
    },
    fotoBox: {
      width: '20mm',
      height: '28mm',
      border: '1px solid #000',
      backgroundColor: 'red',
      flexShrink: 0
    },
    table: {
      fontSize: '8pt',
      fontWeight: 'bold',
      borderCollapse: 'collapse',
      width: '100%'
    },
    footer: {
      marginTop: 'auto',
      textAlign: 'right',
      paddingRight: '10px'
    },
    btnFloating: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 24px',
      backgroundColor: '#2ecc71',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
      zIndex: 1000
    }
  };

  // Helper untuk membagi data per 8 kartu
  const chunks = [];
  for (let i = 0; i < students.length; i += 8) {
    chunks.push(students.slice(i, i + 8));
  }

  return (
    <div style={styles.wrapper}>
      <button style={styles.btnFloating} onClick={downloadPDF}>GENERATE PDF F4</button>
      
      <div ref={contentRef}>
        {chunks.map((pageData, pageIdx) => (
          <div key={pageIdx} className="page-break" style={styles.page}>
            {pageData.map(std => (
              <div key={std.id} style={styles.card}>
                {/* Image KOP dari src/image.png */}
                <img src={kopImage} style={styles.kop} alt="KOP Surat" />
                
                <p style={styles.title}>KARTU PESERTA</p>
                <p style={styles.subTitle}>UJI KOMPETENSI KEAHLIAN</p>

                <div style={styles.mainContent}>
                  <div style={styles.fotoBox}>
                    <img src={std.foto} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="Foto" />
                  </div>
                  <table style={styles.table}>
                    <tbody>
                      <tr>
                        <td width="45">NAMA</td>
                        <td width="5">:</td>
                        <td>{std.nama}</td>
                      </tr>
                      <tr>
                        <td>KELAS</td>
                        <td>:</td>
                        <td>{std.kelas}</td>
                      </tr>
                      <tr>
                        <td>NO. PST</td>
                        <td>:</td>
                        <td>{std.noPst}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={styles.footer}>
                  <div style={{fontSize: '7pt'}}>Kepala Sekolah</div>
                  <div style={{height: '10mm'}}></div>
                  <div style={{fontSize: '7pt', fontWeight: 'bold', textDecoration: 'underline'}}>
                    Lestari Kurniawati, S.Pd.
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