<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LocalizacaoEntregador extends Model
{
    use HasFactory;

    protected $fillable = [
        'entregador_id',
        'latitude',
        'longitude',
        'precisao',
        'velocidade',
        'altitude',
        'registrada_em',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'precisao' => 'decimal:2',
        'velocidade' => 'decimal:2',
        'altitude' => 'decimal:2',
        'registrada_em' => 'datetime',
    ];

    // Relacionamentos
    public function entregador()
    {
        return $this->belongsTo(Entregador::class);
    }

    // Scopes
    public function scopeRecentes($query, $minutos = 5)
    {
        return $query->where('registrada_em', '>=', now()->subMinutes($minutos));
    }

    public function scopePorEntregador($query, $entregadorId)
    {
        return $query->where('entregador_id', $entregadorId);
    }

    // Métodos
    public static function registrarLocalizacao($entregadorId, $dados)
    {
        return self::create([
            'entregador_id' => $entregadorId,
            'latitude' => $dados['latitude'],
            'longitude' => $dados['longitude'],
            'precisao' => $dados['precisao'] ?? null,
            'velocidade' => $dados['velocidade'] ?? null,
            'altitude' => $dados['altitude'] ?? null,
            'registrada_em' => now(),
        ]);
    }
}
