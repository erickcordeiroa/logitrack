<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Rota>
 */
class RotaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = $this->faker->randomElement(['pendente', 'em_andamento', 'concluida', 'cancelada']);
        $dataEntrega = $this->faker->dateTimeBetween('now', '+7 days');
        
        return [
            'nome' => 'Rota ' . $this->faker->city() . ' - ' . $this->faker->date('d/m/Y'),
            'descricao' => $this->faker->sentence(),
            'entregador_id' => null, // Será definido no seeder
            'status' => $status,
            'data_entrega' => $dataEntrega,
            'hora_inicio' => $status === 'em_andamento' || $status === 'concluida' ? $this->faker->time('H:i') : null,
            'hora_fim' => $status === 'concluida' ? $this->faker->time('H:i') : null,
            'distancia_total' => $this->faker->randomFloat(2, 5, 50), // Entre 5 e 50 km
            'valor_total' => $this->faker->numberBetween(2000, 15000), // Entre R$ 20,00 e R$ 150,00 em centavos
        ];
    }
}
