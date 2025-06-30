<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Entrega;
use App\Models\Rota;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class EntregaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $entregas = Entrega::with(['rota'])->get();

        return response()->json([
            'success' => true,
            'data' => $entregas,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'rota_id' => 'required|exists:rotas,id',
            'cliente_nome' => 'required|string|max:255',
            'cliente_telefone' => 'nullable|string|max:20',
            'endereco_origem' => 'required|string',
            'origem_latitude' => 'required|numeric|between:-90,90',
            'origem_longitude' => 'required|numeric|between:-180,180',
            'endereco_destino' => 'required|string',
            'destino_latitude' => 'required|numeric|between:-90,90',
            'destino_longitude' => 'required|numeric|between:-180,180',
            'valor_entrega' => 'nullable|integer|min:0',
            'peso' => 'nullable|numeric|min:0',
            'observacoes' => 'nullable|string',
            'ordem_na_rota' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $dados = $validator->validated();
        $dados['codigo_rastreamento'] = 'LT' . str_pad(rand(1, 99999999), 8, '0', STR_PAD_LEFT);

        $entrega = Entrega::create($dados);

        return response()->json([
            'success' => true,
            'data' => $entrega->load('rota'),
            'message' => 'Entrega criada com sucesso',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Entrega $entrega): JsonResponse
    {
        $entrega->load('rota');
        
        return response()->json([
            'success' => true,
            'data' => $entrega,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Entrega $entrega): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'cliente_nome' => 'sometimes|string|max:255',
            'cliente_telefone' => 'nullable|string|max:20',
            'endereco_origem' => 'sometimes|string',
            'origem_latitude' => 'sometimes|numeric|between:-90,90',
            'origem_longitude' => 'sometimes|numeric|between:-180,180',
            'endereco_destino' => 'sometimes|string',
            'destino_latitude' => 'sometimes|numeric|between:-90,90',
            'destino_longitude' => 'sometimes|numeric|between:-180,180',
            'status' => 'sometimes|in:pendente,coletada,em_transito,entregue,cancelada',
            'valor_entrega' => 'nullable|integer|min:0',
            'peso' => 'nullable|numeric|min:0',
            'observacoes' => 'nullable|string',
            'ordem_na_rota' => 'sometimes|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $entrega->update($validator->validated());

        return response()->json([
            'success' => true,
            'data' => $entrega->load('rota'),
            'message' => 'Entrega atualizada com sucesso',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Entrega $entrega): JsonResponse
    {
        $entrega->delete();

        return response()->json([
            'success' => true,
            'message' => 'Entrega removida com sucesso',
        ]);
    }

    public function marcarComoColetada(Entrega $entrega): JsonResponse
    {
        if ($entrega->status !== 'pendente') {
            return response()->json([
                'success' => false,
                'message' => 'Entrega não pode ser marcada como coletada',
            ], 422);
        }

        $entrega->marcarComoColetada();

        return response()->json([
            'success' => true,
            'data' => $entrega,
            'message' => 'Entrega marcada como coletada',
        ]);
    }

    public function marcarComoEmTransito(Entrega $entrega): JsonResponse
    {
        if (!in_array($entrega->status, ['coletada', 'pendente'])) {
            return response()->json([
                'success' => false,
                'message' => 'Entrega não pode ser marcada como em trânsito',
            ], 422);
        }

        $entrega->marcarComoEmTransito();

        return response()->json([
            'success' => true,
            'data' => $entrega,
            'message' => 'Entrega marcada como em trânsito',
        ]);
    }

    public function marcarComoEntregue(Request $request, Entrega $entrega): JsonResponse
    {
        if (!in_array($entrega->status, ['em_transito', 'coletada'])) {
            return response()->json([
                'success' => false,
                'message' => 'Entrega não pode ser marcada como entregue',
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'foto_comprovante' => 'nullable|string',
            'assinatura_cliente' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $dados = $validator->validated();
        
        $entrega->marcarComoEntregue(
            $dados['foto_comprovante'] ?? null,
            $dados['assinatura_cliente'] ?? null
        );

        return response()->json([
            'success' => true,
            'data' => $entrega,
            'message' => 'Entrega marcada como entregue',
        ]);
    }

    public function buscarPorCodigo(string $codigo): JsonResponse
    {
        $entrega = Entrega::where('codigo_rastreamento', $codigo)
            ->with('rota')
            ->first();

        if (!$entrega) {
            return response()->json([
                'success' => false,
                'message' => 'Entrega não encontrada',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $entrega,
        ]);
    }
}
