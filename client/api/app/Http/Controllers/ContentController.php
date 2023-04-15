<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Content;
use Exception;

class ContentController extends Controller
{

    public function index(){
        $contents = Content::where('listed',1)->where('deleted',0)->get();
        $contents = $contents->map(function ($content) {
            $content->content = mb_convert_encoding(mb_strlen($content->content) > 30 ? substr($content->content, 0, 60) . '...' : $content->content,'UTF-8');
            return $content;
        });
        
        $data =[
            'contents' => $contents,
        ];

        return response()->json($data,200);
    }

    public function getContents(Request $request){
        $contents = Content::where('user_address',$request->user_address)->get();
        $data =[
            'contents' => $contents,
        ];

        return response()->json($data,200);
    }

    public function save(Request $request){
        if($request->user_address == null || $request->title == null || $request->content == null){
            $data=[
                'message' => "you need require data"
            ];
            return response()->json($data,403);
        }

        //priceとparchase_methodはlistするタイミングでupdateされます。
        Content::create([
            'user_address' => $request->user_address,
            'title' => $request->title,
            'content' => $request->content,
            'thumbnail'=>$request->thumbnail,
            'price' => 0,
            'purchase_method' => 0,
        ]);

        $data = [
            'message'=>"Article successfully saved! "
        ];

        return response()->json($data,200);
    }


    public function list(Request $request){
        $content = Content::find($request->id);
        try{
            $content->update([
                'token_id' => $request->token_id,
                'listed' => 1,
                'price' => $request->price,
                'purchase_method' => $request->purchase_method,
                'ipfs_hash' => $request->ipfs_hash,
            ]);

            $data = ['message'=>"Article successfully listed! " ];
            return response()->json($data,200);


        }catch(Exception $e){
            echo $e;
            throw new Exception($e->getMessage());
        }
    }

    public function get(Request $request){
        $content = Content::find($request->content_id);
        $data =[
            'content' => $content,
        ];

        return response()->json($data,200);

    }
}
