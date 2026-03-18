import { useState, useRef } from 'react';
import { UserPlus, Eye, Loader2, Plus, Trash2, LayoutGrid, Sparkles, Layers, Download } from 'lucide-react';
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
      const canvas = await html2canvas(contentRef.current, { 
        scale: 3, 
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
      setPdfUrl(pdf.output('bloburl'));
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (pdfUrl) return <PdfPreview url={pdfUrl} onClose={() => setPdfUrl(null)} />;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans antialiased selection:bg-indigo-500/30">
      {/* GLOSSY NAV */}
      <nav className="sticky top-0 z-[60] border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl px-10 py-5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-2xl rotate-3 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <Layers className="text-white" size={20} />
          </div>
          <div className="leading-none">
            <h1 className="text-lg font-black tracking-tight text-white uppercase italic">Card<span className="text-indigo-400">Lab</span></h1>
            <span className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase">V.02 Engine</span>
          </div>
        </div>
        
        <button 
          onClick={generatePreview}
          disabled={isGenerating || students.length === 0}
          className="relative group overflow-hidden bg-white text-black px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-fuchsia-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
          {isGenerating ? <Loader2 className="animate-spin" /> : 'Render Document'}
        </button>
      </nav>

      <main className="max-w-[1700px] mx-auto p-10 grid grid-cols-12 gap-10">
        
        {/* BENTO INPUT PANEL */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="group relative bg-[#0f172a]/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md overflow-hidden transition-all hover:border-white/10">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full"></div>
            
            <h2 className="text-sm font-black text-white mb-8 flex items-center gap-3 tracking-[0.2em] uppercase">
              <Plus size={16} className="text-indigo-400" /> Identity Entry
            </h2>

            <div className="space-y-6">
              {[
                { label: 'Subject Name', key: 'nama', placeholder: 'Enter Full Name' },
                { label: 'Access ID', key: 'nisn', placeholder: 'ID-XXXXX' },
                { label: 'Deployment Sector', key: 'ruang', placeholder: 'Sector Name' }
              ].map((f) => (
                <div key={f.key} className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{f.label}</label>
                  <input 
                    className="w-full bg-[#1e293b]/30 border border-white/5 p-4 rounded-2xl text-sm text-white outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700"
                    placeholder={f.placeholder}
                    value={form[f.key]} 
                    onChange={e => setForm({...form, [f.key]: e.target.value})} 
                  />
                </div>
              ))}
              
              <button 
                onClick={() => {
                  if(!form.nama) return;
                  setStudents([...students, {...form, id: Date.now()}]);
                  setForm({nama:'', nisn:'', ruang:''});
                }}
                className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(99,102,241,0.3)] transition-all active:scale-95"
              >
                Inject Participant
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/5 p-8 rounded-[2.5rem]">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Workspace Stats</h3>
             <p className="text-4xl font-black text-white italic">{students.length}<span className="text-sm text-slate-600 not-italic ml-2 uppercase">Units</span></p>
          </div>
        </div>

        {/* WORKSPACE AREA */}
        <div className="col-span-12 lg:col-span-8 flex flex-col items-center">
          <div className="w-full mb-8 flex justify-between items-center px-4">
            <div className="flex items-center gap-3">
               <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Global Canvas View</span>
            </div>
          </div>

          <div className="w-full bg-[#0f172a]/20 border border-white/5 rounded-[3rem] p-12 min-h-[80vh] overflow-auto flex justify-center shadow-inner relative">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            <div 
              ref={contentRef} 
              className="bg-white grid grid-cols-2 gap-8 p-12 transform scale-[0.6] xl:scale-[0.85] origin-top transition-all"
              style={{ width: '210mm', minHeight: '297mm' }}
            >
              {students.map(s => (
                <div key={s.id} className="group relative bg-[#fafafa] border border-black/5 h-[55mm] w-full p-0 flex flex-col shadow-sm">
                  {/* CARD DESIGN - MINIMALIST PREMIUM */}
                  <div className="bg-black p-4 flex justify-between items-center">
                    <div className="h-1.5 w-12 bg-indigo-500"></div>
                    <span className="text-[8px] font-black text-white uppercase tracking-[0.4em]">Auth-2026</span>
                  </div>
                  
                  <div className="flex-1 p-5 flex gap-5 items-center">
                    <div className="w-20 h-24 bg-slate-100 border border-black/5 rounded-sm flex items-center justify-center text-[7px] font-black text-slate-400">IMG-SCAN</div>
                    <div className="flex-1 space-y-3">
                       <div className="border-b border-black/10 pb-1">
                          <p className="text-[6px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1">Subject_Name</p>
                          <p className="text-[10pt] font-black text-black uppercase leading-none truncate tracking-tighter">{s.nama}</p>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Access_ID</p>
                             <p className="text-[9pt] font-mono font-bold text-black">{s.nisn}</p>
                          </div>
                          <div>
                             <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Sector</p>
                             <p className="text-[9pt] font-black text-black italic">{s.ruang || '---'}</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="px-5 py-3 border-t border-black/5 bg-white flex justify-between items-center">
                    <span className="text-[6px] font-black uppercase tracking-[0.3em] text-slate-300">Identity-Verification-System</span>
                    <div className="h-4 w-4 bg-indigo-100 rounded-full flex items-center justify-center">
                       <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full"></div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setStudents(students.filter(x => x.id !== s.id))} 
                    className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110 data-html2canvas-ignore"
                  >
                    <Trash2 size={14}/>
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