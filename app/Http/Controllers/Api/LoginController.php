<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
 
    public function login(Request $request){
        try{
        $uservalidate = Validator::make($request->all(), 
        [
            "email"=> "required|email",
            "password"=> "required", 
        ]);

        if($uservalidate->fails()){
            return response()->json(
                [      
                    'status' => false,
                    'message' => 'Validation Error.',
                    "errors" => $uservalidate->errors(),        
                ]);
        }

        if(!Auth::attempt(request()->only("email","password"))){
            return response()->json(
            [  
                "status"=> false,
                "message"=> "Emails and password does not matched with our records",
                'errors' => $uservalidate->errors()
            ]);

        }
        $user = Auth::user();

        return response()->json(
            [
                "status" => true,
                "message" => "Login successfully. Redirecting you to Dashboard",
                'token' => $user->createToken("API TOKEN")->plainTextToken,
                'role' => $user->role,
                'id' => $user->id ,
                'firstName' => $user->firstName,
                'lastName' => $user->lastName,
                'branch_code' => $user->branch_code,
                'contact' => $user->contact,
                'signature' => $user->signature,
                'email' => $user->email,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}
