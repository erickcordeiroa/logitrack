# 🗺️ Como Configurar Google Maps no LogiTrack

Para que as rotas sigam as ruas reais (como um GPS), você precisa configurar uma chave da API do Google Maps.

## 🔑 Obtendo a Chave da API

### 1. Acesse o Google Cloud Console
- Vá para: https://console.cloud.google.com/
- Faça login com sua conta Google

### 2. Crie um Projeto (se não tiver)
- Clique em "Selecionar projeto" no topo
- Clique em "Novo projeto"
- Dê um nome como "LogiTrack"
- Clique em "Criar"

### 3. Ative as APIs Necessárias
No menu lateral, vá em **APIs e Serviços > Biblioteca** e ative:

- ✅ **Maps SDK for Android**
- ✅ **Maps SDK for iOS** 
- ✅ **Directions API**
- ✅ **Places API** (opcional, para busca de endereços)
- ✅ **Geocoding API** (opcional, para conversão endereço/coordenadas)

### 4. Criar a Chave da API
- Vá em **APIs e Serviços > Credenciais**
- Clique em **+ Criar Credenciais > Chave da API**
- Copie a chave gerada

### 5. Configurar Restrições (Recomendado)
- Clique na chave criada para editá-la
- Em **Restrições da aplicação**, escolha:
  - **Apps para Android** (para produção Android)
  - **Apps para iOS** (para produção iOS)
  - **Referenciadores HTTP** (para desenvolvimento web)
- Em **Restrições da API**, selecione apenas as APIs que você ativou

## ⚙️ Configurando no App

### 1. Abra o arquivo do mapa:
```bash
nano src/components/DeliveryMap.tsx
```

### 2. Substitua a chave:
```typescript
// Encontre esta linha:
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

// Substitua por:
const GOOGLE_MAPS_API_KEY = 'SUA_CHAVE_AQUI';
```

### 3. Salve e reinicie o app:
```bash
# Parar o app (Ctrl+C no terminal)
# Iniciar novamente
npm start
```

## 🚗 Testando as Rotas

Depois de configurar:

1. **Abra o app** no celular via Expo Go
2. **Permita acesso à localização** quando solicitado
3. **Vá para a aba "Mapa"**
4. **Observe as rotas azuis** seguindo as ruas
5. **Use os botões de controle**:
   - 👁️ Mostrar/ocultar rotas
   - 🗺️ Rota completa vs próxima entrega
   - 📍 Centralizar no usuário
   - 🗺️ Centralizar na rota

## 🎨 Recursos das Rotas

### Cores das Rotas:
- **Azul (#007AFF)**: Rota completa para todas as entregas
- **Laranja (#FF6B35)**: Apenas próxima entrega

### Funcionalidades:
- ✅ **Seguem as ruas** usando dados reais do Google
- ✅ **Otimização automática** de waypoints
- ✅ **Tempo e distância reais**
- ✅ **Evita trânsito** (quando disponível)
- ✅ **Instruções em português**
- ✅ **Ajuste automático** do zoom do mapa

## 💰 Custos

O Google Maps oferece:
- **$200 de créditos grátis** por mês
- **Primeiras 28.000 solicitações grátis** da Directions API
- Para um entregador, isso é suficiente para **uso ilimitado**

## 🐛 Troubleshooting

### Rota não aparece:
- ✅ Verificar se a chave está correta
- ✅ Verificar se as APIs estão ativas
- ✅ Verificar logs no console (npm start)
- ✅ Testar em dispositivo real (não emulador)

### Erro de cota excedida:
- 🔍 Verificar uso no Google Cloud Console
- 💳 Adicionar método de pagamento se necessário
- ⚙️ Configurar alertas de cota

### Rotas imprecisas:
- 📍 Verificar precisão do GPS
- 🕐 Aguardar sinal GPS estabilizar
- 🔄 Tentar recarregar o app

## 🔒 Segurança

**Para produção**, sempre:
- 🚫 **Nunca commit** a chave no Git
- 🔐 Use **variáveis de ambiente**
- 🎯 Configure **restrições** da API
- 📊 Monitor **uso e custos**

### Exemplo com variável de ambiente:
```typescript
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';
```

Agora seu app terá rotas realistas seguindo as ruas! 🛣️✨
