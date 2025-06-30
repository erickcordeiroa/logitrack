# 🚀 Como Executar o LogiTrack Entregador

## Comandos Rápidos

```bash
# Entrar na pasta do app mobile
cd mobile

# Instalar dependências (apenas na primeira vez)
npm install

# Iniciar o app
npm start
```

## Testando o App

### 📱 No seu celular (recomendado):
1. Instale o **Expo Go** na Play Store (Android) ou App Store (iOS)
2. Execute `npm start` no terminal
3. Escaneie o QR code que aparece com o app Expo Go

### 💻 No emulador:
- **Android**: Pressione `a` no terminal após `npm start`
- **iOS**: Pressione `i` no terminal (apenas macOS)

### 🌐 No navegador web:
- Pressione `w` no terminal após `npm start`

## ⚙️ Configurações Importantes

Antes de usar em produção, configure:

1. **Google Maps API Key** - [Ver guia completo](mobile/GOOGLE_MAPS_SETUP.md)
   - Obtenha uma chave grátis no Google Cloud Console
   - Configure em `src/components/DeliveryMap.tsx`
   - **Necessário para rotas seguirem as ruas**

2. **URL da API** em `src/services/api.ts`
   - Configure para seu backend Laravel

## 📁 Estrutura do Projeto

```
mobile/
├── src/
│   ├── components/     # Componentes (Mapa, Lista de entregas)
│   ├── screens/        # Telas (Home, Entregas, Detalhes)
│   ├── services/       # APIs e localização
│   ├── navigation/     # Navegação entre telas
│   └── types/          # Tipos TypeScript
├── App.tsx            # App principal
└── package.json       # Dependências
```

Pronto! O app está completo e funcional. 🎉
