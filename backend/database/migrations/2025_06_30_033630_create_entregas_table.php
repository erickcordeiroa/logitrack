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
        Schema::create('entregas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rota_id')->constrained('rotas')->onDelete('cascade');
            $table->string('codigo_rastreamento')->unique();
            $table->string('cliente_nome');
            $table->string('cliente_telefone')->nullable();
            $table->text('endereco_origem');
            $table->decimal('origem_latitude', 10, 8);
            $table->decimal('origem_longitude', 11, 8);
            $table->text('endereco_destino');
            $table->decimal('destino_latitude', 10, 8);
            $table->decimal('destino_longitude', 11, 8);
            $table->enum('status', ['pendente', 'coletada', 'em_transito', 'entregue', 'cancelada'])->default('pendente');
            $table->integer('valor_entrega')->default(0); // valor em centavos
            $table->decimal('peso', 8, 2)->nullable(); // em kg
            $table->text('observacoes')->nullable();
            $table->integer('ordem_na_rota'); // ordem de entrega na rota
            $table->timestamp('coletada_em')->nullable();
            $table->timestamp('entregue_em')->nullable();
            $table->text('foto_comprovante')->nullable(); // URL da foto
            $table->text('assinatura_cliente')->nullable(); // base64 da assinatura
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entregas');
    }
};
