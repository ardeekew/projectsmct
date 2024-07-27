<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Approver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApproverController extends Controller
{
    /**
     * Display a listing of the approvers.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $approvers = Approver::all();
    
            return response()->json([
                'message' => 'Approvers retrieved successfully',
                'data' => $approvers,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving approvers',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified approver.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($userId)
    {
        try {
            $approver = Approver::where('user_id', $userId)->first();
    
            if (!$approver) {
                return response()->json([
                    'message' => 'Approver not found',
                ], 404);
            }
    
            return response()->json([
                'message' => 'Approver retrieved successfully',
                'data' => $approver,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
}
