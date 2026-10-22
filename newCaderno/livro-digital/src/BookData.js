/**
 * FONTE ÚNICA DE CONTEÚDO DO LIVRO
 * --------------------------------
 * Para editar o livro, altere apenas este arquivo.
 *
 * Estrutura:
 *   book
 *   ├─ capa / contracapa     textos da capa e da contracapa
 *   └─ chapters[]           { id, eyebrow?, title, source?, intro?, sections[] }
 *      └─ sections[]        { id, eyebrow?, title, content[] }
 *         └─ content[]      blocos de conteúdo (ver abaixo)
 *
 * Tipos de bloco aceitos em `intro` e `content`:
 *   "Texto simples"                          → parágrafo (atalho)
 *   { type: "paragraph", text }              → parágrafo
 *   { type: "heading", text }                → subtítulo dentro da página
 *   (em parágrafos e listas: **negrito** e *itálico*)
 *   { type: "quote", text, author? }         → citação
 *   { type: "list", items: [] }              → lista com marcadores
 *   { type: "callout", title?, text }        → destaque / dica
 *   { type: "image", src, alt?, caption?, full? } → imagem (arquivo em public/imagens/);
 *                                              full: true ocupa a página inteira.
 *                                              Regra do livro: cada imagem fica em sua própria página.
 *   { type: "activity", title?, text?, items? } → caixa de atividade (text: string | string[])
 *   { type: "field", label?, placeholder, large? } → campo para escrever na própria página
 *   { type: "imageGrid", images: [{ src, alt }] }  → grade de imagens
 *   { type: "post", user, src, alt?, captionPlaceholder?, tagsPlaceholder? } → mockup de post
 *   { type: "fieldGroup", fields: [{ title, placeholder }] } → colunas de escrita
 *   { type: "credits", items: [{ term, text }] } → expediente
 *
 * Imagens: copie o arquivo para public/imagens/ com o nome indicado.
 * Enquanto o arquivo não existir, aparece um marcador no lugar.
 *
 * IMAGEM DA PÁGINA:
 *   `image: "/imagens/imagensUsadas/arquivo.jpg"` em um capítulo ou seção mostra a
 *   imagem, com borda, ocupando o espaço que sobra embaixo na página, depois do
 *   título e do texto. `description` (seções) é uma descrição curta sob o título.
 *   Uma seção cujo conteúdo é só um bloco `image` funciona do mesmo jeito.
 *   Coloque os arquivos em public/imagens/imagensUsadas/.
 *
 * `eyebrow` é o rótulo pequeno acima do título (ex.: "Sessão 1").
 * Os `id`s de capítulos e seções devem ser únicos.
 */
/**
 * Capítulo de imagens: a página de abertura traz o resumo (`resumo`) e o bloco de
 * atividade (`atividade`); depois vem uma página para cada imagem.
 */
function imageChapter({ id, eyebrow, title, source, resumo, atividade, folder, images }) {
  return {
    id,
    eyebrow,
    title,
    source,
    intro: [...resumo, { type: "activity", text: atividade }],
    sections: images.map(([nome, arquivo]) => ({
      id: `${id}-${nome.toLowerCase().replace(/\s+/g, "-")}`,
      eyebrow: nome,
      title,
      tocTitle: nome,
      content: [
        { type: "image", full: true, src: encodeURI(`/imagens/${folder}/${arquivo}`), alt: `${title} — ${nome}` },
      ],
    })),
  };
}

export const book = {
  eyebrow: "Atividade de leitura",
  title: "Carlos Drummond\nde Andrade",
  subtitle: "um poeta, sete atividades, e o espaço para você se encontrar em cada uma delas.",
  nameField: "Nome: ______________________  Turma: _______",
  calls: [
    "Sessão 1 — Marcas da vida",
    "Sessão 2 — Sete faces do eu leitor",
    "Sessão 3 — A xícara de cacos",
  ],
  footer: ["Caderno de leitura", "Língua Portuguesa"],
  backCover: {
    seal: "D",
    name: "Carlos Drummond de Andrade",
    text: "cada caco tem seu lugar.\nmundo mundo vasto mundo — o seu coração é mais vasto ainda.",
  },
  runningTitle: "Drummond",

  chapters: [
    imageChapter({
      id: "sessao-1",
      resumo: [
        "Se cada fase importante da vida de Drummond fosse uma marca no corpo, qual seria? Uma cicatriz, uma tatuagem, um arranhão, uma pintura?",
        "A trajetória do poeta foi atravessada por perdas, afetos, deslocamentos e uma reflexão constante sobre o tempo. Pense nessas fases como marcas visíveis — cada uma contando, à sua maneira, uma parte da história.",
      ],
      atividade:
        "Produza uma imagem (com IA, Canva, Photoshop ou outra ferramenta) que represente essa marca — sua ou do poeta — explicando o que a causou e como ela apareceria se estivesse exposta.",
      eyebrow: "Sessão 1",
      title: "Marcas da vida",
      folder: "marcas da vida",
      images: [
        ["Jhonatan", "Jhonatan - marcas.png"],
        ["Marcio", "Marcio - marcas da vida.png"],
      ],
    }),
    imageChapter({
      id: "sessao-2",
      source: 'a partir de "Quando nasci, um anjo torto", C. Drummond de Andrade',
      resumo: [
        'Nesse poema, Drummond descreve um "eu" que se sente fora de lugar — "gauche na vida" — e observa o mundo em fragmentos. São várias faces de uma mesma pessoa, alternando ironia, espanto e ternura.',
        'Assim como o eu do poema, você também tem várias "faces" como leitor — momentos diferentes que moldaram a sua relação com os livros.',
      ],
      atividade:
        "Monte uma colagem em 7 partes (mapa mental) no Canva ou numa ferramenta de IA, representando 7 momentos da sua trajetória como leitor(a).",
      eyebrow: "Sessão 2",
      title: "Sete faces do eu leitor",
      folder: "As sete faces do meu eu leitor",
      images: [
        ["Felipe", "felipe - sete faces - 1.jpg"],
        ["Julyano", "julyano - faces - 1.png"],
        ["João Pedro", "João Pedro - 1.png"],
      ],
    }),
    imageChapter({
      id: "sessao-3",
      source: 'a partir de "Cerâmica", C. Drummond de Andrade',
      resumo: [
        "Em poucos versos, Drummond descreve uma xícara feita de cacos colados — sem uso prático, mas guardada no aparador, observando a casa. É uma imagem da vida como algo remendado: pedaços quebrados que, juntos, formam algo novo e imperfeito, mas carregado de sentido.",
      ],
      atividade:
        'A partir dos "cacos" da sua própria trajetória, crie a sua xícara — em Canva, colagem física digitalizada, ou outra ferramenta.',
      eyebrow: "Sessão 3",
      title: "A xícara de cacos",
      folder: "Xícara",
      images: [
        ["Diego", "Diego - xicara (1).jpg"],
        ["Matheus", "xicara - matheus.png"],
      ],
    }),
    {
      id: "caso-do-vestido",
      eyebrow: "O caso do vestido",
      title: "O caso do vestido",
      source: "uma leitura jornalística e visual do poema",
      intro: [
        "O vestido volta, e com ele a pergunta que ninguém quer responder. Nas páginas a seguir, o poema vira tirinha.",
      ],
      sections: [
        ["Marcio", "marcio", 3],
        ["Rodrigo", "rodrigo", 6],
      ].flatMap(([nome, arquivo, total]) =>
        Array.from({ length: total }, (_, i) => ({
          id: `vestido-${arquivo}-${i + 1}`,
          eyebrow: `${nome} · ${i + 1}/${total}`,
          title: "O caso do vestido",
          tocTitle: `${nome} — página ${i + 1}`,
          content: [
            {
              type: "image",
              full: true,
              src: `/imagens/O caso do vestido/${arquivo}-${i + 1}.jpg`,
              alt: `O caso do vestido — ${nome}, página ${i + 1}`,
            },
          ],
        }))
      ),
    },
    {
      id: "reportagem",
      flow: true, // seções em sequência na mesma página; só vira quando enche
      eyebrow: "Reportagem",
      title: "Intelectuais indígenas e a resistência da memória",
      source: "O elo entre o passado e o futuro dos povos originários",
      intro: [
        { type: "heading", text: "Introdução: os ecos poéticos do \"Pranto Geral dos Índios\"" },
        "Em seu célebre poema **\"Pranto Geral dos Índios\"**, Carlos Drummond de Andrade expressa a dor histórica, a perda territorial e a violência sofrida pelas populações originárias do Brasil. O poeta itabirano denuncia a exploração predatória da terra — *\"uma terra sempre furtada / pelos que vêm de longe e não sabem possuí-la\"* — e retrata a **opressão causada por garimpeiros, seringueiros e invasores** ao longo dos séculos.",
        "Entretanto, o poema também evoca a busca por respeito, diálogo e paz. Traçando um paralelo com a realidade contemporânea, a \"fumaça\" e as \"lágrimas\" denunciadas por Drummond hoje dão lugar à palavra, à literatura e ao protagonismo dos próprios indígenas. A memória, outrora ameaçada de apagamento, tornou-se a principal ferramenta de resistência de intelectuais originários que reescrevem a narrativa nacional.",
      ],
      sections: [
        {
          id: "reportagem-intelectuais",
          eyebrow: "Reportagem",
          title: "Intelectuais indígenas e a resistência da memória",
          tocTitle: "Intelectuais contemporâneos",
          content: [
            { type: "heading", text: "Intelectuais contemporâneos: a voz dos povos originários no século XXI" },
            "A intelectualidade indígena contemporânea ocupa espaços acadêmicos, literários e políticos antes restritos. Nomes como **Ailton Krenak** (pensador, ambientalista e o primeiro indígena a ocupar uma cadeira na Academia Brasileira de Letras), **Daniel Munduruku** (doutor em Educação e autor de dezenas de livros) e **Sonia Guajajara** lideram debates globais sobre meio ambiente, direitos humanos e preservação cultural.",
            "Esses pensadores mostram que a cultura indígena não é uma relíquia do passado, mas uma filosofia viva capaz de propor caminhos para os desafios do presente, como a crise climática e a necessidade de viver em harmonia com a natureza.",
            { type: "image", compact: true, src: "/imagens/Reportagem/indio_reportagem.png", alt: "Intelectuais indígenas contemporâneos" },
          ],
        },
        {
          id: "reportagem-rondon",
          eyebrow: "Reportagem",
          title: "Intelectuais indígenas e a resistência da memória",
          tocTitle: "Cândido Rondon",
          content: [
            { type: "heading", text: "Seção especial: Cândido Rondon e o lema \"Morrer se preciso for, matar nunca\"" },
            "O Marechal **Cândido Mariano da Silva Rondon** (1865–1958), de ascendência indígena (Bororo, Terena e Guará), desempenhou um papel divisor de águas na relação entre o Estado brasileiro e as populações originárias no início do século XX.",
            {
              type: "list",
              items: [
                "**Integração sem violência:** à frente da Comissão de Linhas Telegráficas e do Serviço de Proteção aos Índios (SPI), Rondon demarcou territórios e estabeleceu o célebre lema: *\"Morrer se preciso for, matar nunca\"*.",
                "**O homenageado por Drummond:** é justamente a Rondon que Drummond dedica o *\"Pranto Geral dos Índios\"*, reconhecendo nele um mediador respeitoso — *\"eras um dos nossos voltando à origem, e trazias na mão o fio que fala\"*.",
                "**Legado:** Rondon foi fundamental para a criação do Parque Indígena do Xingu e para o reconhecimento do valor da preservação das culturas nativas frente à expansão territorial do país.",
              ],
            },
          ],
        },
        {
          id: "reportagem-conclusao",
          eyebrow: "Reportagem",
          title: "Intelectuais indígenas e a resistência da memória",
          tocTitle: "Conclusão",
          content: [
            { type: "heading", text: "Conclusão: a necessidade urgente de valorização dos povos indígenas" },
            "A valorização dos povos originários não é apenas um dever histórico ou uma reparação moral; é um compromisso fundamental com a diversidade e o futuro do planeta. Quando garantimos a demarcação de terras, o acesso à educação e a presença de vozes indígenas nos centros de decisão, fortalecemos a democracia brasileira e a preservação do meio ambiente.",
            "Como nos ensinam os intelectuais indígenas e a própria poesia de Drummond, manter viva a memória e os saberes ancestrais é a chave para garantir que as futuras gerações continuem a tecer uma história de respeito, dignidade e pertencimento.",
          ],
        },
      ],
    },
  ],
};
