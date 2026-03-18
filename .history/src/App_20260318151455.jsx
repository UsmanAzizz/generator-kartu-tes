import { useState, useRef } from 'react';
import { Plus, Eye, Loader2, Trash2, ArrowRight, Wallet, Layout, Command, User, Hash, DoorOpen } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Tips: Pastikan PdfPreview juga diupdate atau sementara gunakan alert/console jika belum ada
function App() {
  const [students, setStudents] = useState([
    { id: 1, nama: 'JULIAN RICCI', nisn: 'PX-99021', ruang: 'ALPHA CORE' },
    { id: 2, nama: 'SARAH CONNOR', nisn: 'PX-99022', ruang: 'BETA SECTOR' },
  ]);
  const [form, setForm] = useState({ nama: '', nisn: '', ruang: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef(null);

  const generatePreview = async () => {
    if (!contentRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(contentRef.current, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save("id-cards.pdf");
    } catch (e) { 
      console.error(e); 
    } finally { 
      setIsGenerating(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#1e293b] font-sans">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Command className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">Studio<span className="text-indigo-600">Cards</span></span>
        </div>
        
        <button 
          onClick={generatePreview}
          disabled={isGenerating || students.length === 0}
          className="group bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-indigo-200 active:scale-95"
        >
          {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Eye size={18} />}
          Export PDF
        </button>
      </nav>

      <main className="max-w-[1600px] mx-auto p-8 grid grid-cols-12 gap-8">
        
        {/* LEFT: INPUT PANEL */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-28">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Plus size={18} className="text-indigo-600" /> 
              Add New Identity
            </h2>
            
            <div className="space-y-4">
              {[
                { label: 'Full Name', key: 'nama', icon: <User size={14}/>, placeholder: 'e.g. John Doe' },
                { label: 'Access ID', key: 'nisn', icon: <Hash size={14}/>, placeholder: 'e.g. ID-1002' },
                { label: 'Room/Sector', key: 'ruang', icon: <DoorOpen size={14}/>, placeholder: 'e.g. Room A' },
              ].map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 ml-1 flex items-center gap-1.5 uppercase tracking-wider">
                    {f.icon} {f.label}
                  </label>
                  <input 
                    className="w-full bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder={f.placeholder}
                    value={form[f.key]} 
                    onChange={e => setForm({...form, [f.key]: e.target.value.toUpperCase()})} 
                  />
                </div>
              ))}
              
              <button 
                onClick={() => {
                  if(!form.nama) return;
                  setStudents([...students, {...form, id: Date.now()}]);
                  setForm({nama:'', nisn:'', ruang:''});
                }}
                className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold text-sm transition-all mt-4 flex justify-center gap-2 items-center"
              >
                Add to Registry
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: PREVIEW AREA */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Print Preview</h2>
              <p className="text-slate-500 text-sm">Visualizing {students.length} cards on A4 Sheet</p>
            </div>
          </div>

          {/* THE PAPER CONTAINER */}
          <div className="bg-slate-300 p-12 rounded-[2rem] overflow-auto flex justify-center shadow-inner min-h-[80vh]">
            <div 
              ref={contentRef} 
              className="bg-white shadow-2xl origin-top"
              style={{ 
                width: '210mm', 
                minHeight: '297mm', 
                padding: '15mm',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10mm',
                alignContent: 'start'
              }}
            >
              {students.map(s => (
                <div key={s.id} className="group relative bg-white border-[0.5px] border-slate-200 h-[55mm] rounded-xl flex flex-col shadow-sm overflow-hidden">
                  {/* CARD HEADER */}
                  <div className="bg-indigo-600 px-4 py-2 flex justify-between items-center">
                    <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-indigo-100">Identification Card</span>
                    <Wallet size={10} className="text-white/80" />
                  </div>
                  
                  {/* CARD BODY */}
                  <div className="flex-1 p-4 flex gap-4 items-center">
                    {/* PHOTO PLACEHOLDER */}
                    <div className="w-16 h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center">
                       <User size={20} className="text-slate-300" />
                       <span className="text-[5px] mt-2 font-bold text-slate-400 uppercase">NO PHOTO</span>
                    </div>

                    <div className="flex-1 space-y-3">
                       <div>
                          <p className="text-[6px] font-bold text-indigo-500 uppercase tracking-tighter mb-0.5">Full Name</p>
                          <p className="text-[12pt] font-black text-slate-800 leading-tight uppercase truncate">{s.nama}</p>
                       </div>
                       
                       <div className="flex gap-4">
                          <div>
                             <p className="text-[6px] font-bold text-slate-400 uppercase mb-0.5">ID Number</p>
                             <p className="text-[9pt] font-mono font-bold text-slate-700">{s.nisn}</p>
                          </div>
                          <div>
                             <p className="text-[6px] font-bold text-slate-400 uppercase mb-0.5">Sector</p>
                             <p className="text-[9pt] font-bold text-slate-700 italic">{s.ruang || '---'}</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* CARD FOOTER */}
                  <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex gap-1">
                       <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                       <span className="text-[5px] font-bold uppercase text-slate-400">Security Verified</span>
                    </div>
                    <span className="text-[5px] font-mono text-slate-300">#2026-REG-{s.id.toString().slice(-4)}</span>
                  </div>

                  {/* HOVER DELETE */}
                  <button 
                    onClick={() => setStudents(students.filter(x => x.id !== s.id))} 
                    className="absolute top-8 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 data-html2canvas-ignore"
                  >
                    <Trash2 size={12}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;