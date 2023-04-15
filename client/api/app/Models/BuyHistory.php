<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuyHistory extends Model
{
    use HasFactory;

    protected $guarded = [
        'created_at',
    ];
    
    protected $fillable = [
        'content_id',
        'buyer',
        'tx_hash',
    ];
}
