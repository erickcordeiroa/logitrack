<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EntregadorController;
use App\Http\Controllers\Api\RotaController;
use App\Http\Controllers\Api\EntregaController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Rotas públicas (sem autenticação)
Route::prefix('v1')->group(function () {
    
    // Entregadores
    Route::apiResource('entregadores', EntregadorController::class);
    Route::post('entregadores/{entregador}/location', [EntregadorController::class, 'updateLocation']);
    Route::get('entregadores/{entregador}/location-history', [EntregadorController::class, 'locationHistory']);
    
    // Rotas
    Route::apiResource('rotas', RotaController::class);
    Route::post('rotas/{rota}/iniciar', [RotaController::class, 'iniciarRota']);
    Route::post('rotas/{rota}/finalizar', [RotaController::class, 'finalizarRota']);
    
    // Entregas
    Route::apiResource('entregas', EntregaController::class);
    Route::post('entregas/{entrega}/coletar', [EntregaController::class, 'marcarComoColetada']);
    Route::post('entregas/{entrega}/transito', [EntregaController::class, 'marcarComoEmTransito']);
    Route::post('entregas/{entrega}/entregar', [EntregaController::class, 'marcarComoEntregue']);
    Route::get('entregas/codigo/{codigo}', [EntregaController::class, 'buscarPorCodigo']);
    
    // Dashboard endpoints
    Route::get('dashboard/stats', function () {
        $entregadoresAtivos = \App\Models\Entregador::where('ativo', true)->count();
        $rotasHoje = \App\Models\Rota::whereDate('data_entrega', today())->count();
        $entregasPendentes = \App\Models\Entrega::where('status', 'pendente')->count();
        $entregasEntregues = \App\Models\Entrega::where('status', 'entregue')->count();
        
        return response()->json([
            'success' => true,
            'data' => [
                'entregadores_ativos' => $entregadoresAtivos,
                'rotas_hoje' => $rotasHoje,
                'entregas_pendentes' => $entregasPendentes,
                'entregas_entregues' => $entregasEntregues,
            ],
        ]);
    });
    
    Route::get('dashboard/entregadores-localizacao', function () {
        $entregadores = \App\Models\Entregador::where('ativo', true)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->with('ultimaLocalizacao')
            ->get()
            ->map(function ($entregador) {
                return [
                    'id' => $entregador->id,
                    'nome' => $entregador->nome,
                    'latitude' => $entregador->latitude,
                    'longitude' => $entregador->longitude,
                    'status' => $entregador->status,
                    'veiculo_tipo' => $entregador->veiculo_tipo,
                    'ultima_localizacao' => $entregador->ultima_localizacao,
                ];
            });
            
        return response()->json([
            'success' => true,
            'data' => $entregadores,
        ]);
    });
    
    // Real-time tracking endpoint
    Route::get('tracking/{codigo}', function (string $codigo) {
        $entrega = \App\Models\Entrega::where('codigo_rastreamento', $codigo)
            ->with(['rota.entregador'])
            ->first();
            
        if (!$entrega) {
            return response()->json([
                'success' => false,
                'message' => 'Código de rastreamento não encontrado',
            ], 404);
        }
        
        $entregador = $entrega->rota->entregador;
        
        return response()->json([
            'success' => true,
            'data' => [
                'entrega' => $entrega,
                'entregador' => $entregador ? [
                    'nome' => $entregador->nome,
                    'telefone' => $entregador->telefone,
                    'veiculo_tipo' => $entregador->veiculo_tipo,
                    'latitude' => $entregador->latitude,
                    'longitude' => $entregador->longitude,
                    'status' => $entregador->status,
                ] : null,
            ],
        ]);
    });
});
