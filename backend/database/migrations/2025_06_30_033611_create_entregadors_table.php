<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('entregadors', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('email')->unique();
            $table->string('telefone')->nullable();
            $table->string('cpf')->unique();
            $table->string('veiculo_tipo'); // moto, bicicleta, carro, etc
            $table->string('veiculo_placa')->nullable();
            $table->boolean('ativo')->default(true);
            $table->timestamp('ultimo_login')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->timestamp('ultima_localizacao')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entregadors');
    }
};
