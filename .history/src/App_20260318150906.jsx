import { useState, useRef } from 'react';
import { UserPlus, FileText, Eye, Loader2, Plus, Trash2, LayoutGrid, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PdfPreview from './PdfPreview';

function App() {
  const [students, setStudents] = useState([
    { id: 1, nama: 'Alex Rivera', nisn: '10928374', ruang: 'Quantum Lab' },
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
        scale: 3, // High quality
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
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-blue-500/30">
      {/* MODERN NAVBAR */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <Sparkles className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            CARD<span className="text-blue-500 font-black">STUDIO</span>
          </h1>
        </div>
        
        <button 
          onClick={generatePreview}
          disabled={isGenerating || students.length === 0}
          className="group relative px-6 py-2.5 bg-white text-slate-950 rounded-full font-bold flex items-center gap-2 transition-all hover:bg-blue-50 hover:ring-4 hover:ring-blue-500/20 disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Eye size={18} className="group-hover:scale-110 transition-transform" />}
          Generate PDF
        </button>
      </nav>

      <main className="max-w-[1600px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* FLOATING INPUT PANEL */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <UserPlus className="text-blue-500" /> Member Data
            </h2>
            <div className="space-y-5">
              {[
                { label: 'Full Name', key: 'nama', placeholder: 'e.g. Alex Rivera' },
                { label: 'Identification ID', key: 'nisn', placeholder: 'e.g. 2024001' },
                { label: 'Assigned Room', key: 'ruang', placeholder: 'e.g. Lab Alpha' }
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block italic">{field.label}</label>
                  <input 
                    className="w-full bg-slate-800/50 border border-slate-700 p-4 rounded-2xl text-sm text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-600" 
                    placeholder={field.placeholder}
                    value={form[field.key]} 
                    onChange={e => setForm({...form, [field.key]: e.target.value})} 
                  />
                </div>
              ))}
              <button 
                onClick={() => {
                  if(!form.nama) return;
                  setStudents([...students, {...form, id: Date.now()}]);
                  setForm({nama:'', nisn:'', ruang:''});
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-2xl hover:shadow-blue-500/20 active:scale-[0.98] transition-all flex justify-center gap-2 items-center"
              >
                <Plus size={18} /> Add to List
              </button>
            </div>
          </div>
        </div>

        {/* MODERN CANVAS WORKSPACE */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900/30 rounded-[40px] p-12 border border-slate-800/50 min-h-[85vh] relative overflow-hidden shadow-inner">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex items-center gap-4 mb-10 bg-slate-800/50 px-6 py-2 rounded-full border border-slate-700/50 backdrop-blur-md">
                <LayoutGrid size={16} className="text-blue-500" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Live Preview Canvas</span>
              </div>

              {/* THE REAL A4 SHEET */}
              <div 
                ref={contentRef} 
                className="bg-white p-[15mm] grid grid-cols-2 gap-6 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] transform scale-[0.6] origin-top xl:scale-[0.8] transition-transform duration-500"
                style={{ width: '210mm', minHeight: '297mm' }}
              >
                {students.map(s => (
                  <div key={s.id} className="group relative bg-[#f8fafc] border-[3px] border-slate-950 h-[55mm] w-full p-0 flex flex-col overflow-hidden">
                    {/* CARD HEADER */}
                    <div className="bg-slate-950 text-white py-3 px-4 flex justify-between items-center italic">
                      <span className="text-[10pt] font-black uppercase tracking-tighter">Identity Pass</span>
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    </div>
                    
                    {/* CARD CONTENT */}
                    <div className="flex-1 p-4 flex gap-4 bg-white text-slate-950">
                      <div className="w-20 h-24 bg-slate-200 border-2 border-slate-950 flex items-center justify-center text-[8pt] font-black text-slate-400 uppercase">FOTO</div>
                      <div className="flex-1 space-y-2 text-[9pt] font-bold">
                        <div className="border-b-2 border-slate-100 pb-1">
                          <p className="text-[7pt] text-slate-400 uppercase tracking-widest leading-none mb-1">Holder Name</p>
                          <p className="truncate uppercase">{s.nama}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-[7pt] text-slate-400 uppercase mb-1 leading-none">ID Number</p>
                            <p className="font-mono">{s.nisn}</p>
                          </div>
                          <div>
                            <p className="text-[7pt] text-slate-400 uppercase mb-1 leading-none">Sector</p>
                            <p>{s.ruang || '---'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 py-2 border-t-2 border-slate-950 flex justify-between items-center bg-slate-50 text-slate-950">
                       <span className="text-[7pt] font-black italic tracking-widest opacity-30">#SYSTEM-2026</span>
                       <span className="text-[8pt] font-black uppercase tracking-widest">Verified</span>
                    </div>

                    <button 
                      onClick={() => setStudents(students.filter(x => x.id !== s.id))} 
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:rotate-12 data-html2canvas-ignore"
                    >
                      <Trash2 size={14}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;