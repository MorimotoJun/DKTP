<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BuyHistory;
use App\Models\Content;

class BuyHistoryController extends Controller
{
    public function create(Request $request){
        BuyHistory::create([
            "content_id" => $request->content_id,
            "buyer" => $request->buyer,
            "tx_hash" => $request->tx_hash,
        ]);

         $data = [
            'message'=>"Successfully buy content"
        ];

        return response()->json($data,200);
    }

    public function getBuyhistory(Request $request){
        $content_ids = BuyHistory::where('buyer',$request->user_address)->pluck('content_id');
        $contents = Content::whereIn('id',$content_ids)->get();
        $data =[
            'contents' => $contents,
        ];

        return response()->json($data,200);
    }
}
