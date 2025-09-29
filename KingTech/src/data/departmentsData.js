import { SiAmd } from "react-icons/si";

export const departmentsData = {
  "Computadores e acessórios": {
    id: 1,
    subcategories: [
      { id: 1, name: "Notebooks", slug: "notebooks" },
      { id: 2, name: "Desktops", slug: "desktops" },
      { id: 3, name: "Tablets", slug: "tablets" },
      { id: 4, name: "Monitores", slug: "monitores" },
      { id: 5, name: "Teclados e Mouses", slug: "teclados_e_mouses" },
      {
        id: 6,
        name: "Componentes de Hardware",
        slug: "componentes_de_hardware",
      },
      { id: 7, name: "Armazenamento", slug: "armazenamento" },
    ],
  },
  "Smartphones e acessórios": {
    id: 2,
    subcategories: [
      { id: 1, name: "Smartphones", slug: "smartphones" },
      { id: 2, name: "Smartwatches", slug: "smartwatches" },
      { id: 3, name: "Fones de ouvido", slug: "fones" },
      { id: 4, name: "Capas e protetores", slug: "capas_e_protetores" },
      { id: 5, name: "Carregadores e cabos", slug: "carregadores_e_cabos" },
      { id: 6, name: "Baterias externas", slug: "baterias_externas" },
    ],
  },
  "Áudio e video": {
    id: 3,
    subcategories: [
      { id: 1, name: "Televisores", slug: "televisores" },
      { id: 2, name: "Home Theaters", slug: "home_teathers" },
      { id: 3, name: "Caixas de Som", slug: "caixas_de_som" },
      { id: 4, name: "Soundbars", slug: "soundbars" },
      { id: 5, name: "Projetores", slug: "projetores" },
    ],
  },
  Gaming: {
    id: 4,
    subcategories: [
      { id: 1, name: "Consoles", slug: "consoles" },
      { id: 2, name: "Jogos", slug: "jogos" },
      { id: 3, name: "Acessórios para jogos", slug: "acessorios_para_jogos" },
      { id: 4, name: "PC gamer", slug: "pc_gamer" },
      { id: 5, name: "Cadeiras e mesas gamer", slug: "cadeiras_e_mesas" },
    ],
  },
  "Fotografia e Filmagem": {
    id: 5,
    subcategories: [
      { id: 1, name: "Câmeras digitais", slug: "cameras_digitais" },
      { id: 2, name: "Lentes", slug: "lentes" },
      { id: 3, name: "Tripés e Suportes", slug: "tripes_e_suportes" },
      {
        id: 4,
        name: "Acessórios para Câmeras",
        slug: "acessorios_para_cameras",
      },
      { id: 5, name: "Drones", slug: "drones" },
      {
        id: 6,
        name: "Equipamentos de iluminação",
        slug: "equipamentos_de_iluminacao",
      },
    ],
  },
  "Casa Inteligente": {
    id: 6,
    subcategories: [
      { id: 1, name: "Assistentes Virtuais", slug: "assistentes_virtuais" },
      { id: 2, name: "Lâmpadas inteligentes", slug: "lampadas_inteligentes" },
      {
        id: 3,
        name: "Termostatos inteligentes",
        slug: "termostatos_inteligentes",
      },
      {
        id: 4,
        name: "Fechaduras e Câmeras de segurança",
        slug: "fechaduras_e_cameras_de_seguranca",
      },
      {
        id: 5,
        name: "Tomadas e interruptores inteligentes",
        slug: "tomadas_e_interruptores_inteligentes",
      },
    ],
  },
  Eletrodomésticos: {
    id: 7,
    subcategories: [
      { id: 1, name: "Aspirador de pó", slug: "aspirador_de_po" },
      { id: 2, name: "Cafeteiras", slug: "cafeteiras" },
    ],
  },
  Wearables: {
    id: 8,
    subcategories: [
      { id: 1, name: "Fitness Trackers", slug: "fitness_trackers" },
      { id: 2, name: "Óculos inteligentes", slug: "oculos_inteligentes" },
    ],
  },
  Automotivo: {
    id: 9,
    subcategories: [
      { id: 1, name: "Sistemas de Navegação", slug: "sistemas_de_navegacao" },
      {
        id: 2,
        name: "Câmeras de segurança para veículos",
        slug: "cameras_de_seguranca_para_veiculos",
      },
      {
        id: 3,
        name: "Sistemas de som automotivo",
        slug: "sistemas_de_som_automotivo",
      },
      { id: 4, name: "Acessórios", slug: "acessórios" },
    ],
  },
  "Conectividade e Redes": {
    id: 10,
    subcategories: [
      { id: 1, name: "Roteadores", slug: "roteadores" },
      { id: 2, name: "Modems", slug: "modems" },
      { id: 3, name: "Repetidores de sinal", slug: "repetidores_de_sinal" },
      { id: 4, name: "Adaptadores de Rede", slug: "adaptadores_de_rede" },
      { id: 5, name: "Switches", slug: "switches" },
    ],
  },
  "Acessórios gerais": {
    id: 11,
    subcategories: [
      {
        id: 1,
        name: "Carregadores universais",
        slug: "carregadores_universais",
      },
      {
        id: 2,
        name: "Adaptadores e conversores",
        slug: "adaptadores_e_conversores",
      },
      {
        id: 3,
        name: "Baterias e Carregadores",
        slug: "baterias_e_carregadores",
      },
      { id: 4, name: "Hub USB", slug: "hub_usb" },
    ],
  },
};

export const categoryFilters = [
  {
    departments: "all",
    childrens: [
      {
        category: "Promoções",
        filters: [{ id: 1, rowData: "super_desconto", name: "Super desconto" }],
      },
      {
        category: "Ofertas",
        filters: [
          { id: 1, rowData: "offers", name: "Top Ofertas" },
          { id: 2, rowData: "offers", name: "Campeão de vendas" },
        ],
      },
      {
        category: "Cupom de desconto",
        filters: [
          { id: 1, rowData: "discount_coupon", name: "Setembro premiado" },
        ],
      },
      {
        category: "Conexões",
        filters: [
          { id: 1, rowData: "conections", name: "HDMI 2.1" },
          { id: 2, rowData: "conections", name: "USB-C" },
          { id: 3, rowData: "conections", name: "Wi-FI 6E" },
          { id: 4, rowData: "conections", name: "Bluetooth 5.2" },
          { id: 5, rowData: "conections", name: "DisplayPort 1.4" },
        ],
      },
    ],
  },
  {
    departments: ["monitores", "televisores", "projetores"],
    childrens: [
      {
        category: "Resolução",
        filters: [
          { id: 1, rowData: "hd", name: "HD" },
          { id: 2, rowData: "full_hd", name: "Full HD" },
          { id: 3, rowData: "4k", name: "4K" },
          { id: 4, rowData: "5k", name: "5K" },
          { id: 6, rowData: "8k", name: "8K" },
        ],
      },
      {
        category: "Tempo de Resposta",
        filters: [
          { id: 1, rowData: "response_time", name: "0,03 ms" },
          { id: 2, rowData: "response_time", name: "0,5 ms" },
          { id: 3, rowData: "response_time", name: "1 ms" },
          { id: 4, rowData: "response_time", name: "1,5 ms" },
          { id: 5, rowData: "response_time", name: "2 ms" },
        ],
      },
    ],
  },
  {
    departments: [
      "notebooks",
      "monitores",
      "teclados e mouses",
      "componentes de hardware",
      "armazenamento",
    ],
    childrens: [
      {
        category: "Sincronização Adaptativa",
        filters: [
          { id: 1, rowData: "adaptive_sync", name: "AMD FreeSync" },
          { id: 2, rowData: "adaptive_sync", name: "AMD FreeSync Premium" },
          { id: 3, rowData: "adaptive_sync", name: "NVIDIA G-Sync" },
          { id: 4, rowData: "adaptive_sync", name: "NVIDIA G-Sync Compatible" },
          { id: 5, rowData: "adaptive_sync", name: "VESA Adaptive-Sync" },
          { id: 6, rowData: "adaptive_sync", name: "VRR" },
          { id: 7, rowData: "adaptive_sync", name: "Compatível com PS5/Xbox" },
        ],
      },
    ],
  },
];

export const product = {
  brand: "amd",
  rating: 4.2,
  numberRating: 217, // número de pessoas que avaliaram o produto
  compositionRating: {
    5: 50,
    4: 30,
    3: 9,
    2: 7,
    1: 4,
  },
  img: [
    "/image/amd1.avif",
    "/image/amd2.jpg",
    "/image/amd3.png",
    "/image/amd4.webp",
    "/image/amd5.jpg",
    "/image/amd6.webp",
    "/image/amd7.webp",
    "/image/amd8.jpg",
    "/image/amd9.webp",
  ],
  name: "Amd Radeon™ RX 9060 XT",
  code: "599420",
  variations: [
    {
      category: "memória",
      options: ["8GB", "16GB"],
    },
  ],
  mainInformations: [
    {
      id: 1,
      title: "Arquitetura",
      information: "Com a arquitetura da AMD RDNA™ 4, experimente aceleradores de traçado de raios e de IA poderosos, maior qualidade visual para streaming e gravação de vídeo, tudo com o apoio de otimizações contínuas do software AMD. Esta é a atualização que manterá seu sistema rápido e atualizado por muitos anos.",
    },
    {
      id: 2,
      title: "Resolução",
      information: "Tecnologias avançadas de geração de frames e de upscaling com tecnologia de aprendizado de máquina de ponta chegam ao AMD FidelityFX™ Super Resolution 42.  Experimente novos níveis de imersão durante o aumento das suas taxas de frames em títulos compatíveis.",
    },
    {
      id: 3,
      title: "Traçado de raios realista",
      information: "Os poderosos aceleradores de traçado de raios na placa de vídeo AMD Radeon™ RX Série 9000 trazem níveis impressionantes de detalhes para iluminação, sombras e reflexos em jogos compatíveis.",
    },
    {
      id: 4,
      title: "Streaming",
      information: "Com um novo mecanismo AMD Radiance Display™ e mecanismo de mídia avançado, experimente gravação e streaming de nível profissional como nunca antes. Entregue uma qualidade visual avançada para a sua comunidade durante streamings e gravações com taxas de bit mais baixas, assim você pode focar mais na sua jogada.",
    },
  ],
  texts: [
    {
      category: "introduction",
      title: "Apresentamos a AMD Radeon™ RX 9060 XT",
      text: "As placas de vídeo AMD Radeon™ RX 9060 XT foram projetadas para proporcionar tudo o que você precisa para garantir jogos ultrarrápidos, com recursos visuais de alto nível e recursos prontos para o futuro turbinados com IA.",
      imgLg: "/image/introduction.avif",
      imgSm: "https://www.amd.com/content/dam/amd/en/images/products/desktops/3269802-radeon-ryzen-products.png",
    },
    {
      category: "architecture",
      title: "Arquitetura AMD RDNA™ 4 ",
      text: "Feita para jogadores",
      imgLg: "https://www.amd.com/content/dam/amd/en/images/backgrounds/abstract/2922918-red-vertical-light-beams-bg.jpg",
      imgSm: "https://www.amd.com/content/dam/amd/en/images/products/processors/2922918-rdna-chip-cropped.png",
    },
    {
      category: "ultrafast",
      title: "Tudo de que você precisa para jogos ultrarrápidos",
      text: "Quer você precise de taxas de atualização ultra-altas para eSports ou de todas as configurações para explorar seus mundos favoritos, as placas de vídeo AMD Radeon™ RX Série 9000 oferecem tudo de que você precisa para executar jogos ultrarrápidos. Turbine sua experiência com a AMD HYPR-RX1 e libere o verdadeiro potencial da GPU Radeon™ RX, aproveitando as forças combinadas das tecnologias avançadas de super-resolução, geração de frames e redução de latência.",
      imgLg: "https://www.amd.com/content/dam/amd/en/images/backgrounds/colors/red-side-black-center-bg.jpg",
      imgSm: "",
    },
    {
      category: "perfomance",
      title: "AMD HYPR-RX com AMD Fluid Motion Frames 2.1",
      text: "Desempenho instantâneo para todos os seus jogos",
      imgLg: "https://www.amd.com/content/dam/amd/en/images/backgrounds/colors/red-side-black-center-bg.jpg",
      imgSm: "/image/perfomance.png",
    },
    {
      category: "quality",
      title: "1440p nativo Ultra - Em média 46% mais rápida que a RX 7600 XT em mais de 30 jogos (16GB)",
      text: "",
      imgLg: "https://www.amd.com/content/dam/amd/en/images/backgrounds/colors/red-side-black-center-bg.jpg",
      imgSm: "/image/quality.png",
    },
    {
      category: "realismo",
      title: "Traçado de raios realista",
      text: "Os poderosos aceleradores de traçado de raios na placa de vídeo AMD Radeon™ RX Série 9000 trazem níveis impressionantes de detalhes para iluminação, sombras e reflexos em jogos compatíveis.",
      imgLg: "https://www.amd.com/content/dam/amd/en/images/backgrounds/colors/red-center-glow.jpg",
      imgSm: "/image/realismo.png",
    },
    {
      category: "streaming",
      title: "Transmita como um profissional",
      text: "Com um novo mecanismo AMD Radiance Display™ e mecanismo de mídia avançado, experimente gravação e streaming de nível profissional como nunca antes. Entregue uma qualidade visual avançada para a sua comunidade durante streamings e gravações com taxas de bit mais baixas, assim você pode focar mais na sua jogada.",
      imgLg: "",
      imgSm: "",
    },
    {
      category: "video-streaming",
      title: "Streaming de alta qualidade com AV13",
      text: "Desbloqueie novas experiências multimídia com suporte total a codificação/decodificação AV1, projetado para oferecer uma qualidade de imagem incrível com taxas de bits mais baixas e tamanhos de arquivo menores.",
      imgLg: "",
      imgSm: "/image/video-streaming.avif",
    },
  ],
  typeDelivery: "flash",
  prevPrice: 3310.99,
  descount: "10%",
  priceInCardStore: 2979.89,
  pricePartInCardStore: 3145.44,
  discountPix: "25%",
  pricePix: 2483.24,
  stock: true,
  specs: {
    "Nome": "AMD Radeon™ RX 9060 XT",
    "Familia": "Radeon RX",
    "Série": "Radeon RX 9000 Series",
    "Tipo de placa": "Desktop",
    "Suporte a SO": "Windows 10 - 64-Bit Edition , Windows 11 - 64-Bit Edition , Linux x86 64-Bit",
    "Conector de energia adicional": "1x8-Pin",
    "Unidades de computação": "32",
    "Aumento da frequência": "Até 3130 Mhz",
    "Frequência de jogo": "2530 Mhz",
    "Aceleradores de raios": "32",
    "Aceleradores de IA": "64",
    "Pico de Pixels Processados": "Até 200.3 GP/s",
    "Desempenho da precisão de pico único (vetor FP32)": "25.6 TFLOPs",
    "Desempenho da precisão de meio pico (vetor FP16)": "51.3 TFLOPs",
    "Desempenho da precisão de meio pico (matriz FP16)": "103 TFLOPs",
    "Desempenho da precisão de meio pico (matriz FP16) com dispersão estruturada": "205 TFLOPs",
    "Desempenho de pico de precisão de 8 bits (matriz FP8) (E5M2, E4M3)": "205 TFLOPs",
    "Desempenho da precisão de pico de 8 bits (matriz FP8) com dispersão estruturada (E5M2, E4M3)": "410 TFLOPs",
    "Desempenho máximo de precisão de 8 bits (matriz INT8)": "205 TOPs",
    "Desempenho de precisão de pico de 8 bits (matriz INT8) com dispersão estruturada": "410 TOPs",
    "Desempenho máximo de precisão de 4 bits (matriz INT4)": "410 TOPs",
    "Desempenho de precisão de pico de 4 bits (matriz INT4) com dispersão estruturada": "821 TOPs",
    "ROPs": "64",
    "Processadores de streaming": "2048",
    "Unidades de textura": "128",
    "Contagem de transistor": "29.7 B",
    "Alimentação de placa típica (desktop)": "160W",
    "Recomendação mínima de PSU": "450W",
    "Tecnologia AMD Infinity Cache": "32 MB",
    "Velocidade de memória": "Até 20Gbps",
    "Tamanho máximo de memória": "8GB ou 16GB",
    "Tipo de memória": "GDDR6",
    "Interface de memória": "128-bit",
    "Largura de banda de memória": "Até 320 GB/s",
    "HDMI™ 4K Support": "Sim",
    "4K H264 Decode": "Sim",
    "4K H264 Encode": "Sim",
    "H265/HEVC Decode": "Sim",
    "H265/HEVC Encode": "Sim",
    "AV1 Decode": "Sim",
    "AV1 Encode": "Sim",
    "DisplayPort™": "2.1a",
    "HDMI™": "2.1b",
    "Tecnologias compatíveis": "AMD Software Adrenalin Edition , AMD FidelityFX™ Super Resolution 4 , AMD Fluid Motion Frames , AMD Noise Suppression , AMD Radeon™ Super Resolution , AMD Smart Access Memory , AMD Smart Access Video , AMD Privacy View , AMD Radeon™ Boost , AMD Enhanced Sync Technology , AMD FreeSync™ Technology , AMD Radeon™ Chill , AMD Virtual Super Resolution , AMD Radeon™ Anti-Lag 2 , AMD Radeon™ Image Sharpening 2",
    "TPP": "1641",
    "Densidade de TPP": "8.52",
  },
  reviewComments: [
    {
      id: 1,
      name: "Guilherme",
      date: "24/09/2025",
      verified: true,
      rating: 5,
      comment: "Produto top, roda muitos jogos com qualidade excelente",
    },
    {
      id: 2,
      name: "Ana Souza",
      date: "12/01/2025",
      verified: false,
      rating: 5,
      comment:
        "Excelente produto! A qualidade superou as minhas expectativas, entrega rápida e bem embalad0.",
    },
    {
      id: 3,
      name: "Carlos Mendes",
      date: "05/01/2025",
      verified: true,
      rating: 4,
      comment:
        "Produto muito bom mas o manual poderia ser mais detalhado, No geral, recomendo bastante",
    },
    {
      id: 4,
      name: "Fernanda Oliveira",
      date: "28/12/2024",
      verified: false,
      rating: 5,
      comment:
        "Já uso há duas semanas e estou muito satisfeita, O desempenho é incrível e não tive nenhum problema",
    },
    {
      id: 5,
      name: "Ricardo Lima",
      date: "20/12/2024",
      verified: false,
      rating: 3,
      comment:
        "Cumpre o que promete, mas achei o preço um pouco alto pelo que oferece. Poderia ter mais recursos",
    },
    {
      id: 6,
      name: "Juliana Santos",
      date: "15/12/2024",
      verified: false,
      rating: 4,
      comment:
        "Gostei bastante, mas demorou um pouco mais que o esperado para chegar. Fora isso, tudo certo",
    },
    {
      id: 7,
      name: "Thiago Pereira",
      date: "02/12/2024",
      verified: true,
      rating: 5,
      comment:
        "Produto sensacional! Superou as expectativas, principalmente na perfomance, recomendo muito.",
    },
    {
      id: 8,
      name: "Mariana Costa",
      date: "25/11/2024",
      verified: true,
      rating: 2,
      comment:
        "Infelizmente não gostei, veio com alguns arranhões e o atendimento demorou para me responder.",
    },
    {
      id: 9,
      name: "Lucas Ferreira",
      date: "10/11/2025",
      verified: true,
      rating: 4,
      comment: "Cumpre o prometido, Vou comprar outros produtos da mesma marca",
    },
  ],
};
