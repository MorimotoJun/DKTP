<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contents', function (Blueprint $table) {
            $table->id();
            $table->string('token_id')->nullable();
            $table->char('user_address','42');
            $table->foreign('user_address')->references('address')->on('users');
            $table->tinyInteger('listed')->default(0);
            $table->tinyInteger('deleted')->default(0);
            $table->longText('ipfs_hash')->nullable();
            $table->tinyInteger('purchase_method')->default(0);
            $table->string('price');
            $table->char('title',50);
            $table->longText('content');
            $table->longText('thumbnail')->nullable();
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
        Schema::dropIfExists('contents');
    }
}
