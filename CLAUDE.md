# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com o código neste repositório.

## Visão Geral do Projeto

**SorteadorMega** é um Progressive Web App (PWA) para o **Studio Kellen Cristina** - um sistema de gerenciamento de estoque com capacidade de leitura de código de barras. É uma aplicação web estática com funcionalidade offline habilitada por Service Workers.

### Características Principais
- **Sem processo de build**: Vanilla JavaScript, HTML e CSS - arquivos executados diretamente no navegador
- **Funciona offline**: Service Worker armazena em cache o shell da aplicação para uso sem conexão
- **Mobile-first**: Design responsivo otimizado para celular com navegação fixa na parte inferior
- **Leitura de código de barras**: Usa a biblioteca [html5-qrcode](https://github.com/mebjas/html5-qrcode) (v2.3.8)
- **Integração com IA**: Versões anteriores usavam Gemini AI para OCR (consulte o histórico do git para trabalhos específicos de ML)

## Arquitetura

### Estrutura de Arquivos
```
.
├── estoque.html          # App de estoque (aplicação principal)
├── index.html            # Página de marketing/vitrine
├── app.js                # Placeholder para futuras funcionalidades interativas
├── sw.js                 # Service Worker para estratégia de cache
├── manifest.json         # Manifesto PWA (ícones, metadados, URL inicial)
├── style.css             # Estilos compartilhados para index.html
├── img/                  # Assets (logos, fundos, imagens de produtos)
└── README.md             # README do projeto
```

### Padrões Arquiteturais Principais

**1. Cache do Service Worker (sw.js)**
- **Estratégia de Cache**: Network-first para navegação, cache-first para assets
- **App Shell**: Armazena `estoque.html` e `manifest.json` em cache na instalação
- **Tratamento cross-origin**: Ignora cache de recursos externos (bibliotecas CDN, fontes)
- **Versionamento de cache**: Usa a constante `CACHE_NAME` para invalidação de cache

**2. Configuração PWA (manifest.json)**
- URL inicial: `/estoque.html` (app de estoque)
- Modo de exibição: `standalone` (app mobile em tela cheia)
- Cores do tema: Azul (`#002644`) e dourado (`#e4c36b`)
- Ícones mascaráveis fornecidos para exibição de ícone adaptativo

**3. Padrão de UI (estoque.html)**
- **Cabeçalho fixo**: Barra superior fixa com título e botão de voltar
- **Navegação fixa inferior**: 5 botões de navegação (abas) na parte inferior
- **Troca de telas**: JavaScript alterna a classe `.active` nas divs `.screen`
- **Otimizado para mobile**: Usa `100dvh` (altura dinâmica do viewport) para evitar sobreposição com menus do celular
- **Esquema de cores**: Tema azul e dourado com design de cartão glassmórfico

**4. Integração de Leitura de Código de Barras**
- Usa `html5-qrcode@2.3.8` via CDN (atenção: hash de Subresource Integrity ausente - adicionar para produção)
- Scanner normalmente integrado às telas de estoque para entrada de código de barras/QR code

## Fluxo de Desenvolvimento

### Sem Etapa de Build
Os arquivos são servidos como estão. Teste as alterações diretamente:
1. Inicie um servidor web local: `npx http-server .` ou Python `python -m http.server 8000`
2. Abra `http://localhost:8000/estoque.html` no navegador
3. Abra o DevTools para verificar o registro do Service Worker e o cache

### Servindo a Aplicação
- **Desenvolvimento**: Qualquer servidor HTTP (necessário para registro do SW; file:// não funciona)
- **Produção**: Faça o deploy dos arquivos estáticos em qualquer hospedagem (GitHub Pages, Netlify, Vercel, etc.)

### Considerações Importantes de Desenvolvimento

**Cache do Service Worker**
- Alterações em `sw.js`: Incremente `CACHE_NAME` para limpar o cache do navegador na próxima visita
- Alterações em arquivos cacheados: Atualize o nome do cache; versões antigas são deletadas na ativação
- Teste: Use DevTools → Application → Cache Storage para inspecionar os arquivos em cache

**Testes de PWA**
- Validação do manifesto: DevTools → Application → Manifest
- Prompt de instalação: Use DevTools → Application → Install ou teste em dispositivo real
- Simulação offline: DevTools → Network → Throttling → Offline

**Dependências Externas**
- `html5-qrcode@2.3.8`: Usado para leitura de código de barras/QR (verificar fixação de versão)
- `Tailwind CSS`: Usado no index.html via CDN (https://cdn.tailwindcss.com)
- Google Fonts: Cinzel e Playfair Display (index.html)

## Padrões de Código Importantes

### Paleta de Cores (Variáveis CSS)
```css
:root {
  --azul-escuro: #002644;
  --azul-medio: #003a6b;
  --dourado-1: #e4c36b;
  --dourado-2: #d9b463;
  --branco: #ffffff;
  --amarelo-claro: #faf8c5;
  --vermelho: #e74c3c;
  --verde: #27ae60;
  --bg: #001a33;
  --card-bg: rgba(0, 38, 68, 0.92);
  --border: rgba(228, 195, 107, 0.3);
}
```
Use essas variáveis para manter consistência entre a página de marketing e o app de estoque.

### Padrão de Troca de Tela/Aba (estoque.html)
```javascript
// Exibe a tela adicionando a classe .active, oculta as demais
function showScreen(screenName) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenName).classList.add('active');
  updateNav(screenName); // Atualiza o destaque dos botões de navegação
}
```

## Fluxo Git

- **Repositório**: https://github.com/EngSoftsergioluiz/SorteadorMega
- **Branch principal**: `main` (pronto para produção)
- **Desenvolvimento baseado em PRs**: Funcionalidades desenvolvidas em branches de feature, mescladas via GitHub PRs
- **Estilo de commits**: Segue commits convencionais (veja commits recentes: `feat:`, `fix:`, `improve:`, `refactor:`)

## Deploy

Por ser uma PWA estática:
1. Faça commit das alterações na `main`
2. Faça push para o GitHub
3. Faça o deploy dos arquivos estáticos da `main` para a plataforma de hospedagem
4. Verifique se o Service Worker carrega corretamente e se o cache funciona em produção

## Notas de Melhorias Futuras

- `app.js` é atualmente um placeholder; use para funcionalidades JS compartilhadas entre páginas
- html5-qrcode v2.3.8 deve ter o hash SRI (Subresource Integrity) adicionado por segurança
- Considere uma estratégia de fixação de versão para dependências CDN (Tailwind, fontes)
- Trabalho anterior com a API Gemini visível no histórico do git para referência sobre capacidades de visão computacional
