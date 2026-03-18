import { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

import kopImage from './image.png'; 
import dummyFoto from './aji.jpg'; 

function App() {
  const [students, setStudents] = useState([]);
  const [photoMap, setPhotoMap] = useState({}); // Menyimpan blob foto lokal
  const contentRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  // 1. DOWNLOAD TEMPLATE EXCEL
  const downloadTemplate = () => {
    const data = [
      { Nama: "AJENG SETIA RAHAYU", Kelas: "X AKL", Nomor_Peserta: "2025/UKK/101" },
      { Nama: "ALYA JESIKA", Kelas: "XII TJKT 2", Nomor_Peserta: "2025/UKK/102" }
    ];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data_Siswa");
    XLSX.writeFile(workbook, "template_ukk.xlsx");
  };

  // 2. UNGGAH EXCEL
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
        nama: item.Nama || "",
        kelas: item.Kelas || "",
        username: item.Nomor_Peserta || "",
      }));
      setStudents(mapped);
    };
    reader.readAsBinaryString(file);
  };

  // 3. AMBIL FOTO DARI FOLDER LOKAL
  const handleFolderUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotoMap = {};

    files.forEach(file => {
      // Ambil nama file tanpa ekstensi (misal: "AJENG SETIA RAHAYU.jpg" -> "AJENG SETIA RAHAYU")
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
      const canvas = await html2canvas(pages[i], { scale: 2, useCORS: true });
      if (i > 0) pdf.addPage('p', 'mm', [210, 330]);
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 330);
    }
    pdf.save("kartu-ukk-final.pdf");
  };

  const styles = {
    wrapper: { backgroundColor: '#525659', height: '100vh', width: '100vw', display: 'flex', overflow: 'hidden' },
    sidebar: { width: '320px', backgroundColor: '#2c3e50', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '2px 0 10px rgba(0,0,0,0.5)' },
    previewArea: { flex: 1, overflowY: 'auto', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    sideBtn: { padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
    inputLabel: { fontSize: '12px', color: '#bdc3c7', marginBottom: '5px', display: 'block' },
    page: { width: '210mm', height: '330mm', backgroundColor: 'white', marginBottom: '40px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', flexShrink: 0 },
    cardSlot: (index) => ({ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', borderRight: (index % 2 === 0) ? '0.5mm dashed #ccc' : 'none', borderBottom: (index < 6) ? '0.5mm dashed #ccc' : 'none' }),
    card: { width: '99mm', height: '78mm', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '10px', padding: '2mm', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' },
    foto: { width: '18mm', height: '24mm', objectFit: 'cover', border: '1px solid #ccc' }
  };

  const pages = Array.from({ length: Math.ceil(students.length / 8) }, (_, i) => students.slice(i * 8, i * 8 + 8));

  return (
    <div style={styles.wrapper}>
      <div style={styles.sidebar}>
        <h3>Kartu UKK Digital</h3>
        
        <div>
          <label style={styles.inputLabel}>1. Persiapan Data</label>
          <button style={{...styles.sideBtn, width: '100%', backgroundColor: '#34495e', color: 'white'}} onClick={downloadTemplate}>Unduh Template Excel</button>
        </div>

        <div>
          <label style={styles.inputLabel}>2. Unggah Data Siswa (.xlsx)</label>
          <input type="file" accept=".xlsx" onChange={handleExcelUpload} />
        </div>

        <div>
          <label style={styles.inputLabel}>3. Pilih Folder Foto Siswa</label>
          <input 
            type="file" 
            webkitdirectory="true" 
            directory="" 
            multiple 
            onChange={handleFolderUpload} 
          />
          <p style={{fontSize: '10px', marginTop: '5px', color: '#ecf0f1'}}>*Nama file foto harus sama dengan Nama di Excel</p>
        </div>

        <div style={{marginTop: 'auto'}}>
          <button style={{...styles.sideBtn, width: '100%', backgroundColor: '#27ae60', color: 'white', fontSize: '16px'}} onClick={downloadPDF}>CETAK PDF F4</button>
          <p style={{textAlign: 'center', fontSize: '12px', marginTop: '10px'}}>Total Data: {students.length}</p>
        </div>
      </div>

      <div style={styles.previewArea}>
        {students.length === 0 ? <div style={{color: 'white'}}>Unggah Excel untuk memulai...</div> : (
          <div ref={contentRef}>
            {pages.map((pageStudents, pIdx) => (
              <div key={pIdx} className="page-break" style={styles.page}>
                {pageStudents.map((std, index) => {
                  // CARI FOTO BERDASARKAN NAMA
                  const studentNameKey = std.nama.toUpperCase().trim();
                  const photoSrc = photoMap[studentNameKey] || dummyFoto;

                  return (
                    <div key={std.id} style={styles.cardSlot(index)}>
                      <div style={styles.card}>
                        <img src={kopImage} style={{width: '100%', height: '70px', marginBottom: '5px'}} />
                        <div style={{textAlign: 'center', fontWeight: 'bold', fontSize: '9pt', marginBottom: '10px'}}>KARTU PESERTA UJI KOMPETENSI KEAHLIAN</div>
                        <div style={{display: 'flex', gap: '10px'}}>
                          <img src={photoSrc} style={styles.foto} />
                          <table style={{fontSize: '9pt', borderCollapse: 'collapse', width: '100%'}}>
                            <tbody>
                              <tr><td width="50">Nama</td><td>: {std.nama}</td></tr>
                              <tr><td>Kelas</td><td>: {std.kelas}</td></tr>
                              <tr><td>No. Pst</td><td>: {std.username}</td></tr>
                            </tbody>
                          </table>
                        </div>
                        <div style={{marginTop: 'auto', textAlign: 'right', fontSize: '8pt'}}>
                          Cipari, 18 Maret 2026<br/>Kepala Sekolah,<br/><br/><br/>
                          <strong>Lestari Kurniawati, S.Pd.</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;