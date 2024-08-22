<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\RequestForm;
use App\Models\CustomApprovers;
use App\Models\ApprovalProcess;
use Illuminate\Support\Facades\DB;
use App\Notifications\ApprovalProcessNotification;
use App\Notifications\EmployeeNotification;
use Illuminate\Support\Facades\Log;
use App\Notifications\ReturnRequestNotification;
use App\Notifications\PreviousReturnRequestNotification;
use App\Events\NotificationEvent;



class ApprovalProcessController extends Controller
{
    //FOR APPROVER SIDE 
    public function processRequestForm(Request $request, $request_form_id)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'action' => 'required|in:approve,disapprove',
            'comment' => 'nullable|string',
        ]);

        $user_id = $validated['user_id'];
        $action = $validated['action'];
        $comment = $validated['comment'];

        DB::beginTransaction();

        try {
            $requestForm = RequestForm::findOrFail($request_form_id);

            $approvalProcess = ApprovalProcess::where('request_form_id', $request_form_id)
                ->where('user_id', $user_id)
                ->where('status', 'Pending')
                ->first();

            if (!$approvalProcess) {
                return response()->json([
                    'message' => 'You are not authorized to approve this request form or it has already been processed.',
                ], 403);
            }

            $currentApprovalLevel = ApprovalProcess::where('request_form_id', $request_form_id)
                ->where('status', 'Pending')
                ->orderBy('level')
                ->first();

            if ($currentApprovalLevel->user_id !== $user_id) {
                return response()->json([
                    'message' => 'It is not your turn to approve this request form.',
                ], 403);
            }

            $approvalProcess->update([
                'status' => $action === 'approve' ? 'Approved' : 'Disapproved',
                'comment' => $comment,
            ]);

            if ($action === 'approve') {
                // Check if the current approver is the first approver
                $firstApprovalProcess = ApprovalProcess::where('request_form_id', $request_form_id)
                    ->orderBy('level')
                    ->first();

                if ($firstApprovalProcess && $firstApprovalProcess->user_id == $user_id) {
                    $requestForm->status = 'Ongoing';
                    $requestForm->save();
                }

                $nextApprovalProcess = ApprovalProcess::where('request_form_id', $request_form_id)
                    ->where('status', 'Pending')
                    ->orderBy('level')
                    ->first();

                if ($nextApprovalProcess) {
                    $nextApprover = $nextApprovalProcess->user;
                    $firstname = $nextApprover->firstName;
                    $employee = $requestForm->user;
                    $requesterFirstname = $employee->firstName;
                    $requesterLasttname = $employee->lastName;
                    $nextApprover->notify(new ApprovalProcessNotification($nextApprovalProcess, $firstname, $requestForm, $requesterFirstname, $requesterLasttname));

                    // Broadcast the notification count update
                    $notificationCount = $nextApprover->unreadNotifications()->count();
                    broadcast(new NotificationEvent($nextApprover, $notificationCount));

                } else {
                    $requestForm->status = 'Approved';
                    $formtype = $requestForm->form_type;
                    $requestForm->save();
                    $employee = $requestForm->user;
                    $firstname = $employee->firstName;
                    $employee->notify(new EmployeeNotification($requestForm, 'approved', $firstname, $formtype));

                    // Broadcast the notification count update
                    $notificationCount = $employee->unreadNotifications()->count();
                    broadcast(new NotificationEvent($employee, $notificationCount));
                }
            } else {
                $requestForm->status = 'Disapproved';
                $requestForm->save();
                $formtype = $requestForm->form_type;
                $employee = $requestForm->user;
                $firstname = $employee->firstName;
                $approverFirstname = $approvalProcess->user->firstName;
                $approverLastname = $approvalProcess->user->lastName;
                $employee->notify(new ReturnRequestNotification($requestForm, 'disapproved', $firstname, $approverFirstname, $approverLastname, $comment));

                // Broadcast the notification count update
                $notificationCount = $employee->unreadNotifications()->count();
                broadcast(new NotificationEvent($employee, $notificationCount));

                // Notify all previous approvers and update their status to "Rejected by [name]"
                $previousApprovalProcesses = ApprovalProcess::where('request_form_id', $request_form_id)
                    ->where('status', 'Approved')
                    ->orderBy('level', 'asc') // Ensure we are processing in order
                    ->get();

                foreach ($previousApprovalProcesses as $previousApprovalProcess) {
                    $previousApprover = $previousApprovalProcess->user;
                    $prevFirstName = $previousApprover->firstName;

                    // Update the previous approver's status to "Rejected by [name]"
                    $previousApprovalProcess->update([
                        'status' => "Rejected by $approverFirstname $approverLastname",
                     
                    ]);

                    $requesterFirstname = $employee->firstName;
                    $requesterLastname = $employee->lastName;
                    $previousApprover->notify(new PreviousReturnRequestNotification($requestForm, 'disapproved', $prevFirstName, $approverFirstname, $approverLastname, $comment, $requesterFirstname, $requesterLastname));

                    // Broadcast the notification count update
                    $notificationCount = $previousApprover->unreadNotifications()->count();
                    broadcast(new NotificationEvent($previousApprover, $notificationCount));
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Request form processed successfully',
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'An error occurred',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function getRequestFormsForApproval($user_id)
    {
        try {
            // Retrieve all approval processes where the current user is involved
            $approvalProcesses = ApprovalProcess::where('user_id', $user_id)
                ->orderBy('level')
                ->with(['requestForm.user', 'user']) // Eager load request form with user
                ->get();

            // Process each approval process
            $transformedApprovalProcesses = $approvalProcesses->map(function ($approvalProcess) use ($user_id) {
                $requestForm = $approvalProcess->requestForm;
                $requester = $requestForm->user; // Eager loaded user

                // Check if any previous level is disapproved
                $previousLevelsDisapproved = $requestForm->approvalProcess
                    ->where('level', '<', $approvalProcess->level)
                    ->contains('status', 'Disapproved');

                // Check if all previous levels are approved
                $previousLevelsApproved = $requestForm->approvalProcess
                    ->where('level', '<', $approvalProcess->level)
                    ->every(function ($process) {
                        return $process->status == 'Approved';
                    });

                // Determine if it's the user's turn to approve
                $isUserTurn = $previousLevelsApproved && $approvalProcess->status == 'Pending' && $approvalProcess->user_id == $user_id;

                // Include request forms where the previous level has statuses of Approved, Disapproved, or Rejected by...
                $isRelevantStatus = in_array($approvalProcess->status, ['Approved', 'Disapproved']) ||
                    preg_match('/^Rejected by/', $approvalProcess->status);

                if (!$isRelevantStatus && !$isUserTurn) {
                    return null; // Skip if the status is not relevant and it's not the user's turn to approve
                }

                // Determine if the current user is the last approver
                $isLastApprover = $requestForm->approvalProcess()
                    ->where('status', 'Pending')
                    ->where('level', '>', $approvalProcess->level)
                    ->count() === 0;

                // Determine if the request form has been disapproved
                $isDisapproved = $requestForm->approvalProcess()
                    ->where('status', 'Disapproved')
                    ->count() > 0;

                // Determine the next approver
                $pendingApproverr = $requestForm->approvalProcess()
                    ->where('status', 'Pending')
                    ->orderBy('level')
                    ->first()?->user; // Get the next approver

                // Prepare the response format
                $approver = $approvalProcess->user; // Eager loaded approver

                // Determine pending approver
                $pendingApprover = null;
                if ($isUserTurn && $isLastApprover) {
                    $pendingApprover = "{$approver->firstName} {$approver->lastName}";
                } elseif ($isDisapproved) {
                    $pendingApprover = 'No Pending Approver';
                } else {
                    $pendingApprover = $pendingApproverr ? "{$pendingApproverr->firstName} {$pendingApproverr->lastName}" : 'No Pending Approver';
                }

                return [
                    'id' => $requestForm->id,
                    'form_type' => $requestForm->form_type,
                    'form_data' => $requestForm->form_data, // Assuming form_data is JSON
                    'status' => $approvalProcess->status, // Include the actual status of the approval process
                    'created_at' => $approvalProcess->created_at,
                    'updated_at' => $approvalProcess->updated_at,
                    'user_id' => $requestForm->user_id,
                    'requested_by' => ($requester ? "{$requester->firstName} {$requester->lastName}" : "Unknown"), // Handle null requester
                    'approvers_id' => $approvalProcess->user_id, // Include approvers id
                    'pending_approver' => $pendingApprover, // Update pending approver logic
                    'attachment' => $requestForm->attachment,
                ];
            })->filter(); // Filter out null values

            return response()->json([
                'message' => 'Approval processes you are involved in',
                'request_forms' => $transformedApprovalProcesses->values(), // Ensure it's a zero-indexed array
            ], 200);

        } catch (\Exception $e) {
            // Log the exception for debugging purposes
            Log::error('Error in getRequestFormsForApproval', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'An error occurred',
                'error' => 'An error occurred while processing your request.',
            ], 500);
        }
    }



    //vIEW INDIVIDUAL REQUEST TO APPROVE
    public function viewSingleRequestForm($request_form_id)
    {
        try {
            // Fetch the request form
            $requestForm = RequestForm::findOrFail($request_form_id);

            // Fetch custom approvers for this specific request form
            $customApprovers = CustomApprovers::where('id', $requestForm->approvers_id)->first();
            $notedByIds = $customApprovers ? (is_array($customApprovers->noted_by) ? $customApprovers->noted_by : json_decode($customApprovers->noted_by, true)) : [];
            $approvedByIds = $customApprovers ? (is_array($customApprovers->approved_by) ? $customApprovers->approved_by : json_decode($customApprovers->approved_by, true)) : [];

            // Fetch noted by users and their approval statuses
            $notedBy = User::whereIn('id', $notedByIds)->select('id', 'firstName', 'lastName', 'position', 'signature', 'branch')->get()->keyBy('id');
            $notedStatus = ApprovalProcess::whereIn('user_id', $notedByIds)
                ->where('request_form_id', $request_form_id)
                ->pluck('status', 'user_id');


            $notedComment = ApprovalProcess::whereIn('user_id', $notedByIds)
                ->where('request_form_id', $request_form_id)
                ->pluck('comment', 'user_id');


            // Fetch approved by users and their approval statuses
            $approvedBy = User::whereIn('id', $approvedByIds)->select('id', 'firstName', 'lastName', 'position', 'signature', 'branch')->get()->keyBy('id');
            $approvedStatus = ApprovalProcess::whereIn('user_id', $approvedByIds)
                ->where('request_form_id', $request_form_id)
                ->pluck('status', 'user_id');


            $approvedComment = ApprovalProcess::whereIn('user_id', $approvedByIds)
                ->where('request_form_id', $request_form_id)
                ->pluck('comment', 'user_id');


            // Fetch comments for the request form
            /*  $comments = ApprovalProcess::where('request_form_id', $request_form_id)
                 //->whereIn('status', ['approved', 'disapproved'])
                 ->join('users', 'approval_processes.user_id', '=', 'users.id')
                 ->select('approval_processes.comment')
                 //->orderBy('approval_processes.level')
                 ->get(); */

            // Format notedby and approvedby according to the desired structure
            $formattedNotedBy = [];
            foreach ($notedByIds as $userId) {
                if (isset($notedBy[$userId])) {
                    $formattedNotedBy[] = [
                        'firstname' => $notedBy[$userId]->firstName,
                        'lastname' => $notedBy[$userId]->lastName,
                        'status' => $notedStatus[$userId] ?? '',
                        'comment' => isset($notedComment[$userId]) ? $notedComment[$userId] : '',
                        'position' => $notedBy[$userId]->position,
                        'signature' => $notedBy[$userId]->signature,

                    ];
                }
            }

            $formattedApprovedBy = [];
            foreach ($approvedByIds as $userId) {
                if (isset($approvedBy[$userId])) {
                    $formattedApprovedBy[] = [
                        'firstname' => $approvedBy[$userId]->firstName,
                        'lastname' => $approvedBy[$userId]->lastName,
                        'status' => $approvedStatus[$userId] ?? '',
                        'comment' => isset($approvedComment[$userId]) ? $approvedComment[$userId] : '',
                        'position' => $approvedBy[$userId]->position,
                        'signature' => $approvedBy[$userId]->signature,


                    ];
                }
            }

            $response = [
                'message' => 'Request form retrieved successfully',
                'request_form' => $requestForm,
                'notedby' => $formattedNotedBy,
                'approvedby' => $formattedApprovedBy,

            ];

            return response()->json($response, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving the request form',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


}