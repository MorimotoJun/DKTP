<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBuyHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('buy_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('content_id')->constrained();
            $table->char('buyer','42');
            $table->foreign('buyer')->references('address')->on('users');
            $table->string('tx_hash');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('buy_histories');
    }
}
