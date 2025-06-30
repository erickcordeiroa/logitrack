#!/bin/bash

echo "🚀 Iniciando LogiTrack Entregador App..."
echo ""

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

echo "🌟 Iniciando Expo Dev Server..."
echo ""
echo "📱 Para testar no seu dispositivo:"
echo "   1. Instale o app 'Expo Go' na Play Store/App Store"
echo "   2. Escaneie o QR code que aparecerá"
echo ""
echo "💻 Para testar no emulador:"
echo "   - Pressione 'a' para Android"
echo "   - Pressione 'i' para iOS (apenas no macOS)"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Configure sua chave do Google Maps em src/components/DeliveryMap.tsx"
echo "   - Configure a URL da API em src/services/api.ts"
echo ""

npm start
