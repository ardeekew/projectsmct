<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        try {
            $uservalidate = Validator::make($request->all(), [
                "firstname" => 'required|string|max:255',
                "lastname" => 'required|string|max:255',
                "contact" => 'required|string|max:255',
                "branch_code" => 'required|string|max:255',
                "username" => 'required|string|max:255',
                "email" => "required|email|unique:users,email",
                "password" => "required|min:5",
                "role" => 'required|string|max:255',
                'signature' => "required|longText"
            ]);

            if ($uservalidate->fails()) {
                return response()->json([
                    "errors" => $uservalidate->errors(),
                ]);
            }

            // Decode and save the signature
            $signature = $request->input('signature');
            $signature = str_replace('data:image/png;base64,', '', $signature);
            $signature = str_replace(' ', '+', $signature);
            $signatureData = base64_decode($signature);

            $fileName = 'signature_' . time() . '.png';
            $filePath = public_path('signatures/' . $fileName);

            if (!file_put_contents($filePath, $signatureData)) {
                return response()->json(['error' => 'Unable to save the signature file'], 500);
            }

            $user = User::create([
                "firstname" => $request->firstname,
                "lastname" => $request->lastname,
                "contact" => $request->contact,
                "branch_code" => $request->branch_code,
                "username" => $request->username,
                "email" => $request->email,
                "password" => bcrypt($request->password),
                "role" => $request->role,
                'signature' => $fileName // Save only the filename or file path in the database
            ]);

            return response()->json([
                "status" => true,
                "message" => "Registered Successfully",
                "token" => $user->createToken("API TOKEN")->plainTextToken
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "errors" => $th->getMessage(),
            ]);
        }
    }
}
