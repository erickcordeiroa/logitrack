<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Rota extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'descricao',
        'entregador_id',
        'status',
        'data_entrega',
        'hora_inicio',
        'hora_fim',
        'distancia_total',
        'valor_total',
    ];

    protected $casts = [
        'data_entrega' => 'date',
        'hora_inicio' => 'datetime:H:i',
        'hora_fim' => 'datetime:H:i',
        'distancia_total' => 'decimal:2',
        'valor_total' => 'integer',
    ];

    // Relacionamentos
    public function entregador()
    {
        return $this->belongsTo(Entregador::class);
    }

    public function entregas()
    {
        return $this->hasMany(Entrega::class);
    }

    // Accessors
    public function getValorTotalReaisAttribute()
    {
        return $this->valor_total / 100;
    }

    public function getEntregasPendentesAttribute()
    {
        return $this->entregas()->where('status', 'pendente')->count();
    }

    public function getEntregasConcluidasAttribute()
    {
        return $this->entregas()->where('status', 'entregue')->count();
    }

    public function getProgressoAttribute()
    {
        $total = $this->entregas()->count();
        $concluidas = $this->entregas_concluidas;
        
        return $total > 0 ? ($concluidas / $total) * 100 : 0;
    }
}
