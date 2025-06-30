# APIs Backend para LogiTrack Entregador

Este documento descreve as APIs que precisam ser implementadas no backend Laravel para suportar o app mobile de entregadores.

## Base URL
```
Desenvolvimento: http://localhost:8000/api
Produção: https://your-domain.com/api
```

## Autenticação
Todas as requisições (exceto login) devem incluir o header:
```
Authorization: Bearer {token}
```

## Endpoints

### 1. Autenticação

#### POST /auth/login
Login do entregador
```json
{
  "email": "entregador@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "driver-1",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "(11) 99999-9999",
    "vehicle": "Moto Honda CG 160"
  }
}
```

### 2. Entregas

#### GET /drivers/{driverId}/deliveries
Lista todas as entregas do entregador

**Parâmetros de Query:**
- `status`: pending|in_progress|delivered|failed
- `date`: YYYY-MM-DD

**Resposta:**
```json
[
  {
    "id": "1",
    "customerName": "João Silva",
    "customerPhone": "(11) 99999-1111",
    "address": "Rua das Flores, 123 - Centro, São Paulo - SP",
    "latitude": -23.550520,
    "longitude": -46.633309,
    "status": "pending",
    "estimatedTime": "30 min",
    "items": [
      {
        "id": "1",
        "name": "Pizza Margherita",
        "quantity": 1,
        "description": "Tamanho grande"
      }
    ],
    "notes": "Entregar no portão principal",
    "priority": "high",
    "createdAt": "2025-06-29T10:00:00Z",
    "updatedAt": "2025-06-29T10:00:00Z"
  }
]
```

#### GET /deliveries/{deliveryId}
Detalhes de uma entrega específica

**Resposta:** Mesmo formato do objeto de entrega acima.

#### PATCH /deliveries/{deliveryId}/status
Atualiza o status de uma entrega

```json
{
  "status": "delivered",
  "location": {
    "latitude": -23.550520,
    "longitude": -46.633309
  },
  "timestamp": "2025-06-29T14:30:00Z",
  "notes": "Entregue ao porteiro"
}
```

**Resposta:**
```json
{
  "message": "Status atualizado com sucesso"
}
```

### 3. Rota e Otimização

#### POST /drivers/{driverId}/optimize-route
Otimiza a rota de entregas

```json
{
  "currentLocation": {
    "latitude": -23.550520,
    "longitude": -46.633309
  }
}
```

**Resposta:**
```json
{
  "id": "route-1",
  "deliveries": [...], // Array de entregas ordenadas
  "totalDistance": 12.5,
  "estimatedDuration": 90,
  "optimized": true,
  "startLocation": {
    "latitude": -23.550520,
    "longitude": -46.633309
  }
}
```

### 4. Localização

#### POST /drivers/{driverId}/location
Atualiza a localização atual do entregador

```json
{
  "latitude": -23.550520,
  "longitude": -46.633309,
  "timestamp": "2025-06-29T14:30:00Z"
}
```

**Resposta:**
```json
{
  "message": "Localização atualizada"
}
```

#### GET /drivers/{driverId}/location/history
Histórico de localizações

**Parâmetros de Query:**
- `date`: YYYY-MM-DD
- `limit`: número máximo de registros

**Resposta:**
```json
[
  {
    "latitude": -23.550520,
    "longitude": -46.633309,
    "timestamp": "2025-06-29T14:30:00Z"
  }
]
```

### 5. Estatísticas

#### GET /drivers/{driverId}/stats
Estatísticas do entregador

**Parâmetros de Query:**
- `period`: today|week|month

**Resposta:**
```json
{
  "deliveries": {
    "total": 45,
    "delivered": 42,
    "failed": 3,
    "pending": 5
  },
  "distance": {
    "total": 234.5,
    "average": 5.2
  },
  "time": {
    "totalHours": 8.5,
    "averagePerDelivery": 12
  }
}
```

### 6. Notificações

#### GET /drivers/{driverId}/notifications
Lista notificações do entregador

**Resposta:**
```json
[
  {
    "id": "notif-1",
    "title": "Nova entrega atribuída",
    "message": "Você recebeu uma nova entrega para João Silva",
    "type": "new_delivery",
    "read": false,
    "createdAt": "2025-06-29T14:30:00Z"
  }
]
```

#### PATCH /notifications/{notificationId}/read
Marca notificação como lida

## Estrutura do Banco de Dados

### Tabela: drivers
```sql
id (string, primary key)
name (string)
email (string, unique)
phone (string)
vehicle (string)
status (enum: active, inactive)
created_at (timestamp)
updated_at (timestamp)
```

### Tabela: deliveries
```sql
id (string, primary key)
driver_id (string, foreign key)
customer_name (string)
customer_phone (string)
address (text)
latitude (decimal)
longitude (decimal)
status (enum: pending, in_progress, delivered, failed)
estimated_time (string)
notes (text, nullable)
priority (enum: low, medium, high)
created_at (timestamp)
updated_at (timestamp)
```

### Tabela: delivery_items
```sql
id (string, primary key)
delivery_id (string, foreign key)
name (string)
quantity (integer)
description (text, nullable)
```

### Tabela: driver_locations
```sql
id (bigint, primary key)
driver_id (string, foreign key)
latitude (decimal)
longitude (decimal)
timestamp (timestamp)
```

### Tabela: delivery_status_history
```sql
id (bigint, primary key)
delivery_id (string, foreign key)
status (string)
location_latitude (decimal, nullable)
location_longitude (decimal, nullable)
notes (text, nullable)
timestamp (timestamp)
```

## Eventos em Tempo Real (WebSocket/Pusher)

### Eventos para o entregador:
- `delivery.assigned` - Nova entrega atribuída
- `delivery.updated` - Entrega foi modificada
- `delivery.cancelled` - Entrega foi cancelada
- `route.optimized` - Nova rota otimizada disponível

### Eventos do entregador:
- `driver.location.updated` - Localização atualizada
- `delivery.status.changed` - Status da entrega mudou

## Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação
- `401` - Não autorizado
- `403` - Acesso negado
- `404` - Não encontrado
- `422` - Dados inválidos
- `500` - Erro interno do servidor

## Exemplos de Implementação Laravel

### Controller para Entregas:
```php
class DeliveryController extends Controller
{
    public function index(Request $request, $driverId)
    {
        $query = Delivery::where('driver_id', $driverId)
            ->with('items');
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        return $query->get();
    }
    
    public function updateStatus(Request $request, $deliveryId)
    {
        $delivery = Delivery::findOrFail($deliveryId);
        
        $delivery->update([
            'status' => $request->status,
            'updated_at' => now()
        ]);
        
        // Registrar no histórico
        DeliveryStatusHistory::create([
            'delivery_id' => $deliveryId,
            'status' => $request->status,
            'location_latitude' => $request->location['latitude'] ?? null,
            'location_longitude' => $request->location['longitude'] ?? null,
            'timestamp' => $request->timestamp
        ]);
        
        return response()->json(['message' => 'Status atualizado com sucesso']);
    }
}
```

### Middleware de Autenticação:
```php
class DriverAuthMiddleware
{
    public function handle($request, Closure $next)
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json(['error' => 'Token não fornecido'], 401);
        }
        
        // Validar JWT token
        // Adicionar driver ao request
        
        return $next($request);
    }
}
```

## Observações Importantes

1. **Segurança**: Implementar rate limiting para evitar spam
2. **Cache**: Usar Redis para cache de rotas otimizadas
3. **Queue**: Usar filas para otimização de rotas pesadas
4. **Logs**: Registrar todas as mudanças de status para auditoria
5. **Backup**: Fazer backup regular dos dados de localização
6. **Performance**: Indexar campos de busca frequente (driver_id, status, etc.)

Este backend fornecerá toda a funcionalidade necessária para o app mobile de entregadores funcionar perfeitamente!
