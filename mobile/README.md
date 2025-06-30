# LogiTrack Entregador - App Mobile

App móvel para entregadores do sistema LogiTrack, desenvolvido com Expo e React Native.

## 🚀 Funcionalidades

### 📍 GPS e Localização
- **Localização em tempo real**: Rastreamento contínuo da posição do entregador
- **Mapa interativo**: Visualização de todas as entregas em um mapa
- **Navegação integrada**: Abertura automática do GPS do celular para navegação

### 🗺️ Otimização de Rotas
- **Rota otimizada**: Algoritmo que calcula a melhor sequência de entregas
- **Consideração de prioridades**: Entregas de alta prioridade são priorizadas
- **Recálculo automático**: Rota é recalculada quando uma entrega é concluída
- **Distâncias e tempos**: Cálculo de distância e tempo estimado para cada entrega

### 📦 Gestão de Entregas
- **Lista de entregas**: Visualização completa de todas as entregas pendentes
- **Detalhes completos**: Informações do cliente, itens, observações
- **Status em tempo real**: Atualização de status (pendente, em andamento, entregue, falhada)
- **Filtros avançados**: Busca por cliente, endereço ou telefone

### 📱 Interface Moderna
- **Design responsivo**: Interface otimizada para dispositivos móveis
- **Modo mapa/lista**: Alternância entre visualização em mapa e lista
- **Feedback visual**: Cores e ícones indicando prioridade e status
- **Ações rápidas**: Botões para ligar, navegar e atualizar status

## 🛠️ Tecnologias Utilizadas

- **React Native + Expo**: Framework para desenvolvimento mobile
- **TypeScript**: Tipagem estática para maior robustez
- **React Navigation**: Navegação entre telas
- **Expo Location**: Serviços de localização
- **React Native Maps**: Integração com mapas
- **Axios**: Cliente HTTP para comunicação com API

## 📋 Pré-requisitos

- Node.js 18+ 
- Expo CLI
- Dispositivo Android/iOS ou emulador

## 🚀 Instalação e Execução

1. **Instalar dependências**:
```bash
cd mobile
npm install
```

2. **Configurar chave do Google Maps**:
   - Obtenha uma chave da API do Google Maps
   - Edite o arquivo `src/components/DeliveryMap.tsx`
   - Substitua `YOUR_GOOGLE_MAPS_API_KEY` pela sua chave

3. **Iniciar o app**:
```bash
npm start
```

4. **Executar no dispositivo**:
   - Escaneie o QR code com o app Expo Go
   - Ou execute `npm run android`/`npm run ios`

## 🔧 Configuração do Backend

O app está preparado para se conectar com um backend Laravel. Para configurar:

1. **Editar configuração da API**:
   - Abra `src/services/api.ts`
   - Altere `API_BASE_URL` para o endereço do seu backend

2. **Endpoints esperados**:
   - `GET /api/drivers/{id}/deliveries` - Listar entregas
   - `GET /api/deliveries/{id}` - Detalhes da entrega
   - `PATCH /api/deliveries/{id}/status` - Atualizar status
   - `POST /api/drivers/{id}/optimize-route` - Otimizar rota
   - `POST /api/drivers/{id}/location` - Atualizar localização

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── DeliveryMap.tsx  # Componente do mapa
│   └── DeliveryItem.tsx # Item da lista de entregas
├── screens/             # Telas do app
│   ├── HomeScreen.tsx   # Tela principal com mapa
│   ├── DeliveriesScreen.tsx      # Lista de entregas
│   └── DeliveryDetailsScreen.tsx # Detalhes da entrega
├── services/            # Serviços e APIs
│   ├── api.ts          # Cliente da API
│   └── location.ts     # Serviços de localização
├── navigation/          # Configuração de navegação
│   └── AppNavigator.tsx
├── types/              # Definições de tipos TypeScript
│   └── index.ts
└── utils/              # Utilitários
    └── routeOptimizer.ts # Algoritmo de otimização
```

## 🔐 Permissões

O app solicita as seguintes permissões:

### Android
- `ACCESS_FINE_LOCATION` - Localização precisa
- `ACCESS_COARSE_LOCATION` - Localização aproximada  
- `ACCESS_BACKGROUND_LOCATION` - Localização em segundo plano

### iOS
- Localização quando o app está em uso
- Localização sempre (para tracking em segundo plano)

## 📊 Funcionalidades Avançadas

### Otimização de Rota
- **Algoritmo do vizinho mais próximo**: Encontra a sequência mais eficiente
- **Consideração de prioridades**: Entregas urgentes são priorizadas
- **Reagrupamento**: Entregas próximas são agrupadas
- **Recálculo dinâmico**: Rota é otimizada quando entregas são concluídas

### Rastreamento em Tempo Real
- **Localização contínua**: GPS atualizado a cada 10 segundos ou 10 metros
- **Histórico de posições**: Trajetória do entregador é registrada
- **Notificações de proximidade**: Alertas quando próximo ao destino

### Offline Support (Futuro)
- Cache de dados para funcionamento offline
- Sincronização quando conectividade retornar
- Armazenamento local de entregas

## 🚧 Próximas Funcionalidades

- [ ] **Autenticação**: Login/logout de entregadores
- [ ] **Notificações Push**: Alertas de novas entregas
- [ ] **Chat**: Comunicação com central/clientes
- [ ] **Relatórios**: Estatísticas de entregas realizadas
- [ ] **Modo noturno**: Tema escuro para uso noturno
- [ ] **Navegação offline**: Mapas offline para economia de dados

## 🐛 Troubleshooting

### Problemas com localização
- Verifique se as permissões foram concedidas
- Teste em dispositivo físico (emulador pode ter limitações)
- Certifique-se de que o GPS está ativado

### Problemas com mapas
- Verifique se a chave do Google Maps está configurada
- Confirme se a chave tem as APIs necessárias habilitadas
- Teste a conectividade com a internet

### Problemas de build
- Execute `expo doctor` para verificar problemas
- Limpe o cache: `expo start --clear`
- Reinstale dependências: `rm -rf node_modules && npm install`

## 📱 Compatibilidade

- **Android**: 6.0+ (API level 23+)
- **iOS**: 11.0+
- **Expo SDK**: 53.x

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste em dispositivos Android e iOS
5. Envie um pull request

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para mais detalhes.
