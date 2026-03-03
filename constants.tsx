
import { Department } from './types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'service_record',
    name: 'Registro de Atendimento',
    icon: 'fa-headset',
    description: 'Registro formal de interações e demandas',
    colorClass: 'bg-indigo-600',
    submodules: [
      { id: 'service_record', name: 'Registro de atendimento', parentId: 'service_record' }
    ]
  },
  { 
    id: 'assistance', 
    name: 'Assistência 24H', 
    icon: 'fa-truck-medical', 
    description: 'Gestão de socorro e suporte emergencial',
    colorClass: 'bg-red-600',
    submodules: [
      { id: 'assistance_request', name: 'Acionamento de assistência', parentId: 'assistance' }
    ]
  },
  {
    id: 'registration',
    name: 'Cadastro',
    icon: 'fa-address-card',
    description: 'Boas-vindas e novos associados',
    colorClass: 'bg-blue-500',
    submodules: [
      { id: 'welcome_membership', name: 'Boas-vindas adesão', parentId: 'registration' },
      { id: 'welcome_brpower', name: 'Boas-vindas BR POWER', parentId: 'registration' }
    ]
  },
  { 
    id: 'tracking', 
    name: 'Rastreamento', 
    icon: 'fa-location-dot', 
    description: 'Equipamentos e protocolos de instalação',
    colorClass: 'bg-yellow-400',
    submodules: [
      { id: 'tracking_receipt', name: 'Termo de recebimento de rastreadores', parentId: 'tracking' },
      { id: 'tracking_schedule', name: 'Protocolo: agendar instalação', parentId: 'tracking' },
      { id: 'tracking_guidelines', name: 'Orientações pós-instalação', parentId: 'tracking' }
    ]
  },
  { 
    id: 'events', 
    name: 'Eventos', 
    icon: 'fa-car-burst', 
    description: 'Sinistros, oficinas e entregas',
    colorClass: 'bg-red-500',
    submodules: [
      { id: 'events_workshop', name: 'Agendamento para oficina', parentId: 'events' },
      { id: 'events_delivery', name: 'Termo de entrega de veículos', parentId: 'events' },
      { id: 'events_activation', name: 'Termo de acionamento', parentId: 'events' }
    ]
  },
  { 
    id: 'cancellations', 
    name: 'Cancelamentos', 
    icon: 'fa-file-circle-xmark', 
    description: 'Distações e encerramentos',
    colorClass: 'bg-slate-900',
    submodules: [
      { id: 'cancellation_term', name: 'Termo de cancelamento', parentId: 'cancellations' }
    ]
  },
  { 
    id: 'billing', 
    name: 'Cobrança', 
    icon: 'fa-file-invoice-dollar', 
    description: 'Financeiro e acordos',
    colorClass: 'bg-green-600',
    submodules: [
      { id: 'billing_message', name: 'Mensagem de cobrança', parentId: 'billing' },
      { id: 'settlement_term', name: 'Termo de acordo', parentId: 'billing' }
    ]
  },
  {
    id: 'commercial',
    name: 'Pós-Venda',
    icon: 'fa-headset',
    description: 'Atendimento e fidelização',
    colorClass: 'bg-indigo-600',
    submodules: [],
    groups: [
      {
        name: 'Logística',
        items: [
          { id: 'mail_send', name: 'Enviar para associado', parentId: 'commercial' },
          { id: 'mail_confirm', name: 'Confirmar recebimento do kit', parentId: 'commercial' }
        ]
      }
    ]
  }
];