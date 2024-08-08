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
                $nextApprover->notify(new ApprovalProcessNotification($nextApprovalProcess, $firstname,$requestForm,$requesterFirstname,$requesterLasttname));

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

            // Notify previous approver
            $previousApprovalProcess = ApprovalProcess::where('request_form_id', $request_form_id)
                ->where('status', 'Approved')
                ->orderBy('level', 'desc')
                ->first();

            if ($previousApprovalProcess) {
                $previousApprover = $previousApprovalProcess->user;
                $prevFirstName = $previousApprover->firstName;
                $requesterFirstname = $employee->firstName;
                $requesterLastname = $employee->lastName;
                $previousApprover->notify(new PreviousReturnRequestNotification($requestForm, 'disapproved', $prevFirstName, $approverFirstname, $approverLastname, $comment,$requesterFirstname,$requesterLastname));

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

                ->whereIn('status', ['Pending', 'Approved', 'Disapproved'])

                ->orderBy('level')

                ->with(['requestForm'])

                ->get();


            // Process each approval process

            $transformedApprovalProcesses = $approvalProcesses->map(function ($approvalProcess) use ($user_id) {

                // Get the associated request form details

                $requestForm = $approvalProcess->requestForm;


                // Check if all previous levels are approved or disapproved

                $previousLevelsApproved = $requestForm->approvalProcess

                    ->filter(function ($process) use ($approvalProcess) {

                        return $process->level < $approvalProcess->level;

                    })

                    ->every(function ($process) {

                        return in_array($process->status, ['Approved', 'Disapproved']);

                    });


                if (!$previousLevelsApproved) {

                    return null; // Skip if previous levels are not approved or disapproved

                }


                // Determine the status for the current approval process

                $status = $approvalProcess->status;


                // Prepare the response format

                return [

                    //'user_id' => $approvalProcess->user_id,

                    'id' => $approvalProcess->requestForm->id,

                    'form_type' => $approvalProcess->requestForm->form_type,

                    'form_data' => $approvalProcess->requestForm->form_data, // Assuming form_data is JSON

                    'status' => $status,

                    'created_at' => $approvalProcess->created_at,

                    'updated_at' => $approvalProcess->updated_at,

                    'user_id' => $approvalProcess->requestForm->user_id,

                    'approvers_id' => $approvalProcess->requestForm->approvers_id,

                    'attachment' => $approvalProcess->requestForm->attachment,


                ];

            })->filter(); // Filter out null values


            return response()->json([

                'message' => 'Approval processes you are involved in',

                'request_forms' => $transformedApprovalProcesses->values(), // Ensure it's a zero-indexed array

            ], 200);


        } catch (\Exception $e) {


            return response()->json([

                'message' => 'An error occurred',

                'error' => $e->getMessage(),

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