<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Star;

class StarController extends Controller
{
    public function send(Request $request){
        $content_id = null;
        if($request->content_id != null){
            $content_id = $request->content_id;
        }
         Star::create([
            'sender' => $request->sender,
            'receiver' => $request->receiver,
            'content_id' => $content_id,
            'tx_hash' => $request->tx_hash,
        ]);


        $data = [
            'message'=>"Successfully send star for".$request->sender
        ];

        return response()->json($data,200);
    }
}
