<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    use HasFactory;
    protected $guarded = [
        'created_at',
    ];
    protected $fillable = [
        'user_address',
        'token_id',
        'listed',
        'deleted',
        'released',
        'title',
        'content',
        'thumbnail',
        'price',
        'purchase_method',
        'ipfs_hash',
    ];
}
