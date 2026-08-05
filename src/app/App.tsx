import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  readLocalPayload,
  readStoredPayload,
  writeStoredPayload,
  writeStoredPayloadSync,
} from "./formStorage";
import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";
import { useAuth } from "../contexts/AuthContext";
import request from "../lib/api";
import biztripLogo from "../imports/Propriedade_1_Branco_-_100.svg";
import biztripBIcon from "../imports/b-icon.svg";
import kennedyLogo from "../imports/kennedy-viagens-logo.svg";
import biztripBadge from "../imports/biztrip-badge-logo.svg";
import smartphoneHomeBiztrip from "../imports/SmartphoneHomeBiztrip.png";

// SlideWrapper (TravelSlide) assets
import travelSvgPaths from "../imports/SlideWrapper/svg-tid1bjt43l";
import travelImgDocumento2 from "../imports/SlideWrapper/cf66a49cd67cdbb849eb3fd839a3bc45a8275e5c.png";
import { imgLocalActivity as travelImgLocalActivity } from "../imports/SlideWrapper/svg-1vder";

// SlideWrapper-1 (HotelariaSlide) assets
import hotelariaSvgPaths from "../imports/SlideWrapper-1/svg-gkoc22m2aj";
import hotelariaImgMockup51 from "../imports/SlideWrapper-1/640ffec113166068ff9dbbb8efd83dde91d53164.png";

// SlideWrapper-2 (RodoviarioSlide) assets
import rodoviarioSvgPaths from "../imports/SlideWrapper-2/svg-vrvvrys1nt";
import rodoviarioImgMockup041 from "../imports/SlideWrapper-2/9a7c8e55ea35aac0020ab745738951e74b2e400d.png";

// SlideWrapper-3 (BizpaySlide) assets
import bizpaySvgPaths from "../imports/SlideWrapper-3/svg-wm5cy8uflx";
import bizpayImgScreen from "../imports/SlideWrapper-3/8cbe3cc66fe9025b6c712df1e18327e6385fc816.png";
import bizpayImgSilver from "../imports/SlideWrapper-3/3d9a04b34d3338b47f17681f8aa0bb08ae8a1bd3.png";

// SlideWrapper-4 (BiztripExpenseSlide) assets
import expenseSvgPaths from "../imports/SlideWrapper-4/svg-gs89q6glhp";
import expenseImgImagem041 from "../imports/SlideWrapper-4/fba2596fdc110d0d3124b9e499b8e60939e98144.png";
import { imgRequestQuote as expenseImgRequestQuote } from "../imports/SlideWrapper-4/svg-9hwpe";

// SlideWrapper-5 (AISlide) assets
import aiSvgPaths from "../imports/SlideWrapper-5/svg-jvgxcirv02";
import aiImgScreen from "../imports/SlideWrapper-5/e828e7832bebe29d6fc4ef73b9308ba387d0bcb2.png";
import aiImgSilver from "../imports/SlideWrapper-5/3d9a04b34d3338b47f17681f8aa0bb08ae8a1bd3.png";
import aiImgScreen1 from "../imports/SlideWrapper-5/52d6ede2150aeed829470ac624c72a40ae3851a4.png";

// SlideWrapper-6 (ReportsSlide) assets
import imgReports01 from "../imports/ReportsSlide/report01.png";
import imgReports02 from "../imports/ReportsSlide/report02.png";

// SlideWrapper-7 (IntegrationsSlide) assets
import intSvgPaths from "../imports/SlideWrapper-7/svg-aw3sjpif4d";
import intImgImage2 from "../imports/SlideWrapper-7/e6ed9fe2f15667361b22e3588947bbf9d53a3d3f.png";
import intImgImage3 from "../imports/SlideWrapper-7/f88f98b340abead1acb0e22127bd4c7a6b8d41ad.png";
import intImgSeniorSistemasLogo1 from "../imports/SlideWrapper-7/885261d29ff1b32ee4689fdf5ea9a2649440e3de.png";
import intImgImageLogoDaEmpresa from "../imports/SlideWrapper-7/e56e346b34acc09fb5fed9b1f960019aeb757423.png";
import { imgGroup as intImgGroup } from "../imports/SlideWrapper-7/svg-vk87j";
import intImgSapLogo from "../imports/IntegrationsSlide/e87aad7bab9682de5e7906f3e62c6f0d1b6f5c50.svg";
import intImgTotvsLogo from "../imports/IntegrationsSlide/8f4cd232d7d7eba5556f19a77e4be5529024c636.svg";
import intImgUberLogo from "../imports/IntegrationsSlide/4343565a30b3425dc5f1483f405b93ff4d5bdb98.svg";
import intImgContaAzul from "../imports/IntegrationsSlide/0463bcd4a6d1d64292aac637955c5d0ecce3adcd.svg";
import intImgApiIcon from "../imports/IntegrationsSlide/9f5657b51805ba397ccd84754ccf05e70e158d33.svg";

// SlideWrapper-8 (ImplementationSlide) assets
import implSvgPaths from "../imports/SlideWrapper-8/svg-yo8yeau6v0";
import implImgUnsplash from "../imports/SlideWrapper-8/d5222765a599747bee73451f1d9809a8d85b5695.png";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";
import Heading2 from "../imports/Heading2/Heading2";
import {
  FileText,
  Save,
  FileDown,
  Plane,
  DollarSign,
  Sparkles,
  BarChart,
  Plug,
  HeadphonesIcon,
  Rocket,
  Upload,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Linkedin,
  MessageSquare,
  TrendingUp,
  Star,
  Hotel,
  Bus,
  CreditCard,
  Receipt,
  Lock,
  Shield,
  Camera,
  AlertCircle,
  Zap,
  Layers,
  User,
  UserCheck,
  Cpu,
  ChevronRight,
  LayoutDashboard,
  GitBranch,
  Brain,
  Ticket,
  X,
  Eye,
  EyeOff,
  ArrowLeft,
  Trash2,
  Check,
  LogOut,
  Users,
} from "lucide-react";

const modules = [
  { id: "cover", name: "Capa", icon: FileText },
  { id: "travel", name: "Viagens", icon: Plane },
  { id: "hotelaria", name: "Hotelaria", icon: Hotel },
  { id: "rodoviario", name: "Rodoviário", icon: Bus },
  { id: "bizpay", name: "Bizpay", icon: CreditCard },
  {
    id: "biztripexpense",
    name: "Biztrip Expense",
    icon: Receipt,
  },
  { id: "ai", name: "IA", icon: Sparkles },
  { id: "reports", name: "Reports", icon: BarChart },
  { id: "integrations", name: "Integrations", icon: Plug },
  { id: "implementation", name: "Implementação", icon: Rocket },
  { id: "investment", name: "Investimento", icon: TrendingUp },
  { id: "whybiztrip", name: "Por que Biztrip?", icon: Star },
  { id: "support", name: "Suporte", icon: HeadphonesIcon },
  { id: "contact", name: "Contato", icon: Mail },
];

const SLIDE_TOTAL = 14;

type FormState = {
  cover: {
    title: string;
    company: string;
    subtitle: string;
    date: string;
    validity: string;
    companyLogo: string;
  };
  contact: {
    headline: string;
    sellerName: string;
    sellerContact: string;
    sellerEmail: string;
    linkedin: string;
  };
  travel: {
    headline: string;
    description: string;
    service1: string;
    service2: string;
    service3: string;
    service4: string;
    service5: string;
    service6: string;
    benefit1title: string;
    benefit1desc: string;
    benefit2title: string;
    benefit2desc: string;
    benefit3title: string;
    benefit3desc: string;
  };
  hotelaria: {
    headline: string;
    description: string;
    f1title: string;
    f1desc: string;
    f2title: string;
    f2desc: string;
    f3title: string;
    f3desc: string;
  };
  rodoviario: {
    headline: string;
    description: string;
    col1: string;
    col2: string;
    row1b: string;
    row1d: string;
    row2b: string;
    row2d: string;
    row3b: string;
    row3d: string;
    row4b: string;
    row4d: string;
  };
  bizpay: {
    headline: string;
    description: string;
    f1bold: string;
    f1rest: string;
    f2bold: string;
    f2rest: string;
    f3bold: string;
    f3rest: string;
    f4bold: string;
    f4rest: string;
  };
  biztripexpense: {
    headline: string;
    description: string;
    f1title: string;
    f1desc: string;
    f2title: string;
    f2desc: string;
    f3title: string;
    f3desc: string;
    f4title: string;
    f4desc: string;
  };
  ai: {
    headline: string;
    description: string;
    capability1: string;
    capability1Desc: string;
    capability2: string;
    capability2Desc: string;
    capability3: string;
    capability3Desc: string;
    capability4: string;
    capability4Desc: string;
  };
  reports: {
    headline: string;
    description: string;
  };
  integrations: {
    headline: string;
    description: string;
    int1: string;
    int1Logo: string;
    int2: string;
    int2Logo: string;
    int3: string;
    int3Logo: string;
    int4: string;
    int4Logo: string;
    int5: string;
    int5Logo: string;
    int6: string;
    int6Logo: string;
    int7: string;
    int7Logo: string;
    int8: string;
    int8Logo: string;
    int9: string;
    int9Logo: string;
    int10: string;
    int10Logo: string;
  };
  support: {
    headline: string;
    description: string;
    channel1: string;
    channel2: string;
    channel3: string;
    sla: string;
    hours: string;
    plan: string;
  };
  implementation: {
    headline: string;
    description: string;
    phase1: string;
    phase1Duration: string;
    phase2: string;
    phase2Duration: string;
    phase3: string;
    phase3Duration: string;
    phase4: string;
    phase4Duration: string;
    phase5: string;
    phase5Duration: string;
    totalDuration: string;
  };
  investment: {
    headline: string;
    implantacaoTreinamentos: string;
    emissaoAereo: string;
    emissaoRodoviario: string;
    emissaoCarro: string;
    bilheteNaoVoado: string;
    atendimento24h: string;
    reembolso: string;
    biTravelExpense: string;
    emissaoAssentoConforto: string;
    compraBagagem: string;
    reservasLongstay: string;
    disponibilidadeApi: string;
    solicitacaoReembolso: string;
    iaIntegradoDespesas: string;
    emissaoNovosCartoesFisicos: string;
    cartaoBizpay: string;
    criacaoCartaoVirtual: string;
    formaPagamento: string;
    prazo: string;
  };
  whybiztrip: {
    headline: string;
    description: string;
    d1title: string;
    d1desc: string;
    d2title: string;
    d2desc: string;
    d3title: string;
    d3desc: string;
    d4title: string;
    d4desc: string;
    d5title: string;
    d5desc: string;
    d6title: string;
    d6desc: string;
    d7title: string;
    d7desc: string;
    d8title: string;
    d8desc: string;
    d9title: string;
    d9desc: string;
    d10title: string;
    d10desc: string;
  };
};

const defaultForm: FormState = {
  cover: {
    title: "Proposta Comercial",
    company: "Nome da Empresa",
    subtitle: "Gestão Inteligente de Viagens Corporativas",
    date: "2026",
    validity: "Validade 30 dias",
    companyLogo: "",
  },
  contact: {
    headline: "Dúvidas? Entre em contato conosco",
    sellerName: "Nome do vendedor",
    sellerContact: "Contato do vendedor",
    sellerEmail: "E-mail do vendedor",
    linkedin: "/linkedindabiztrip",
  },
  travel: {
    headline: "Gestão de Viagens",
    description:
      "Reservar uma viagem corporativa deveria ser tão simples quanto comprar online. A Biztrip oferece uma experiência moderna, intuitiva e totalmente aderente às políticas da empresa.",
    service1: "Passagens aéreas",
    service2: "Hospedagens",
    service3: "Rodoviário",
    service4: "Locação de veículos",
    service5: "Bilhetes não voados",
    service6: "Voos internacionais",
    benefit1title: "Mais autonomia para os viajantes",
    benefit1desc:
      "Encontram as melhores opções disponíveis sem depender de trocas intermináveis de e-mails.",
    benefit2title: "Mais controle para os gestores",
    benefit2desc:
      "Todas as solicitações seguem automaticamente os fluxos definidos pela empresa.",
    benefit3title: "Mais economia para a organização",
    benefit3desc:
      "A plataforma consulta múltiplas fontes simultaneamente para encontrar as melhores oportunidades disponíveis.",
  },
  hotelaria: {
    headline: "Marketplace de Hotelaria",
    description:
      "O hotel certo. No lugar certo. Pelo preço certo. Nem sempre os melhores hotéis estão nas grandes plataformas. Por isso a Biztrip combina tecnologia, acordos corporativos e negociações diretas para ampliar as opções disponíveis.",
    f1title: "Cobertura Ampliada",
    f1desc:
      "Grandes redes, hotéis regionais e hotéis independentes em uma única busca.",
    f2title: "Política Automática",
    f2desc:
      "Visualize instantaneamente quais opções estão dentro ou fora da política da empresa.",
    f3title: "Mais Economia",
    f3desc:
      "Conteúdo ampliado significa mais competitividade e melhores negociações.",
  },
  rodoviario: {
    headline: "Marketplace Rodoviário",
    description:
      "Nem toda viagem corporativa acontece de avião. A Biztrip possui um dos maiores marketplaces rodoviários corporativos do Brasil.",
    col1: "Benefício",
    col2: "Descrição",
    row1b: "Mais Opções",
    row1d: "Mais de 500 viações disponíveis em uma única busca",
    row2b: "Mais Conveniência",
    row2d: "Compare horários, categorias e preços em segundos",
    row3b: "Mais Controle",
    row3d: "Todas as reservas seguem as mesmas políticas das viagens aéreas",
    row4b: "Rotas combinadas",
    row4d: "Combine rotas e viações diferentes até o seu destino final",
  },
  bizpay: {
    headline: "Bizpay: Cartões corporativos",
    description:
      "Gastar com controle nunca foi tão fácil. O Bizpay conecta despesas, viagens e pagamentos em uma única experiência. Cada compra realizada já nasce integrada à plataforma Biztrip.",
    f1bold: "Cartões físicos e virtuais",
    f1rest: "integrados",
    f2bold: "Limites por usuário",
    f2rest: "e centro de custo",
    f3bold: "Bloqueios inteligentes",
    f3rest: "em tempo real",
    f4bold: "Controle em tempo real",
    f4rest: "de despesas",
  },
  biztripexpense: {
    headline: "Biztrip Expense: Controle de Despesas",
    description:
      "Fotografar um comprovante é mais fácil do que preencher um relatório. Prestação de contas não deveria tomar tempo de quem precisa produzir. Por isso a Biztrip utiliza Inteligência Artificial para transformar comprovantes em informações prontas para aprovação.",
    f1title: "OCR Inteligente",
    f1desc:
      "Fotografe o comprovante e a plataforma identifica automaticamente estabelecimento, valor, data, categoria e centro de custo.",
    f2title: "Menos Erros",
    f2desc:
      "A IA identifica despesas duplicadas e inconsistências automaticamente.",
    f3title: "Mais Velocidade",
    f3desc: "Reduza drasticamente o tempo gasto com conferências manuais.",
    f4title: "Adiantamentos",
    f4desc:
      "Adiante orçamentos para os colaboradores de forma rápida e intuitiva.",
  },
  ai: {
    headline: "Inteligência Artificial a Serviço das Viagens",
    description:
      "Nossa IA analisa padrões, antecipa necessidades e sugere as melhores opções para cada viagem corporativa.",
    capability1: "Assistente Virtual 24/7",
    capability1Desc:
      "Suporte inteligente para dúvidas, rebooking e emergências em qualquer idioma.",
    capability2: "Recomendação Preditiva",
    capability2Desc:
      "Sugere voos e hotéis baseado no histórico e preferências do viajante.",
    capability3: "Detecção de Anomalias",
    capability3Desc:
      "Identifica gastos fora da política automaticamente e aciona alertas.",
    capability4: "OCR Inteligente",
    capability4Desc:
      "Fotografe o comprovante e a plataforma identifica automaticamente as informações da despesa.",
  },
  reports: {
    headline: "Relatórios e Analytics Avançados",
    description:
      "Dashboards em tempo real com todos os KPIs de viagens corporativas para decisões mais inteligentes.",
  },
  integrations: {
    headline: "Integrações com seu Ecossistema",
    description:
      "Conecte o biztrip às ferramentas que sua empresa já usa, sem fricção e sem retrabalho.",
    int1: "SAP / Oracle",
    int1Logo: "",
    int2: "Salesforce",
    int2Logo: "",
    int3: "Slack / Teams",
    int3Logo: "",
    int4: "Concur",
    int4Logo: "",
    int5: "Totvs",
    int5Logo: "",
    int6: "API Própria",
    int6Logo: "",
    int7: "Omnie",
    int7Logo: "",
    int8: "Sankhya",
    int8Logo: "",
    int9: "Conta Azul",
    int9Logo: "",
    int10: "99",
    int10Logo: "",
  },
  support: {
    headline: "Suporte dedicado e especializado",
    description:
      "Equipe especializada em viagens corporativas disponível para garantir a melhor experiência para seus viajantes.",
    channel1: "Chat em tempo real",
    channel2: "E-mail dedicado",
    channel3: "Telefone 0800",
    sla: "Resposta em até 2 horas",
    hours: "24 horas / 7 dias",
    plan: "Premium Enterprise",
  },
  implementation: {
    headline: "Implantação rápida e sem fricção",
    description:
      "Processo estruturado de onboarding para sua empresa estar operacional em poucas semanas.",
    phase1: "Assinatura de contrato",
    phase1Duration: "3 dias",
    phase2: "Configuração de Plataforma",
    phase2Duration: "2-3 dias",
    phase3: "Treinamento",
    phase3Duration: "1-2 dias",
    phase4: "Suporte e CS",
    phase4Duration: "30 dias",
    phase5: "Integração de sistema (ERP)",
    phase5Duration: "3 meses",
    totalDuration: "Implantação em até 30 dias",
  },
  investment: {
    headline: "Investimento Total",
    implantacaoTreinamentos: "",
    emissaoAereo: "",
    emissaoRodoviario: "",
    emissaoCarro: "",
    bilheteNaoVoado: "",
    atendimento24h: "",
    reembolso: "",
    biTravelExpense: "",
    emissaoAssentoConforto: "",
    compraBagagem: "",
    reservasLongstay: "",
    disponibilidadeApi: "",
    solicitacaoReembolso: "",
    iaIntegradoDespesas: "",
    emissaoNovosCartoesFisicos: "",
    cartaoBizpay: "7,00",
    criacaoCartaoVirtual: "",
    formaPagamento: "",
    prazo: "",
  },
  whybiztrip: {
    headline: "Por que escolher a Biztrip?",
    description:
      "A biztrip se diferencia no mercado por oferecer uma solução completa e integrada.",
    d1title: "Plataforma Única",
    d1desc: "Gestão Completa de Travel, Expense e Pagamentos em um só lugar.",
    d2title: "Atendimento 24hrs",
    d2desc: "Suporte humano especializado disponível em qualquer fuso horário.",
    d3title: "Marketplace Rodoviário e Hotelaria Exclusivos",
    d3desc: "O maior inventário corporativo do Brasil integrado nativamente.",
    d4title: "Gestão Avançada de Créditos",
    d4desc: "Monitoramento proativo de bilhetes não utilizados.",
    d5title: "Tecnologia Própria em Evolução",
    d5desc: "Agilidade para integrações personalizadas e inovação contínua.",
    d6title: "Dashboards em Tempo Real",
    d6desc: "Visibilidade total de gastos e indicadores estratégicos.",
    d7title: "Customer Success Dedicado",
    d7desc: "Acompanhamento contínuo para garantir resultados.",
    d8title: "Integrações Corporativas",
    d8desc: "APIs abertas para ERP, RH, Financeiro e BI.",
    d9title: "Inteligência Artificial Aplicada",
    d9desc: "IA para auditoria automática e leitura de comprovantes.",
    d10title: "Monitoramento de bilhetes não utilizados",
    d10desc: "IA para auditoria automática e leitura de comprovantes.",
  },
};

function SlideWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full bg-white rounded-lg overflow-hidden shadow-xl border border-neutral-300 flex flex-col relative"
      style={{ minHeight: 842 }}
    >
      {children}
    </div>
  );
}

function SlideHeader({
  title,
  accent = false,
}: {
  title: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`px-8 py-4 flex items-center justify-between ${accent ? "bg-[#2563eb]" : "bg-[#1e3a5f]"}`}
    >
      <img
        src={biztripBIcon}
        alt="biztrip"
        className="h-4 w-auto opacity-80 object-contain"
      />
      <span className="text-white text-xs opacity-60">{title}</span>
    </div>
  );
}

function SlideFooter({
  page,
  total = SLIDE_TOTAL,
}: {
  page: number;
  total?: number;
}) {
  return (
    <div className="px-8 py-3 bg-neutral-50 border-t flex items-center justify-between mt-auto">
      <span className="text-[10px] text-neutral-400">
        Proposta Comercial — biztrip
      </span>
      <span className="text-[10px] text-neutral-400">
        {page} / {total}
      </span>
    </div>
  );
}

/** Mockup posicionado conforme Figma node 36:522 — CoverSlide (36:450) e Contact (36:521) */
function SmartphoneHomeMockup({ variant }: { variant: "cover" | "contact" }) {
  const figma =
    variant === "cover"
      ? { left: 264, top: -66, width: 398, height: 383 }
      : { left: -153, top: 479, width: 341, height: 328 };

  return (
    <img
      src={smartphoneHomeBiztrip}
      alt=""
      draggable={false}
      className="absolute pointer-events-none select-none drop-shadow-[0px_8px_24px_rgba(0,0,0,0.35)]"
      style={{
        left: figma.left,
        top: figma.top,
        width: figma.width,
        height: figma.height,
        objectFit: "contain",
      }}
    />
  );
}

function CoverSlide({
  data,
  visibleFields,
}: {
  data: FormState["cover"];
  visibleFields: Record<string, boolean>;
}) {
  const v = (field: string) => visibleFields[`cover.${field}`] !== false;
  return (
    <SlideWrapper>
      <div className="relative h-[842px] overflow-hidden bg-[#1e3a5f]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#2563eb] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#2563eb] -translate-x-1/2 translate-y-1/2" />
        </div>
        {/* Área de conteúdo 800px — Figma Container 36:435 */}
        <div className="absolute inset-x-0 top-0 h-[800px]">
          <SmartphoneHomeMockup variant="cover" />
          <div className="relative flex h-full flex-col items-center justify-center px-16 text-center">
            <img src={biztripLogo} alt="biztrip" className="mb-0 h-8 w-auto" />
            {v("title") && (
              <h1 className="text-white text-3xl mb-0 leading-tight">
                {data.title || "Proposta Comercial"}
              </h1>
            )}
            {v("subtitle") && (
              <p className="text-white/70 text-sm mb-3 max-w-md">
                {data.subtitle || "Gestão Inteligente de Viagens Corporativas"}
              </p>
            )}
            <div className="w-16 h-0.5 bg-[#2563eb] mx-auto mb-3" />
            {v("company") && (
              <div className="px-6 py-2 rounded-lg bg-white/10 border border-white/20">
                <p className="text-white text-base">
                  {data.company || "Nome da Empresa"}
                </p>
              </div>
            )}
            {v("companyLogo") && data.companyLogo && (
              <div className="mt-4 flex items-center justify-center">
                <img
                  src={data.companyLogo}
                  alt="Logo da empresa"
                  className="h-12 max-w-[160px] object-contain"
                />
              </div>
            )}
          </div>
        </div>
        {/* Rodapé 40px — Figma Container 36:451 */}
        <div className="absolute inset-x-0 bottom-0 h-10 px-10 bg-[#2563eb]/30 flex items-center justify-between">
          {v("validity") && (
            <span className="text-white/60 text-xs">
              {data.validity || "Validade 30 dias"}
            </span>
          )}
          {v("date") && (
            <span className="text-white/60 text-xs">{data.date || "2026"}</span>
          )}
        </div>
      </div>
    </SlideWrapper>
  );
}

function ContactSlide({
  data,
  coverDate,
  coverValidity,
  visibleFields,
}: {
  data: FormState["contact"];
  coverDate: string;
  coverValidity: string;
  visibleFields: Record<string, boolean>;
}) {
  const v = (field: string) => visibleFields[`contact.${field}`] !== false;
  const cvDate = (field: string) => visibleFields[`cover.${field}`] !== false;
  const fields = [
    {
      icon: User,
      value: data.sellerName || "Nome do vendedor",
      key: "sellerName",
    },
    {
      icon: Phone,
      value: data.sellerContact || "Contato do vendedor",
      key: "sellerContact",
    },
    {
      icon: Mail,
      value: data.sellerEmail || "E-mail do vendedor",
      key: "sellerEmail",
    },
    {
      icon: Linkedin,
      value: data.linkedin || "/linkedindabiztrip",
      key: "linkedin",
    },
  ];

  return (
    <SlideWrapper>
      <div className="relative h-[842px] overflow-hidden bg-[#1e3a5f]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#2563eb] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#2563eb] -translate-x-1/2 translate-y-1/2" />
        </div>
        {/* Mockup no nível do SlideWrapper — Figma 36:521 */}
        <SmartphoneHomeMockup variant="contact" />
        <div className="absolute inset-x-0 top-0 h-[800px] flex flex-col items-center px-12 text-center">
          {v("headline") && (
            <h2 className="text-white text-lg font-semibold leading-snug max-w-[220px] mt-[237px] whitespace-pre-line">
              {data.headline || "Dúvidas? Entre em contato conosco"}
            </h2>
          )}
          <div className="w-16 h-0.5 bg-[#2563eb] mx-auto mt-2 mb-4" />
          <div className="w-full max-w-[259px] space-y-2">
            {fields.map(
              ({ icon: Icon, value, key }, i) =>
                v(key) && (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 text-left"
                  >
                    <Icon className="size-3.5 text-neutral-400 shrink-0" />
                    <span className="text-neutral-500 text-xs truncate">
                      {value}
                    </span>
                  </div>
                ),
            )}
          </div>
          <div className="mt-auto mb-[90px] flex flex-col items-center">
            <img src={biztripLogo} alt="biztrip" className="h-8 w-auto mb-1" />
            <span className="text-[#2563eb] text-[8px] tracking-wide">
              powered by
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <img
                src={biztripBadge}
                alt="biztrip"
                className="h-[11px] w-[50px]"
              />
              <img
                src={kennedyLogo}
                alt="Kennedy Viagens"
                className="h-[8px] w-[32px]"
              />
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-10 px-10 bg-[#2563eb]/30 flex items-center justify-between">
          {cvDate("validity") && (
            <span className="text-white/60 text-xs">
              {coverValidity || "Validade 30 dias"}
            </span>
          )}
          {cvDate("date") && (
            <span className="text-white/60 text-xs">{coverDate || "2026"}</span>
          )}
        </div>
      </div>
    </SlideWrapper>
  );
}

function TravelSlide({
  data,
  visibleFields,
}: {
  data: FormState["travel"];
  visibleFields: Record<string, boolean>;
}) {
  const v = (field: string) => visibleFields[`travel.${field}`] !== false;
  const serviceIcons = [
    // Passagens aéreas - airplane SVG from Figma
    <div
      key="s1"
      className="bg-[rgba(37,99,235,0.1)] relative rounded-[4px] shrink-0 size-[24px] flex items-center justify-center"
    >
      <div className="relative shrink-0 size-[16px]">
        <div className="overflow-clip relative rounded-[inherit] size-full">
          <div className="absolute inset-[18.75%_6.25%]">
            <div className="absolute inset-[-5%_-3.57%]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 15 11"
              >
                <path
                  d={travelSvgPaths.p3d70ae80}
                  stroke="#005BC4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>,
    // Hospedagens - bed icon
    <div
      key="s2"
      className="bg-[rgba(37,99,235,0.1)] relative rounded-[4px] shrink-0 size-[24px] flex items-center justify-center"
    >
      <div className="relative shrink-0 size-[16px]">
        <div className="overflow-clip relative rounded-[inherit] size-full">
          <div className="absolute inset-[15.63%_16.41%_12.5%_16.41%]">
            <div className="absolute inset-[-4.35%_-4.65%]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 11.75 12.5"
              >
                <path
                  d={travelSvgPaths.p14d9b000}
                  stroke="#005BC4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>,
    // Rodoviário - bus icon
    <div
      key="s3"
      className="bg-[rgba(37,99,235,0.1)] relative rounded-[4px] shrink-0 size-[24px] flex items-center justify-center"
    >
      <div className="relative shrink-0 size-[16px]">
        <div className="overflow-clip relative rounded-[inherit] size-full">
          <div className="absolute inset-[9.38%_9.29%_9.38%_9.38%]">
            <div className="absolute inset-[-3.85%_-3.84%]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 14.0141 14"
              >
                <path
                  d={travelSvgPaths.p2d7639f0}
                  stroke="#005BC4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>,
    // Locação de veículos - car icon
    <div
      key="s4"
      className="bg-[rgba(37,99,235,0.1)] relative rounded-[4px] shrink-0 size-[24px] flex items-center justify-center"
    >
      <div className="relative shrink-0 size-[16px]">
        <div className="overflow-clip relative rounded-[inherit] size-full">
          <div className="absolute inset-[18.75%_6.25%_15.63%_6.25%]">
            <div className="absolute inset-[-4.76%_-3.57%]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 15 11.5"
              >
                <path
                  d={travelSvgPaths.p1362d280}
                  stroke="#005BC4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>,
    // Bilhetes não voados - ticket icon (mask-image)
    <div
      key="s5"
      className="bg-[rgba(37,99,235,0.1)] relative rounded-[4px] shrink-0 size-[24px] flex items-center justify-center"
    >
      <div className="relative shrink-0 size-[16px]">
        <div
          className="absolute inset-[16.67%_8.33%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-2.667px_-5.333px] mask-size-[32px_32px]"
          style={{ maskImage: `url("${travelImgLocalActivity}")` }}
        >
          <svg
            className="absolute block inset-0 size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 13.3333 10.6667"
          >
            <path d={travelSvgPaths.p2e656b80} fill="#005BC4" />
          </svg>
        </div>
      </div>
    </div>,
    // Voos internacionais - airlines icon (mask-image)
    <div
      key="s6"
      className="bg-[rgba(37,99,235,0.1)] relative rounded-[4px] shrink-0 size-[24px] flex items-center justify-center"
    >
      <div className="relative shrink-0 size-[16px]">
        <div
          className="absolute inset-[16.67%_8.33%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-2.667px_-5.333px] mask-size-[32px_32px]"
          style={{ maskImage: `url("${travelImgLocalActivity}")` }}
        >
          <svg
            className="absolute block inset-0 size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 13.3333 10.6667"
          >
            <path d={travelSvgPaths.p3d496180} fill="#005BC4" />
          </svg>
        </div>
      </div>
    </div>,
  ];

  const services = [
    { label: data.service1 || "Passagens aéreas", iconIdx: 0, key: "service1" },
    { label: data.service2 || "Hospedagens", iconIdx: 1, key: "service2" },
    { label: data.service3 || "Rodoviário", iconIdx: 2, key: "service3" },
    {
      label: data.service4 || "Locação de veículos",
      iconIdx: 3,
      key: "service4",
    },
    {
      label: data.service5 || "Bilhetes não voados",
      iconIdx: 4,
      key: "service5",
    },
    {
      label: data.service6 || "Voos internacionais",
      iconIdx: 5,
      key: "service6",
    },
  ].filter((s) => v(s.key));

  const checkIcon = (
    <div className="relative shrink-0 size-[20px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 32 32"
        >
          <g />
        </svg>
        <div className="absolute inset-[40.63%_32.81%_37.5%_32.81%]">
          <div className="absolute inset-[-14.29%_-9.09%]">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 8.125 5.625"
            >
              <path
                d={travelSvgPaths.p1773c4c0}
                stroke="#005BC4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.25"
              />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[12.5%]">
          <div className="absolute inset-[-4.17%]">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 16.25 16.25"
            >
              <path
                d={travelSvgPaths.p35691400}
                stroke="#005BC4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.25"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <SlideWrapper>
      <SlideHeader title="Viagens" />
      <div className="flex-1 flex flex-col px-8 py-6 bg-white overflow-hidden gap-5 relative">
        {/* Title + description */}
        <div className="relative shrink-0 w-full">
          {v("headline") && (
            <p className="font-semibold leading-[24.75px] text-[#2563eb] text-[18px] tracking-[-0.4395px]">
              {data.headline || "Gestão de Viagens"}
            </p>
          )}
          {v("description") && (
            <p className="font-normal leading-[19.5px] text-[#737373] text-[12px] pt-[8px]">
              {data.description}
            </p>
          )}
        </div>

        {/* Services grid - 2 columns, 3 rows with absolute-like layout */}
        {services.length > 0 && (
          <div className="h-[142px] relative shrink-0 w-full">
            <div className="relative size-full">
              {services.map((s, i) => {
                const col = i % 2;
                const row = Math.floor(i / 2);
                return (
                  <div
                    key={i}
                    className="absolute flex gap-[8px] items-center px-[13px] py-[9px] rounded-[10px]"
                    style={{
                      left: col === 0 ? 0 : "calc(50% + 8px)",
                      top: row * 50,
                      width: "calc(50% - 4px)",
                      border: "1px solid #e5e5e5",
                    }}
                  >
                    {serviceIcons[s.iconIdx]}
                    <span className="text-[#404040] text-[12px] leading-[16px]">
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Benefits list */}
        <div className="flex flex-col gap-[12px]">
          {[
            {
              title: data.benefit1title || "Mais autonomia para os viajantes",
              desc: data.benefit1desc,
              key: "benefit1title",
            },
            {
              title: data.benefit2title || "Mais controle para os gestores",
              desc: data.benefit2desc,
              key: "benefit2title",
            },
            {
              title: data.benefit3title || "Mais economia para a organização",
              desc: data.benefit3desc,
              key: "benefit3title",
            },
          ]
            .filter((b) => v(b.key))
            .map((b, i) => (
              <div key={i} className="flex gap-[8px] items-start">
                {checkIcon}
                <div>
                  <p className="text-[#262626] text-[12px] leading-[16px]">
                    {b.title}
                  </p>
                  <p className="text-[#737373] text-[11px] leading-[17.875px] tracking-[0.0645px]">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* Decorative document mockup image */}
        <div className="-translate-x-1/2 absolute h-[385px] left-[calc(50%-0.5px)] top-[466px] w-[476px] pointer-events-none">
          <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden">
            <img
              alt=""
              className="absolute h-[157.56%] left-[-28.43%] max-w-none top-[-40.41%] w-[159.34%]"
              src={travelImgDocumento2}
            />
          </div>
        </div>
      </div>
      <SlideFooter page={2} />
    </SlideWrapper>
  );
}

function HotelariaSlide({
  data,
  visibleFields,
}: {
  data: FormState["hotelaria"];
  visibleFields: Record<string, boolean>;
}) {
  const v = (field: string) => visibleFields[`hotelaria.${field}`] !== false;
  // Hotel icon from Figma (building icon with windows)
  const hotelIcon = (
    <div className="bg-[rgba(37,99,235,0.1)] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[28px]">
      <div className="relative shrink-0 size-[14px]">
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 14 14"
        >
          <g>
            <path
              d="M5.83333 12.8333V9.00083"
              stroke="#2563EB"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.16667"
            />
            <path
              d="M7 6.41667H7.00583"
              stroke="#2563EB"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.16667"
            />
            <path
              d="M7 4.08333H7.00583"
              stroke="#2563EB"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.16667"
            />
            <path
              d="M8.16667 9.00083V12.8333"
              stroke="#2563EB"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.16667"
            />
            <path
              d={hotelariaSvgPaths.p30fe6500}
              stroke="#2563EB"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.16667"
            />
            <path
              d="M9.33333 6.41667H9.33917"
              stroke="#2563EB"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.16667"
            />
            <path
              d="M9.33333 4.08333H9.33917"
              stroke="#2563EB"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.16667"
            />
            <path
              d="M4.66667 6.41667H4.6725"
              stroke="#2563EB"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.16667"
            />
            <path
              d="M4.66667 4.08333H4.6725"
              stroke="#2563EB"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.16667"
            />
            <path
              d={hotelariaSvgPaths.p162a1600}
              stroke="#2563EB"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.16667"
            />
          </g>
        </svg>
      </div>
    </div>
  );

  // Policy icon from Figma
  const policyIcon = (
    <div className="bg-[rgba(37,99,235,0.1)] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[28px]">
      <div className="relative shrink-0 size-[14px]">
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 14 14"
        >
          <g>
            <path
              d={hotelariaSvgPaths.pd04fc00}
              stroke="#2563EB"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.16667"
            />
          </g>
        </svg>
      </div>
    </div>
  );

  // Savings icon from Figma (dollar/coin)
  const savingsIcon = (
    <div className="bg-[rgba(37,99,235,0.1)] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[28px]">
      <div className="relative shrink-0 size-[14px]">
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 14 14"
        >
          <g>
            <path
              d={hotelariaSvgPaths.p1977ee80}
              stroke="#2563EB"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.16667"
            />
            <path
              d={hotelariaSvgPaths.p3471a100}
              stroke="#2563EB"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.16667"
            />
          </g>
        </svg>
      </div>
    </div>
  );

  const features = [
    {
      title: data.f1title || "Cobertura Ampliada",
      desc: data.f1desc,
      icon: hotelIcon,
      key: "f1title",
    },
    {
      title: data.f2title || "Política Automática",
      desc: data.f2desc,
      icon: policyIcon,
      key: "f2title",
    },
    {
      title: data.f3title || "Mais Economia",
      desc: data.f3desc,
      icon: savingsIcon,
      key: "f3title",
    },
  ].filter((f) => v(f.key));

  return (
    <SlideWrapper>
      <SlideHeader title="Hotelaria" />
      <div className="flex-1 flex flex-col px-8 py-6 bg-white gap-5 overflow-hidden relative">
        <div>
          {v("headline") && (
            <p className="font-semibold leading-[28px] text-[#2563eb] text-[18px] tracking-[-0.4395px]">
              {data.headline || "Marketplace de Hotelaria"}
            </p>
          )}
          {v("description") && (
            <p className="font-normal leading-[19.5px] text-[#737373] text-[12px] pt-[8px]">
              {data.description}
            </p>
          )}
        </div>
        {features.length > 0 && (
          <div className="flex flex-col gap-[12px]">
            {features.map((f, i) => (
              <div
                key={i}
                className="relative rounded-[10px]"
                style={{ border: "1px solid #e5e5e5" }}
              >
                <div className="flex gap-[12px] items-start px-[17px] py-[13px]">
                  <div className="flex items-start pt-[2px]">{f.icon}</div>
                  <div className="h-[48px] relative w-[455px]">
                    <p className="absolute font-normal left-0 text-[#262626] text-[12px] top-[3px] w-[455px]">
                      <span className="leading-[16px]">{f.title}:</span>
                      <span className="leading-[16px] text-[#737373]">{` ${f.desc}`}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Decorative mockup image */}
        <div className="-translate-x-1/2 absolute h-[337px] left-1/2 top-[456px] w-[595px] pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            <img
              alt=""
              className="absolute h-[117%] left-0 max-w-none top-[-16.07%] w-full"
              src={hotelariaImgMockup51}
            />
          </div>
        </div>
      </div>
      <SlideFooter page={3} />
    </SlideWrapper>
  );
}

function RodoviarioSlide({
  data,
  visibleFields,
}: {
  data: FormState["rodoviario"];
  visibleFields: Record<string, boolean>;
}) {
  const v = (field: string) => visibleFields[`rodoviario.${field}`] !== false;
  const checkIcon = (
    <div className="relative shrink-0 size-[20px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 32 32"
        >
          <g />
        </svg>
        <div className="absolute inset-[40.63%_32.81%_37.5%_32.81%]">
          <div className="absolute inset-[-14.29%_-9.09%]">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 8.125 5.625"
            >
              <path
                d={rodoviarioSvgPaths.p1773c4c0}
                stroke="#005BC4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.25"
              />
            </svg>
          </div>
        </div>
        <div className="absolute inset-[12.5%]">
          <div className="absolute inset-[-4.17%]">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 16.25 16.25"
            >
              <path
                d={rodoviarioSvgPaths.p35691400}
                stroke="#005BC4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.25"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  const tableRows = [
    {
      b: data.row1b || "Mais Opções",
      d: data.row1d || "Mais de 500 viações disponíveis em uma única busca",
      bg: "bg-[#fafafa]",
      bk: "row1b",
      dk: "row1d",
    },
    {
      b: data.row2b || "Mais Conveniência",
      d: data.row2d || "Compare horários, categorias e preços em segundos",
      bg: "bg-white",
      bk: "row2b",
      dk: "row2d",
    },
    {
      b: data.row3b || "Mais Controle",
      d:
        data.row3d ||
        "Todas as reservas seguem as mesmas políticas das viagens aéreas",
      bg: "bg-[#fafafa]",
      bk: "row3b",
      dk: "row3d",
    },
    {
      b: data.row4b || "Rotas combinadas",
      d:
        data.row4d ||
        "Combine rotas e viações diferentes até o seu destino final",
      bg: "bg-white",
      bk: "row4b",
      dk: "row4d",
    },
  ].filter((r) => v(r.bk) || v(r.dk));

  return (
    <SlideWrapper>
      <SlideHeader title="Rodoviário" />
      <div className="flex-1 flex flex-col px-8 py-6 bg-white gap-5 overflow-hidden relative">
        <div>
          {v("headline") && (
            <p className="font-semibold leading-[28px] text-[#2563eb] text-[18px] tracking-[-0.4395px]">
              {data.headline || "Marketplace Rodoviário"}
            </p>
          )}
          {v("description") && (
            <p className="font-normal leading-[19.5px] text-[#737373] text-[12px] pt-[8px]">
              {data.description}
            </p>
          )}
        </div>
        <div className="flex-[609_0_0] min-h-px relative w-full overflow-clip rounded-[inherit]">
          {/* Table header */}
          <div className="bg-[#2563eb] h-[36px] relative rounded-tl-[10px] rounded-tr-[10px]">
            <div className="flex items-start px-[16px] py-[10px] size-full">
              <div className="flex-[248.5_0_0] h-full min-w-px">
                <p className="text-[12px] text-white leading-[16px]">
                  {data.col1 || "Benefício"}
                </p>
              </div>
              <div className="flex-[248.5_0_0] h-full min-w-px">
                <p className="text-[12px] text-white leading-[16px]">
                  {data.col2 || "Descrição"}
                </p>
              </div>
            </div>
          </div>
          {/* Table rows */}
          {tableRows.map((row, i) => (
            <div
              key={i}
              className={`${row.bg} h-[57px] relative`}
              style={{ borderBottom: "1px solid #f5f5f5" }}
            >
              <div className="flex items-start pb-[13px] pt-[12px] px-[16px] size-full">
                <div className="flex-[248.5_0_0] h-full min-w-px flex gap-[8px] items-center">
                  {v(row.bk) && checkIcon}
                  {v(row.bk) && (
                    <span className="text-[#262626] text-[12px] leading-[16px]">
                      {row.b}
                    </span>
                  )}
                </div>
                {v(row.dk) && (
                  <div className="flex-[248.5_0_0] h-full min-w-px">
                    <p className="text-[#737373] text-[12px] leading-[16px] w-[249px]">
                      {row.d}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {/* Decorative mockup image overlaid */}
          <div className="absolute flex h-[478.181px] items-center justify-center left-[-24.06px] top-[291.41px] w-[558.115px] pointer-events-none">
            <div className="flex-none rotate-[-0.75deg]">
              <div className="h-[471px] relative w-[552px]">
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    alt=""
                    className="absolute h-[121.88%] left-0 max-w-none top-[-21.81%] w-full"
                    src={rodoviarioImgMockup041}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter page={4} />
    </SlideWrapper>
  );
}

function BizpaySlide({
  data,
  visibleFields,
}: {
  data: FormState["bizpay"];
  visibleFields: Record<string, boolean>;
}) {
  const v = (field: string) => visibleFields[`bizpay.${field}`] !== false;
  const featureTexts = [
    {
      bold: data.f1bold || "Cartões físicos e virtuais",
      rest: data.f1rest || "integrados",
      key: "f1bold",
      svgIcon: (
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 20 20"
        >
          <path
            d={bizpaySvgPaths.p16dd5f0}
            stroke="#2563EB"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d="M1.66667 8.33333H18.3333"
            stroke="#2563EB"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </svg>
      ),
    },
    {
      bold: data.f2bold || "Limites por usuário",
      rest: data.f2rest || "e centro de custo",
      key: "f2bold",
      svgIcon: (
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 20 20"
        >
          <path
            d={bizpaySvgPaths.p2566d000}
            stroke="#2563EB"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={bizpaySvgPaths.p1bf79e00}
            stroke="#2563EB"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </svg>
      ),
    },
    {
      bold: data.f3bold || "Bloqueios inteligentes",
      rest: data.f3rest || "em tempo real",
      key: "f3bold",
      svgIcon: (
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 20 20"
        >
          <path
            d={bizpaySvgPaths.p25fc4100}
            stroke="#2563EB"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </svg>
      ),
    },
    {
      bold: data.f4bold || "Controle em tempo real",
      rest: data.f4rest || "de despesas",
      key: "f4bold",
      svgIcon: (
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 16.6667V8.33333"
            stroke="#2563EB"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d="M15 16.6667V3.33333"
            stroke="#2563EB"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d="M5 16.6667V13.3333"
            stroke="#2563EB"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </svg>
      ),
    },
  ].filter((f) => v(f.key));

  return (
    <SlideWrapper>
      <SlideHeader title="Bizpay" />
      <div className="flex-1 flex flex-col px-8 py-6 bg-white gap-5 overflow-hidden relative">
        <div>
          {v("headline") && (
            <p className="font-semibold leading-[28px] text-[#2563eb] text-[18px] tracking-[-0.4395px]">
              {data.headline || "Bizpay: Cartões corporativos"}
            </p>
          )}
          {v("description") && (
            <p className="font-normal leading-[19.5px] text-[#737373] text-[12px] pt-[8px]">
              {data.description}
            </p>
          )}
        </div>
        {/* 2x2 feature grid matching Figma */}
        {featureTexts.length > 0 && (
          <div className="h-[161px] relative w-full">
            <div className="gap-x-[8px] gap-y-[16px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(2,fit-content(100%))] relative size-full">
              {featureTexts.map((f, i) => (
                <div
                  key={i}
                  className="bg-white drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] justify-self-stretch relative rounded-[10px] self-stretch"
                >
                  <div
                    aria-hidden
                    className="absolute border-[#2563eb] border-b border-l-4 border-r border-solid border-t inset-0 pointer-events-none rounded-[10px]"
                  />
                  <div className="flex flex-row items-center size-full">
                    <div className="flex gap-[12px] items-center pl-[12px] pr-[9px] py-[17px] relative size-full">
                      <div className="relative shrink-0 size-[20px]">
                        {f.svgIcon}
                      </div>
                      <div className="h-[38.5px] relative w-[205.5px]">
                        <p className="absolute font-normal left-0 text-[#171717] text-[14px] top-0 tracking-[-0.1504px] w-[206px]">
                          <span className="leading-[19.25px]">{f.bold}</span>
                          <span className="leading-[19.25px] text-[#404040]">{` ${f.rest}`}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* iPhone mockup positioned to the right/bottom as in Figma */}
        <div className="absolute drop-shadow-[0px_8px_4px_rgba(0,0,0,0.25)] h-[500px] left-[174px] top-[408px] w-[246px] pointer-events-none">
          <div className="relative size-full">
            <div className="absolute inset-[2.15%_4.85%_2.27%_5.08%]">
              <img
                alt=""
                className="absolute block inset-0 max-w-none size-full"
                src={bizpayImgScreen}
              />
            </div>
            <div className="absolute inset-[0_-0.23%_0.11%_0]">
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                src={bizpayImgSilver}
              />
            </div>
          </div>
        </div>
      </div>
      <SlideFooter page={5} />
    </SlideWrapper>
  );
}

function BiztripExpenseSlide({
  data,
  visibleFields,
}: {
  data: FormState["biztripexpense"];
  visibleFields: Record<string, boolean>;
}) {
  const v = (field: string) =>
    visibleFields[`biztripexpense.${field}`] !== false;
  // Icon builder using mask-image pattern from Figma
  const makeIcon = (
    svgPath: string,
    inset: string,
    maskPosition: string,
    viewBox: string,
  ) => (
    <div className="bg-[rgba(37,99,235,0.1)] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[28px]">
      <div className="relative shrink-0 size-[16px]">
        <div
          className={`absolute ${inset} mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[16px_16px]`}
          style={{
            maskImage: `url("${expenseImgRequestQuote}")`,
            maskPosition,
          }}
        >
          <svg
            className="absolute block inset-0 size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox={viewBox}
          >
            <path d={svgPath} fill="#005BC4" />
          </svg>
        </div>
      </div>
    </div>
  );

  const featureItems = [
    {
      title: data.f1title || "OCR Inteligente",
      desc:
        data.f1desc ||
        "Fotografe o comprovante e a plataforma identifica automaticamente estabelecimento, valor, data, categoria e centro de custo.",
      icon: makeIcon(
        expenseSvgPaths.p32cb6d00,
        "inset-[8.33%_16.67%]",
        "-2.667px -1.333px",
        "0 0 10.6667 13.3333",
      ),
      key: "f1title",
    },
    {
      title: data.f2title || "Menos Erros",
      desc:
        data.f2desc ||
        "A IA identifica despesas duplicadas e inconsistências automaticamente.",
      icon: makeIcon(
        expenseSvgPaths.pda5e740,
        "inset-[12.5%_8.33%]",
        "-1.333px -2px",
        "0 0 13.3333 12",
      ),
      key: "f2title",
    },
    {
      title: data.f3title || "Mais Velocidade",
      desc:
        data.f3desc ||
        "Reduza drasticamente o tempo gasto com conferências manuais.",
      icon: makeIcon(
        expenseSvgPaths.p2b9610f2,
        "inset-[8.33%]",
        "-1.333px -1.333px",
        "0 0 13.3333 13.3333",
      ),
      key: "f3title",
    },
    {
      title: data.f4title || "Adiantamentos",
      desc:
        data.f4desc ||
        "Adiante orçamentos para os colaboradores de forma rápida e intuitiva.",
      icon: makeIcon(
        expenseSvgPaths.pae68c00,
        "inset-[4.17%]",
        "-0.667px -0.667px",
        "0 0 14.6667 14.6667",
      ),
      key: "f4title",
    },
  ].filter((f) => v(f.key));

  return (
    <SlideWrapper>
      <SlideHeader title="Biztrip Expense" />
      <div className="flex-1 flex flex-col px-8 py-6 bg-white gap-5 overflow-hidden relative">
        <div>
          {v("headline") && (
            <p className="font-semibold leading-[28px] text-[#2563eb] text-[18px] tracking-[-0.4395px]">
              {data.headline || "Biztrip Expense: Controle de Despesas"}
            </p>
          )}
          {v("description") && (
            <p className="font-normal leading-[19.5px] text-[#737373] text-[12px] pt-[8px]">
              {data.description}
            </p>
          )}
        </div>
        {featureItems.length > 0 && (
          <div className="flex flex-col gap-[12px]">
            {featureItems.map((f, i) => (
              <div
                key={i}
                className="bg-[#fafafa] relative rounded-[10px]"
                style={{ border: "1px solid #e5e5e5" }}
              >
                <div className="flex gap-[12px] items-start px-[17px] py-[13px]">
                  <div className="flex items-start pt-[2px]">{f.icon}</div>
                  <div className="h-[35px] relative w-[455px]">
                    <p className="absolute font-normal left-0 text-[#262626] text-[12px] top-[3px] w-[455px]">
                      <span className="leading-[16px]">{f.title}:</span>
                      <span className="leading-[16px] text-[#737373]">{` ${f.desc}`}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Decorative image from Figma */}
        <div className="absolute h-[331px] left-[141px] top-[439px] w-[312px] pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            <img
              alt=""
              className="absolute h-[117.31%] left-[-33.1%] max-w-none top-[-17.28%] w-[165.96%]"
              src={expenseImgImagem041}
            />
          </div>
        </div>
      </div>
      <SlideFooter page={6} />
    </SlideWrapper>
  );
}

function AISlide({
  data,
  visibleFields,
}: {
  data: FormState["ai"];
  visibleFields: Record<string, boolean>;
}) {
  const v = (field: string) => visibleFields[`ai.${field}`] !== false;
  const aiIcon = (
    <div className="bg-[rgba(37,99,235,0.3)] content-stretch flex items-center justify-center relative rounded-[10px] shrink-0 size-[28px]">
      <div className="relative shrink-0 size-[14px]">
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 14 14"
        >
          <g clipPath="url(#clip0_ai_icon)">
            <path
              d={aiSvgPaths.p115b3700}
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.16667"
            />
            <path
              d="M11.6667 1.75V4.08333"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.16667"
            />
            <path
              d="M12.8333 2.91667H10.5"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.16667"
            />
            <path
              d="M2.33333 9.91667V11.0833"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.16667"
            />
            <path
              d="M2.91667 10.5H1.75"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.16667"
            />
          </g>
          <defs>
            <clipPath id="clip0_ai_icon">
              <rect fill="white" height="14" width="14" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );

  const capabilities = [
    {
      title: data.capability1 || "Assistente Virtual 24/7",
      desc:
        data.capability1Desc ||
        "Suporte inteligente para dúvidas, rebooking e emergências em qualquer idioma.",
      key: "capability1",
    },
    {
      title: data.capability2 || "Recomendação Preditiva",
      desc:
        data.capability2Desc ||
        "Sugere voos e hotéis baseado no histórico e preferências do viajante.",
      key: "capability2",
    },
    {
      title: data.capability3 || "Detecção de Anomalias",
      desc:
        data.capability3Desc ||
        "Identifica gastos fora da política automaticamente e aciona alertas.",
      key: "capability3",
    },
    {
      title: data.capability4 || "OCR Inteligente",
      desc:
        data.capability4Desc ||
        "Fotografe o comprovante e a plataforma identifica automaticamente as informações da despesa.",
      key: "capability4",
    },
  ].filter((c) => v(c.key));

  return (
    <SlideWrapper>
      <SlideHeader title="Inteligência Artificial" />
      <div className="flex-1 flex flex-col px-8 py-5 bg-white overflow-hidden relative">
        {v("headline") && (
          <p className="font-semibold leading-[28px] text-[#2563eb] text-[18px] tracking-[-0.4395px]">
            {data.headline || "Inteligência Artificial a Serviço das Viagens"}
          </p>
        )}
        {v("description") && (
          <div className="h-[55px] relative w-full">
            <p className="font-normal leading-[19.5px] text-[#737373] text-[12px] w-[529px]">
              {data.description}
            </p>
          </div>
        )}
        {/* Capability cards - dark navy cards like Figma */}
        {capabilities.length > 0 && (
          <div className="flex-[625_0_0] min-h-px relative w-full flex flex-col gap-[12px]">
            {capabilities.map((c, i) => (
              <div
                key={i}
                className="bg-[#1e3a5f] relative rounded-[14px] w-full"
              >
                <div className="flex gap-[12px] items-start px-[16px] py-[12px] relative size-full">
                  <div className="flex items-start pt-[2px]">{aiIcon}</div>
                  <div>
                    <p className="font-normal leading-[16px] text-[12px] text-white">
                      {c.title}
                    </p>
                    <p className="font-normal leading-[16.25px] text-[10px] text-[rgba(255,255,255,0.5)] tracking-[0.1172px] pt-[4px]">
                      {c.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Two iPhone mockups positioned decoratively */}
        <div className="absolute flex h-[172px] items-center justify-center left-[-128px] top-[411px] w-[349px] pointer-events-none">
          <div className="-rotate-90 flex-none">
            <div className="drop-shadow-[0px_8px_4px_rgba(0,0,0,0.25)] h-[349px] relative w-[172px]">
              <div className="relative size-full">
                <div className="absolute inset-[2.15%_4.85%_2.27%_5.08%]">
                  <img
                    alt=""
                    className="absolute block inset-0 max-w-none size-full"
                    src={aiImgScreen}
                  />
                </div>
                <div className="absolute inset-[0_-0.23%_0.11%_0]">
                  <img
                    alt=""
                    className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                    src={aiImgSilver}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute flex h-[171px] items-center justify-center left-[260px] top-[544px] w-[348px] pointer-events-none">
          <div className="-scale-y-100 flex-none rotate-90">
            <div className="drop-shadow-[0px_8px_4px_rgba(0,0,0,0.25)] h-[348px] relative w-[171px]">
              <div className="relative size-full">
                <div className="absolute inset-[2.15%_4.85%_2.27%_5.08%]">
                  <img
                    alt=""
                    className="absolute block inset-0 max-w-none size-full"
                    src={aiImgScreen1}
                  />
                </div>
                <div className="absolute inset-[0_-0.23%_0.11%_0]">
                  <img
                    alt=""
                    className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                    src={aiImgSilver}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideFooter page={7} />
    </SlideWrapper>
  );
}

function ReportsSlide({
  data,
  visibleFields,
}: {
  data: FormState["reports"];
  visibleFields: Record<string, boolean>;
}) {
  const v = (field: string) => visibleFields[`reports.${field}`] !== false;

  return (
    <SlideWrapper>
      <SlideHeader title="Analytics & Reports" />
      <div className="bg-white flex-[752_0_0] min-h-px relative w-full">
        <div className="flex flex-col gap-[14px] items-start px-[32px] py-[20px] size-full">
          {v("headline") && (
            <p className="font-semibold leading-[28px] text-[#2563eb] text-[18px] tracking-[-0.4395px]">
              {data.headline || "Relatórios e Analytics Avançados"}
            </p>
          )}
          {v("description") && (
            <div className="w-full">
              <p className="font-normal leading-[19.5px] text-[#737373] text-[12px] w-[529px]">
                {data.description}
              </p>
            </div>
          )}
          <img
            alt=""
            className="object-cover pointer-events-none rounded-[11px] w-[506px] h-[232px]"
            src={imgReports01}
          />
          <img
            alt=""
            className="object-cover pointer-events-none rounded-[12px] w-[506px] h-[273px]"
            src={imgReports02}
          />
        </div>
      </div>
      <SlideFooter page={8} />
    </SlideWrapper>
  );
}

function IntegrationsSlide({
  data,
  visibleFields,
}: {
  data: FormState["integrations"];
  visibleFields: Record<string, boolean>;
}) {
  const v = (field: string) => visibleFields[`integrations.${field}`] !== false;
  // Fixed integrations from Figma design (SAP, TOTVS, Uber, 99, Benner, Senior, Omnie, Sankhya, Conta Azul, API Própria)
  // User-uploadable slots replace some of the fixed ones when logos are provided
  const userItems = [
    { label: data.int1 || "SAP", logo: data.int1Logo, key: "int1" },
    { label: data.int2 || "TOTVS", logo: data.int2Logo, key: "int2" },
    { label: data.int3 || "Uber", logo: data.int3Logo, key: "int3" },
    { label: data.int4 || "99", logo: data.int4Logo, key: "int4" },
    { label: data.int5 || "Benner", logo: data.int5Logo, key: "int5" },
    { label: data.int6 || "Senior", logo: data.int6Logo, key: "int6" },
    { label: data.int7 || "Omnie", logo: data.int7Logo, key: "int7" },
    { label: data.int8 || "Sankhya", logo: data.int8Logo, key: "int8" },
    { label: data.int9 || "Conta Azul", logo: data.int9Logo, key: "int9" },
    { label: data.int10 || "API Própria", logo: data.int10Logo, key: "int10" },
  ];

  // Figma fixed integration logos (inline SVG/image)
  const figmaItems: React.ReactNode[] = [
    // SAP
    <div
      key="sap"
      className="justify-self-stretch relative rounded-[14px] self-stretch"
      style={{ border: "1px solid #e5e5e5" }}
    >
      <div className="flex flex-col items-center justify-center size-full">
        <div className="flex flex-col gap-[8px] items-center justify-center p-[17px] relative size-full">
          <div className="h-[49px] relative w-[98px]">
            <img
              alt="SAP"
              className="absolute block inset-0 max-w-none size-full"
              src={intImgSapLogo}
            />
          </div>
          <p className="text-[#404040] text-[12px] leading-[16px] text-center">
            SAP
          </p>
        </div>
      </div>
    </div>,
    // TOTVS
    <div
      key="totvs"
      className="justify-self-stretch relative rounded-[14px] self-stretch"
      style={{ border: "1px solid #e5e5e5" }}
    >
      <div className="flex flex-col items-center justify-center size-full">
        <div className="flex flex-col gap-[8px] items-center justify-center p-[17px] relative size-full">
          <div className="h-[43px] relative w-[141px]">
            <img
              alt="TOTVS"
              className="absolute block inset-0 max-w-none size-full"
              src={intImgTotvsLogo}
            />
          </div>
          <p className="text-[#404040] text-[12px] leading-[16px] text-center">
            TOTVS
          </p>
        </div>
      </div>
    </div>,
    // Uber
    <div
      key="uber"
      className="justify-self-stretch relative rounded-[14px] self-stretch"
      style={{ border: "1px solid #e5e5e5" }}
    >
      <div className="flex flex-col items-center justify-center size-full">
        <div className="flex flex-col gap-[8px] items-center justify-center p-[17px] relative size-full">
          <div className="h-[27px] relative w-[74px]">
            <img
              alt="Uber"
              className="absolute block inset-0 max-w-none size-full"
              src={intImgUberLogo}
            />
          </div>
          <p className="text-[#404040] text-[12px] leading-[16px] text-center">
            Uber
          </p>
        </div>
      </div>
    </div>,
    // 99
    <div
      key="99"
      className="justify-self-stretch relative rounded-[14px] self-stretch"
      style={{ border: "1px solid #e5e5e5" }}
    >
      <div className="flex flex-col items-center justify-center size-full">
        <div className="flex flex-col gap-[8px] items-center justify-center p-[17px] relative size-full">
          <div className="h-[66px] relative w-[67px]">
            <img
              alt="99"
              className="absolute inset-0 max-w-none object-cover size-full"
              src={intImgImage2}
            />
          </div>
          <p className="text-[#404040] text-[12px] leading-[16px] text-center">
            99
          </p>
        </div>
      </div>
    </div>,
    // Benner
    <div
      key="benner"
      className="justify-self-stretch relative rounded-[14px] self-stretch"
      style={{ border: "1px solid #e5e5e5" }}
    >
      <div className="flex flex-col items-center justify-center size-full">
        <div className="flex flex-col gap-[8px] items-center justify-center p-[17px] relative size-full">
          <div className="h-[59px] relative w-[68px] overflow-hidden">
            <img
              alt="Benner"
              className="absolute h-[115.25%] left-[0.37%] max-w-none top-0 w-full"
              src={intImgImage3}
            />
          </div>
          <p className="text-[#404040] text-[12px] leading-[16px] text-center">
            Benner
          </p>
        </div>
      </div>
    </div>,
    // Senior
    <div
      key="senior"
      className="justify-self-stretch relative rounded-[14px] self-stretch"
      style={{ border: "1px solid #e5e5e5" }}
    >
      <div className="flex flex-col items-center justify-center size-full">
        <div className="flex flex-col gap-[8px] items-center justify-center p-[17px] relative size-full">
          <div className="h-[25px] relative w-[76px]">
            <img
              alt="Senior"
              className="absolute inset-0 max-w-none object-cover size-full"
              src={intImgSeniorSistemasLogo1}
            />
          </div>
          <p className="text-[#404040] text-[12px] leading-[16px] text-center">
            Senior
          </p>
        </div>
      </div>
    </div>,
    // Omnie
    <div
      key="omnie"
      className="justify-self-stretch relative rounded-[14px] self-stretch"
      style={{ border: "1px solid #e5e5e5" }}
    >
      <div className="flex flex-col items-center justify-center size-full">
        <div className="flex flex-col gap-[8px] items-center justify-center p-[17px] relative size-full">
          <div className="h-[39px] max-w-[160px] relative w-[128px]">
            <img
              alt="Omnie"
              className="absolute inset-0 max-w-none object-contain size-full"
              src={intImgImageLogoDaEmpresa}
            />
          </div>
          <p className="text-[#404040] text-[12px] leading-[16px] text-center">
            Omnie
          </p>
        </div>
      </div>
    </div>,
    // Sankhya
    <div
      key="sankhya"
      className="justify-self-stretch relative rounded-[14px] self-stretch"
      style={{ border: "1px solid #e5e5e5" }}
    >
      <div className="flex flex-col items-center justify-center size-full">
        <div className="flex flex-col gap-[8px] items-center justify-center p-[17px] relative size-full">
          <div className="h-[28px] relative w-[124px] overflow-clip">
            <div className="absolute contents inset-0">
              <div
                className={`absolute inset-[0.03%_-0.01%_-0.01%_0] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[124px_28px]`}
                style={{
                  maskImage: `url("${intImgGroup}")`,
                  maskPosition: "0px -0.008px",
                }}
              >
                <svg
                  className="absolute block inset-0 size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 124.007 27.9949"
                >
                  <path d={intSvgPaths.p3460b080} fill="#66CB66" />
                  <path d={intSvgPaths.p1fd74fc0} fill="#66CB66" />
                  <path d={intSvgPaths.p231bc980} fill="#66CB66" />
                  <path d={intSvgPaths.p331df300} fill="black" />
                  <path d={intSvgPaths.pbcec300} fill="black" />
                  <path d={intSvgPaths.p34ef0a00} fill="black" />
                  <path d={intSvgPaths.p210b5500} fill="black" />
                  <path d={intSvgPaths.p326fcb80} fill="black" />
                  <path d={intSvgPaths.p22275880} fill="black" />
                  <path d={intSvgPaths.pe2a8d80} fill="black" />
                </svg>
              </div>
            </div>
          </div>
          <p className="text-[#404040] text-[12px] leading-[16px] text-center">
            Sankhya
          </p>
        </div>
      </div>
    </div>,
    // Conta Azul
    <div
      key="contaazul"
      className="justify-self-stretch relative rounded-[14px] self-stretch"
      style={{ border: "1px solid #e5e5e5" }}
    >
      <div className="flex flex-col items-center justify-center size-full">
        <div className="flex flex-col gap-[8px] items-center justify-center p-[17px] relative size-full">
          <div className="h-[31px] relative w-[205px]">
            <img
              alt="Conta Azul"
              className="absolute block inset-0 max-w-none size-full"
              src={intImgContaAzul}
            />
          </div>
          <p className="text-[#404040] text-[12px] leading-[16px] text-center">
            Conta Azul
          </p>
        </div>
      </div>
    </div>,
    // API Própria
    <div
      key="api"
      className="justify-self-stretch relative rounded-[14px] self-stretch"
      style={{ border: "1px solid #e5e5e5" }}
    >
      <div className="flex flex-col items-center justify-center size-full">
        <div className="flex flex-col gap-[8px] items-center justify-center p-[17px] relative size-full">
          <div
            className="bg-[#fafafa] relative rounded-[10px] size-[64px] flex items-center justify-center overflow-clip"
            style={{ border: "1px solid #f5f5f5" }}
          >
            <div className="relative shrink-0 size-[24px]">
              <img
                alt=""
                className="absolute block inset-0 max-w-none size-full"
                src={intImgApiIcon}
              />
            </div>
          </div>
          <p className="text-[#404040] text-[12px] leading-[16px] text-center">
            API Própria
          </p>
        </div>
      </div>
    </div>,
  ];

  const gridItems = figmaItems.map((item, i) => {
    const user = userItems[i];
    if (!userItems[i] || !v(userItems[i].key)) return null;
    if (user?.logo) {
      return (
        <div
          key={`user-${i}`}
          className="justify-self-stretch relative rounded-[14px] self-stretch"
          style={{ border: "1px solid #e5e5e5" }}
        >
          <div className="flex flex-col items-center justify-center size-full">
            <div className="flex flex-col gap-[8px] items-center justify-center p-[17px] relative size-full">
              <div className="h-[49px] max-w-[160px] relative w-full flex items-center justify-center">
                <img
                  src={user.logo}
                  alt={user.label}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="text-[#404040] text-[12px] leading-[16px] text-center">
                {user.label}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return item;
  });

  return (
    <SlideWrapper>
      <SlideHeader title="Integrações" />
      <div className="flex-1 flex flex-col px-8 py-5 bg-white overflow-hidden">
        {v("headline") && (
          <p className="font-semibold leading-[28px] text-[#2563eb] text-[18px] tracking-[-0.4395px]">
            {data.headline || "Integrações com seu Ecossistema"}
          </p>
        )}
        {v("description") && (
          <div className="h-[36px] relative w-full">
            <p className="font-normal leading-[19.5px] text-[#737373] text-[12px]">
              {data.description}
            </p>
          </div>
        )}
        {/* 2-column grid of integration logos */}
        <div className="h-[656px] relative w-full">
          <div className="gap-x-[8px] gap-y-[8px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(5,minmax(0,1fr))] relative size-full">
            {gridItems.filter(Boolean)}
          </div>
        </div>
      </div>
      <SlideFooter page={9} />
    </SlideWrapper>
  );
}

function SupportSlide({
  data,
  visibleFields,
}: {
  data: FormState["support"];
  visibleFields: Record<string, boolean>;
}) {
  const v = (field: string) => visibleFields[`support.${field}`] !== false;
  const channels = [
    {
      icon: MessageSquare,
      label: data.channel1 || "Chat em tempo real",
      key: "channel1",
    },
    { icon: Mail, label: data.channel2 || "E-mail dedicado", key: "channel2" },
    { icon: Phone, label: data.channel3 || "Telefone 0800", key: "channel3" },
  ];

  return (
    <SlideWrapper>
      <SlideHeader title="Suporte" />
      <div className="flex-1 flex flex-col px-8 py-5 bg-white overflow-hidden">
        {v("headline") && (
          <p className="font-semibold leading-[28px] text-[#2563eb] text-[18px] tracking-[-0.4395px]">
            {data.headline || "Suporte dedicado e especializado"}
          </p>
        )}
        {v("description") && (
          <div className="h-[55px] relative w-full">
            <p className="font-normal leading-[19.5px] text-[#737373] text-[12px] w-[529px] pt-1">
              {data.description}
            </p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 flex-1">
          <div>
            <p className="text-[#a1a1a1] text-[10px] tracking-[0.6172px] uppercase mb-2">
              Canais de Atendimento
            </p>
            <div className="space-y-2">
              {channels
                .filter((ch) => v(ch.key))
                .map(({ icon: Icon, label }, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white rounded-lg px-3 py-2"
                    style={{ border: "1px solid #e5e5e5" }}
                  >
                    <Icon className="size-3.5 text-[#2563eb] shrink-0" />
                    <span className="text-[#404040] text-[12px]">{label}</span>
                  </div>
                ))}
            </div>
          </div>
          <div>
            <p className="text-[#a1a1a1] text-[10px] tracking-[0.6172px] uppercase mb-2">
              Detalhes do Plano
            </p>
            <div className="bg-[#1e3a5f] rounded-[14px] p-4 space-y-3">
              {v("plan") && (
                <div>
                  <p className="text-white/50 text-[10px]">Plano</p>
                  <p className="text-white text-[12px] mt-0.5">
                    {data.plan || "Premium Enterprise"}
                  </p>
                </div>
              )}
              {v("sla") && (
                <div>
                  <p className="text-white/50 text-[10px]">SLA</p>
                  <p className="text-white text-[12px] mt-0.5">
                    {data.sla || "Resposta em até 2 horas"}
                  </p>
                </div>
              )}
              {v("hours") && (
                <div>
                  <p className="text-white/50 text-[10px]">Disponibilidade</p>
                  <p className="text-white text-[12px] mt-0.5">
                    {data.hours || "24 horas / 7 dias"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <SlideFooter page={13} />
    </SlideWrapper>
  );
}

function ImplementationSlide({
  data,
  visibleFields,
}: {
  data: FormState["implementation"];
  visibleFields: Record<string, boolean>;
}) {
  const v = (field: string) =>
    visibleFields[`implementation.${field}`] !== false;
  // Figma shows 5 numbered phases with step name and duration
  const figmaPhases = [
    {
      num: "1",
      name: data.phase1 || "Assinatura de contrato",
      duration: data.phase1Duration || "3 dias",
      nk: "phase1",
      dk: "phase1Duration",
    },
    {
      num: "2",
      name: data.phase2 || "Configuração de Plataforma",
      duration: data.phase2Duration || "2-3 dias",
      nk: "phase2",
      dk: "phase2Duration",
    },
    {
      num: "3",
      name: data.phase3 || "Treinamento",
      duration: data.phase3Duration || "1-2 dias",
      nk: "phase3",
      dk: "phase3Duration",
    },
    {
      num: "4",
      name: data.phase4 || "Suporte e CS",
      duration: data.phase4Duration || "30 dias",
      nk: "phase4",
      dk: "phase4Duration",
    },
    {
      num: "5",
      name: data.phase5 || "Integração de sistema (ERP)",
      duration: data.phase5Duration || "3 meses",
      nk: "phase5",
      dk: "phase5Duration",
    },
  ];

  return (
    <SlideWrapper>
      <SlideHeader title="Implementação" />
      <div className="flex-1 flex flex-col px-8 py-5 bg-white overflow-hidden relative">
        {v("headline") && (
          <p className="font-semibold leading-[28px] text-[#2563eb] text-[18px] tracking-[-0.4395px]">
            {data.headline || "Implantação rápida e sem fricção"}
          </p>
        )}
        {v("description") && (
          <div className="h-[55px] relative w-full">
            <p className="font-normal leading-[19.5px] text-[#737373] text-[12px] w-[529px]">
              {data.description}
            </p>
          </div>
        )}
        {/* Phases list */}
        <div className="h-[586px] relative w-full flex flex-col">
          {figmaPhases
            .filter((p) => v(p.nk) || v(p.dk))
            .map((phase, i) => (
              <div
                key={i}
                className={`flex gap-[12px] items-center relative w-full${i > 0 ? " pt-[8px]" : ""}`}
              >
                <div className="bg-[#2563eb] relative rounded-[33554400px] shrink-0 size-[28px] flex items-center justify-center">
                  <span className="text-white text-[12px] font-normal leading-[16px]">
                    {phase.num}
                  </span>
                </div>
                <div
                  className="bg-[#fafafa] flex-[489_0_0] min-w-px relative rounded-[10px]"
                  style={{ border: "1px solid #f5f5f5" }}
                >
                  <div className="flex flex-row items-center size-full">
                    <div className="flex items-center justify-between px-[17px] py-[9px] relative size-full">
                      {v(phase.nk) && (
                        <span className="text-[#404040] text-[12px] leading-[16px]">
                          {phase.name}
                        </span>
                      )}
                      {v(phase.dk) && (
                        <span className="text-[#2563eb] text-[10px] leading-[15px] tracking-[0.1172px]">
                          {phase.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {/* Decorative background image from Figma */}
          <div
            className="absolute h-[463px] left-[-44px] rounded-[190px] top-[312px] w-[619px] pointer-events-none overflow-hidden"
            style={{ borderRadius: 190 }}
          >
            <img
              alt=""
              className="absolute h-[92.53%] left-[-3.36%] max-w-none top-[-7.44%] w-[103.89%]"
              src={implImgUnsplash}
            />
          </div>
        </div>
      </div>
      <SlideFooter page={10} />
    </SlideWrapper>
  );
}

function parseValue(v: string): number {
  const n = parseFloat(v.replace(/[^\d,.-]/g, "").replace(",", "."));
  return isNaN(n) ? 0 : n;
}

function fmt(v: string) {
  const n = parseValue(v);
  if (!v || n === 0) return "—";
  return `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

function InvestmentSlide({
  data,
  visibleFields,
}: {
  data: FormState["investment"];
  visibleFields: Record<string, boolean>;
}) {
  const v = (field: string) => visibleFields[`investment.${field}`] !== false;

  const setupRows: { label: string; key: keyof FormState["investment"] }[] = [
    { label: "IMPLANTAÇÃO E TREINAMENTOS", key: "implantacaoTreinamentos" },
  ];

  const travelRows: { label: string; key: keyof FormState["investment"] }[] = [
    { label: "EMISSÃO AÉREO", key: "emissaoAereo" },
    { label: "EMISSÃO RODOVIÁRIO", key: "emissaoRodoviario" },
    { label: "EMISSÃO CARRO", key: "emissaoCarro" },
    { label: "BILHETE NÃO VOADO", key: "bilheteNaoVoado" },
    { label: "ATENDIMENTO 24H", key: "atendimento24h" },
    { label: "REEMBOLSO", key: "reembolso" },
    { label: "BI TRAVEL E EXPENSE", key: "biTravelExpense" },
    { label: "EMISSÃO ASSENTO CONFORTO", key: "emissaoAssentoConforto" },
    { label: "COMPRA DE BAGAGEM", key: "compraBagagem" },
    { label: "RESERVAS LONGSTAY", key: "reservasLongstay" },
    { label: "DISPONIBILIDADE DE API", key: "disponibilidadeApi" },
    { label: "SOLICITAÇÃO DE REEMBOLSO", key: "solicitacaoReembolso" },
    { label: "IA INTEGRADO AS DESPESAS", key: "iaIntegradoDespesas" },
  ];

  const bizpayRows: { label: string; key: keyof FormState["investment"] }[] = [
    {
      label: "EMISSÃO DE NOVOS CARTÕES FÍSICOS",
      key: "emissaoNovosCartoesFisicos",
    },
    { label: "CARTÃO BIZPAY", key: "cartaoBizpay" },
    { label: "CRIAÇÃO DE CARTÃO VIRTUAL", key: "criacaoCartaoVirtual" },
  ];

  const formaPagamentoRows: { label: string; key: "formaPagamento" }[] = [
    { label: "FORMA DE PAGAMENTO", key: "formaPagamento" },
  ];

  const monthlyKeys = [...travelRows, ...bizpayRows].map((r) => r.key);
  const monthlyTotal = monthlyKeys.reduce(
    (sum, key) => sum + parseValue(data[key]),
    0,
  );

  const fmtR = (val: string) => {
    const n = parseValue(val);
    if (!val || n === 0) return "—";
    return `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  };

  const renderTravelValue = (val: string) => {
    if (!val) return "—";
    const n = parseValue(val);
    if (n > 0) return fmtR(val);
    return val;
  };

  return (
    <SlideWrapper>
      <SlideHeader title="Investimento" />
      <div className="flex-1 flex flex-col px-8 py-5 bg-white overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <div className="size-6 rounded bg-[#2563eb]/10 flex items-center justify-center">
            <TrendingUp className="size-3.5 text-[#2563eb]" />
          </div>
          {v("headline") && (
            <h2 className="text-neutral-800 text-base">
              {data.headline || "Investimento Total"}
            </h2>
          )}
        </div>
        <div className="flex-1 overflow-hidden space-y-4">
          {/* SETUP INICIAL */}
          <div>
            <div className="flex items-center gap-1 text-[10px] text-neutral-400 uppercase tracking-wider mb-1">
              <ChevronRight className="size-3" />
              <span>SETUP INICIAL</span>
            </div>
            <div className="flex text-[9px] text-neutral-400 uppercase tracking-wider px-2 mb-1">
              <span className="flex-1">Item</span>
              <span className="w-28 text-right">Valor Único</span>
            </div>
            <div className="space-y-0.5">
              {setupRows
                .filter((r) => v(r.key))
                .map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center px-2 py-1.5 rounded bg-neutral-50"
                  >
                    <span className="flex-1 text-[11px] text-neutral-700">
                      {row.label}
                    </span>
                    <span className="w-28 text-right text-[11px] text-neutral-800">
                      {fmtR(data[row.key])}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* TRAVEL E DESPESAS */}
          <div>
            <div className="flex items-center gap-1 text-[10px] text-neutral-400 uppercase tracking-wider mb-1">
              <ChevronRight className="size-3" />
              <span>TRAVEL E DESPESAS</span>
            </div>
            <div className="flex text-[9px] text-neutral-400 uppercase tracking-wider px-2 mb-1">
              <span className="flex-1">Item</span>
              <span className="w-28 text-right">Valor / mês</span>
            </div>
            <div className="space-y-0.5">
              {travelRows
                .filter((r) => v(r.key))
                .map((row, i) => {
                  const val = data[row.key];
                  const isNumeric = parseValue(val) > 0;
                  return (
                    <div
                      key={i}
                      className={`flex items-center px-2 py-1.5 rounded ${i % 2 === 0 ? "bg-neutral-50" : "bg-white"}`}
                    >
                      <span className="flex-1 text-[11px] text-neutral-700">
                        {row.label}
                      </span>
                      <span
                        className={`w-28 text-right text-[11px] ${isNumeric ? "text-neutral-800" : val ? "text-emerald-600" : "text-neutral-400"}`}
                      >
                        {renderTravelValue(val)}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* BIZPAY */}
          <div>
            <div className="flex items-center gap-1 text-[10px] text-neutral-400 uppercase tracking-wider mb-1">
              <ChevronRight className="size-3" />
              <span>BIZPAY</span>
            </div>
            <div className="flex text-[9px] text-neutral-400 uppercase tracking-wider px-2 mb-1">
              <span className="flex-1">Item</span>
              <span className="w-28 text-right">Valor</span>
            </div>
            <div className="space-y-0.5">
              {bizpayRows
                .filter((r) => v(r.key))
                .map((row, i) => {
                  const val = data[row.key];
                  const isNumeric = parseValue(val) > 0;
                  return (
                    <div
                      key={i}
                      className={`flex items-center px-2 py-1.5 rounded ${i % 2 === 0 ? "bg-neutral-50" : "bg-white"}`}
                    >
                      <span className="flex-1 text-[11px] text-neutral-700">
                        {row.label}
                      </span>
                      <span
                        className={`w-28 text-right text-[11px] ${isNumeric ? "text-neutral-800" : val ? "text-emerald-600" : "text-neutral-400"}`}
                      >
                        {isNumeric ? fmtR(val) : val || "—"}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* FORMA DE PAGAMENTO */}
          {v("formaPagamento") && data.formaPagamento && (
            <div>
              <div className="flex items-center gap-1 text-[10px] text-neutral-400 uppercase tracking-wider mb-1">
                <ChevronRight className="size-3" />
                <span>FORMA DE PAGAMENTO</span>
              </div>
              <div className="flex flex-col gap-1">
                {data.formaPagamento
                  .split(", ")
                  .filter(Boolean)
                  .map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-2 py-1.5 rounded bg-neutral-50"
                    >
                      <Check className="size-4 text-emerald-600 flex-shrink-0" />
                      <span className="text-[11px] text-neutral-700">
                        {item}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* PRAZO */}
          {v("prazo") && data.prazo && (
            <div>
              <div className="flex items-center gap-1 text-[10px] text-neutral-400 uppercase tracking-wider mb-1">
                <ChevronRight className="size-3" />
                <span>PRAZO</span>
              </div>
              <div className="flex items-center px-2 py-1.5 rounded bg-neutral-50">
                <span className="text-[11px] text-neutral-700">
                  {data.prazo} dias
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 rounded-lg bg-[#1e3a5f] px-5 py-3 flex items-center justify-between">
          <span className="text-white/80 text-sm">
            Investimento Mensal Total
          </span>
          <span className="text-white text-lg">
            {monthlyTotal > 0
              ? `R$ ${monthlyTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
              : "—"}
          </span>
        </div>
      </div>
      <SlideFooter page={11} />
    </SlideWrapper>
  );
}

function WhyBiztripSlide({
  data,
  visibleFields,
}: {
  data: FormState["whybiztrip"];
  visibleFields: Record<string, boolean>;
}) {
  const v = (field: string) => visibleFields[`whybiztrip.${field}`] !== false;
  const differentiators = [
    { title: data.d1title, desc: data.d1desc, key: "d1title" },
    { title: data.d2title, desc: data.d2desc, key: "d2title" },
    { title: data.d3title, desc: data.d3desc, key: "d3title" },
    { title: data.d4title, desc: data.d4desc, key: "d4title" },
    { title: data.d5title, desc: data.d5desc, key: "d5title" },
    { title: data.d6title, desc: data.d6desc, key: "d6title" },
    { title: data.d7title, desc: data.d7desc, key: "d7title" },
    { title: data.d8title, desc: data.d8desc, key: "d8title" },
    { title: data.d9title, desc: data.d9desc, key: "d9title" },
  ];
  const icons = [
    Layers,
    Clock,
    Bus,
    Ticket,
    Cpu,
    LayoutDashboard,
    UserCheck,
    GitBranch,
    Brain,
    Ticket,
  ];

  return (
    <SlideWrapper>
      <SlideHeader title="Por que Biztrip?" accent />
      <div className="flex-1 flex flex-col px-8 py-5 bg-white overflow-hidden">
        {v("headline") && (
          <p className="font-semibold leading-[28px] text-[#2563eb] text-[18px] tracking-[-0.4395px]">
            {data.headline || "Por que escolher a Biztrip?"}
          </p>
        )}
        {v("description") && (
          <div className="h-[36px] relative w-full mb-3">
            <p className="font-normal leading-[19.5px] text-[#737373] text-[12px]">
              {data.description}
            </p>
          </div>
        )}
        <div className="grid grid-cols-3 gap-2">
          {differentiators
            .filter((d) => v(d.key))
            .map((d, i) => {
              const Icon = icons[i] ?? Star;
              return (
                <div
                  key={i}
                  className="bg-[#fafafa] rounded-[14px] p-3 flex flex-col min-h-[155px]"
                  style={{ border: "1px solid #e5e5e5" }}
                >
                  <div className="size-6 rounded bg-[#2563eb] flex items-center justify-center mb-2 shrink-0">
                    <Icon className="size-3 text-white" />
                  </div>
                  <p className="text-[#262626] text-[11px] mb-1 leading-tight font-medium">
                    {d.title}
                  </p>
                  <p className="text-[#737373] text-[10px] leading-relaxed">
                    {d.desc}
                  </p>
                </div>
              );
            })}
        </div>
        {v("d10title") && (data.d10title || data.d10desc) && (
          <div
            className="mt-2 bg-[#fafafa] rounded-[14px] p-3 flex gap-3 min-h-[100px]"
            style={{ border: "1px solid #e5e5e5" }}
          >
            <div className="size-6 rounded bg-[#2563eb] flex items-center justify-center shrink-0">
              <Ticket className="size-3 text-white" />
            </div>
            <div>
              <p className="text-[#262626] text-[11px] mb-1 leading-tight font-medium">
                {data.d10title}
              </p>
              <p className="text-[#737373] text-[10px] leading-relaxed">
                {data.d10desc}
              </p>
            </div>
          </div>
        )}
      </div>
      <SlideFooter page={12} />
    </SlideWrapper>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  fieldKey,
  visible,
  onToggleVisibility,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  fieldKey?: string;
  visible?: boolean;
  onToggleVisibility?: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-xs text-neutral-500">{label}</label>
        {fieldKey && onToggleVisibility && (
          <button
            type="button"
            onClick={onToggleVisibility}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
            title={visible ? "Ocultar no preview" : "Exibir no preview"}
          >
            {visible !== false ? (
              <Eye className="size-3.5" />
            ) : (
              <EyeOff className="size-3.5" />
            )}
          </button>
        )}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  fieldKey,
  visible,
  onToggleVisibility,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  fieldKey?: string;
  visible?: boolean;
  onToggleVisibility?: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-xs text-neutral-500">{label}</label>
        {fieldKey && onToggleVisibility && (
          <button
            type="button"
            onClick={onToggleVisibility}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
            title={visible ? "Ocultar no preview" : "Exibir no preview"}
          >
            {visible !== false ? (
              <Eye className="size-3.5" />
            ) : (
              <EyeOff className="size-3.5" />
            )}
          </button>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-none"
      />
    </div>
  );
}

function mergeSavedForm(parsed: Partial<FormState>): FormState {
  return {
    ...defaultForm,
    ...parsed,
    cover: { ...defaultForm.cover, ...parsed.cover },
    contact: { ...defaultForm.contact, ...parsed.contact },
    travel: { ...defaultForm.travel, ...parsed.travel },
    hotelaria: { ...defaultForm.hotelaria, ...parsed.hotelaria },
    rodoviario: { ...defaultForm.rodoviario, ...parsed.rodoviario },
    bizpay: { ...defaultForm.bizpay, ...parsed.bizpay },
    biztripexpense: { ...defaultForm.biztripexpense, ...parsed.biztripexpense },
    ai: { ...defaultForm.ai, ...parsed.ai },
    reports: { ...defaultForm.reports, ...parsed.reports },
    integrations: { ...defaultForm.integrations, ...parsed.integrations },
    support: { ...defaultForm.support, ...parsed.support },
    implementation: { ...defaultForm.implementation, ...parsed.implementation },
    investment: { ...defaultForm.investment, ...parsed.investment },
    whybiztrip: { ...defaultForm.whybiztrip, ...parsed.whybiztrip },
  };
}

function loadInitialState(): { form: FormState; activeModule: string } {
  const payload = readLocalPayload();
  if (!payload?.form) {
    return { form: mergeSavedForm({}), activeModule: "cover" };
  }
  return {
    form: mergeSavedForm(payload.form as Partial<FormState>),
    activeModule: payload.activeModule ?? "cover",
  };
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return React.createElement(
        "div",
        { style: { padding: 20, fontFamily: "sans-serif" } },
        React.createElement(
          "h2",
          { style: { color: "red" } },
          "Algo deu errado",
        ),
        React.createElement(
          "pre",
          {
            style: {
              fontSize: 12,
              whiteSpace: "pre-wrap",
              background: "#f5f5f5",
              padding: 10,
              borderRadius: 4,
            },
          },
          String(this.state.error?.message || this.state.error),
        ),
        React.createElement(
          "pre",
          { style: { fontSize: 11, whiteSpace: "pre-wrap", color: "#666" } },
          (this.state.error?.stack || "").split("\n").slice(1, 6).join("\n"),
        ),
      );
    }
    return this.props.children;
  }
}

interface ApiProposalMeta {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  thumbnail: string | null;
}

interface ApiProposalFull {
  id: string;
  userId: string;
  title: string;
  formData: any;
  thumbnail: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [initialState] = useState(loadInitialState);
  const [activeModule, setActiveModule] = useState(initialState.activeModule);
  const [form, setForm] = useState<FormState>(initialState.form);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>(
    {},
  );
  const [editorInvSections, setEditorInvSections] = useState<
    Record<string, boolean>
  >({
    setup: true,
    travel: true,
    bizpay: true,
    formaPagamento: true,
    prazo: true,
  });
  const toggleEditorInvSection = (s: string) =>
    setEditorInvSections((prev) => ({ ...prev, [s]: !prev[s] }));
  const [exporting, setExporting] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const skipAutoSaveRef = useRef(true);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const apiSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeProposalId, setActiveProposalId] = useState<string | null>(null);
  const [savedProposals, setSavedProposals] = useState<ApiProposalMeta[]>([]);
  const [selectedSavedId, setSelectedSavedId] = useState<string | null>(null);
  const [savedPdfUrl, setSavedPdfUrl] = useState<string | null>(null);

  function toggleVisibility(section: string, field: string) {
    const key = `${section}.${field}`;
    setVisibleFields((prev) => ({
      ...prev,
      [key]: prev[key] === false ? true : false,
    }));
  }

  function setField<K extends keyof FormState>(
    section: K,
    field: keyof FormState[K],
    value: string,
  ) {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }

  function f<K extends keyof FormState>(section: K) {
    return (field: keyof FormState[K]) => (value: string) =>
      setField(section, field, value);
  }

  const persistState = useCallback(async (data: FormState, module: string) => {
    await writeStoredPayload({ form: data, activeModule: module });
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (readLocalPayload()) return;
      const payload = await readStoredPayload();
      if (cancelled || !payload?.form) return;
      skipAutoSaveRef.current = true;
      setForm(mergeSavedForm(payload.form as Partial<FormState>));
      if (payload.activeModule) setActiveModule(payload.activeModule);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load proposal from navigation state (admin viewing)
  const location = useLocation();
  useEffect(() => {
    const state = location.state as { viewingProposal?: any } | null;
    if (state?.viewingProposal) {
      const proposal = state.viewingProposal;
      if (proposal.formData) {
        skipAutoSaveRef.current = true;
        setForm(mergeSavedForm(proposal.formData as Partial<FormState>));
        setActiveProposalId(proposal.id);
        setActiveModule("cover");
      }
      // Clear the state so it doesn't re-trigger on re-render
      window.history.replaceState({}, "");
    }
  }, [location]);

  useEffect(() => {
    if (skipAutoSaveRef.current) {
      skipAutoSaveRef.current = false;
      return;
    }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      persistState(form, activeModule).catch(() => {});
    }, 500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [form, activeModule, persistState]);

  // API autosave with 3s debounce
  useEffect(() => {
    if (!activeProposalId) return;
    if (apiSaveTimerRef.current) clearTimeout(apiSaveTimerRef.current);
    apiSaveTimerRef.current = setTimeout(() => {
      request(`/proposals/${activeProposalId}`, {
        method: "PUT",
        body: JSON.stringify({
          title: form.cover.company || "Proposta sem título",
          formData: form,
        }),
      }).catch(() => {});
    }, 3000);
    return () => {
      if (apiSaveTimerRef.current) clearTimeout(apiSaveTimerRef.current);
    };
  }, [form, activeProposalId]);

  useEffect(() => {
    const flushOnExit = () => {
      writeStoredPayloadSync({ form, activeModule });
    };
    window.addEventListener("beforeunload", flushOnExit);
    return () => window.removeEventListener("beforeunload", flushOnExit);
  }, [form, activeModule]);

  useEffect(() => {
    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    };
  }, [pdfBlobUrl]);

  async function loadSavedProposals() {
    try {
      const data = await request<{ proposals: ApiProposalMeta[] }>(
        "/proposals",
      );
      setSavedProposals(data.proposals);
    } catch {
      setSavedProposals([]);
    }
  }

  useEffect(() => {
    loadSavedProposals();
  }, []);

  const PDF_IMAGE_QUALITY = 0.85;
  const PDF_IMAGE_PIXEL_RATIO = 1.5;

  async function renderSlidesToPdf(): Promise<jsPDF | null> {
    if (!slidesRef.current) return null;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
      compress: true,
    });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    const slideEls =
      slidesRef.current.querySelectorAll<HTMLElement>("[data-slide]");
    for (let i = 0; i < slideEls.length; i++) {
      const el = slideEls[i];
      const imgData = await toJpeg(el, {
        width: 595,
        height: 842,
        pixelRatio: PDF_IMAGE_PIXEL_RATIO,
        backgroundColor: "#ffffff",
        quality: PDF_IMAGE_QUALITY,
      });
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, 0, pdfW, pdfH);
    }
    return pdf;
  }

  async function generatePDFBlob(): Promise<Blob | null> {
    const pdf = await renderSlidesToPdf();
    if (!pdf) return null;
    return pdf.output("blob");
  }

  async function handleSave() {
    setSaveStatus("saving");
    try {
      await persistState(form, activeModule);
      const blob = await generatePDFBlob();
      if (blob) {
        if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
        const url = URL.createObjectURL(blob);
        setPdfBlobUrl(url);

        const companyName = form.cover.company || "Sem nome";

        if (activeProposalId) {
          await request(`/proposals/${activeProposalId}`, {
            method: "PUT",
            body: JSON.stringify({ title: companyName, formData: form }),
          });
        } else {
          const data = await request<{ proposal: ApiProposalFull }>(
            "/proposals",
            {
              method: "POST",
              body: JSON.stringify({ title: companyName, formData: form }),
            },
          );
          setActiveProposalId(data.proposal.id);
        }

        await loadSavedProposals();
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  }

  async function handleExportPDF() {
    if (!slidesRef.current) return;
    setExporting(true);
    try {
      const pdf = await renderSlidesToPdf();
      if (pdf) pdf.save("proposta-biztrip.pdf");
    } finally {
      setExporting(false);
    }
  }

  function handleBackToEditor() {
    if (savedPdfUrl) URL.revokeObjectURL(savedPdfUrl);
    setSelectedSavedId(null);
    setSavedPdfUrl(null);
  }

  async function handleSelectSavedProposal(id: string) {
    try {
      const data = await request<{ proposal: ApiProposalFull }>(
        `/proposals/${id}`,
      );
      setForm(mergeSavedForm(data.proposal.formData as Partial<FormState>));
      setActiveProposalId(data.proposal.id);
      skipAutoSaveRef.current = true;
      setSelectedSavedId(null);
      setSavedPdfUrl(null);
      setActiveModule("cover");
    } catch {
      // fallback: tenta carregar do IndexedDB
    }
  }

  async function handleDeleteSavedProposal(id: string) {
    try {
      await request(`/proposals/${id}`, { method: "DELETE" });
    } catch {
      // ignore
    }
    if (selectedSavedId === id) {
      handleBackToEditor();
    }
    await loadSavedProposals();
  }

  const cv = f("cover");
  const tr = f("travel");
  const ht = f("hotelaria");
  const rd = f("rodoviario");
  const bp = f("bizpay");
  const be = f("biztripexpense");
  const ai = f("ai");
  const rp = f("reports");
  const ig = f("integrations");
  const sp = f("support");
  const im = f("implementation");
  const inv = f("investment");
  const wb = f("whybiztrip");
  const ct = f("contact");

  return (
    <ErrorBoundary>
      <div className="size-full flex bg-neutral-100 relative">
        {/* Left Sidebar */}
        <aside className="w-60 bg-white border-r flex flex-col shrink-0 h-full">
          <div className="border-b px-[24px] py-[7px]">
            <Heading2 />
          </div>
          <nav className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto">
            <p className="text-xs text-neutral-400 pt-1 px-1">
              Edite as seções da proposta comercial
            </p>
            <ul className="space-y-0.5">
              {modules.map((module) => {
                const Icon = module.icon;
                const isActive = activeModule === module.id;
                return (
                  <li key={module.id}>
                    <button
                      onClick={() => {
                        handleBackToEditor();
                        setActiveModule(module.id);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      <Icon
                        className={`size-4 ${isActive ? "text-blue-600" : "text-neutral-400"}`}
                      />
                      {module.name}
                    </button>
                  </li>
                );
              })}
            </ul>

            <button
              onClick={() => {
                handleBackToEditor();
                setActiveModule("__saved__");
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                activeModule === "__saved__"
                  ? "bg-blue-50 text-blue-600"
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <Save
                className={`size-4 ${activeModule === "__saved__" ? "text-blue-600" : "text-neutral-400"}`}
              />
              Propostas Salvas
            </button>

            {user?.role === "MASTER" && (
              <button
                onClick={() => navigate("/admin/proposals")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm text-neutral-600 hover:bg-neutral-50"
              >
                <Shield className="size-4 text-neutral-400" />
                Todas as Propostas
              </button>
            )}

            {(user?.role === "MASTER" || user?.role === "GERENTE") && (
              <button
                onClick={() => navigate("/admin/users")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm text-neutral-600 hover:bg-neutral-50"
              >
                <Users className="size-4 text-neutral-400" />
                Gerenciar Usuários
              </button>
            )}
          </nav>

          <div className="border-t p-3">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-neutral-500 truncate">
                  {user?.name}
                </p>
                <span className="text-xs text-neutral-400">{user?.role}</span>
              </div>
              <button
                onClick={async () => {
                  await logout();
                  navigate("/login");
                }}
                className="text-neutral-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50"
                title="Sair"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Center Panel - Editor */}
        <main className="w-80 bg-white border-r flex flex-col shrink-0 h-full overflow-hidden">
          <div className="px-6 py-3 bg-white border-b flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-sm text-neutral-700">
                {activeModule === "__saved__"
                  ? "Propostas Salvas"
                  : "Editor de Conteúdo"}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                {activeModule === "__saved__"
                  ? "Visualize suas propostas salvas"
                  : "Edite os campos abaixo"}
              </p>
            </div>
            <span className="text-xs text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full">
              {activeModule === "__saved__"
                ? "Propostas Salvas"
                : modules.find((m) => m.id === activeModule)?.name}
            </span>
          </div>
          <ScrollArea className="flex-1 min-h-0 overflow-hidden">
            <div className="p-5 space-y-4">
              {activeModule === "__saved__" && (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm text-neutral-700">
                      Propostas Salvas
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Clique em uma proposta para visualizar o PDF
                    </p>
                  </div>
                  {savedProposals.length === 0 ? (
                    <div className="text-center py-12 text-neutral-400">
                      <Save className="size-8 mx-auto mb-3 text-neutral-300" />
                      <p className="text-sm">Nenhuma proposta salva</p>
                      <p className="text-xs mt-1">
                        Clique em "Salvar" no preview para salvar uma proposta
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {savedProposals.map((p) => (
                        <div
                          key={p.id}
                          className={`group border rounded-lg p-4 cursor-pointer transition-colors w-full overflow-hidden ${
                            selectedSavedId === p.id
                              ? "border-blue-300 bg-blue-50"
                              : "border-neutral-200 hover:bg-neutral-50"
                          }`}
                          onClick={() => handleSelectSavedProposal(p.id)}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                              <FileText className="size-5 text-neutral-400 shrink-0" />
                              <div className="min-w-0 overflow-hidden">
                                <p className="text-sm text-neutral-700 truncate">
                                  {p.title}
                                </p>
                                <p className="text-xs text-neutral-400 mt-0.5 truncate">
                                  {new Date(p.createdAt).toLocaleDateString(
                                    "pt-BR",
                                  )}{" "}
                                  às{" "}
                                  {new Date(p.createdAt).toLocaleTimeString(
                                    "pt-BR",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSavedProposal(p.id);
                              }}
                              className="text-neutral-300 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {activeModule === "cover" && (
                <>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-400">Título</p>
                    <p className="text-sm text-neutral-600 px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg">
                      {form.cover.title}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-400">Subtítulo</p>
                    <p className="text-sm text-neutral-600 px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg">
                      {form.cover.subtitle}
                    </p>
                  </div>
                  <InputField
                    label="Nome da Empresa"
                    value={form.cover.company}
                    onChange={cv("company")}
                    placeholder="Nome da Empresa"
                    fieldKey="cover.company"
                    visible={visibleFields["cover.company"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("cover", "company")
                    }
                  />
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">
                      Logo da empresa
                    </label>
                    {form.cover.companyLogo && (
                      <div className="mb-2 relative flex items-center justify-center bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                        <img
                          src={form.cover.companyLogo}
                          alt="Logo"
                          className="h-14 max-w-full object-contain"
                        />
                        <button
                          onClick={() => cv("companyLogo")("")}
                          className="absolute top-1.5 right-1.5 size-5 rounded-full bg-neutral-200 hover:bg-red-100 text-neutral-500 hover:text-red-500 flex items-center justify-center"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    )}
                    <div className="border-2 border-dashed border-neutral-200 rounded-lg p-5 text-center">
                      <Upload className="size-5 text-neutral-300 mx-auto mb-2" />
                      <p className="text-xs text-neutral-400">
                        SVG, PNG ou JPG
                      </p>
                      <label className="mt-2 inline-block cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) =>
                              cv("companyLogo")(ev.target?.result as string);
                            reader.readAsDataURL(file);
                            e.target.value = "";
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-0 text-xs h-7 pointer-events-none"
                        >
                          Enviar logo
                        </Button>
                      </label>
                    </div>
                  </div>
                  <InputField
                    label="Validade"
                    value={form.cover.validity}
                    onChange={cv("validity")}
                    placeholder="Validade 30 dias"
                    fieldKey="cover.validity"
                    visible={visibleFields["cover.validity"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("cover", "validity")
                    }
                  />
                  <InputField
                    label="Ano / Data"
                    value={form.cover.date}
                    onChange={cv("date")}
                    placeholder="2026"
                    fieldKey="cover.date"
                    visible={visibleFields["cover.date"] !== false}
                    onToggleVisibility={() => toggleVisibility("cover", "date")}
                  />
                </>
              )}

              {activeModule === "contact" && (
                <>
                  <InputField
                    label="Título"
                    value={form.contact.headline}
                    onChange={ct("headline")}
                    fieldKey="contact.headline"
                    visible={visibleFields["contact.headline"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("contact", "headline")
                    }
                  />
                  <InputField
                    label="Nome do vendedor"
                    value={form.contact.sellerName}
                    onChange={ct("sellerName")}
                    fieldKey="contact.sellerName"
                    visible={visibleFields["contact.sellerName"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("contact", "sellerName")
                    }
                  />
                  <InputField
                    label="Contato do vendedor"
                    value={form.contact.sellerContact}
                    onChange={ct("sellerContact")}
                    fieldKey="contact.sellerContact"
                    visible={visibleFields["contact.sellerContact"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("contact", "sellerContact")
                    }
                  />
                  <InputField
                    label="E-mail do vendedor"
                    value={form.contact.sellerEmail}
                    onChange={ct("sellerEmail")}
                    type="email"
                    fieldKey="contact.sellerEmail"
                    visible={visibleFields["contact.sellerEmail"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("contact", "sellerEmail")
                    }
                  />
                  <InputField
                    label="LinkedIn"
                    value={form.contact.linkedin}
                    onChange={ct("linkedin")}
                    placeholder="/linkedindabiztrip"
                    fieldKey="contact.linkedin"
                    visible={visibleFields["contact.linkedin"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("contact", "linkedin")
                    }
                  />
                </>
              )}

              {activeModule === "travel" && (
                <>
                  <InputField
                    label="Título"
                    value={form.travel.headline}
                    onChange={tr("headline")}
                    fieldKey="travel.headline"
                    visible={visibleFields["travel.headline"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("travel", "headline")
                    }
                  />
                  <TextAreaField
                    label="Descrição"
                    value={form.travel.description}
                    onChange={tr("description")}
                    rows={3}
                    fieldKey="travel.description"
                    visible={visibleFields["travel.description"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("travel", "description")
                    }
                  />
                  <p className="text-xs text-neutral-400 pt-2 border-t">
                    Serviços
                  </p>
                  <InputField
                    label="Serviço 1"
                    value={form.travel.service1}
                    onChange={tr("service1")}
                    fieldKey="travel.service1"
                    visible={visibleFields["travel.service1"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("travel", "service1")
                    }
                  />
                  <InputField
                    label="Serviço 2"
                    value={form.travel.service2}
                    onChange={tr("service2")}
                    fieldKey="travel.service2"
                    visible={visibleFields["travel.service2"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("travel", "service2")
                    }
                  />
                  <InputField
                    label="Serviço 3"
                    value={form.travel.service3}
                    onChange={tr("service3")}
                    fieldKey="travel.service3"
                    visible={visibleFields["travel.service3"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("travel", "service3")
                    }
                  />
                  <InputField
                    label="Serviço 4"
                    value={form.travel.service4}
                    onChange={tr("service4")}
                    fieldKey="travel.service4"
                    visible={visibleFields["travel.service4"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("travel", "service4")
                    }
                  />
                  <InputField
                    label="Serviço 5"
                    value={form.travel.service5}
                    onChange={tr("service5")}
                    fieldKey="travel.service5"
                    visible={visibleFields["travel.service5"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("travel", "service5")
                    }
                  />
                  <InputField
                    label="Serviço 6"
                    value={form.travel.service6}
                    onChange={tr("service6")}
                    fieldKey="travel.service6"
                    visible={visibleFields["travel.service6"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("travel", "service6")
                    }
                  />
                  <p className="text-xs text-neutral-400 pt-2 border-t">
                    Benefícios
                  </p>
                  <InputField
                    label="Benefício 1 — Título"
                    value={form.travel.benefit1title}
                    onChange={tr("benefit1title")}
                    fieldKey="travel.benefit1title"
                    visible={visibleFields["travel.benefit1title"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("travel", "benefit1title")
                    }
                  />
                  <TextAreaField
                    label="Benefício 1 — Descrição"
                    value={form.travel.benefit1desc}
                    onChange={tr("benefit1desc")}
                    rows={2}
                    fieldKey="travel.benefit1desc"
                    visible={visibleFields["travel.benefit1desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("travel", "benefit1desc")
                    }
                  />
                  <InputField
                    label="Benefício 2 — Título"
                    value={form.travel.benefit2title}
                    onChange={tr("benefit2title")}
                    fieldKey="travel.benefit2title"
                    visible={visibleFields["travel.benefit2title"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("travel", "benefit2title")
                    }
                  />
                  <TextAreaField
                    label="Benefício 2 — Descrição"
                    value={form.travel.benefit2desc}
                    onChange={tr("benefit2desc")}
                    rows={2}
                    fieldKey="travel.benefit2desc"
                    visible={visibleFields["travel.benefit2desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("travel", "benefit2desc")
                    }
                  />
                  <InputField
                    label="Benefício 3 — Título"
                    value={form.travel.benefit3title}
                    onChange={tr("benefit3title")}
                    fieldKey="travel.benefit3title"
                    visible={visibleFields["travel.benefit3title"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("travel", "benefit3title")
                    }
                  />
                  <TextAreaField
                    label="Benefício 3 — Descrição"
                    value={form.travel.benefit3desc}
                    onChange={tr("benefit3desc")}
                    rows={2}
                    fieldKey="travel.benefit3desc"
                    visible={visibleFields["travel.benefit3desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("travel", "benefit3desc")
                    }
                  />
                </>
              )}

              {activeModule === "hotelaria" && (
                <>
                  <InputField
                    label="Título"
                    value={form.hotelaria.headline}
                    onChange={ht("headline")}
                    fieldKey="hotelaria.headline"
                    visible={visibleFields["hotelaria.headline"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("hotelaria", "headline")
                    }
                  />
                  <TextAreaField
                    label="Descrição"
                    value={form.hotelaria.description}
                    onChange={ht("description")}
                    rows={4}
                    fieldKey="hotelaria.description"
                    visible={visibleFields["hotelaria.description"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("hotelaria", "description")
                    }
                  />
                  <p className="text-xs text-neutral-400 pt-2 border-t">
                    Funcionalidades
                  </p>
                  <InputField
                    label="Feature 1 — Título"
                    value={form.hotelaria.f1title}
                    onChange={ht("f1title")}
                    fieldKey="hotelaria.f1title"
                    visible={visibleFields["hotelaria.f1title"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("hotelaria", "f1title")
                    }
                  />
                  <TextAreaField
                    label="Feature 1 — Descrição"
                    value={form.hotelaria.f1desc}
                    onChange={ht("f1desc")}
                    rows={2}
                    fieldKey="hotelaria.f1desc"
                    visible={visibleFields["hotelaria.f1desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("hotelaria", "f1desc")
                    }
                  />
                  <InputField
                    label="Feature 2 — Título"
                    value={form.hotelaria.f2title}
                    onChange={ht("f2title")}
                    fieldKey="hotelaria.f2title"
                    visible={visibleFields["hotelaria.f2title"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("hotelaria", "f2title")
                    }
                  />
                  <TextAreaField
                    label="Feature 2 — Descrição"
                    value={form.hotelaria.f2desc}
                    onChange={ht("f2desc")}
                    rows={2}
                    fieldKey="hotelaria.f2desc"
                    visible={visibleFields["hotelaria.f2desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("hotelaria", "f2desc")
                    }
                  />
                  <InputField
                    label="Feature 3 — Título"
                    value={form.hotelaria.f3title}
                    onChange={ht("f3title")}
                    fieldKey="hotelaria.f3title"
                    visible={visibleFields["hotelaria.f3title"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("hotelaria", "f3title")
                    }
                  />
                  <TextAreaField
                    label="Feature 3 — Descrição"
                    value={form.hotelaria.f3desc}
                    onChange={ht("f3desc")}
                    rows={2}
                    fieldKey="hotelaria.f3desc"
                    visible={visibleFields["hotelaria.f3desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("hotelaria", "f3desc")
                    }
                  />
                </>
              )}

              {activeModule === "rodoviario" && (
                <>
                  <InputField
                    label="Título"
                    value={form.rodoviario.headline}
                    onChange={rd("headline")}
                    fieldKey="rodoviario.headline"
                    visible={visibleFields["rodoviario.headline"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("rodoviario", "headline")
                    }
                  />
                  <TextAreaField
                    label="Descrição"
                    value={form.rodoviario.description}
                    onChange={rd("description")}
                    rows={3}
                    fieldKey="rodoviario.description"
                    visible={visibleFields["rodoviario.description"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("rodoviario", "description")
                    }
                  />
                  <p className="text-xs text-neutral-400 pt-2 border-t">
                    Tabela de benefícios
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <InputField
                      label="Cabeçalho Col. 1"
                      value={form.rodoviario.col1}
                      onChange={rd("col1")}
                      fieldKey="rodoviario.col1"
                      visible={visibleFields["rodoviario.col1"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("rodoviario", "col1")
                      }
                    />
                    <InputField
                      label="Cabeçalho Col. 2"
                      value={form.rodoviario.col2}
                      onChange={rd("col2")}
                      fieldKey="rodoviario.col2"
                      visible={visibleFields["rodoviario.col2"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("rodoviario", "col2")
                      }
                    />
                    <InputField
                      label="Linha 1 — Benefício"
                      value={form.rodoviario.row1b}
                      onChange={rd("row1b")}
                      fieldKey="rodoviario.row1b"
                      visible={visibleFields["rodoviario.row1b"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("rodoviario", "row1b")
                      }
                    />
                    <InputField
                      label="Linha 1 — Descrição"
                      value={form.rodoviario.row1d}
                      onChange={rd("row1d")}
                      fieldKey="rodoviario.row1d"
                      visible={visibleFields["rodoviario.row1d"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("rodoviario", "row1d")
                      }
                    />
                    <InputField
                      label="Linha 2 — Benefício"
                      value={form.rodoviario.row2b}
                      onChange={rd("row2b")}
                      fieldKey="rodoviario.row2b"
                      visible={visibleFields["rodoviario.row2b"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("rodoviario", "row2b")
                      }
                    />
                    <InputField
                      label="Linha 2 — Descrição"
                      value={form.rodoviario.row2d}
                      onChange={rd("row2d")}
                      fieldKey="rodoviario.row2d"
                      visible={visibleFields["rodoviario.row2d"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("rodoviario", "row2d")
                      }
                    />
                    <InputField
                      label="Linha 3 — Benefício"
                      value={form.rodoviario.row3b}
                      onChange={rd("row3b")}
                      fieldKey="rodoviario.row3b"
                      visible={visibleFields["rodoviario.row3b"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("rodoviario", "row3b")
                      }
                    />
                    <InputField
                      label="Linha 3 — Descrição"
                      value={form.rodoviario.row3d}
                      onChange={rd("row3d")}
                      fieldKey="rodoviario.row3d"
                      visible={visibleFields["rodoviario.row3d"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("rodoviario", "row3d")
                      }
                    />
                    <InputField
                      label="Linha 4 — Benefício"
                      value={form.rodoviario.row4b}
                      onChange={rd("row4b")}
                      fieldKey="rodoviario.row4b"
                      visible={visibleFields["rodoviario.row4b"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("rodoviario", "row4b")
                      }
                    />
                    <InputField
                      label="Linha 4 — Descrição"
                      value={form.rodoviario.row4d}
                      onChange={rd("row4d")}
                      fieldKey="rodoviario.row4d"
                      visible={visibleFields["rodoviario.row4d"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("rodoviario", "row4d")
                      }
                    />
                  </div>
                </>
              )}

              {activeModule === "bizpay" && (
                <>
                  <InputField
                    label="Título"
                    value={form.bizpay.headline}
                    onChange={bp("headline")}
                    fieldKey="bizpay.headline"
                    visible={visibleFields["bizpay.headline"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("bizpay", "headline")
                    }
                  />
                  <TextAreaField
                    label="Descrição"
                    value={form.bizpay.description}
                    onChange={bp("description")}
                    rows={4}
                    fieldKey="bizpay.description"
                    visible={visibleFields["bizpay.description"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("bizpay", "description")
                    }
                  />
                  <p className="text-xs text-neutral-400 pt-2 border-t">
                    Funcionalidades (negrito + complemento)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <InputField
                      label="F1 — Negrito"
                      value={form.bizpay.f1bold}
                      onChange={bp("f1bold")}
                      fieldKey="bizpay.f1bold"
                      visible={visibleFields["bizpay.f1bold"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("bizpay", "f1bold")
                      }
                    />
                    <InputField
                      label="F1 — Complemento"
                      value={form.bizpay.f1rest}
                      onChange={bp("f1rest")}
                      fieldKey="bizpay.f1rest"
                      visible={visibleFields["bizpay.f1rest"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("bizpay", "f1rest")
                      }
                    />
                    <InputField
                      label="F2 — Negrito"
                      value={form.bizpay.f2bold}
                      onChange={bp("f2bold")}
                      fieldKey="bizpay.f2bold"
                      visible={visibleFields["bizpay.f2bold"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("bizpay", "f2bold")
                      }
                    />
                    <InputField
                      label="F2 — Complemento"
                      value={form.bizpay.f2rest}
                      onChange={bp("f2rest")}
                      fieldKey="bizpay.f2rest"
                      visible={visibleFields["bizpay.f2rest"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("bizpay", "f2rest")
                      }
                    />
                    <InputField
                      label="F3 — Negrito"
                      value={form.bizpay.f3bold}
                      onChange={bp("f3bold")}
                      fieldKey="bizpay.f3bold"
                      visible={visibleFields["bizpay.f3bold"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("bizpay", "f3bold")
                      }
                    />
                    <InputField
                      label="F3 — Complemento"
                      value={form.bizpay.f3rest}
                      onChange={bp("f3rest")}
                      fieldKey="bizpay.f3rest"
                      visible={visibleFields["bizpay.f3rest"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("bizpay", "f3rest")
                      }
                    />
                    <InputField
                      label="F4 — Negrito"
                      value={form.bizpay.f4bold}
                      onChange={bp("f4bold")}
                      fieldKey="bizpay.f4bold"
                      visible={visibleFields["bizpay.f4bold"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("bizpay", "f4bold")
                      }
                    />
                    <InputField
                      label="F4 — Complemento"
                      value={form.bizpay.f4rest}
                      onChange={bp("f4rest")}
                      fieldKey="bizpay.f4rest"
                      visible={visibleFields["bizpay.f4rest"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("bizpay", "f4rest")
                      }
                    />
                  </div>
                </>
              )}

              {activeModule === "biztripexpense" && (
                <>
                  <InputField
                    label="Título"
                    value={form.biztripexpense.headline}
                    onChange={be("headline")}
                    fieldKey="biztripexpense.headline"
                    visible={visibleFields["biztripexpense.headline"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("biztripexpense", "headline")
                    }
                  />
                  <TextAreaField
                    label="Descrição"
                    value={form.biztripexpense.description}
                    onChange={be("description")}
                    rows={4}
                    fieldKey="biztripexpense.description"
                    visible={
                      visibleFields["biztripexpense.description"] !== false
                    }
                    onToggleVisibility={() =>
                      toggleVisibility("biztripexpense", "description")
                    }
                  />
                  <p className="text-xs text-neutral-400 pt-2 border-t">
                    Funcionalidades
                  </p>
                  <InputField
                    label="Feature 1 — Título"
                    value={form.biztripexpense.f1title}
                    onChange={be("f1title")}
                    fieldKey="biztripexpense.f1title"
                    visible={visibleFields["biztripexpense.f1title"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("biztripexpense", "f1title")
                    }
                  />
                  <TextAreaField
                    label="Feature 1 — Descrição"
                    value={form.biztripexpense.f1desc}
                    onChange={be("f1desc")}
                    rows={2}
                    fieldKey="biztripexpense.f1desc"
                    visible={visibleFields["biztripexpense.f1desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("biztripexpense", "f1desc")
                    }
                  />
                  <InputField
                    label="Feature 2 — Título"
                    value={form.biztripexpense.f2title}
                    onChange={be("f2title")}
                    fieldKey="biztripexpense.f2title"
                    visible={visibleFields["biztripexpense.f2title"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("biztripexpense", "f2title")
                    }
                  />
                  <TextAreaField
                    label="Feature 2 — Descrição"
                    value={form.biztripexpense.f2desc}
                    onChange={be("f2desc")}
                    rows={2}
                    fieldKey="biztripexpense.f2desc"
                    visible={visibleFields["biztripexpense.f2desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("biztripexpense", "f2desc")
                    }
                  />
                  <InputField
                    label="Feature 3 — Título"
                    value={form.biztripexpense.f3title}
                    onChange={be("f3title")}
                    fieldKey="biztripexpense.f3title"
                    visible={visibleFields["biztripexpense.f3title"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("biztripexpense", "f3title")
                    }
                  />
                  <TextAreaField
                    label="Feature 3 — Descrição"
                    value={form.biztripexpense.f3desc}
                    onChange={be("f3desc")}
                    rows={2}
                    fieldKey="biztripexpense.f3desc"
                    visible={visibleFields["biztripexpense.f3desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("biztripexpense", "f3desc")
                    }
                  />
                  <InputField
                    label="Feature 4 — Título"
                    value={form.biztripexpense.f4title}
                    onChange={be("f4title")}
                    fieldKey="biztripexpense.f4title"
                    visible={visibleFields["biztripexpense.f4title"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("biztripexpense", "f4title")
                    }
                  />
                  <TextAreaField
                    label="Feature 4 — Descrição"
                    value={form.biztripexpense.f4desc}
                    onChange={be("f4desc")}
                    rows={2}
                    fieldKey="biztripexpense.f4desc"
                    visible={visibleFields["biztripexpense.f4desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("biztripexpense", "f4desc")
                    }
                  />
                </>
              )}

              {activeModule === "ai" && (
                <>
                  <InputField
                    label="Título do Slide"
                    value={form.ai.headline}
                    onChange={ai("headline")}
                    fieldKey="ai.headline"
                    visible={visibleFields["ai.headline"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("ai", "headline")
                    }
                  />
                  <TextAreaField
                    label="Descrição"
                    value={form.ai.description}
                    onChange={ai("description")}
                    rows={3}
                    fieldKey="ai.description"
                    visible={visibleFields["ai.description"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("ai", "description")
                    }
                  />
                  <InputField
                    label="Capacidade 1 — Título"
                    value={form.ai.capability1}
                    onChange={ai("capability1")}
                    fieldKey="ai.capability1"
                    visible={visibleFields["ai.capability1"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("ai", "capability1")
                    }
                  />
                  <TextAreaField
                    label="Capacidade 1 — Descrição"
                    value={form.ai.capability1Desc}
                    onChange={ai("capability1Desc")}
                    rows={2}
                    fieldKey="ai.capability1Desc"
                    visible={visibleFields["ai.capability1Desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("ai", "capability1Desc")
                    }
                  />
                  <InputField
                    label="Capacidade 2 — Título"
                    value={form.ai.capability2}
                    onChange={ai("capability2")}
                    fieldKey="ai.capability2"
                    visible={visibleFields["ai.capability2"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("ai", "capability2")
                    }
                  />
                  <TextAreaField
                    label="Capacidade 2 — Descrição"
                    value={form.ai.capability2Desc}
                    onChange={ai("capability2Desc")}
                    rows={2}
                    fieldKey="ai.capability2Desc"
                    visible={visibleFields["ai.capability2Desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("ai", "capability2Desc")
                    }
                  />
                  <InputField
                    label="Capacidade 3 — Título"
                    value={form.ai.capability3}
                    onChange={ai("capability3")}
                    fieldKey="ai.capability3"
                    visible={visibleFields["ai.capability3"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("ai", "capability3")
                    }
                  />
                  <TextAreaField
                    label="Capacidade 3 — Descrição"
                    value={form.ai.capability3Desc}
                    onChange={ai("capability3Desc")}
                    rows={2}
                    fieldKey="ai.capability3Desc"
                    visible={visibleFields["ai.capability3Desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("ai", "capability3Desc")
                    }
                  />
                  <InputField
                    label="Capacidade 4 — Título"
                    value={form.ai.capability4}
                    onChange={ai("capability4")}
                    fieldKey="ai.capability4"
                    visible={visibleFields["ai.capability4"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("ai", "capability4")
                    }
                  />
                  <TextAreaField
                    label="Capacidade 4 — Descrição"
                    value={form.ai.capability4Desc}
                    onChange={ai("capability4Desc")}
                    rows={2}
                    fieldKey="ai.capability4Desc"
                    visible={visibleFields["ai.capability4Desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("ai", "capability4Desc")
                    }
                  />
                </>
              )}

              {activeModule === "reports" && (
                <>
                  <InputField
                    label="Título do Slide"
                    value={form.reports.headline}
                    onChange={rp("headline")}
                    fieldKey="reports.headline"
                    visible={visibleFields["reports.headline"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("reports", "headline")
                    }
                  />
                  <TextAreaField
                    label="Descrição"
                    value={form.reports.description}
                    onChange={rp("description")}
                    rows={3}
                    fieldKey="reports.description"
                    visible={visibleFields["reports.description"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("reports", "description")
                    }
                  />
                </>
              )}

              {activeModule === "integrations" && (
                <>
                  <InputField
                    label="Título do Slide"
                    value={form.integrations.headline}
                    onChange={ig("headline")}
                    fieldKey="integrations.headline"
                    visible={visibleFields["integrations.headline"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("integrations", "headline")
                    }
                  />
                  <TextAreaField
                    label="Descrição"
                    value={form.integrations.description}
                    onChange={ig("description")}
                    rows={3}
                    fieldKey="integrations.description"
                    visible={
                      visibleFields["integrations.description"] !== false
                    }
                    onToggleVisibility={() =>
                      toggleVisibility("integrations", "description")
                    }
                  />
                  <p className="text-xs text-neutral-400 pt-2 border-t">
                    Integrações
                  </p>
                  {[
                    {
                      labelKey: "int1" as const,
                      logoKey: "int1Logo" as const,
                      num: 1,
                    },
                    {
                      labelKey: "int2" as const,
                      logoKey: "int2Logo" as const,
                      num: 2,
                    },
                    {
                      labelKey: "int3" as const,
                      logoKey: "int3Logo" as const,
                      num: 3,
                    },
                    {
                      labelKey: "int4" as const,
                      logoKey: "int4Logo" as const,
                      num: 4,
                    },
                    {
                      labelKey: "int5" as const,
                      logoKey: "int5Logo" as const,
                      num: 5,
                    },
                    {
                      labelKey: "int6" as const,
                      logoKey: "int6Logo" as const,
                      num: 6,
                    },
                    {
                      labelKey: "int7" as const,
                      logoKey: "int7Logo" as const,
                      num: 7,
                    },
                    {
                      labelKey: "int8" as const,
                      logoKey: "int8Logo" as const,
                      num: 8,
                    },
                    {
                      labelKey: "int9" as const,
                      logoKey: "int9Logo" as const,
                      num: 9,
                    },
                    {
                      labelKey: "int10" as const,
                      logoKey: "int10Logo" as const,
                      num: 10,
                    },
                  ].map(({ labelKey, logoKey, num }) => (
                    <div key={num} className="space-y-1.5">
                      <InputField
                        label={`Integração ${num}`}
                        value={form.integrations[labelKey]}
                        onChange={ig(labelKey)}
                        fieldKey={`integrations.int${num}`}
                        visible={
                          visibleFields[`integrations.int${num}`] !== false
                        }
                        onToggleVisibility={() =>
                          toggleVisibility("integrations", `int${num}`)
                        }
                      />
                      <div className="flex items-center gap-2">
                        {form.integrations[logoKey] ? (
                          <div className="flex items-center gap-2 flex-1">
                            <div className="size-10 rounded-lg border border-neutral-200 bg-neutral-50 flex items-center justify-center overflow-hidden shrink-0">
                              <img
                                src={form.integrations[logoKey]}
                                alt=""
                                className="size-full object-contain p-1"
                              />
                            </div>
                            <span className="text-xs text-neutral-500 flex-1 truncate">
                              Logo anexada
                            </span>
                            <button
                              onClick={() => ig(logoKey)("")}
                              className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors shrink-0"
                            >
                              Excluir
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center gap-2 cursor-pointer flex-1">
                            <div className="size-10 rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center shrink-0 hover:border-blue-400 transition-colors">
                              <Upload className="size-3.5 text-neutral-400" />
                            </div>
                            <span className="text-xs text-neutral-400">
                              Anexar logo
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (ev) =>
                                  ig(logoKey)(ev.target?.result as string);
                                reader.readAsDataURL(file);
                                e.target.value = "";
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {activeModule === "support" && (
                <>
                  <InputField
                    label="Título do Slide"
                    value={form.support.headline}
                    onChange={sp("headline")}
                    fieldKey="support.headline"
                    visible={visibleFields["support.headline"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("support", "headline")
                    }
                  />
                  <TextAreaField
                    label="Descrição"
                    value={form.support.description}
                    onChange={sp("description")}
                    rows={3}
                    fieldKey="support.description"
                    visible={visibleFields["support.description"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("support", "description")
                    }
                  />
                  <InputField
                    label="Canal 1"
                    value={form.support.channel1}
                    onChange={sp("channel1")}
                    placeholder="Ex: Chat em tempo real"
                    fieldKey="support.channel1"
                    visible={visibleFields["support.channel1"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("support", "channel1")
                    }
                  />
                  <InputField
                    label="Canal 2"
                    value={form.support.channel2}
                    onChange={sp("channel2")}
                    placeholder="Ex: E-mail dedicado"
                    fieldKey="support.channel2"
                    visible={visibleFields["support.channel2"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("support", "channel2")
                    }
                  />
                  <InputField
                    label="Canal 3"
                    value={form.support.channel3}
                    onChange={sp("channel3")}
                    placeholder="Ex: Telefone 0800"
                    fieldKey="support.channel3"
                    visible={visibleFields["support.channel3"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("support", "channel3")
                    }
                  />
                  <InputField
                    label="Plano"
                    value={form.support.plan}
                    onChange={sp("plan")}
                    placeholder="Ex: Premium Enterprise"
                    fieldKey="support.plan"
                    visible={visibleFields["support.plan"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("support", "plan")
                    }
                  />
                  <InputField
                    label="SLA"
                    value={form.support.sla}
                    onChange={sp("sla")}
                    placeholder="Ex: Resposta em 2 horas"
                    fieldKey="support.sla"
                    visible={visibleFields["support.sla"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("support", "sla")
                    }
                  />
                  <InputField
                    label="Horário"
                    value={form.support.hours}
                    onChange={sp("hours")}
                    placeholder="Ex: 24/7"
                    fieldKey="support.hours"
                    visible={visibleFields["support.hours"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("support", "hours")
                    }
                  />
                </>
              )}

              {activeModule === "implementation" && (
                <>
                  <InputField
                    label="Título do Slide"
                    value={form.implementation.headline}
                    onChange={im("headline")}
                    fieldKey="implementation.headline"
                    visible={visibleFields["implementation.headline"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("implementation", "headline")
                    }
                  />
                  <TextAreaField
                    label="Descrição"
                    value={form.implementation.description}
                    onChange={im("description")}
                    rows={3}
                    fieldKey="implementation.description"
                    visible={
                      visibleFields["implementation.description"] !== false
                    }
                    onToggleVisibility={() =>
                      toggleVisibility("implementation", "description")
                    }
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <InputField
                      label="Fase 1"
                      value={form.implementation.phase1}
                      onChange={im("phase1")}
                      fieldKey="implementation.phase1"
                      visible={visibleFields["implementation.phase1"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("implementation", "phase1")
                      }
                    />
                    <InputField
                      label="Período"
                      value={form.implementation.phase1Duration}
                      onChange={im("phase1Duration")}
                      fieldKey="implementation.phase1Duration"
                      visible={
                        visibleFields["implementation.phase1Duration"] !== false
                      }
                      onToggleVisibility={() =>
                        toggleVisibility("implementation", "phase1Duration")
                      }
                    />
                    <InputField
                      label="Fase 2"
                      value={form.implementation.phase2}
                      onChange={im("phase2")}
                      fieldKey="implementation.phase2"
                      visible={visibleFields["implementation.phase2"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("implementation", "phase2")
                      }
                    />
                    <InputField
                      label="Período"
                      value={form.implementation.phase2Duration}
                      onChange={im("phase2Duration")}
                      fieldKey="implementation.phase2Duration"
                      visible={
                        visibleFields["implementation.phase2Duration"] !== false
                      }
                      onToggleVisibility={() =>
                        toggleVisibility("implementation", "phase2Duration")
                      }
                    />
                    <InputField
                      label="Fase 3"
                      value={form.implementation.phase3}
                      onChange={im("phase3")}
                      fieldKey="implementation.phase3"
                      visible={visibleFields["implementation.phase3"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("implementation", "phase3")
                      }
                    />
                    <InputField
                      label="Período"
                      value={form.implementation.phase3Duration}
                      onChange={im("phase3Duration")}
                      fieldKey="implementation.phase3Duration"
                      visible={
                        visibleFields["implementation.phase3Duration"] !== false
                      }
                      onToggleVisibility={() =>
                        toggleVisibility("implementation", "phase3Duration")
                      }
                    />
                    <InputField
                      label="Fase 4"
                      value={form.implementation.phase4}
                      onChange={im("phase4")}
                      fieldKey="implementation.phase4"
                      visible={visibleFields["implementation.phase4"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("implementation", "phase4")
                      }
                    />
                    <InputField
                      label="Período"
                      value={form.implementation.phase4Duration}
                      onChange={im("phase4Duration")}
                      fieldKey="implementation.phase4Duration"
                      visible={
                        visibleFields["implementation.phase4Duration"] !== false
                      }
                      onToggleVisibility={() =>
                        toggleVisibility("implementation", "phase4Duration")
                      }
                    />
                    <InputField
                      label="Fase 5"
                      value={form.implementation.phase5}
                      onChange={im("phase5")}
                      fieldKey="implementation.phase5"
                      visible={visibleFields["implementation.phase5"] !== false}
                      onToggleVisibility={() =>
                        toggleVisibility("implementation", "phase5")
                      }
                    />
                    <InputField
                      label="Período"
                      value={form.implementation.phase5Duration}
                      onChange={im("phase5Duration")}
                      fieldKey="implementation.phase5Duration"
                      visible={
                        visibleFields["implementation.phase5Duration"] !== false
                      }
                      onToggleVisibility={() =>
                        toggleVisibility("implementation", "phase5Duration")
                      }
                    />
                  </div>
                  <InputField
                    label="Prazo Total"
                    value={form.implementation.totalDuration}
                    onChange={im("totalDuration")}
                    placeholder="Ex: Implantação em 30 dias"
                    fieldKey="implementation.totalDuration"
                    visible={
                      visibleFields["implementation.totalDuration"] !== false
                    }
                    onToggleVisibility={() =>
                      toggleVisibility("implementation", "totalDuration")
                    }
                  />
                </>
              )}

              {activeModule === "investment" && form.investment && (
                <>
                  <InputField
                    label="Título do Slide"
                    value={form.investment.headline}
                    onChange={inv("headline")}
                    fieldKey="investment.headline"
                    visible={visibleFields["investment.headline"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("investment", "headline")
                    }
                  />

                  <button
                    type="button"
                    onClick={() => toggleEditorInvSection("setup")}
                    className="flex items-center gap-1 text-xs text-neutral-400 uppercase tracking-wider pt-3 pb-1 border-t w-full text-left cursor-pointer hover:text-neutral-600 transition-colors"
                  >
                    <ChevronRight
                      className={`size-3 transition-transform duration-200 ${editorInvSections.setup ? "rotate-90" : ""}`}
                    />
                    <span>SETUP INICIAL (Pagamento Único)</span>
                  </button>
                  {editorInvSections.setup && (
                    <>
                      <InputField
                        label="IMPLANTAÇÃO E TREINAMENTOS (R$)"
                        value={form.investment.implantacaoTreinamentos}
                        onChange={inv("implantacaoTreinamentos")}
                        placeholder="Ex: 5000"
                        fieldKey="investment.implantacaoTreinamentos"
                        visible={
                          visibleFields[
                            "investment.implantacaoTreinamentos"
                          ] !== false
                        }
                        onToggleVisibility={() =>
                          toggleVisibility(
                            "investment",
                            "implantacaoTreinamentos",
                          )
                        }
                      />
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleEditorInvSection("travel")}
                    className="flex items-center gap-1 text-xs text-neutral-400 uppercase tracking-wider pt-3 pb-1 border-t w-full text-left cursor-pointer hover:text-neutral-600 transition-colors"
                  >
                    <ChevronRight
                      className={`size-3 transition-transform duration-200 ${editorInvSections.travel ? "rotate-90" : ""}`}
                    />
                    <span>TRAVEL E DESPESAS (Mensal)</span>
                  </button>
                  {editorInvSections.travel && (
                    <>
                      <InputField
                        label="EMISSÃO AÉREO"
                        value={form.investment.emissaoAereo}
                        onChange={inv("emissaoAereo")}
                        placeholder='Valor ou "Incluso"'
                        fieldKey="investment.emissaoAereo"
                        visible={
                          visibleFields["investment.emissaoAereo"] !== false
                        }
                        onToggleVisibility={() =>
                          toggleVisibility("investment", "emissaoAereo")
                        }
                      />
                      <InputField
                        label="EMISSÃO RODOVIÁRIO"
                        value={form.investment.emissaoRodoviario}
                        onChange={inv("emissaoRodoviario")}
                        placeholder='Valor ou "Incluso"'
                        fieldKey="investment.emissaoRodoviario"
                        visible={
                          visibleFields["investment.emissaoRodoviario"] !==
                          false
                        }
                        onToggleVisibility={() =>
                          toggleVisibility("investment", "emissaoRodoviario")
                        }
                      />
                      <InputField
                        label="EMISSÃO CARRO"
                        value={form.investment.emissaoCarro}
                        onChange={inv("emissaoCarro")}
                        placeholder='Valor ou "Incluso"'
                        fieldKey="investment.emissaoCarro"
                        visible={
                          visibleFields["investment.emissaoCarro"] !== false
                        }
                        onToggleVisibility={() =>
                          toggleVisibility("investment", "emissaoCarro")
                        }
                      />
                      <InputField
                        label="BILHETE NÃO VOADO"
                        value={form.investment.bilheteNaoVoado}
                        onChange={inv("bilheteNaoVoado")}
                        placeholder='Valor ou "Incluso"'
                        fieldKey="investment.bilheteNaoVoado"
                        visible={
                          visibleFields["investment.bilheteNaoVoado"] !== false
                        }
                        onToggleVisibility={() =>
                          toggleVisibility("investment", "bilheteNaoVoado")
                        }
                      />
                      <InputField
                        label="ATENDIMENTO 24H"
                        value={form.investment.atendimento24h}
                        onChange={inv("atendimento24h")}
                        placeholder='Valor ou "Incluso"'
                        fieldKey="investment.atendimento24h"
                        visible={
                          visibleFields["investment.atendimento24h"] !== false
                        }
                        onToggleVisibility={() =>
                          toggleVisibility("investment", "atendimento24h")
                        }
                      />
                      <InputField
                        label="REEMBOLSO"
                        value={form.investment.reembolso}
                        onChange={inv("reembolso")}
                        placeholder='Valor ou "Incluso"'
                        fieldKey="investment.reembolso"
                        visible={
                          visibleFields["investment.reembolso"] !== false
                        }
                        onToggleVisibility={() =>
                          toggleVisibility("investment", "reembolso")
                        }
                      />
                      <InputField
                        label="BI TRAVEL E EXPENSE"
                        value={form.investment.biTravelExpense}
                        onChange={inv("biTravelExpense")}
                        placeholder='Valor ou "Incluso"'
                        fieldKey="investment.biTravelExpense"
                        visible={
                          visibleFields["investment.biTravelExpense"] !== false
                        }
                        onToggleVisibility={() =>
                          toggleVisibility("investment", "biTravelExpense")
                        }
                      />
                      <InputField
                        label="EMISSÃO ASSENTO CONFORTO"
                        value={form.investment.emissaoAssentoConforto}
                        onChange={inv("emissaoAssentoConforto")}
                        placeholder='Valor ou "Incluso"'
                        fieldKey="investment.emissaoAssentoConforto"
                        visible={
                          visibleFields["investment.emissaoAssentoConforto"] !==
                          false
                        }
                        onToggleVisibility={() =>
                          toggleVisibility(
                            "investment",
                            "emissaoAssentoConforto",
                          )
                        }
                      />
                      <InputField
                        label="COMPRA DE BAGAGEM"
                        value={form.investment.compraBagagem}
                        onChange={inv("compraBagagem")}
                        placeholder='Valor ou "Incluso"'
                        fieldKey="investment.compraBagagem"
                        visible={
                          visibleFields["investment.compraBagagem"] !== false
                        }
                        onToggleVisibility={() =>
                          toggleVisibility("investment", "compraBagagem")
                        }
                      />
                      <InputField
                        label="RESERVAS LONGSTAY"
                        value={form.investment.reservasLongstay}
                        onChange={inv("reservasLongstay")}
                        placeholder='Valor ou "Incluso"'
                        fieldKey="investment.reservasLongstay"
                        visible={
                          visibleFields["investment.reservasLongstay"] !== false
                        }
                        onToggleVisibility={() =>
                          toggleVisibility("investment", "reservasLongstay")
                        }
                      />
                      <InputField
                        label="DISPONIBILIDADE DE API"
                        value={form.investment.disponibilidadeApi}
                        onChange={inv("disponibilidadeApi")}
                        placeholder='Valor ou "Incluso"'
                        fieldKey="investment.disponibilidadeApi"
                        visible={
                          visibleFields["investment.disponibilidadeApi"] !==
                          false
                        }
                        onToggleVisibility={() =>
                          toggleVisibility("investment", "disponibilidadeApi")
                        }
                      />
                      <InputField
                        label="SOLICITAÇÃO DE REEMBOLSO"
                        value={form.investment.solicitacaoReembolso}
                        onChange={inv("solicitacaoReembolso")}
                        placeholder='Valor ou "Incluso"'
                        fieldKey="investment.solicitacaoReembolso"
                        visible={
                          visibleFields["investment.solicitacaoReembolso"] !==
                          false
                        }
                        onToggleVisibility={() =>
                          toggleVisibility("investment", "solicitacaoReembolso")
                        }
                      />
                      <InputField
                        label="IA INTEGRADO AS DESPESAS"
                        value={form.investment.iaIntegradoDespesas}
                        onChange={inv("iaIntegradoDespesas")}
                        placeholder='Valor ou "Incluso"'
                        fieldKey="investment.iaIntegradoDespesas"
                        visible={
                          visibleFields["investment.iaIntegradoDespesas"] !==
                          false
                        }
                        onToggleVisibility={() =>
                          toggleVisibility("investment", "iaIntegradoDespesas")
                        }
                      />
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleEditorInvSection("bizpay")}
                    className="flex items-center gap-1 text-xs text-neutral-400 uppercase tracking-wider pt-3 pb-1 border-t w-full text-left cursor-pointer hover:text-neutral-600 transition-colors"
                  >
                    <ChevronRight
                      className={`size-3 transition-transform duration-200 ${editorInvSections.bizpay ? "rotate-90" : ""}`}
                    />
                    <span>BIZPAY (Valor Variado)</span>
                  </button>
                  {editorInvSections.bizpay && (
                    <>
                      <InputField
                        label="EMISSÃO DE NOVOS CARTÕES FÍSICOS (R$)"
                        value={form.investment.emissaoNovosCartoesFisicos}
                        onChange={inv("emissaoNovosCartoesFisicos")}
                        placeholder="Valor em R$"
                        fieldKey="investment.emissaoNovosCartoesFisicos"
                        visible={
                          visibleFields[
                            "investment.emissaoNovosCartoesFisicos"
                          ] !== false
                        }
                        onToggleVisibility={() =>
                          toggleVisibility(
                            "investment",
                            "emissaoNovosCartoesFisicos",
                          )
                        }
                      />
                      <InputField
                        label="CARTÃO BIZPAY (R$/mês)"
                        value={form.investment.cartaoBizpay}
                        onChange={inv("cartaoBizpay")}
                        placeholder="Ex: 7,00"
                        fieldKey="investment.cartaoBizpay"
                        visible={
                          visibleFields["investment.cartaoBizpay"] !== false
                        }
                        onToggleVisibility={() =>
                          toggleVisibility("investment", "cartaoBizpay")
                        }
                      />
                      <InputField
                        label="CRIAÇÃO DE CARTÃO VIRTUAL"
                        value={form.investment.criacaoCartaoVirtual}
                        onChange={inv("criacaoCartaoVirtual")}
                        placeholder='Valor ou "Incluso"'
                        fieldKey="investment.criacaoCartaoVirtual"
                        visible={
                          visibleFields["investment.criacaoCartaoVirtual"] !==
                          false
                        }
                        onToggleVisibility={() =>
                          toggleVisibility("investment", "criacaoCartaoVirtual")
                        }
                      />
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleEditorInvSection("formaPagamento")}
                    className="flex items-center gap-1 text-xs text-neutral-400 uppercase tracking-wider pt-3 pb-1 border-t w-full text-left cursor-pointer hover:text-neutral-600 transition-colors"
                  >
                    <ChevronRight
                      className={`size-3 transition-transform duration-200 ${editorInvSections.formaPagamento ? "rotate-90" : ""}`}
                    />
                    <span>FORMA DE PAGAMENTO</span>
                  </button>
                  {editorInvSections.formaPagamento && (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              form.investment.formaPagamento?.includes(
                                "Cartão de Crédito",
                              ) || false
                            }
                            onChange={(e) => {
                              const current =
                                form.investment.formaPagamento || "";
                              const options = current
                                .split(", ")
                                .filter(Boolean);
                              if (e.target.checked) {
                                options.push("Cartão de Crédito");
                              } else {
                                const idx =
                                  options.indexOf("Cartão de Crédito");
                                if (idx > -1) options.splice(idx, 1);
                              }
                              inv("formaPagamento")(options.join(", "));
                            }}
                            className="size-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className="font-medium text-sm">
                            Cartão de Crédito
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              form.investment.formaPagamento?.includes(
                                "Faturado",
                              ) || false
                            }
                            onChange={(e) => {
                              const current =
                                form.investment.formaPagamento || "";
                              const options = current
                                .split(", ")
                                .filter(Boolean);
                              if (e.target.checked) {
                                options.push("Faturado");
                              } else {
                                const idx = options.indexOf("Faturado");
                                if (idx > -1) options.splice(idx, 1);
                              }
                              inv("formaPagamento")(options.join(", "));
                            }}
                            className="size-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className="font-medium text-sm">Faturado</span>
                        </label>
                      </div>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleEditorInvSection("prazo")}
                    className="flex items-center gap-1 text-xs text-neutral-400 uppercase tracking-wider pt-3 pb-1 border-t w-full text-left cursor-pointer hover:text-neutral-600 transition-colors"
                  >
                    <ChevronRight
                      className={`size-3 transition-transform duration-200 ${editorInvSections.prazo ? "rotate-90" : ""}`}
                    />
                    <span>PRAZO</span>
                  </button>
                  {editorInvSections.prazo && (
                    <>
                      <InputField
                        label="Prazo (dias)"
                        value={form.investment.prazo}
                        onChange={inv("prazo")}
                        placeholder="Ex: 30"
                        fieldKey="investment.prazo"
                        visible={visibleFields["investment.prazo"] !== false}
                        onToggleVisibility={() =>
                          toggleVisibility("investment", "prazo")
                        }
                      />
                    </>
                  )}
                </>
              )}

              {activeModule === "whybiztrip" && form.whybiztrip && (
                <>
                  <InputField
                    label="Título do Slide"
                    value={form.whybiztrip.headline}
                    onChange={wb("headline")}
                    fieldKey="whybiztrip.headline"
                    visible={visibleFields["whybiztrip.headline"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "headline")
                    }
                  />
                  <TextAreaField
                    label="Descrição"
                    value={form.whybiztrip.description}
                    onChange={wb("description")}
                    rows={2}
                    fieldKey="whybiztrip.description"
                    visible={visibleFields["whybiztrip.description"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "description")
                    }
                  />
                  <p className="text-xs text-neutral-400 pt-2 border-t">
                    Diferenciais
                  </p>
                  <InputField
                    label="Diferencial 1 — Título"
                    value={form.whybiztrip.d1title}
                    onChange={wb("d1title")}
                    fieldKey="whybiztrip.d1title"
                    visible={visibleFields["whybiztrip.d1title"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "d1title")
                    }
                  />
                  <TextAreaField
                    label="Diferencial 1 — Descrição"
                    value={form.whybiztrip.d1desc}
                    onChange={wb("d1desc")}
                    rows={2}
                    fieldKey="whybiztrip.d1desc"
                    visible={visibleFields["whybiztrip.d1desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "d1desc")
                    }
                  />
                  <InputField
                    label="Diferencial 2 — Título"
                    value={form.whybiztrip.d2title}
                    onChange={wb("d2title")}
                    fieldKey="whybiztrip.d2title"
                    visible={visibleFields["whybiztrip.d2title"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "d2title")
                    }
                  />
                  <TextAreaField
                    label="Diferencial 2 — Descrição"
                    value={form.whybiztrip.d2desc}
                    onChange={wb("d2desc")}
                    rows={2}
                    fieldKey="whybiztrip.d2desc"
                    visible={visibleFields["whybiztrip.d2desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "d2desc")
                    }
                  />
                  <InputField
                    label="Diferencial 3 — Título"
                    value={form.whybiztrip.d3title}
                    onChange={wb("d3title")}
                    fieldKey="whybiztrip.d3title"
                    visible={visibleFields["whybiztrip.d3title"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "d3title")
                    }
                  />
                  <TextAreaField
                    label="Diferencial 3 — Descrição"
                    value={form.whybiztrip.d3desc}
                    onChange={wb("d3desc")}
                    rows={2}
                    fieldKey="whybiztrip.d3desc"
                    visible={visibleFields["whybiztrip.d3desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "d3desc")
                    }
                  />
                  <InputField
                    label="Diferencial 4 — Título"
                    value={form.whybiztrip.d4title}
                    onChange={wb("d4title")}
                    fieldKey="whybiztrip.d4title"
                    visible={visibleFields["whybiztrip.d4title"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "d4title")
                    }
                  />
                  <TextAreaField
                    label="Diferencial 4 — Descrição"
                    value={form.whybiztrip.d4desc}
                    onChange={wb("d4desc")}
                    rows={2}
                    fieldKey="whybiztrip.d4desc"
                    visible={visibleFields["whybiztrip.d4desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "d4desc")
                    }
                  />
                  <InputField
                    label="Diferencial 5 — Título"
                    value={form.whybiztrip.d5title}
                    onChange={wb("d5title")}
                    fieldKey="whybiztrip.d5title"
                    visible={visibleFields["whybiztrip.d5title"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "d5title")
                    }
                  />
                  <TextAreaField
                    label="Diferencial 5 — Descrição"
                    value={form.whybiztrip.d5desc}
                    onChange={wb("d5desc")}
                    rows={2}
                    fieldKey="whybiztrip.d5desc"
                    visible={visibleFields["whybiztrip.d5desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "d5desc")
                    }
                  />
                  <InputField
                    label="Diferencial 6 — Título"
                    value={form.whybiztrip.d6title}
                    onChange={wb("d6title")}
                    fieldKey="whybiztrip.d6title"
                    visible={visibleFields["whybiztrip.d6title"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "d6title")
                    }
                  />
                  <TextAreaField
                    label="Diferencial 6 — Descrição"
                    value={form.whybiztrip.d6desc}
                    onChange={wb("d6desc")}
                    rows={2}
                    fieldKey="whybiztrip.d6desc"
                    visible={visibleFields["whybiztrip.d6desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "d6desc")
                    }
                  />
                  <InputField
                    label="Diferencial 7 — Título"
                    value={form.whybiztrip.d7title}
                    onChange={wb("d7title")}
                    fieldKey="whybiztrip.d7title"
                    visible={visibleFields["whybiztrip.d7title"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "d7title")
                    }
                  />
                  <TextAreaField
                    label="Diferencial 7 — Descrição"
                    value={form.whybiztrip.d7desc}
                    onChange={wb("d7desc")}
                    rows={2}
                    fieldKey="whybiztrip.d7desc"
                    visible={visibleFields["whybiztrip.d7desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "d7desc")
                    }
                  />
                  <InputField
                    label="Diferencial 8 — Título"
                    value={form.whybiztrip.d8title}
                    onChange={wb("d8title")}
                    fieldKey="whybiztrip.d8title"
                    visible={visibleFields["whybiztrip.d8title"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "d8title")
                    }
                  />
                  <TextAreaField
                    label="Diferencial 8 — Descrição"
                    value={form.whybiztrip.d8desc}
                    onChange={wb("d8desc")}
                    rows={2}
                    fieldKey="whybiztrip.d8desc"
                    visible={visibleFields["whybiztrip.d8desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "d8desc")
                    }
                  />
                  <InputField
                    label="Diferencial 9 — Título"
                    value={form.whybiztrip.d9title}
                    onChange={wb("d9title")}
                    fieldKey="whybiztrip.d9title"
                    visible={visibleFields["whybiztrip.d9title"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "d9title")
                    }
                  />
                  <TextAreaField
                    label="Diferencial 9 — Descrição"
                    value={form.whybiztrip.d9desc}
                    onChange={wb("d9desc")}
                    rows={2}
                    fieldKey="whybiztrip.d9desc"
                    visible={visibleFields["whybiztrip.d9desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "d9desc")
                    }
                  />
                  <InputField
                    label="Destaque — Título"
                    value={form.whybiztrip.d10title}
                    onChange={wb("d10title")}
                    fieldKey="whybiztrip.d10title"
                    visible={visibleFields["whybiztrip.d10title"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "d10title")
                    }
                  />
                  <TextAreaField
                    label="Destaque — Descrição"
                    value={form.whybiztrip.d10desc}
                    onChange={wb("d10desc")}
                    rows={2}
                    fieldKey="whybiztrip.d10desc"
                    visible={visibleFields["whybiztrip.d10desc"] !== false}
                    onToggleVisibility={() =>
                      toggleVisibility("whybiztrip", "d10desc")
                    }
                  />
                </>
              )}
            </div>
          </ScrollArea>
        </main>

        {/* Right Panel - PDF Preview */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-200">
          {selectedSavedId && savedPdfUrl ? (
            <>
              <div className="px-4 py-2 bg-white border-b flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToEditor}
                  className="gap-1 text-xs h-7"
                >
                  <ArrowLeft className="size-3.5" />
                  Voltar
                </Button>
                <span className="text-xs text-neutral-500 font-medium truncate flex-1 min-w-0">
                  {savedProposals.find((p) => p.id === selectedSavedId)?.title}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-7 shrink-0"
                  onClick={() => window.open(savedPdfUrl!, "_blank")}
                >
                  <Eye className="size-3.5" />
                  Abrir PDF
                </Button>
              </div>
              <div className="flex-1 p-4">
                <iframe
                  src={savedPdfUrl}
                  className="w-full h-full rounded-lg shadow-xl bg-white"
                  title="Preview da Proposta"
                />
              </div>
            </>
          ) : (
            <>
              <div className="px-6 py-3 bg-white border-b flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-sm text-neutral-700">
                    Preview — Formato A4
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Atualiza em tempo real conforme você edita
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-full">
                    {modules.find((m) => m.id === activeModule)?.name}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="bg-white hover:bg-neutral-50 gap-1.5"
                    onClick={handleSave}
                    disabled={saveStatus === "saving"}
                  >
                    <Save className="size-3.5" />
                    {saveStatus === "saving"
                      ? "Salvando..."
                      : saveStatus === "saved"
                        ? "Salvo!"
                        : saveStatus === "error"
                          ? "Erro ao salvar"
                          : "Salvar"}
                  </Button>
                  {pdfBlobUrl && (
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-white hover:bg-neutral-50 gap-1.5 text-emerald-700 border-emerald-300 hover:border-emerald-400"
                        onClick={() => window.open(pdfBlobUrl, "_blank")}
                      >
                        <Eye className="size-3.5" />
                        Ver PDF
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-white hover:bg-neutral-50 gap-1.5"
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = pdfBlobUrl;
                          a.download = `proposta-${form.cover.company || "biztrip"}.pdf`;
                          a.click();
                        }}
                      >
                        <FileDown className="size-3.5" />
                        Baixar PDF
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                <div className="flex flex-col items-center py-8 px-4 gap-0">
                  <div style={{ width: 595 }} className="shrink-0">
                    {activeModule === "cover" && (
                      <CoverSlide
                        data={form.cover}
                        visibleFields={visibleFields}
                      />
                    )}
                    {activeModule === "travel" && (
                      <TravelSlide
                        data={form.travel}
                        visibleFields={visibleFields}
                      />
                    )}
                    {activeModule === "hotelaria" && form.hotelaria && (
                      <HotelariaSlide
                        data={form.hotelaria}
                        visibleFields={visibleFields}
                      />
                    )}
                    {activeModule === "rodoviario" && form.rodoviario && (
                      <RodoviarioSlide
                        data={form.rodoviario}
                        visibleFields={visibleFields}
                      />
                    )}
                    {activeModule === "bizpay" && form.bizpay && (
                      <BizpaySlide
                        data={form.bizpay}
                        visibleFields={visibleFields}
                      />
                    )}
                    {activeModule === "biztripexpense" &&
                      form.biztripexpense && (
                        <BiztripExpenseSlide
                          data={form.biztripexpense}
                          visibleFields={visibleFields}
                        />
                      )}
                    {activeModule === "ai" && (
                      <AISlide data={form.ai} visibleFields={visibleFields} />
                    )}
                    {activeModule === "reports" && (
                      <ReportsSlide
                        data={form.reports}
                        visibleFields={visibleFields}
                      />
                    )}
                    {activeModule === "integrations" && (
                      <IntegrationsSlide
                        data={form.integrations}
                        visibleFields={visibleFields}
                      />
                    )}
                    {activeModule === "support" && (
                      <SupportSlide
                        data={form.support}
                        visibleFields={visibleFields}
                      />
                    )}
                    {activeModule === "implementation" && (
                      <ImplementationSlide
                        data={form.implementation}
                        visibleFields={visibleFields}
                      />
                    )}
                    {activeModule === "investment" && form.investment && (
                      <InvestmentSlide
                        data={form.investment}
                        visibleFields={visibleFields}
                      />
                    )}
                    {activeModule === "whybiztrip" && form.whybiztrip && (
                      <WhyBiztripSlide
                        data={form.whybiztrip}
                        visibleFields={visibleFields}
                      />
                    )}
                    {activeModule === "contact" && (
                      <ContactSlide
                        data={form.contact}
                        coverDate={form.cover.date}
                        coverValidity={form.cover.validity}
                        visibleFields={visibleFields}
                      />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Floating Action Buttons */}

        {/* Hidden slides for PDF export */}
        <div
          ref={slidesRef}
          className="fixed left-[-9999px] top-0 pointer-events-none"
          aria-hidden="true"
          style={{ width: 595 }}
        >
          <div data-slide="cover">
            <CoverSlide data={form.cover} visibleFields={visibleFields} />
          </div>
          <div data-slide="travel">
            <TravelSlide data={form.travel} visibleFields={visibleFields} />
          </div>
          <div data-slide="hotelaria">
            <HotelariaSlide
              data={form.hotelaria}
              visibleFields={visibleFields}
            />
          </div>
          <div data-slide="rodoviario">
            <RodoviarioSlide
              data={form.rodoviario}
              visibleFields={visibleFields}
            />
          </div>
          <div data-slide="bizpay">
            <BizpaySlide data={form.bizpay} visibleFields={visibleFields} />
          </div>
          <div data-slide="biztripexpense">
            <BiztripExpenseSlide
              data={form.biztripexpense}
              visibleFields={visibleFields}
            />
          </div>
          <div data-slide="ai">
            <AISlide data={form.ai} visibleFields={visibleFields} />
          </div>
          <div data-slide="reports">
            <ReportsSlide data={form.reports} visibleFields={visibleFields} />
          </div>
          <div data-slide="integrations">
            <IntegrationsSlide
              data={form.integrations}
              visibleFields={visibleFields}
            />
          </div>
          <div data-slide="implementation">
            <ImplementationSlide
              data={form.implementation}
              visibleFields={visibleFields}
            />
          </div>
          <div data-slide="investment">
            {form.investment && (
              <InvestmentSlide
                data={form.investment}
                visibleFields={visibleFields}
              />
            )}
          </div>
          <div data-slide="whybiztrip">
            {form.whybiztrip && (
              <WhyBiztripSlide
                data={form.whybiztrip}
                visibleFields={visibleFields}
              />
            )}
          </div>
          <div data-slide="support">
            <SupportSlide data={form.support} visibleFields={visibleFields} />
          </div>
          <div data-slide="contact">
            <ContactSlide
              data={form.contact}
              coverDate={form.cover.date}
              coverValidity={form.cover.validity}
              visibleFields={visibleFields}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
