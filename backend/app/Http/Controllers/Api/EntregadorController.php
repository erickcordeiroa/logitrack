<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Entregador;
use App\Models\LocalizacaoEntregador;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class EntregadorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $entregadores = Entregador::with(['ultimaLocalizacao'])->get();

        return response()->json([
            'success' => true,
            'data' => $entregadores,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:255',
            'email' => 'required|email|unique:entregadors,email',
            'telefone' => 'nullable|string|max:20',
            'cpf' => 'required|string|unique:entregadors,cpf',
            'veiculo_tipo' => 'required|string|max:50',
            'veiculo_placa' => 'nullable|string|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $entregador = Entregador::create($validator->validated());

        return response()->json([
            'success' => true,
            'data' => $entregador,
            'message' => 'Entregador criado com sucesso',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Entregador $entregador): JsonResponse
    {
        $entregador->load(['rotas.entregas', 'ultimaLocalizacao']);
        
        return response()->json([
            'success' => true,
            'data' => $entregador,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Entregador $entregador): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nome' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:entregadors,email,' . $entregador->id,
            'telefone' => 'nullable|string|max:20',
            'cpf' => 'sometimes|string|unique:entregadors,cpf,' . $entregador->id,
            'veiculo_tipo' => 'sometimes|string|max:50',
            'veiculo_placa' => 'nullable|string|max:10',
            'ativo' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $entregador->update($validator->validated());

        return response()->json([
            'success' => true,
            'data' => $entregador,
            'message' => 'Entregador atualizado com sucesso',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Entregador $entregador): JsonResponse
    {
        $entregador->delete();

        return response()->json([
            'success' => true,
            'message' => 'Entregador removido com sucesso',
        ]);
    }

    /**
     * Update the location of the entregador.
     */
    public function updateLocation(Request $request, Entregador $entregador): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'precisao' => 'nullable|numeric|min:0',
            'velocidade' => 'nullable|numeric|min:0',
            'altitude' => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $dados = $validator->validated();

        // Registrar localização histórica
        LocalizacaoEntregador::registrarLocalizacao($entregador->id, $dados);

        // Atualizar localização atual do entregador
        $entregador->update([
            'latitude' => $dados['latitude'],
            'longitude' => $dados['longitude'],
            'ultima_localizacao' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Localização atualizada com sucesso',
            'data' => [
                'latitude' => $entregador->latitude,
                'longitude' => $entregador->longitude,
                'status' => $entregador->status,
            ],
        ]);
    }

    /**
     * Display the location history of the entregador.
     */
    public function locationHistory(Request $request, Entregador $entregador): JsonResponse
    {
        $horas = $request->get('horas', 24);
        
        $localizacoes = $entregador->localizacoes()
            ->where('registrada_em', '>=', now()->subHours($horas))
            ->orderBy('registrada_em', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $localizacoes,
        ]);
    }
}
