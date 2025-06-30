<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Entrega>
 */
class EntregaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = $this->faker->randomElement(['pendente', 'coletada', 'em_transito', 'entregue', 'cancelada']);
        
        // Coordenadas aproximadas de São Paulo
        $origemLat = $this->faker->latitude(-23.6821, -23.4829);
        $origemLng = $this->faker->longitude(-46.8754, -46.3651);
        $destinoLat = $this->faker->latitude(-23.6821, -23.4829);
        $destinoLng = $this->faker->longitude(-46.8754, -46.3651);
        
        return [
            'rota_id' => null, // Será definido no seeder
            'codigo_rastreamento' => 'LT' . $this->faker->unique()->numerify('########'),
            'cliente_nome' => $this->faker->name(),
            'cliente_telefone' => $this->faker->phoneNumber(),
            'endereco_origem' => $this->faker->streetAddress() . ', ' . $this->faker->city() . ' - SP',
            'origem_latitude' => $origemLat,
            'origem_longitude' => $origemLng,
            'endereco_destino' => $this->faker->streetAddress() . ', ' . $this->faker->city() . ' - SP',
            'destino_latitude' => $destinoLat,
            'destino_longitude' => $destinoLng,
            'status' => $status,
            'valor_entrega' => $this->faker->numberBetween(500, 3000), // Entre R$ 5,00 e R$ 30,00 em centavos
            'peso' => $this->faker->randomFloat(2, 0.1, 10), // Entre 0.1kg e 10kg
            'observacoes' => $this->faker->optional()->sentence(),
            'ordem_na_rota' => $this->faker->numberBetween(1, 10),
            'coletada_em' => $status !== 'pendente' ? $this->faker->dateTimeBetween('-1 week', 'now') : null,
            'entregue_em' => $status === 'entregue' ? $this->faker->dateTimeBetween('-1 week', 'now') : null,
            'foto_comprovante' => $status === 'entregue' ? $this->faker->optional()->imageUrl() : null,
            'assinatura_cliente' => $status === 'entregue' ? $this->faker->optional()->text(100) : null,
        ];
    }
}
