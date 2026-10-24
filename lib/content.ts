export const nav = [
  { label: "Início", href: "/" },
  { label: "Sobre Nós", href: "/sobre" },
  { label: "Serviços", href: "/servicos" },
  { label: "Portfólio", href: "/portfolio" },
  { label: "Artistas", href: "/artistas" },
  { label: "Contacto", href: "/contacto" },
];

export const hero = {
  kicker: "PRODUÇÃO MUSICAL • GRAVAÇÃO • MIXAGEM • MASTERIZAÇÃO",
  sub1: "Transformamos ideias em grandes produções.",
  sub2a: "Bem-vindo à ",
  sub2b: "Maré Alta music.",
  primary: { dark: "Conheça o Nosso Trabalho", light: "Nosso Trabalho" },
  secondary: "Ver Portfólio",
};

export const servicesIntro = {
  kicker: "OS NOSSOS SERVIÇOS",
  title1: "Da ideia ao",
  title2: "grande som.",
  para: "Oferecemos soluções completas para artistas, bandas e criadores de conteúdo, desde a gravação até a distribuição.",
  note1: "Qualidade, criatividade",
  note2: "e profissionalismo em cada detalhe.",
};

type Service = {
  icon: string;
  title: string;
  desc: string;
  img: string;
  descRight?: number;
  descLsDark?: string;
  titleLsDark?: string;
};

export const services: Service[] = [
  {
    icon: "mic",
    title: "Gravação\nProfissional",
    desc: "Captamos a sua essência com a melhor tecnologia de áudio.",
    img: "/img/card-1.png",
  },
  {
    icon: "sliders",
    title: "Mixagem\ne Masterização",
    desc: "Som limpo, equilibrado\ne pronto para o mundo.",
    descLsDark: "0.034em",
    img: "/img/card-2.png",
  },
  {
    icon: "music",
    title: "Produção\nMusical",
    desc: "Transformamos ideias\nem músicas de qualidade.",
    img: "/img/card-3.png",
  },
  {
    icon: "video",
    title: "Videoclipes",
    titleLsDark: "-0.045em",
    desc: "Damos vida à sua música\ncom vídeos impactantes\ne criativos.",
    img: "/img/card-4.png",
  },
  {
    icon: "star",
    title: "Artistas &\nTalentos",
    desc: "Apoiamos e impulsionamos\no seu talento.",
    descRight: 6,
    img: "/img/card-5.png",
  },
];

export const contacts = {
  label: "FALE CONNOSCO",
  phone: "951 175 720",
  phoneHref: "tel:+244951175720",
  whatsapp: "+244 932 932 371",
  whatsappHref: "https://wa.me/244932932371",
  follow: "SIGA-NOS",
  address: "Benguela, Angola",
};

export const footer = {
  copyright: "© 2025 Maré Alta Music. Todos os direitos reservados.",
  tags: ["MÚSICA", "CONEXÃO", "FUTURO"],
};

export const socials = {
  facebook: "https://www.facebook.com/profile.php?id=61592795680498",
  instagram: "#",
  youtube: "#",
};
