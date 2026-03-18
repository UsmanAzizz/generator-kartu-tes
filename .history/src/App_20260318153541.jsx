import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import kopImage from './image.png'; 
import dummyFoto from './aji.jpg'; 

function App() {
  // 16 Data Dummy untuk 2 halaman (8 kartu per halaman)
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
    // Setting F4 Portrait: 210mm x 330mm
    const pdf = new jsPDF('p', 'mm', [210, 330]); 

    const pages = element.querySelectorAll('.page-break');
    
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { 
        scale: 2.5, // Menaikkan skala agar teks tidak pecah di PDF
        useCORS: true,
        logging: false 
      });
      const imgData = canvas.toDataURL('image/png');
      
      if (i > 0) pdf.addPage('p', 'mm', [210, 330]);
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 330);
    }
    
    pdf.save("kartu-ujikom-f4-portrait.pdf");
  };

  const styles = {
    wrapper: { 
      backgroundColor: '#333', 
      padding: '20px 0', 
      minHeight: '100vh', 
      fontFamily: 'Arial' 
    },
    page: {
      width: '210mm',
      height: '330mm',
      backgroundColor: 'white',
      margin: '0 auto 40px auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)', // 2 Kolom
      gridTemplateRows: 'repeat(4, 1fr)',    // 4 Baris
      padding: '5mm', // Padding halaman agar kartu tidak terlalu mepet pinggir kertas
      boxSizing: 'border-box',
      // JANGAN ADA GARIS LUAR (BORDER), HANYA BAYANGAN UNTUK DI LAYAR
      boxShadow: '0 0 20px rgba(0,0,0,0.5)',
      overflow: 'hidden',
      gap: '0' // Menghilangkan gap agar garis potong saling bertemu
    },
    card: {
      // Tinggi kartu dikunci agar pas 4 baris di F4 (330mm)
      height: '80mm', 
      width: '100%',
      // HANYA GARIS POTONG: tipis dan abu-abu tipis agar halus
      border: '0.1px solid #e0e0e0', 
      padding: '4mm', // Padding dalam kartu
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      backgroundColor: 'white',
      overflow: 'hidden'
    },
    kop: {
      width: '100%',
      display: 'block',
      marginBottom: '4px'
    },
    title: {
      textAlign: 'center',
      fontSize: '8.5pt',
      fontWeight: 'bold',
      textDecoration: 'underline',
      margin: '2px 0',
      textTransform: 'uppercase'
    },
    subTitle: {
      textAlign: 'center',
      fontSize: '7pt',
      fontWeight: 'bold',
      marginBottom: '6px'
    },
    mainContent: {
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-start'
    },
    fotoBox: {
      width: '22mm', // Ukuran foto disesuaikan
      height: '29mm',
      border: '1px solid #000',
      backgroundColor: '#b91c1c', // Background merah foto
      flexShrink: 0,
      overflow: 'hidden'
    },
    table: {
      fontSize: '8.5pt', 
      fontWeight: 'bold',
      borderCollapse: 'collapse',
      width: '100%',
    },
    footer: {
      marginTop: 'auto', // Dorong ke paling bawah kartu
      textAlign: 'right',
      paddingRight: '5px',
      lineHeight: '1.2'
    },
    signatureName: {
      fontSize: '7.5pt', 
      fontWeight: 'bold', 
      textDecoration: 'underline',
      marginTop: '10mm' // Ruang kosong tanda tangan
    }
  };

  // Membagi data menjadi kelompok 8 per halaman
  const chunks = [];
  for (let i = 0; i < students.length; i += 8) {
    chunks.push(students.slice(i, i + 8));
  }

  return (
    <div style={styles.wrapper}>
      <button style={styles.btnFloating} onClick={downloadPDF}>
        EXPORT PDF F4 (PORTRAIT)
      </button>
      
      <div ref={contentRef}>
        {chunks.map((pageData, pageIdx) => (
          <div key={pageIdx} className="page-break" style={styles.page}>
            {pageData.map(std => (
              <div key={std.id} style={styles.card}>
                {/* Image KOP dari src/image.png */}
                <img src={kopImage} style={styles.kop} alt="KOP" />
                
                <p style={styles.title}>KARTU PESERTA</p>
                <p style={styles.subTitle}>UJI KOMPETENSI KEAHLIAN</p>

                <div style={styles.mainContent}>
                  <div style={styles.fotoBox}>
                    <img 
                      src={std.foto} 
                      style={{width:'100%', height:'100%', objectFit:'cover'}} 
                      alt="Foto" 
                    />
                  </div>
                  <table style={styles.table}>
                    <tbody>
                      <tr>
                        <td style={styles.tdLabel}>NAMA</td>
                        <td style={{width: '5px'}}>:</td>
                        <td style={styles.tdValue}>{std.nama}</td>
                      </tr>
                      <tr>
                        <td style={styles.tdLabel}>KELAS</td>
                        <td>:</td>
                        <td style={styles.tdValue}>{std.kelas}</td>
                      </tr>
                      <tr>
                        <td style={styles.tdLabel}>NO. PST</td>
                        <td>:</td>
                        <td style={styles.tdValue}>{std.noPst}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={styles.footer}>
                  <div style={{fontSize: '7.5pt', marginRight: '30px'}}>Kepala Sekolah</div>
                  <div style={{height: '12mm'}}></div>
                  <div style={{fontSize: '7.5pt', fontWeight: 'bold', textDecoration: 'underline'}}>
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