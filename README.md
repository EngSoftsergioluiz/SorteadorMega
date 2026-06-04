# Studio Kellen Cristina - Sistema de Gerenciamento

Sistema completo de gerenciamento para o Studio Kellen Cristina, incluindo:
- 🏠 Site institucional (index.html)
- 📦 Controle de estoque com scanner de código de barras (estoque.html)
- 📅 Sistema de agendamento com integração Google Calendar (agendamento.html)

## Características Principais

### Site Institucional
- Design responsivo mobile-first
- Navegação suave entre seções
- Galeria de trabalhos
- Informações de contato e redes sociais

### Sistema de Estoque (v2.3.0)
- **PWA**: Funciona offline com Service Workers
- **Scanner de código de barras**: Leitura via câmera usando html5-qrcode
- **IA integrada**: Extração automática de itens de notas fiscais via Gemini Vision API
- **Segurança**:
  - Senha protegida com hash SHA-256
  - Validação de entrada contra XSS
  - Tratamento robusto de erros
  - Integridade de dependências (SRI hashes)
- **Gestão de inventário**:
  - Adicionar/remover produtos
  - Histórico de movimentações
  - Busca rápida
  - Exportação de relatórios

### Sistema de Agendamento
- Interface conversacional com IA (Claude)
- Integração com Google Calendar
- Catálogo completo de serviços:
  - Escova Express (avulso)
  - Clube da Escova (pacotes 4x e 8x)
  - Tratamentos com ozonioterapia
  - Progressivas (formol e orgânicas)
- Painel de gestão de agendamentos
- Notificações e lembretes de aniversário

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3 (variáveis CSS), Vanilla JavaScript
- **Bibliotecas**:
  - html5-qrcode v2.3.8 (scanner de código de barras)
  - React 18 (sistema de agendamento)
  - Babel Standalone (JSX in-browser)
  - Tailwind CSS (site institucional)
- **APIs**:
  - Google Gemini Vision (OCR de notas fiscais)
  - Google Calendar API (agendamentos)
  - Google Identity Services (OAuth)
- **PWA**: Service Workers, Web App Manifest, Offline-first

## Segurança

✅ Todas as dependências externas protegidas com SRI (Subresource Integrity)
✅ Senha armazenada como hash SHA-256 (não em texto plano)
✅ Validação de entrada em todos os formulários
✅ Sanitização de HTML para prevenir XSS
✅ Tratamento de erros de localStorage (quota exceeded)
✅ CORS apropriado para APIs externas

## Como Usar

### Desenvolvimento Local
```bash
# Servidor HTTP simples
npx http-server .

# ou Python
python -m http.server 8000
```

Acesse: `http://localhost:8000`

### Deploy em Produção
1. Faça commit das alterações
2. Faça push para o repositório
3. Deploy dos arquivos estáticos (GitHub Pages, Netlify, Vercel, etc.)
4. Verifique o Service Worker no DevTools

### Configuração do Gemini API (Estoque)
1. Acesse [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Crie uma chave de API gratuita
3. No app de estoque, cole a chave no campo indicado
4. A chave é salva localmente no navegador

### Configuração do Google Calendar (Agendamento)
1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto e ative a Google Calendar API
3. Crie credenciais OAuth 2.0 (tipo Web)
4. Adicione seu domínio como origem autorizada
5. Substitua `GOOGLE_CLIENT_ID` no código

## Versões

- **v2.3.0** (atual):
  - ✅ Hash SHA-256 para senha
  - ✅ SRI hashes para dependências
  - ✅ Validação robusta de entrada
  - ✅ Tratamento de erros aprimorado
  - ✅ SEO e meta tags melhoradas
  - ✅ Cache expandido do Service Worker

- **v2.2.0**: Funcionalidade de agendamento
- **v2.1.0**: Integração com Gemini AI para OCR
- **v2.0.0**: PWA com Service Worker

## Estrutura de Arquivos
```
.
├── index.html          # Site institucional
├── estoque.html        # Sistema de estoque (PWA)
├── agendamento.html    # Sistema de agendamento
├── style.css           # Estilos do site
├── app.js              # JavaScript compartilhado (placeholder)
├── sw.js               # Service Worker
├── manifest.json       # Manifesto PWA
├── img/                # Assets (logos, fotos)
├── CLAUDE.md           # Instruções para Claude Code
└── README.md           # Este arquivo
```

## Licença
© 2025 Studio Kellen Cristina
Desenvolvido por InfraCode Solutions

---
Para dúvidas ou suporte, entre em contato:
📱 WhatsApp: [(41) 99786-9763](https://wa.me/5541997869763)
