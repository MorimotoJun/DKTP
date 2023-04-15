<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    private function existenceCheck($user_address){
        $user = User::where('address',$user_address)->exists();
        return $user;
    }
    public function register(Request $request){
        if(!$request->user_address){
            return;
        }

       $user = $this->existenceCheck($request->user_address);
       if($user){
        $user_info = User::find($request->user_address);
        $created = $user_info->created_at->format('Y-m-d H:i:s');
         $data = [
            'message' => "you are already registing at".$created,
        ];
        return response()->json($data,200);
       }

       $user = User::create([
        'address' => $request->user_address,
        'name' => "account"
       ]);

       $data = [
        'message' => "you success to registing"
       ];

       return response()->json($data,200);


    }
}
