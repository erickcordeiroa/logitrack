<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rota;
use App\Models\Entregador;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class RotaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $rotas = Rota::with(['entregador', 'entregas'])->get();

        return response()->json([
            'success' => true,
            'data' => $rotas,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'entregador_id' => 'nullable|exists:entregadors,id',
            'data_entrega' => 'required|date',
            'valor_total' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $rota = Rota::create($validator->validated());

        return response()->json([
            'success' => true,
            'data' => $rota->load(['entregador', 'entregas']),
            'message' => 'Rota criada com sucesso',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Rota $rota): JsonResponse
    {
        $rota->load(['entregador', 'entregas' => function($query) {
            $query->orderBy('ordem_na_rota');
        }]);
        
        return response()->json([
            'success' => true,
            'data' => $rota,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Rota $rota): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'sometimes|string|max:255',
            'descricao' => 'nullable|string',
            'entregador_id' => 'nullable|exists:entregadors,id',
            'status' => 'sometimes|in:pendente,em_andamento,concluida,cancelada',
            'data_entrega' => 'sometimes|date',
            'hora_inicio' => 'nullable|date_format:H:i',
            'hora_fim' => 'nullable|date_format:H:i',
            'valor_total' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $rota->update($validator->validated());

        return response()->json([
            'success' => true,
            'data' => $rota->load(['entregador', 'entregas']),
            'message' => 'Rota atualizada com sucesso',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rota $rota): JsonResponse
    {
        $rota->delete();

        return response()->json([
            'success' => true,
            'message' => 'Rota removida com sucesso',
        ]);
    }

    /**
     * Iniciar a rota.
     */
    public function iniciarRota(Rota $rota): JsonResponse
    {
        if ($rota->status !== 'pendente') {
            return response()->json([
                'success' => false,
                'message' => 'Rota não pode ser iniciada',
            ], 422);
        }

        $rota->update([
            'status' => 'em_andamento',
            'hora_inicio' => now()->format('H:i'),
        ]);

        return response()->json([
            'success' => true,
            'data' => $rota,
            'message' => 'Rota iniciada com sucesso',
        ]);
    }

    /**
     * Finalizar a rota.
     */
    public function finalizarRota(Rota $rota): JsonResponse
    {
        if ($rota->status !== 'em_andamento') {
            return response()->json([
                'success' => false,
                'message' => 'Rota não está em andamento',
            ], 422);
        }

        $rota->update([
            'status' => 'concluida',
            'hora_fim' => now()->format('H:i'),
        ]);

        return response()->json([
            'success' => true,
            'data' => $rota,
            'message' => 'Rota finalizada com sucesso',
        ]);
    }
}
