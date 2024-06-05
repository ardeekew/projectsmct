<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
    public function login(Request $request){
        $uservalidate = Validator::make($request->all(), 
        [
            "email"=> "required|email",
            "password"=> "required", 
        ]);

        if($uservalidate->fails()){
            return response()->json(
                [    
                    "errors" => $uservalidate->errors(),        
                ]);
        }

        if(!Auth::attempt(request()->only("email","password"))){
            return response()->json(
            [  
                "status"=> false,
                "message"=> "Emails and password does not matched with our records",
            ]);

        }

        return response()->json(
            [
                "status" => true,
                "message" => "Login successfully. Redirecting you to Dashboard"
            ]);
    }
}
