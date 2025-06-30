<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Entregador;
use App\Models\Rota;
use App\Models\Entrega;
use App\Models\LocalizacaoEntregador;

class LogiTrackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Criar entregadores
        $entregadores = Entregador::factory(10)->create();
        
        echo "Criados " . $entregadores->count() . " entregadores\n";
        
        // Criar rotas e distribuir entre entregadores
        $rotas = collect();
        
        foreach ($entregadores as $entregador) {
            // Cada entregador pode ter 1-3 rotas
            $numRotas = rand(1, 3);
            
            for ($i = 0; $i < $numRotas; $i++) {
                $rota = Rota::factory()->create([
                    'entregador_id' => $entregador->id,
                ]);
                
                $rotas->push($rota);
                
                // Criar entregas para cada rota (3-8 entregas por rota)
                $numEntregas = rand(3, 8);
                
                for ($j = 1; $j <= $numEntregas; $j++) {
                    Entrega::factory()->create([
                        'rota_id' => $rota->id,
                        'ordem_na_rota' => $j,
                    ]);
                }
            }
        }
        
        echo "Criadas " . $rotas->count() . " rotas\n";
        echo "Criadas " . Entrega::count() . " entregas\n";
        
        // Criar localizações recentes para entregadores ativos
        $entregadoresAtivos = $entregadores->where('ativo', true);
        
        foreach ($entregadoresAtivos as $entregador) {
            // Criar algumas localizações históricas (últimas 2 horas)
            for ($i = 0; $i < rand(5, 15); $i++) {
                LocalizacaoEntregador::create([
                    'entregador_id' => $entregador->id,
                    'latitude' => $entregador->latitude + (rand(-100, 100) / 10000), // Variação pequena
                    'longitude' => $entregador->longitude + (rand(-100, 100) / 10000),
                    'precisao' => rand(5, 20),
                    'velocidade' => rand(0, 60),
                    'altitude' => rand(700, 900),
                    'registrada_em' => now()->subMinutes(rand(1, 120)),
                ]);
            }
        }
        
        echo "Criadas localizações para " . $entregadoresAtivos->count() . " entregadores ativos\n";
        
        // Atualizar última localização dos entregadores
        foreach ($entregadoresAtivos as $entregador) {
            $ultimaLocalizacao = $entregador->localizacoes()->latest('registrada_em')->first();
            if ($ultimaLocalizacao) {
                $entregador->update([
                    'latitude' => $ultimaLocalizacao->latitude,
                    'longitude' => $ultimaLocalizacao->longitude,
                    'ultima_localizacao' => $ultimaLocalizacao->registrada_em,
                ]);
            }
        }
        
        echo "Dados de teste criados com sucesso!\n";
    }
}
