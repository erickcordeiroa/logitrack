<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Entrega extends Model
{
    use HasFactory;

    protected $fillable = [
        'rota_id',
        'codigo_rastreamento',
        'cliente_nome',
        'cliente_telefone',
        'endereco_origem',
        'origem_latitude',
        'origem_longitude',
        'endereco_destino',
        'destino_latitude',
        'destino_longitude',
        'status',
        'valor_entrega',
        'peso',
        'observacoes',
        'ordem_na_rota',
        'coletada_em',
        'entregue_em',
        'foto_comprovante',
        'assinatura_cliente',
    ];

    protected $casts = [
        'origem_latitude' => 'decimal:8',
        'origem_longitude' => 'decimal:8',
        'destino_latitude' => 'decimal:8',
        'destino_longitude' => 'decimal:8',
        'valor_entrega' => 'integer',
        'peso' => 'decimal:2',
        'ordem_na_rota' => 'integer',
        'coletada_em' => 'datetime',
        'entregue_em' => 'datetime',
    ];

    // Relacionamentos
    public function rota()
    {
        return $this->belongsTo(Rota::class);
    }

    // Accessors
    public function getValorEntregaReaisAttribute()
    {
        return $this->valor_entrega / 100;
    }

    // Scopes
    public function scopePorOrdem($query)
    {
        return $query->orderBy('ordem_na_rota');
    }

    public function scopePorStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    // Métodos
    public function marcarComoColetada()
    {
        $this->update([
            'status' => 'coletada',
            'coletada_em' => now(),
        ]);
    }

    public function marcarComoEmTransito()
    {
        $this->update([
            'status' => 'em_transito',
        ]);
    }

    public function marcarComoEntregue($fotoComprovante = null, $assinaturaCliente = null)
    {
        $this->update([
            'status' => 'entregue',
            'entregue_em' => now(),
            'foto_comprovante' => $fotoComprovante,
            'assinatura_cliente' => $assinaturaCliente,
        ]);
    }
}
