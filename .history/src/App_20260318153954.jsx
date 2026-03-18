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
      gridTemplateColumns: 'repeat(2, 1fr)', 
      gridTemplateRows: 'repeat(4, 1fr)',
      padding: '5mm', 
      boxSizing: 'border-box',
      boxShadow: '0 0 20px rgba(0,0,0,0.5)',
      overflow: 'hidden',
      // Gunakan gap untuk memberikan ruang bagi garis potong putus-putus
      gap: '0', 
    },
    cardContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // Garis putus-putus di sekeliling area kartu sebagai panduan potong
      border: '0.5px dashed #ccc', 
      boxSizing: 'border-box',
      height: '100%',
      width: '100%',
    },
    card: {
      // Ukuran kartu sedikit lebih kecil dari kontainer agar tidak menempel ke garis potong
      width: '92%', 
      height: '92%', 
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px', // Sudut membulat sesuai contoh
      padding: '4mm',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)', // Bayangan halus
    },
    kop: {
      width: '100%',
      marginBottom: '4px'
    },
    title: {
      textAlign: 'center',
      fontSize: '8.5pt',
      fontWeight: 'bold',
      margin: '2px 0',
      textTransform: 'uppercase'
    },
    subTitle: {
      textAlign: 'center',
      fontSize: '7.5pt',
      fontWeight: 'bold',
      marginBottom: '5px'
    },
    mainContent: {
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-start',
      marginTop: '5px'
    },
    fotoBox: {
      width: '22mm',
      height: '30mm',
      border: '1px solid #000',
      backgroundColor: '#b91c1c',
      flexShrink: 0
    },
    table: {
      fontSize: '8.5pt',
      fontWeight: 'bold',
      borderCollapse: 'collapse',
      width: '100%',
    },
    footer: {
      marginTop: 'auto',
      textAlign: 'right',
      paddingRight: '10px',
      position: 'relative'
    },
    signatureName: {
      fontSize: '8pt',
      fontWeight: 'bold',
      textDecoration: 'underline',
      marginTop: '12mm'
    }
  };

  // Di bagian Return, ubah struktur pemetaan kartu menjadi:
  return (
    <div style={styles.wrapper}>
      <button style={styles.btnFloating} onClick={downloadPDF}>EXPORT PDF F4</button>
      
      <div ref={contentRef}>
        {chunks.map((pageData, pageIdx) => (
          <div key={pageIdx} className="page-break" style={styles.page}>
            {pageData.map(std => (
              /* Kontainer Garis Potong */
              <div key={std.id} style={styles.cardContainer}>
                
                /* Visual Kartu Asli */
                <div style={styles.card}>
                  <img src={kopImage} style={styles.kop} alt="KOP" />
                  
                  <p style={styles.title}>KARTU PESERTA</p>
                  <p style={styles.subTitle}>UJI KOMPETENSI KEAHLIAN</p>

                  <div style={styles.mainContent}>
                    <div style={styles.fotoBox}>
                      <img src={std.foto} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="Foto" />
                    </div>
                    <table style={styles.table}>
                      <tbody>
                        <tr><td width="50">NAMA</td><td width="5">:</td><td>{std.nama}</td></tr>
                        <tr><td>KELAS</td><td>:</td><td>{std.kelas}</td></tr>
                        <tr><td>NO. PST</td><td>:</td><td>{std.noPst}</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div style={styles.footer}>
                    <div style={{fontSize: '7.5pt', marginRight: '20px'}}>Kepala Sekolah,</div>
                    <div style={styles.signatureName}>Lestari Kurniawati, S.Pd.</div>
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