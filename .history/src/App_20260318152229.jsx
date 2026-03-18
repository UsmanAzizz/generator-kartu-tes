import { useState } from 'react';
// Pastikan file aji.jpg ada di folder src/
import dummyFoto from './aji.jpg'; 

function App() {
  // Data Dummy agar kita bisa fokus ke visual desain
  const dummyData = {
    lembaga: "LEMBAGA PENDIDIKAN MA'ARIF NU PCNU KABUPATEN CILACAP",
    sekolah: "SMK DIPONEGORO CIPARI",
    alamat: "Jl. Diponegoro Desa Cipari Kecamatan Cipari Kabupaten Cilacap 53262",
    email: "smkdiponegorocipari@gmail.com",
    web: "smkdiponegorocipari.sch.id",
    nama: "SURYA SEPTA DWI PRAYOGI",
    kelas: "XII TJKT 2",
    noPst: "2025/TJKT/55",
    kepalaSekolah: "Lestari Kurniawati, S.Pd."
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#333',
      padding: '20px'
    },
    // Ukuran 1 kartu (sekitar 1/6 A4)
    card: {
      width: '95mm', // Sedikit lebih lebar agar teks tidak sesak
      height: '65mm',
      backgroundColor: 'white',
      border: '1px solid #000',
      padding: '8px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      fontFamily: '"Arial", sans-serif',
      backgroundImage: 'linear-gradient(135deg, transparent 70%, #e1f5fe 100%)', // Efek watermark tipis
    },
    header: {
      textAlign: 'center',
      borderBottom: '1.5px solid #000',
      paddingBottom: '4px',
      marginBottom: '6px',
      position: 'relative'
    },
    logoPlaceholder: {
      position: 'absolute',
      left: '0',
      top: '0',
      width: '40px',
      height: '40px',
      border: '1px dashed #ccc' // Tempat logo NU & SMK
    },
    namaLembaga: {
      fontSize: '7.5pt',
      fontWeight: 'bold',
      margin: '0',
      letterSpacing: '0.2px'
    },
    namaSekolah: {
      fontSize: '10pt',
      fontWeight: 'bold',
      margin: '2px 0',
      color: '#065f46' // Hijau gelap khas Ma'arif
    },
    alamat: {
      fontSize: '5.5pt',
      margin: '0',
      lineHeight: '1.2'
    },
    titleSection: {
      textAlign: 'center',
      marginTop: '2px'
    },
    titleMain: {
      fontSize: '9pt',
      fontWeight: 'bold',
      textDecoration: 'underline',
      margin: '0'
    },
    titleSub: {
      fontSize: '8pt',
      fontWeight: 'bold',
      margin: '2px 0 8px 0'
    },
    content: {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start'
    },
    fotoBox: {
      width: '24mm',
      height: '32mm',
      border: '1px solid #000',
      backgroundColor: '#b91c1c', // Merah bendera/background foto
      overflow: 'hidden',
      flexShrink: 0
    },
    fotoImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    table: {
      fontSize: '9pt',
      fontWeight: 'bold',
      borderCollapse: 'collapse',
      marginTop: '5px'
    },
    tdLabel: {
      padding: '2px 0',
      verticalAlign: 'top',
      width: '60px'
    },
    tdSeparator: {
      padding: '2px 4px',
      verticalAlign: 'top'
    },
    tdValue: {
      padding: '2px 0',
      verticalAlign: 'top'
    },
    footer: {
      marginTop: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      paddingRight: '15px'
    },
    signatureTitle: {
      fontSize: '8pt',
      marginRight: '35px'
    },
    signatureName: {
      fontSize: '8pt',
      fontWeight: 'bold',
      textDecoration: 'underline',
      marginTop: '30px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* KOP SURAT */}
        <div style={styles.header}>
          <div style={styles.logoPlaceholder}>
             <span style={{fontSize: '5px'}}>LOGO</span>
          </div>
          <p style={styles.namaLembaga}>{dummyData.lembaga}</p>
          <p style={styles.namaSekolah}>{dummyData.sekolah}</p>
          <p style={styles.alamat}>{dummyData.alamat}</p>
          <p style={{...styles.alamat, fontSize: '5pt'}}>
             Email: {dummyData.email} | Web: {dummyData.web}
          </p>
        </div>

        {/* JUDUL KARTU */}
        <div style={styles.titleSection}>
          <p style={styles.titleMain}>KARTU PESERTA</p>
          <p style={styles.titleSub}>UJI KOMPETENSI KEAHLIAN</p>
        </div>

        {/* ISI DATA */}
        <div style={styles.content}>
          <div style={styles.fotoBox}>
            <img src={dummyFoto} alt="Foto Peserta" style={styles.fotoImg} />
          </div>
          
          <table style={styles.table}>
            <tbody>
              <tr>
                <td style={styles.tdLabel}>NAMA</td>
                <td style={styles.tdSeparator}>:</td>
                <td style={styles.tdValue}>{dummyData.nama}</td>
              </tr>
              <tr>
                <td style={styles.tdLabel}>KELAS</td>
                <td style={styles.tdSeparator}>:</td>
                <td style={styles.tdValue}>{dummyData.kelas}</td>
              </tr>
              <tr>
                <td style={styles.tdLabel}>NO. PST</td>
                <td style={styles.tdSeparator}>:</td>
                <td style={styles.tdValue}>{dummyData.noPst}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* TANDA TANGAN */}
        <div style={styles.footer}>
          <span style={styles.signatureTitle}>Kepala Sekolah</span>
          <span style={styles.signatureName}>{dummyData.kepalaSekolah}</span>
        </div>
      </div>
    </div>
  );
}

export default App;