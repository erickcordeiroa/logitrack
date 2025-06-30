<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class Entregador extends Model
{
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'nome',
        'email',
        'telefone',
        'cpf',
        'veiculo_tipo',
        'veiculo_placa',
        'ativo',
        'ultimo_login',
        'latitude',
        'longitude',
        'ultima_localizacao',
    ];

    protected $casts = [
        'ativo' => 'boolean',
        'ultimo_login' => 'datetime',
        'ultima_localizacao' => 'datetime',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    // Relacionamentos
    public function rotas()
    {
        return $this->hasMany(Rota::class);
    }

    public function localizacoes()
    {
        return $this->hasMany(LocalizacaoEntregador::class);
    }

    public function ultimaLocalizacao()
    {
        return $this->hasOne(LocalizacaoEntregador::class)->latest('registrada_em');
    }

    // Accessors
    public function getStatusAttribute()
    {
        if (!$this->ativo) {
            return 'inativo';
        }

        // Verifica se tem rota ativa
        $rotaAtiva = $this->rotas()->where('status', 'em_andamento')->first();
        
        if ($rotaAtiva) {
            return 'em_entrega';
        }

        // Verifica última localização
        if ($this->ultima_localizacao && now()->diffInMinutes($this->ultima_localizacao) <= 5) {
            return 'online';
        }

        return 'offline';
    }
}
