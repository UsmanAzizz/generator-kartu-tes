import { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

import kopImage from './image.png'; 
// dummyFoto (aji.jpg) dihapus/tidak digunakan
import bgCard from './bg.png'; 

function App() {
  const [students, setStudents] = useState([]);
  const [photoMap, setPhotoMap] = useState({});
  const contentRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const downloadTemplate = () => {
    const data = [{ Nama: "ALYA JESIKA", Kelas: "X AKL", No_Pst: "2025/UKK/101" }];
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
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [210, 330],
      compress: true 
    }); 

    const pages = element.querySelectorAll('.page-break');
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { 
        scale: 2, 
        useCORS: true, 
        logging: false 
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      
      if (i > 0) pdf.addPage('p', 'mm', [210, 330]);
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 330, undefined, 'FAST');
    }
    pdf.save("kartu-peserta-ukk-f4.pdf");
  };

  const styles = {
    wrapper: { backgroundColor: '#525659', height: '100vh', width: '100vw', fontFamily: 'Arial, sans-serif', overflow: 'hidden', display: 'flex' },
    sidebar: { width: '300px', backgroundColor: '#2c3e50', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 1000, boxShadow: '2px 0 10px rgba(0,0,0,0.3)' },
    previewArea: { flex: 1, overflowY: 'auto', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    page: { width: '210mm', height: '330mm', backgroundColor: 'white', marginBottom: '40px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', boxSizing: 'border-box', boxShadow: '0 0 20px rgba(0,0,0,0.5)', overflow: 'hidden', flexShrink: 0 },
    cardSlot: (index) => ({ display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', height: '100%', width: '100%', borderRight: (index % 2 === 0) ? '0.5mm dashed #ccc' : 'none', borderBottom: (index < 6) ? '0.5mm dashed #ccc' : 'none' }),
    card: { 
      width: '99mm', height: '78mm', backgroundColor: 'white', border: '1px solid #ddd', 
      borderRadius: '10px', padding: '2mm', boxSizing: 'border-box', display: 'flex', 
      flexDirection: 'column', position: 'relative', overflow: 'hidden' 
    },
    bgImage: {
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      objectFit: 'cover', opacity: 0.15, zIndex: 0, pointerEvents: 'none'
    },
    cardContent: { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' },
    headerKop: { width: '100%', height: '65px', marginBottom: '6px' },
    titleSection: { textAlign: 'center', marginBottom: '8px' },
    titleText: { fontSize: '9pt', fontWeight: 'bold', margin: '0', lineHeight: '1.2', color: '#000' },
    mainContent: { display: 'flex', gap: '12px', marginTop: '1px' },
    
    // Wrapper foto dengan border hitam tetap tampil meski foto kosong
    fotoWrapper: { 
      width: '18mm', 
      height: '24mm', 
      flexShrink: 0, 
      overflow: 'hidden', 
      marginLeft: '1.5mm', 
      border: '1px solid #000', 
      borderRadius: '5px',
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '6pt',
      color: '#ccc'
    },
    
    infoTable: { 
  fontSize: '9pt', 
  width: '100%', 
  textAlign: 'left', 
  borderCollapse: 'collapse', 
  color: '#000',
  lineHeight: '1.1' // Mengurangi tinggi baris teks
},
// Tambahkan style khusus untuk cell agar jarak atas-bawah minim
infoTd: { 
  paddingTop: '1px', 
  paddingBottom: '1px', 
  verticalAlign: 'top' 
},
    footerArea: { 
      marginTop: 'auto', 
      display: 'flex', 
      justifyContent: 'flex-end', 
      paddingRight: '0mm', 
      fontSize: '8pt', 
      lineHeight: '1.3', 
      color: '#000' 
    },
    footerTextWrapper: {
      textAlign: 'left', 
      minWidth: '38mm'   
    },
    signature: { 
      fontWeight: 'bold', 
      marginTop: '10mm', 
    },
    sideBtn: { padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: '#3498db', color: 'white' }
  };

  const pages = Array.from({ length: Math.ceil(students.length / 8) }, (_, i) => students.slice(i * 8, i * 8 + 8));

 // Logika Tambahan di atas return:
  // Kelompokkan meja (1-20) ke dalam array berisi maks 8 meja per halaman
  const kartuMejaData = Array.from({ length: Math.min(students.length, 20) }).map((_, i) => ({
    nomor: i + 1,
    peserta: students.filter((_, idx) => (idx % 20) === i)
  }));
  const mejaPages = Array.from({ length: Math.ceil(kartuMejaData.length / 8) }, (_, i) => kartuMejaData.slice(i * 8, i * 8 + 8));

  return (
    <div style={styles.wrapper}>
      <div style={styles.sidebar}>
        <h3 style={{ margin: '0 0 10px 0' }}>DIKALA ANDA MAGER BIKIN KARTU MANUAL PAKE EXCEL MENDING NGODING</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '11px', color: '#bdc3c7' }}>1. Format Data</label>
          <button style={styles.sideBtn} onClick={downloadTemplate}>Download Template Excel</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '11px', color: '#bdc3c7' }}>2. Import Excel</label>
          <input type="file" id="excelInput" accept=".xlsx" onChange={handleExcelUpload} style={{ display: 'none' }} />
          <button style={styles.sideBtn} onClick={() => document.getElementById('excelInput').click()}>Pilih File Excel</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '11px', color: '#bdc3c7' }}>3. Import Folder Foto</label>
          <input type="file" id="folderInput" webkitdirectory="true" multiple onChange={handleFolderUpload} style={{ display: 'none' }} />
          <button style={styles.sideBtn} onClick={() => document.getElementById('folderInput').click()}>Pilih Folder Foto</button>
        </div>
        <div style={{ marginTop: 'auto', borderTop: '1px solid #444', paddingTop: '10px' }}>
          <p style={{ fontSize: '12px' }}>Total Data: {students.length} Siswa</p>
          <button style={{ ...styles.sideBtn, backgroundColor: '#27ae60', width: '100%', fontSize: '16px' }} onClick={downloadPDF}>CETAK PDF F4</button>
        </div>
      </div>

      <div style={styles.previewArea}>
        <div ref={contentRef}>
          
          {/* --- BAGIAN 1: KARTU MEJA (MAKS 8 PER HALAMAN) --- */}
          {mejaPages.map((pageMeja, pIdx) => (
            <div key={`meja-page-${pIdx}`} className="page-break" style={styles.page}>
              {pageMeja.map((meja, index) => (
                <div key={`meja-${meja.nomor}`} style={styles.cardSlot(index)}>
                  <div style={{ ...styles.card, border: '2px solid #000' }}>
                 
                    <img src={kopImage} alt="KOP" style={{ ...styles.headerKop, height: '68px' }} />
                    <div style={{ flex: 1, marginTop: '5px', overflow: 'hidden' }}>
                     <div style={{ backgroundColor: '#000', color: '#fff', textAlign: 'center', fontWeight: 'bold', padding: '2px', fontSize: '14pt', marginBottom: '5px' }}>
                      MEJA {meja.nomor}
                    </div>
                      {meja.peserta.map((s, idxS) => (
                        <div key={idxS} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5pt', lineHeight: '1.2', borderBottom: '0.1mm solid #eee', padding: '1px 0', color: '#000' }}>
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%' }}>
                            {s.nama.split(' ').slice(0, 2).join(' ')}
                          </span>
                          <span style={{ fontWeight: 'bold' }}>{s.username}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* --- BAGIAN 2: KARTU PESERTA INDIVIDU (MAKS 8 PER HALAMAN) --- */}
          {pages.map((pageStudents, pageIdx) => (
            <div key={`std-page-${pageIdx}`} className="page-break" style={styles.page}>
              {pageStudents.map((std, index) => {
                const photoSrc = photoMap[std.nama.toUpperCase().trim()] || null;
                return (
                  <div key={std.id} style={styles.cardSlot(index)}>
                    <div style={styles.card}>
                      <img src={bgCard} style={styles.bgImage} alt="" />
                      <div style={styles.cardContent}>
                        <img src={kopImage} alt="KOP" style={styles.headerKop} />
                        <div style={styles.titleSection}>
                          <p style={styles.titleText}>KARTU PESERTA</p>
                          <p style={styles.titleText}>UJI KOMPETENSI KEAHLIAN</p>
                        </div>
                        <div style={styles.mainContent}>
                          <div style={styles.fotoWrapper}>
                            {photoSrc ? (
                              <img src={photoSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="foto" />
                            ) : (
                              <span style={{ fontSize: '8pt', color: '#ccc' }}>3 x 4</span>
                            )}
                          </div>
                         <table style={styles.infoTable}>
  <tbody>
    <tr>
      <td width="60" style={styles.infoTd}>Nama</td>
      <td width="10" style={styles.infoTd}>:</td>
      <td style={styles.infoTd}>{std.nama}</td>
    </tr>
    <tr>
      <td style={styles.infoTd}>Kelas</td>
      <td style={styles.infoTd}>:</td>
      <td style={styles.infoTd}>{std.kelas}</td>
    </tr>
    <tr>
      <td style={styles.infoTd}>No. Pst.</td>
      <td style={styles.infoTd}>:</td>
      <td style={styles.infoTd}>{std.username}</td>
    </tr>
  </tbody>
</table>
                        </div>
                        <div style={styles.footerArea}>
                          <div style={styles.footerTextWrapper}>
                            <div>Cipari, 18 Maret 2026</div>
                            <div>Kepala Sekolah,</div>
                            <div style={styles.signature}>Lestari Kurniawati, S.Pd.</div>
                          </div>
                        </div>
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