<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Approver;
use App\Models\Branch; // Add this line to import the 'Branch' class
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
class ApproverController extends Controller
{
    /**
     * Display a listing of the approvers.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getApprovers($userId)

    {
    
    try {
    
    
    // Fetch the ID for the 'HO' branch
    
    $HObranchID = Branch::where('branch_code', 'HO')->value('id');
    
    
    // Fetch approvers based on the branch ID
    
    $HOapprovers = User::where('branch_code', $HObranchID)
    
    ->where('role', 'approver')
    
    ->select('id','firstName','lastName','role','position','branch_code')
    
    ->get();
    
    // Find the requester by userId
    
    $requester = User::findOrFail($userId);
    
    $requesterBranch = (int) $requester->branch_code;
    
    
    $sameBranchApprovers = User::where('branch_code',$requesterBranch)
    
    ->where('role', 'approver')
    
    ->where('position','!=', 'Area Manager')
    
    ->select('id','firstName','lastName','role','position','branch_code')
    
    ->get();
    
    
    $areaManagerApprover = User::whereIn('id', function($query) use ($requesterBranch) {
    
    $query->select('user_id')
    
    ->from('area_managers')
    
    ->whereJsonContains('branch_id', $requesterBranch);
    
    })->get(['id','firstName','lastName','role','position','branch_code']);
    
    
    
    return response()->json([
    
    'message' => 'Approvers retrieved successfully',
    
    'HOApprovers' => $HOapprovers,
    
    'sameBranchApprovers' => $sameBranchApprovers,
    
    'areaManagerApprover' => $areaManagerApprover
    
    ], 200);
    
    
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
    
    return response()->json([
    
    'message' => 'User not found',
    
    'error' => $e->getMessage(),
    
    ], 404);
    
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
