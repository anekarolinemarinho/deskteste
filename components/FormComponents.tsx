
import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div className="space-y-1 group">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 group-focus-within:text-cyan-600 transition-colors">{label}</label>
    <input 
      {...props}
      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all duration-200 text-slate-700 text-[13px] font-medium placeholder:text-slate-300 input-focus shadow-sm hover:border-slate-300"
    />
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, ...props }) => (
  <div className="space-y-1 group">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 group-focus-within:text-cyan-600 transition-colors">{label}</label>
    <div className="relative">
      <select 
        {...props}
        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all duration-200 text-slate-700 text-[13px] font-medium bg-white shadow-sm hover:border-slate-300 appearance-none cursor-pointer"
      >
        <option value="">Selecione...</option>
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <i className="fa-solid fa-chevron-down text-[10px]"></i>
      </div>
    </div>
  </div>
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  rows?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, rows = 3, ...props }) => (
  <div className="space-y-1 group">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 group-focus-within:text-cyan-600 transition-colors">{label}</label>
    <textarea 
      {...props}
      rows={rows}
      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all duration-200 text-slate-700 text-[13px] font-medium placeholder:text-slate-300 shadow-sm hover:border-slate-300 resize-none"
    />
  </div>
);

interface FormMirrorProps {
  data: Record<string, string>;
  title: string;
  generateMessage: () => string;
}

export const FormMirror: React.FC<FormMirrorProps> = ({ data, title, generateMessage }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const message = generateMessage();
    if (!message || Object.values(data).every(v => !v)) return;
    
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasData = !Object.values(data).every(v => !v);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl sticky top-8 overflow-hidden">
      <div className="absolute right-0 top-0 w-32 h-32 bg-cyan-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-600">Revisão de Dados</h3>
          <i className="fa-solid fa-receipt text-slate-300"></i>
        </div>
        <div className="space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <p className="text-[9px] uppercase font-bold text-slate-400 mb-0.5 tracking-widest">Módulo Selecionado</p>
            <p className="font-bold text-base text-slate-800">{title}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
            {Object.entries(data).map(([key, value]) => (
              value && (
                <div key={key} className="animate-in fade-in slide-in-from-left-1 duration-200">
                  <p className="text-[9px] uppercase font-bold text-cyan-700/70 mb-0.5 tracking-widest">{key.replace(/_/g, ' ')}</p>
                  <p className="text-sm font-semibold text-slate-700 break-words leading-tight">{value}</p>
                </div>
              )
            ))}
            {!hasData && (
               <div className="py-8 text-center text-slate-300 italic text-xs">
                 Preencha o formulário ao lado...
               </div>
            )}
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button 
            disabled={!hasData}
            onClick={handleCopy}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:shadow-none ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            {copied ? (
              <>
                <i className="fa-solid fa-check"></i>
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-copy"></i>
                <span>Copiar Mensagem</span>
              </>
            )}
          </button>
          
          <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">BR Clube Operacional</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 rounded-full bg-cyan-500/40"></div>
              <div className="w-1 h-1 rounded-full bg-cyan-500/20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FormCard: React.FC<{ title: string; children: React.ReactNode; icon: string }> = ({ title, children, icon }) => (
  <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500 h-full">
    <div className="bg-slate-50/50 px-6 py-5 border-b border-slate-100 flex items-center space-x-4">
      <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white shadow-md shadow-cyan-100">
        <i className={`fa-solid ${icon} text-lg`}></i>
      </div>
      <div>
        <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">{title}</h2>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Formulário de Entrada</p>
      </div>
    </div>
    <div className="p-6 lg:p-8">
      {children}
    </div>
  </div>
);

export const SuccessMessage: React.FC<{ message: string; onReset: () => void }> = ({ message, onReset }) => (
  <div className="bg-white border border-slate-100 shadow-2xl rounded-3xl p-10 text-center animate-in fade-in zoom-in duration-500 max-w-lg mx-auto">
    <div className="w-20 h-20 bg-green-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-green-100 mb-6 rotate-3">
      <i className="fa-solid fa-check text-4xl"></i>
    </div>
    <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Sucesso!</h3>
    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">{message}</p>
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <button 
        onClick={onReset}
        className="btn-primary text-white px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2"
      >
        <i className="fa-solid fa-plus"></i>
        <span>Nova Entrada</span>
      </button>
      <button 
        onClick={() => window.location.reload()}
        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-3 rounded-xl font-bold text-sm transition-all"
      >
        Painel
      </button>
    </div>
  </div>
);
