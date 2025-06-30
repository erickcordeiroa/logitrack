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
        Schema::create('rotas', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->text('descricao')->nullable();
            $table->foreignId('entregador_id')->nullable()->constrained('entregadors')->onDelete('set null');
            $table->enum('status', ['pendente', 'em_andamento', 'concluida', 'cancelada'])->default('pendente');
            $table->date('data_entrega');
            $table->time('hora_inicio')->nullable();
            $table->time('hora_fim')->nullable();
            $table->decimal('distancia_total', 8, 2)->nullable(); // em km
            $table->integer('valor_total')->default(0); // valor em centavos
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rotas');
    }
};
