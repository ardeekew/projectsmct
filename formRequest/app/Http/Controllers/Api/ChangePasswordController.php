<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use app\Models\User;

class ChangePasswordController extends Controller
{
    
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = Auth::user();

        // Verify if the current password matches the user's password in the database
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['error' => 'Current password is incorrect.'], 422);
        }

        // Update the user's password
        $user->password = Hash::make($request->new_password);
        //$user->save();
        
        return response()->json(['success' => 'Password changed successfully.'], 200);
    }
}
