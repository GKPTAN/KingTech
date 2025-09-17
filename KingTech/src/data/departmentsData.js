export const departmentsData = {
  "Computadores e acessórios": {
    id: 1,
    subcategories: [
      { id: 1, name: "Notebooks", slug: "notebooks" },
      { id: 2, name: "Desktops", slug: "desktops" },
      { id: 3, name: "Tablets", slug: "tablets" },
      { id: 4, name: "Monitores", slug: "monitores" },
      { id: 5, name: "Teclados e Mouses", slug: "teclados_e_mouses" },
      { id: 6, name: "Componentes de Hardware", slug: "componentes_de_hardware"},
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
  "Gaming": {
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
      { id: 4, name: "Acessórios para Câmeras", slug: "acessorios_para_cameras"},
      { id: 5, name: "Drones", slug: "drones" },
      { id: 6, name: "Equipamentos de iluminação", slug: "equipamentos_de_iluminacao",
      },
    ],
  },
  "Casa Inteligente": {
    id: 6,
    subcategories: [
      { id: 1, name: "Assistentes Virtuais", slug: "assistentes_virtuais" },
      { id: 2, name: "Lâmpadas inteligentes", slug: "lampadas_inteligentes" },
      { id: 3, name: "Termostatos inteligentes", slug: "termostatos_inteligentes"},
      { id: 4, name: "Fechaduras e Câmeras de segurança", slug: "fechaduras_e_cameras_de_seguranca"},
      { id: 5, name: "Tomadas e interruptores inteligentes", slug: "tomadas_e_interruptores_inteligentes"},
    ],
  },
  "Eletrodomésticos": {
    id: 7,
    subcategories: [
      { id: 1, name: "Aspirador de pó", slug: "aspirador_de_po" },
      { id: 2, name: "Cafeteiras", slug: "cafeteiras" },
    ],
  },
  "Wearables": {
    id: 8,
    subcategories: [
      { id: 1, name: "Fitness Trackers", slug: "fitness_trackers" },
      { id: 2, name: "Óculos inteligentes", slug: "oculos_inteligentes" },
    ],
  },
  "Automotivo": {
    id: 9,
    subcategories: [
      { id: 1, name: "Sistemas de Navegação", slug: "sistemas_de_navegacao" },
      { id: 2, name: "Câmeras de segurança para veículos", slug: "cameras_de_seguranca_para_veiculos" },
      { id: 3, name: "Sistemas de som automotivo", slug: "sistemas_de_som_automotivo" },
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
    ]
  },
  "Acessórios gerais": {
    id: 11,
    subcategories: [
        { id: 1, name: "Carregadores universais", slug: "carregadores_universais" },
        { id: 2, name: "Adaptadores e conversores", slug: "adaptadores_e_conversores" },
        { id: 3, name: "Baterias e Carregadores", slug: "baterias_e_carregadores" },
        { id: 4, name: "Hub USB", slug: "hub_usb" },
    ]
  }
};

export const categoryFilters = [
  {
    departments: "all",
    childrens: [
      {
        category: "Promoções",
        filters: [
          { id: 1, rowData: "super_desconto", name: "Super desconto" }
        ]
      },
      {
        category: "Ofertas",
        filters: [
          { id: 1, rowData: "offers", name: "Top Ofertas" },
          { id: 2, rowData: "offers", name: "Campeão de vendas" },
        ]
      },
      {
        category: "Cupom de desconto",
        filters: [
          { id: 1, rowData: "discount_coupon", name: "Setembro premiado" },
        ]
      },
      {
        category: "Conexões",
        filters: [
          { id: 1, rowData: "conections", name: "HDMI 2.1" },
          { id: 2, rowData: "conections", name: "USB-C" },
          { id: 3, rowData: "conections", name: "Wi-FI 6E" },
          { id: 4, rowData: "conections", name: "Bluetooth 5.2" },
          { id: 5, rowData: "conections", name: "DisplayPort 1.4" },
        ]
      },
    ]
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
        ]
      },
      {
        category: "Tempo de Resposta",
        filters: [
          { id: 1, rowData: "response_time", name: "0,03 ms" },
          { id: 2, rowData: "response_time", name: "0,5 ms" },
          { id: 3, rowData: "response_time", name: "1 ms" },
          { id: 4, rowData: "response_time", name: "1,5 ms" },
          { id: 5, rowData: "response_time", name: "2 ms" },
        ]
      },
    ]
  },
  {
    departments: ["notebooks", "monitores", "teclados e mouses", "componentes de hardware", "armazenamento"],
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
        ]
      },
    ]
  },
]