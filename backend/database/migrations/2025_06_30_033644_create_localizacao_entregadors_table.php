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
        Schema::create('localizacao_entregadors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('entregador_id')->constrained('entregadors')->onDelete('cascade');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->decimal('precisao', 8, 2)->nullable(); // precisão em metros
            $table->decimal('velocidade', 8, 2)->nullable(); // velocidade em km/h
            $table->decimal('altitude', 8, 2)->nullable(); // altitude em metros
            $table->timestamp('registrada_em');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('localizacao_entregadors');
    }
};
