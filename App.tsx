
import React, { useState } from 'react';
import Layout from './components/Layout';
import { DepartmentId, FormSubmissionStatus, Submodule } from './types';
import { DEPARTMENTS } from './constants';
import { Input, Select, TextArea, FormCard, SuccessMessage, FormMirror } from './components/FormComponents';

const App: React.FC = () => {
  const [activeDept, setActiveDept] = useState<DepartmentId>('home');
  const [activeSubmodule, setActiveSubmodule] = useState<string | null>(null);
  const [status, setStatus] = useState<FormSubmissionStatus>({ submitting: false, success: null, error: null });
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [demandSearch, setDemandSearch] = useState('');

  const demandHierarchy = [
    { cat: 'Informação', subs: ['Solicitação de contrato', 'Cobertura contratada', 'Dúvidas sobre número de contato da BR Clube', 'Dúvidas sobre rateio'] },
    { cat: 'Financeiro', subs: ['Boleto com valor errado'] },
    { cat: 'Reclamação', subs: ['Demora no atendimento', 'Rateio', 'Evento'] },
    { cat: 'Eventos', subs: ['Abertura de Evento'] },
    { cat: 'Rastreamento', subs: ['Solicitação de login', 'Aplicativo fora do ar'] },
    { cat: '2ª Via Boleto', subs: [] },
    { cat: 'Assistência 24h', subs: [] },
    { cat: 'Cancelamento', subs: [] },
  ];

  const filteredDemands = demandSearch.length > 1 
    ? demandHierarchy.flatMap(d => {
        const matches = d.subs.filter(s => s.toLowerCase().includes(demandSearch.toLowerCase()));
        const catMatch = d.cat.toLowerCase().includes(demandSearch.toLowerCase());
        
        const results: { cat: string, sub: string | null }[] = [];
        if (catMatch) results.push({ cat: d.cat, sub: null });
        matches.forEach(m => results.push({ cat: d.cat, sub: m }));
        return results;
      })
    : [];

  const handleSelectDemand = (cat: string, sub: string | null) => {
    setFormData(prev => ({ 
      ...prev, 
      Categoria_Demanda: cat, 
      Subcategoria_Demanda: sub || '' 
    }));
    setDemandSearch('');
  };

  const handleNavigate = (deptId: DepartmentId, submoduleId: string | null) => {
    setActiveDept(deptId);
    setActiveSubmodule(submoduleId);
    setStatus({ submitting: false, success: null, error: null });
    setFormData({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateCopyMessage = () => {
    if (Object.values(formData).every(v => !v)) return "";
    const dataLines = Object.entries(formData).filter(([_, v]) => v).map(([k, v]) => `*${k.replace(/_/g, ' ')}:* ${v}`).join('\n');
    const sub = getAllSubmodules().find(s => s.id === activeSubmodule);
    const header = `📋 *BR CLUBE - ${sub?.name.toUpperCase()}*`;
    return `${header}\n\nOlá! Seguem os dados atualizados:\n\n${dataLines}\n\n_BR Clube - Proteção em todo lugar._`;
  };

  const getAllSubmodules = (): Submodule[] => {
    const subs: Submodule[] = [];
    DEPARTMENTS.forEach(d => {
      subs.push(...d.submodules);
      d.groups?.forEach(g => subs.push(...g.items));
    });
    return subs;
  };

  const simulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ submitting: true, success: null, error: null });
    setTimeout(() => setStatus({ submitting: false, success: true, error: null }), 1200);
  };

  const renderHome = () => (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-3 text-cyan-500 font-black text-xs uppercase tracking-[0.3em] mb-4">
             <span className="w-12 h-[3px] bg-cyan-500 rounded-full"></span>
             <span>BR Desk Elite</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-[1000] text-slate-900 tracking-tight leading-[0.9] mb-6">
            Gestão <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-700">Inteligente</span>
          </h1>
          <p className="text-slate-500 text-xl font-medium leading-relaxed">
            Selecione o departamento operacional para iniciar um novo fluxo de trabalho.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {DEPARTMENTS.filter(d => d.id !== 'service_record').map((dept, idx) => (
          <button 
            key={dept.id}
            onClick={() => handleNavigate(dept.id, null)}
            style={{ animationDelay: `${idx * 60}ms` }}
            className={`group relative bg-white py-8 px-10 rounded-[32px] border border-slate-100/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 text-center animate-in fade-in slide-in-from-bottom-8 flex flex-col items-center hover:-translate-y-3 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] overflow-hidden`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${dept.colorClass}`}></div>
            
            <div className={`w-16 h-16 bg-slate-50 group-hover:${dept.colorClass} group-hover:text-white rounded-[20px] flex items-center justify-center mb-6 transition-all duration-500 shadow-inner group-hover:shadow-2xl`}>
              <i className={`fa-solid ${dept.icon} text-2xl`}></i>
            </div>
            
            <h3 className="text-xl font-[900] text-slate-800 group-hover:text-cyan-600 transition-colors tracking-tight mb-3">
              {dept.name}
            </h3>
            <p className="text-slate-400 text-[13px] font-semibold leading-snug px-2 opacity-80 group-hover:opacity-100 transition-opacity">
              {dept.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderDepartmentOverview = () => {
    const dept = DEPARTMENTS.find(d => d.id === activeDept);
    if (!dept) return null;

    const cardConfig: Record<string, { icon: string, color: string, desc: string }> = {
      'events_workshop': { icon: 'fa-calendar-check', color: 'bg-blue-500', desc: 'Agendamento e acompanhamento de reparos.' },
      'events_delivery': { icon: 'fa-car-side', color: 'bg-green-500', desc: 'Protocolo formal de entrega ao associado.' },
      'events_activation': { icon: 'fa-file-contract', color: 'bg-purple-500', desc: 'Ativação e termos de acionamento.' },
      'assistance_request': { icon: 'fa-phone-volume', color: 'bg-red-500', desc: 'Gestão de socorro emergencial 24h.' },
      'welcome_membership': { icon: 'fa-handshake', color: 'bg-cyan-500', desc: 'Onboarding de novos associados.' },
      'service_record': { icon: 'fa-headset', color: 'bg-indigo-600', desc: 'Registro formal de interações e demandas.' },
      'welcome_brpower': { icon: 'fa-bolt', color: 'bg-yellow-500', desc: 'Ativação do ecossistema BR Power.' },
      'tracking_receipt': { icon: 'fa-list-check', color: 'bg-blue-600', desc: 'Controle de entrada de hardware.' },
      'tracking_schedule': { icon: 'fa-calendar-plus', color: 'bg-indigo-500', desc: 'Planejamento de novas instalações.' },
      'tracking_guidelines': { icon: 'fa-circle-info', color: 'bg-teal-500', desc: 'Manual de uso e orientações técnicas.' },
      'cancellation_term': { icon: 'fa-user-xmark', color: 'bg-slate-900', desc: 'Finalização de contrato e distrato.' },
      'billing_message': { icon: 'fa-whatsapp', color: 'bg-green-500', desc: 'Régua de cobrança via mensageria.' },
      'settlement_term': { icon: 'fa-handshake-angle', color: 'bg-emerald-600', desc: 'Formalização de acordos financeiros.' },
      'mail_send': { icon: 'fa-envelope-open-text', color: 'bg-blue-800', desc: 'Despacho de kits operacionais.' },
      'mail_confirm': { icon: 'fa-box-check', color: 'bg-blue-900', desc: 'Check de recebimento logística.' },
    };

    const getSubmoduleMeta = (id: string) => cardConfig[id] || { icon: 'fa-file-signature', color: 'bg-slate-400', desc: 'Módulo de entrada de dados.' };

    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-right-12 duration-700">
        <div className="flex items-center space-x-6">
          <button onClick={() => handleNavigate('home', null)} className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-cyan-600 shadow-sm transition-all hover:shadow-xl hover:-translate-x-1">
            <i className="fa-solid fa-arrow-left text-lg"></i>
          </button>
          <div>
            <nav className="flex items-center space-x-3 text-xs font-black uppercase tracking-[0.4em] text-slate-400 mb-2">
               <span>Painel Geral</span>
               <i className="fa-solid fa-chevron-right text-[8px] opacity-30"></i>
               <span className="text-cyan-500">{dept.name}</span>
            </nav>
            <h1 className="text-4xl font-[1000] text-slate-900 tracking-tight">Módulos Disponíveis</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dept.submodules.map((sub, idx) => {
            const meta = getSubmoduleMeta(sub.id);
            return (
              <button
                key={sub.id}
                onClick={() => handleNavigate(dept.id, sub.id)}
                style={{ animationDelay: `${idx * 80}ms` }}
                className="relative bg-white py-6 px-8 text-left shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group hover:-translate-y-2 overflow-hidden border border-slate-100 flex flex-col h-full"
              >
                <div className={`absolute right-0 top-0 w-20 h-20 ${meta.color} opacity-[0.04] rounded-bl-[40px] transition-all group-hover:scale-150`}></div>
                
                <div className="flex items-center space-x-5 mb-4">
                  <div className={`w-14 h-14 shrink-0 ${meta.color} text-white rounded-[18px] flex items-center justify-center shadow-lg transition-all duration-500 group-hover:rotate-3`}>
                    <i className={`fa-solid ${meta.icon} text-xl`}></i>
                  </div>
                  <h3 className="text-lg font-[900] text-slate-800 leading-tight group-hover:text-cyan-700 transition-colors">
                    {sub.name}
                  </h3>
                </div>
                
                <p className="text-slate-500 text-[13px] font-semibold leading-relaxed line-clamp-2">
                  {meta.desc}
                </p>
              </button>
            );
          })}
        </div>

        {dept.groups?.map((group) => (
          <div key={group.name} className="mt-16">
            <div className="flex items-center space-x-6 mb-10">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.5em] whitespace-nowrap">{group.name}</h2>
              <div className="h-[2px] w-full bg-gradient-to-r from-slate-200 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {group.items.map((sub, idx) => {
                const meta = getSubmoduleMeta(sub.id);
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleNavigate(dept.id, sub.id)}
                    style={{ animationDelay: `${(idx + 4) * 80}ms` }}
                    className="relative bg-white py-6 px-8 text-left shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 group hover:-translate-y-2 overflow-hidden border border-slate-100 flex flex-col h-full"
                  >
                    <div className="flex items-center space-x-5 mb-4">
                      <div className={`w-14 h-14 shrink-0 ${meta.color} text-white rounded-[18px] flex items-center justify-center shadow-lg transition-all duration-500 group-hover:rotate-3`}>
                        <i className={`fa-solid ${meta.icon} text-xl`}></i>
                      </div>
                      <h3 className="text-lg font-[900] text-slate-800 leading-tight group-hover:text-cyan-700 transition-colors">
                        {sub.name}
                      </h3>
                    </div>
                    <p className="text-slate-500 text-[13px] font-semibold leading-relaxed line-clamp-2">
                      {meta.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getFormContent = () => {
    switch(activeSubmodule) {
      case 'service_record':
        return (
          <form onSubmit={simulateSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-4">
            <div className="md:col-span-3 relative">
              <div className="mb-1">
                <label className="block text-[10px] font-bold text-cyan-600 uppercase tracking-wider ml-1 mb-1">Busca Rápida de Demanda</label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Ex: rateio, contrato, boleto..."
                    value={demandSearch}
                    onChange={(e) => setDemandSearch(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all text-[13px] font-medium"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <i className="fa-solid fa-magnifying-glass text-xs"></i>
                  </div>
                </div>
                
                {filteredDemands.length > 0 && (
                  <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {filteredDemands.map((res, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectDemand(res.cat, res.sub)}
                        className="w-full text-left px-4 py-2.5 hover:bg-cyan-50 transition-colors border-b border-slate-50 last:border-0 flex items-center justify-between group"
                      >
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{res.cat}</span>
                          <span className="text-[13px] font-bold text-slate-700 group-hover:text-cyan-700">{res.sub || 'Geral'}</span>
                        </div>
                        <i className="fa-solid fa-chevron-right text-[9px] text-slate-300 group-hover:text-cyan-500"></i>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-1">
              <Input name="Protocolo" label="Nº DO PROTOCOLO" placeholder="Digite..." required value={formData.Protocolo || ''} onChange={handleInputChange} />
            </div>
            <div className="md:col-span-1">
              <Input name="Associado" label="NOME DO ASSOCIADO" placeholder="Nome completo" required value={formData.Associado || ''} onChange={handleInputChange} />
            </div>
            <div className="md:col-span-1">
              <Input name="Placa" label="PLACA" placeholder="AAA-0000" required value={formData.Placa || ''} onChange={handleInputChange} />
            </div>
            
            <Select name="Tipo_Registro" label="TIPO DE REGISTRO" required value={formData.Tipo_Registro || ''} onChange={handleInputChange} options={[
              {value: 'Receptivo', label: 'Receptivo'},
              {value: 'Ativo', label: 'Ativo'},
              {value: 'Registro de Ligação', label: 'Registro de Ligação'},
              {value: 'Tentativa de Contato', label: 'Tentativa de Contato'}
            ]} />
            
            <Select name="Canal_Entrada" label="CANAL DE ENTRADA" required value={formData.Canal_Entrada || ''} onChange={handleInputChange} options={[
              {value: 'WhatsApp', label: 'WhatsApp'},
              {value: 'Telefone', label: 'Telefone'},
              {value: 'Email', label: 'E-mail'},
              {value: 'Presencial', label: 'Presencial'}
            ]} />
            
            <Select name="Categoria_Demanda" label="CATEGORIA DA DEMANDA" required value={formData.Categoria_Demanda || ''} onChange={handleInputChange} options={[
              {value: 'Informação', label: 'Informação'},
              {value: '2ª Via Boleto', label: '2ª Via Boleto'},
              {value: 'Assistência 24h', label: 'Assistência 24h'},
              {value: 'Financeiro', label: 'Financeiro'},
              {value: 'Cancelamento', label: 'Cancelamento'},
              {value: 'Reclamação', label: 'Reclamação'},
              {value: 'Eventos', label: 'Eventos'},
              {value: 'Rastreamento', label: 'Rastreamento'}
            ]} />

            {formData.Categoria_Demanda && (
              <div className="md:col-span-3 animate-in slide-in-from-top-2 duration-300">
                <Select 
                  name="Subcategoria_Demanda" 
                  label="SUBCATEGORIA DA DEMANDA" 
                  required 
                  value={formData.Subcategoria_Demanda || ''}
                  onChange={handleInputChange} 
                  options={
                    formData.Categoria_Demanda === 'Informação' ? [
                      {value: 'Solicitação de contrato', label: 'Solicitação de contrato'},
                      {value: 'Cobertura contratada', label: 'Cobertura contratada'},
                      {value: 'Dúvidas sobre número de contato da BR Clube', label: 'Dúvidas sobre número de contato da BR Clube'},
                      {value: 'Dúvidas sobre rateio', label: 'Dúvidas sobre rateio'}
                    ] : formData.Categoria_Demanda === 'Financeiro' ? [
                      {value: 'Boleto com valor errado', label: 'Boleto com valor errado'}
                    ] : formData.Categoria_Demanda === 'Reclamação' ? [
                      {value: 'Demora no atendimento', label: 'Demora no atendimento'},
                      {value: 'Rateio', label: 'Rateio'},
                      {value: 'Evento', label: 'Evento'}
                    ] : formData.Categoria_Demanda === 'Eventos' ? [
                      {value: 'Abertura de Evento', label: 'Abertura de Evento'}
                    ] : formData.Categoria_Demanda === 'Rastreamento' ? [
                      {value: 'Solicitação de login', label: 'Solicitação de login'},
                      {value: 'Aplicativo fora do ar', label: 'Aplicativo fora do ar'}
                    ] : [
                      {value: 'Geral', label: 'Geral / Outros'}
                    ]
                  } 
                />
              </div>
            )}
            
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-5">
              <TextArea name="Relato" label="RELATO" placeholder="O que foi solicitado..." required rows={2} onChange={handleInputChange} />
              <TextArea name="Providencias" label="PROVIDÊNCIAS" placeholder="Ações tomadas..." required rows={2} onChange={handleInputChange} />
            </div>

            <Select name="Percepcao_Satisfacao" label="PERCEPÇÃO DE SATISFAÇÃO" required onChange={handleInputChange} options={[
              {value: 'Satisfeito', label: 'Satisfeito'},
              {value: 'Satisfeito (Aguarda Retorno)', label: 'Satisfeito (Aguarda Retorno)'},
              {value: 'Neutro', label: 'Neutro'},
              {value: 'Insatisfeito', label: 'Insatisfeito'},
              {value: 'Reclamação Formal', label: 'Reclamação Formal'}
            ]} />

            <Select name="Pendencias_Futuras" label="PENDÊNCIAS FUTURAS" required onChange={handleInputChange} options={[
              {value: 'Sim', label: 'Sim'},
              {value: 'Não', label: 'Não'}
            ]} />

            <Select name="Motivo_Fechamento" label="MOTIVO DO FECHAMENTO" required onChange={handleInputChange} options={[
              {value: 'Concluído', label: 'Concluído'},
              {value: 'Encaminhado', label: 'Encaminhado'},
              {value: 'Inatividade do Associado', label: 'Inatividade do Associado'},
              {value: 'Desistência', label: 'Desistência'}
            ]} />

            {formData.Pendencias_Futuras === 'Sim' && (
              <div className="md:col-span-3 animate-in slide-in-from-top-2 duration-300">
                <Input name="Prazo_Retorno" label="PRAZO DE RETORNO" type="datetime-local" required onChange={handleInputChange} />
              </div>
            )}

            <Select name="Tarefas_Space" label="TAREFAS GERADAS NO SPACE?" required onChange={handleInputChange} options={[
              {value: 'Sim', label: 'Sim'},
              {value: 'Não', label: 'Não'},
              {value: 'Não se aplica', label: 'Não se aplica'}
            ]} />

            <div className="md:col-span-2">
              <Select name="Status_Atendimento" label="STATUS DO ATENDIMENTO" required onChange={handleInputChange} options={[
                {value: 'Atendimento concluído', label: 'Atendimento concluído'},
                {value: 'Atendimento transferido', label: 'Atendimento transferido'}
              ]} />
            </div>
            
            <div className="md:col-span-3 flex justify-center mt-2">
              <button className="w-full btn-primary text-white font-bold py-3.5 px-12 rounded-xl text-sm tracking-widest uppercase flex items-center justify-center space-x-3">
                <i className="fa-solid fa-check"></i>
                <span>REGISTRAR ATENDIMENTO</span>
              </button>
            </div>
          </form>
        );
      case 'assistance_request':
        return (
          <form onSubmit={simulateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input name="Associado" label="Associado" required onChange={handleInputChange} />
            <Input name="Placa" label="Placa" required onChange={handleInputChange} />
            <Select name="Servico" label="Serviço Solicitado" onChange={handleInputChange} options={[
              {value: 'Guincho', label: 'Guincho'},
              {value: 'Chaveiro', label: 'Chaveiro'},
              {value: 'Pane', label: 'Pane Elétrica/Mecânica'}
            ]} />
            <Input name="Localizacao" label="Localização Atual" onChange={handleInputChange} />
            <div className="md:col-span-2"><TextArea name="Detalhes" label="Observações do Acionamento" onChange={handleInputChange} /></div>
            <div className="md:col-span-2 flex justify-end"><button className="btn-primary text-white font-[900] py-4 px-12 rounded-2xl text-sm tracking-widest uppercase">ENVIAR PARA OPERAÇÃO</button></div>
          </form>
        );
      case 'welcome_membership':
      case 'welcome_brpower':
        return (
          <form onSubmit={simulateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input name="Associado" label="Nome do Associado" required onChange={handleInputChange} />
            <Input name="CPF" label="CPF" onChange={handleInputChange} />
            <Input name="WhatsApp" label="WhatsApp" required onChange={handleInputChange} />
            <Input name="Plano" label="Plano Contratado" onChange={handleInputChange} />
            <div className="md:col-span-2 flex justify-end"><button className="btn-primary text-white font-[900] py-4 px-12 rounded-2xl text-sm tracking-widest uppercase">REGISTRAR BOAS-VINDAS</button></div>
          </form>
        );
      case 'billing_message':
      case 'settlement_term':
        return (
          <form onSubmit={simulateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input name="Devedor" label="Nome do Devedor" required onChange={handleInputChange} />
            <Input name="Valor" label="Valor em Aberto" placeholder="R$ 0,00" onChange={handleInputChange} />
            <Input name="Parcelas" label="Nº de Parcelas" type="number" onChange={handleInputChange} />
            <Input name="Vencimento" label="Data Vencimento" type="date" onChange={handleInputChange} />
            <div className="md:col-span-2 flex justify-end"><button className="btn-primary text-white font-[900] py-4 px-12 rounded-2xl text-sm tracking-widest uppercase">SALVAR ACORDO</button></div>
          </form>
        );
      default:
        return (
          <form onSubmit={simulateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input name="Nome" label="Nome / Referência" required onChange={handleInputChange} />
            <Input name="Placa" label="Placa (se houver)" onChange={handleInputChange} />
            <Input name="Data" label="Data Referência" type="date" onChange={handleInputChange} />
            <div className="md:col-span-2">
              <TextArea name="Descricao" label="Descrição dos Dados" required onChange={handleInputChange} />
            </div>
            <div className="md:col-span-2 flex justify-end"><button className="btn-primary text-white font-[900] py-4 px-12 rounded-2xl text-sm tracking-widest uppercase">PROCESSAR DADOS</button></div>
          </form>
        );
    }
  };

  const currentSub = getAllSubmodules().find(s => s.id === activeSubmodule);
  const currentDeptObj = DEPARTMENTS.find(d => d.id === activeDept);

  return (
    <Layout activeDept={activeDept} activeSubmodule={activeSubmodule} onNavigate={handleNavigate}>
      {activeDept === 'home' ? (
        renderHome()
      ) : !activeSubmodule ? (
        renderDepartmentOverview()
      ) : (
        <div className="space-y-8 animate-in fade-in duration-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-5">
              <button onClick={() => handleNavigate(activeDept, null)} className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-cyan-600 shadow-sm transition-all hover:shadow-xl">
                <i className="fa-solid fa-arrow-left text-base"></i>
              </button>
              <div>
                <nav className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-1">
                   <span>{currentDeptObj?.name}</span>
                   <i className="fa-solid fa-chevron-right text-[7px] opacity-30"></i>
                   <span className="text-cyan-500 font-black">Editor de Dados</span>
                </nav>
                <h1 className="text-3xl font-[1000] text-slate-900 tracking-tight">{currentSub?.name}</h1>
              </div>
            </div>
          </div>
          
          {status.success ? (
            <div className="py-12">
              <SuccessMessage 
                message={`Os dados de "${currentSub?.name}" foram registrados com sucesso no hub operacional.`} 
                onReset={() => setStatus({ ...status, success: null })} 
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              <div className="xl:col-span-8 2xl:col-span-9">
                <FormCard title={currentSub?.name || ''} icon={currentDeptObj?.icon || 'fa-file'}>
                  {getFormContent()}
                </FormCard>
              </div>
              <div className="xl:col-span-4 2xl:col-span-3">
                <FormMirror data={formData} title={currentSub?.name || ''} generateMessage={generateCopyMessage} />
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default App;
