<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//user address store in DB when user connect wallet on this service first time
Route::post('/user/register', [UserController::class, 'register']);

// save article data
Route::post('content/save', [ContentController::class, 'save']);

// update content data when content was listed
Route::post('content/list', [ContentController::class, 'list']);

// send star 
Route::post('star/send', [StarController::class, 'send']);