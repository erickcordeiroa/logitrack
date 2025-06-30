<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Entregador>
 */
class EntregadorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $veiculosTipos = ['moto', 'bicicleta', 'carro', 'van'];
        $tipoVeiculo = $this->faker->randomElement($veiculosTipos);
        
        return [
            'nome' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'telefone' => $this->faker->phoneNumber(),
            'cpf' => $this->faker->numerify('###.###.###-##'),
            'veiculo_tipo' => $tipoVeiculo,
            'veiculo_placa' => $tipoVeiculo !== 'bicicleta' ? $this->faker->regexify('[A-Z]{3}[0-9]{4}') : null,
            'ativo' => $this->faker->boolean(85), // 85% de chance de estar ativo
            'ultimo_login' => $this->faker->dateTimeBetween('-7 days', 'now'),
            'latitude' => $this->faker->latitude(-23.6821, -23.4829), // São Paulo aproximadamente
            'longitude' => $this->faker->longitude(-46.8754, -46.3651), // São Paulo aproximadamente
            'ultima_localizacao' => $this->faker->dateTimeBetween('-1 hour', 'now'),
        ];
    }
}
