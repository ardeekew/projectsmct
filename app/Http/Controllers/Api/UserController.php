<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMail;

class UserController extends Controller
{
    //REGISTRATION
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
                'signature' => "required",
                "employee_id" => "required",
                'profile_picture' => 'nullable|file|mimes:png,jpg,jpeg'
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
                "signature" => $fileName, // Save only the filename or file path in the database
                "employee_id" => $request->employee_id

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

    //LOGIN 
    public function login(Request $request)
    {
        $uservalidate = Validator::make(
            $request->all(),
            [
                "email" => "required|email",
                "password" => "required",
            ]
        );

        if ($uservalidate->fails()) {
            return response()->json(
                [
                    "errors" => $uservalidate->errors(),
                ]
            );
        }

        if (!Auth::attempt(request()->only("email", "password"))) {
            return response()->json(
                [
                    "status" => false,
                    "message" => "Emails and password does not matched with our records",
                ]
            );

        }

        return response()->json(
            [
                "status" => true,
                "message" => "Login successfully. Redirecting you to Dashboard"
            ]
        );
    }
    //FORGOT PASSWORD
    public function sendResetLinkEmail(Request $request)
    {

        $request->validate(['email' => 'required|email|exists:users,email']);


        $user = User::where('email', $request->email)->first();


        if (!$user) {

            return response()->json(['message' => 'We can\'t find a user with that email address.'], 404);

        }


        // Generate a 6-letter password

        $newPassword = Str::random(6);


        // Hash the new password

        $hashedPassword = Hash::make($newPassword);


        // Update the user's password

        $user->password = $hashedPassword;

        $user->save();


        // Send the new password to the user

        $firstname = $user->firstName;


        Mail::to($user->email)->send(new ResetPasswordMail($newPassword, $firstname));


        return response()->json(['message' => 'We have sent your new password to your email.'], 200);

    }


    //RESET PASSWORD
    public function reset(Request $request)
    {

        $request->validate([
            'token' => 'required',
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:8|confirmed',
        ]);


        $updatePassword = DB::table('password_reset_tokens')
            ->where([
                "email" => $request->email,
                "token" => $request->token,
            ])->first();

        if (!$updatePassword) {
            return response()->json(['message' => 'Invalid.'], 400);
        }

        User::where("email", $request->email)
            ->update(["password" => Hash::make($request->password)]);

        DB::table(table: "password_reset_tokens")
            ->where(["email" => $request->email])
            ->delete();

        return response()->json(['message' => 'Password reset successfully.'], 200);
    }

    //PROFILE - CHANGE PASSWORD
    public function changePassword(Request $request, $id)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::findOrFail($id); // Retrieve the user by ID

        // Verify if the current password matches the user's password in the database
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['error' => 'Current password is incorrect.'], 422);
        }

        // Update the user's password
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['success' => 'Password changed successfully.'], 200);
    }
    //VIEW USER


    public function viewUser($id)
    {
        try {

            $user = User::findOrFail($id);

            return response()->json([
                'message' => 'Users retrieved successfully',
                'data' => $user,
                'status' => true,

            ], 200);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Users not found',
            ], 404);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'An error occurred while retrieving the user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    //VIEW ALL USERS
    public function viewAllUsers()
    {
        try {

            $users = User::select('id', 'firstname', 'lastname', 'branch_code', 'email', 'username', 'role', 'position', 'contact', 'employee_id', 'branch')->get();

            return response()->json([
                'message' => 'Users retrieved successfully',
                'data' => $users
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    //UPDATE PROFILE
    public function updateProfile(Request $request, $id)
    {
        try {
            // Validate the incoming request
            $validated = $request->validate([
                'firstName' => 'required|string|max:255',
                'lastName' => 'required|string|max:255',
                'contact' => 'required|string|max:255',
                'branch_code' => 'required',
                'userName' => 'required|string|max:255',
                'email' => 'required|email',
                'position' => 'required|string|max:255',
                'profile_picture' => 'nullable|file|mimes:png,jpg,jpeg',
            ]);

            $user = User::findOrFail($id);


            DB::beginTransaction();


            // Save the profile picture if provided
            if ($request->hasFile('profile_picture')) {
                $profilePicture = $request->file('profile_picture');
                $profilePicturePath = $profilePicture->store('profile_pictures', 'public');
                $user->profile_picture = $profilePicturePath; // Save only the path
            }

            // Update the user details
            $user->fill($validated);
            $user->save();

            DB::commit();

            return response()->json([
                'message' => 'User updated successfully',
                'data' => $user
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation Error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'An error occurred while updating the user',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    public function updateRole(Request $request, $id = null)
    {
        try {
            // Validate request
            $request->validate([
                'role' => 'required|string|max:255',
                'userIds' => 'required|array',
            ]);

            $role = $request->input('role');
            $userIds = $request->input('userIds');

            // Fetch users to update
            $users = User::whereIn('id', $userIds)->get();

            foreach ($users as $user) {
                $user->role = $role;
                $user->save();

                // Log the updated user ID
                Log::info('User role updated: ' . $user->id);
            }

            return response()->json([
                'message' => 'Users roles updated successfully',
                'data' => $users,
            ], 200);

        } catch (\Exception $e) {
            Log::error('An error occurred while updating users roles: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update users roles',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    //DELETE USER
    public function deleteUser($id)
    {
        try {

            $user = User::findOrFail($id);

            $user->delete();

            return response()->json([
                'message' => 'User deleted successfully',
            ], 200);

        } catch (\Exception $e) {
            Log::error('An error occurred while deleting the user: ' . $e->getMessage());
            return response()->json([
                'message' => 'An error occurred while deleting the user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}