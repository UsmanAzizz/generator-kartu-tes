import { useState, useRef } from 'react';
import { Plus, Eye, Loader2, Trash2, ArrowRight, Wallet, Layout, Command } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PdfPreview from './PdfPreview';

function App() {
  const [students, setStudents] = useState([
    { id: 1, nama: 'JULIAN RICCI', nisn: 'PX-99021', ruang: 'ALPHA CORE' },
  ]);
  const [form, setForm] = useState({ nama: '', nisn: '', ruang: '' });
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef(null);

  const generatePreview = async () => {
    if (!contentRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(contentRef.current, { scale: 3, useCORS: true });
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
      setPdfUrl(pdf.output('bloburl'));
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  if (pdfUrl) return <PdfPreview url={pdfUrl} onClose={() => setPdfUrl(null)} />;

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#1A1C1E] font-sans antialiased">
      {/* ULTRA CLEAN NAV */}
      <nav className="sticky top-0 z-[60] border-b border-slate-200/60 bg-white/70 backdrop-blur-xl px-12 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Command className="text-white" size={20} />
          </div>
          <h1 className="text-lg font-bold tracking-tight">Studio<span className="text-blue-600">Cards</span></h1>
        </div>
        
        <button 
          onClick={generatePreview}
          disabled={isGenerating || students.length === 0}
          className="bg-[#1A1C1E] hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold text-sm transition-all flex items-center gap-3 active:scale-95 disabled:bg-slate-300"
        >
          {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Eye size={18} />}
          Preview PDF
        </button>
      </nav>

      <main className="max-w-[1440px] mx-auto p-12 grid grid-cols-12 gap-16">
        
        {/* INPUT SECTION - MINIMALIST CARD */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Create New</h2>
            <div className="bg-white border border-slate-200/60 p-8 rounded-[2rem] shadow-sm space-y-6">
              {[
                { label: 'Candidate Name', key: 'nama', placeholder: 'Ex: Adrian Smith' },
                { label: 'Access ID', key: 'nisn', placeholder: 'ID-00234' },
                { label: 'Room / Sector', key: 'ruang', placeholder: 'Room 402' }
              ].map((f) => (
                <div key={f.key} className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">{f.label}</label>
                  <input 
                    className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-300"
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 transition-all flex justify-center gap-2 items-center"
              >
                <Plus size={20} /> Add Student
              </button>
            </div>
          </section>
        </div>

        {/* WORKSPACE - THE LIGHT BOX */}
        <div className="col-span-12 lg:col-span-8 flex flex-col items-center">
          <div className="w-full mb-8 flex justify-between items-end border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold tracking-tight italic text-slate-800">Visual <span className="text-blue-600">Editor</span></h2>
            <div className="flex gap-4 text-[11px] font-bold text-slate-400">
               <span className="flex items-center gap-2"><Layout size={14}/> A4 FORMAT</span>
               <span className="flex items-center gap-2"><ArrowRight size={14}/> {students.length} ENTRIES</span>
            </div>
          </div>

          <div className="w-full bg-white border border-slate-200/60 rounded-[3rem] p-16 overflow-auto max-h-[80vh] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.02)] flex justify-center">
            <div 
              ref={contentRef} 
              className="bg-white grid grid-cols-2 gap-8 p-12 transform scale-[0.6] xl:scale-[0.85] origin-top transition-all"
              style={{ width: '210mm', minHeight: '297mm' }}
            >
              {students.map(s => (
                <div key={s.id} className="group relative bg-[#FDFDFD] border border-slate-100 h-[55mm] w-full p-0 flex flex-col shadow-sm rounded-lg overflow-hidden">
                  {/* CARD DESIGN - ELEGANT WHITE */}
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-[7px] font-black uppercase tracking-[0.4em] text-slate-400">Official Identity Card</span>
                    <Wallet size={12} className="text-blue-600" />
                  </div>
                  
                  <div className="flex-1 p-6 flex gap-6 items-center">
                    <div className="w-16 h-20 bg-slate-100 border border-slate-200 rounded-md flex flex-col items-center justify-center gap-1">
                        <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
                        <span className="text-[6px] font-bold text-slate-400 uppercase">Scan Me</span>
                    </div>
                    <div className="flex-1 space-y-3">
                       <div>
                          <p className="text-[6px] font-black text-blue-600 uppercase tracking-widest mb-1 leading-none">Holder_Name</p>
                          <p className="text-[11pt] font-black text-slate-900 tracking-tight leading-none truncate">{s.nama}</p>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Access_ID</p>
                             <p className="text-[9pt] font-mono font-bold text-slate-700">{s.nisn}</p>
                          </div>
                          <div>
                             <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Sector</p>
                             <p className="text-[9pt] font-bold text-slate-700 italic">{s.ruang || '---'}</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="px-6 py-3 bg-white flex justify-between items-center border-t border-slate-50">
                    <span className="text-[6px] font-bold uppercase tracking-[0.3em] text-slate-300">Auth System Verified • 2026</span>
                  </div>

                  <button 
                    onClick={() => setStudents(students.filter(x => x.id !== s.id))} 
                    className="absolute top-2 right-2 bg-white text-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:bg-red-50 data-html2canvas-ignore"
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