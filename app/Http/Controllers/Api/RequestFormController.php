<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CustomApprovers;
use App\Models\ApprovalProcess;
use Illuminate\Http\Request;
use App\Models\RequestForm;
use App\Models\User;
use App\Models\Attachment;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use App\Notifications\ApprovalProcessNotification;
use App\Events\NotificationEvent;



class RequestFormController extends Controller
{

    //CREATE REQUEST    
    public function createRequest(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'form_type' => 'required|string',
                'form_data' => 'required|string', // Temporarily string for decoding
                'approvers_id' => 'required|exists:custom_approvers,id',
              'attachment.*' => 'file|mimes:pdf,png,jpg,jpeg',
            ]);

            $userID = $validated['user_id'];
            $formType = $validated['form_type'];
            $formDataString = $validated['form_data']; // JSON string from request
            $customApproversId = $validated['approvers_id'];

            // Decode JSON string to array
            $formDataArray = json_decode($formDataString, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json([
                    'message' => 'Invalid JSON format in form_data',
                ], 400);
            }

            $validationRules = [
                'Application For Cash Advance' => [
                    "date" => 'required',
                    "department" => 'required',
                    "amount" => 'required',
                    "liquidation_date" => 'required',
                    "usage" => 'required',
                    "items" => [
                        "date" => 'required',
                        'day' => 'required',
                        'itinerary' => 'required',
                        'activity' => 'required',
                        'hotel' => 'required',
                        'rate' => 'required',
                        'per_diem' => 'required',
                        'remarks' => 'required',
                    ],
                    'boat_fare' => 'required',
                    'hotel_amount' => 'required',
                    'per_diem_amount' => 'required',
                    'fare' => 'required',
                    'contingency' => 'required',
                ],
                'Cash Disbursement Requisition Slip' => [
                    'date' => 'required',
                    //'branch' => 'required',
                    'items' => [
                        'quantity' => 'required',
                        'description' => 'required',
                        'unit_cost' => 'required',
                        'total_amount' => 'required',
                        'usage' => 'required',
                    ]
                ],
                'Liquidation of Actual Expense' => [
                    'date' => 'required',
                    'purpose' => 'required',
                    'items' => [
                        'date_expense' => 'required',
                        'destination' => 'required',
                        'transportation_type' => 'required',
                        'amount' => 'required',
                        'hotel_name' => 'required',
                        'place' => 'required',
                        'per_diem' => 'required',
                        'particulars' => 'required',
                    ]
                ],
                'Purchase Order Requisition Slip' => [
                    'date' => 'required',
                    //'branch' => 'required',
                    'supplier' => 'required',
                    'address' => 'required',
                    "items" => [
                        'quantity' => 'required',
                        'description' => 'required',
                        'unit_cost' => 'required',
                        'total_amount' => 'required',
                        'usage' => 'required',
                    ]
                ],
                'Refund Request' => [
                    //'branch' => 'required',
                    'date' => 'required',
                    "items" => [
                        'quantity' => 'required',
                        'description' => 'required',
                        'unit_cost' => 'required',
                        'total_amount' => 'required',
                        'usage' => 'required',
                    ]
                ],
                'Stock Requisition Slip' => [
                    'purpose' => 'required',
                    //'branch' => 'required',
                    'date' => 'required',
                    "items" => [
                        'quantity' => 'required',
                        'description' => 'required',
                        'unit_cost' => 'required',
                        'total_amount' => 'required',
                        'usage' => 'required',
                    ]
                ],
            ];

            if (!isset($validationRules[$formType])) {
                return response()->json([
                    'message' => 'Invalid form type',
                ], 400);
            }

            $customApprovers = CustomApprovers::findOrFail($customApproversId);
            $notedByIds = is_array($customApprovers->noted_by) ? $customApprovers->noted_by : json_decode($customApprovers->noted_by, true);
            $approvedByIds = is_array($customApprovers->approved_by) ? $customApprovers->approved_by : json_decode($customApprovers->approved_by, true);

            if (empty($notedByIds) || empty($approvedByIds)) {
                return response()->json([
                    'message' => 'Custom approvers configuration is invalid',
                ], 400);
            }

            DB::beginTransaction();

            $encodedFormData = [];

            foreach ($formDataArray as $key => $formData) {
                if ($key !== 'items') {
                    $encodedFormData[$key] = $formData;
                    continue;
                }

                $items = [];
                foreach ($formData as $item) {
                    $validator = Validator::make($item, $validationRules[$formType]['items']);
                    if ($validator->fails()) {
                        DB::rollBack();
                        return response()->json([
                            'errors' => $validator->errors(),
                        ], 400);
                    }
                    $items[] = $item;
                }

                $encodedFormData['items'] = $items;
            }

            $filePaths = [];
            if ($request->hasFile('attachment')) {
                $files = is_array($request->file('attachment')) ? $request->file('attachment') : [$request->file('attachment')];

                foreach ($files as $file) {
                    $filePath = $file->store('attachments', 'public');
                    if (!$filePath) {
                        DB::rollBack();
                        return response()->json([
                            'message' => 'File upload failed',
                        ], 500);
                    }
                    $filePaths[] = $filePath;
                }
            }

            $requestForm = RequestForm::create([
                'user_id' => $userID,
                'form_type' => $formType,
                'form_data' => $encodedFormData,
                'approvers_id' => $customApproversId,
                'attachment' => json_encode($filePaths) // Store file paths directly in request_forms
            ]);

            $level = 1;
            $firstApprover = null;
            foreach ($notedByIds as $notedBy) {
                ApprovalProcess::create([
                    'user_id' => $notedBy,
                    'request_form_id' => $requestForm->id,
                    'custom_approvers_id' => $customApproversId,
                    'level' => $level,
                    'status' => 'Pending',
                ]);

                if ($level === 1) {
                    $firstApprover = $notedBy;
                }

                $level++;
            }

            foreach ($approvedByIds as $approvedBy) {
                ApprovalProcess::create([
                    'user_id' => $approvedBy,
                    'request_form_id' => $requestForm->id,
                    'custom_approvers_id' => $customApproversId,
                    'level' => $level,
                    'status' => 'Pending',
                ]);
                $level++;
            }
            // Retrieve requester's first name and last name
         $requester = User::find($userID);
         $requesterFirstName = $requester->firstName;
         $requesterLastName = $requester->lastName;

            if ($firstApprover) {
                $firstApproverUser = User::find($firstApprover);
                if ($firstApproverUser) {
                    $firstApprovalProcess = ApprovalProcess::where('request_form_id', $requestForm->id)
                        ->where('user_id', $firstApprover)
                        ->where('level', 1)
                        ->first();

                    $firstname = $firstApproverUser->firstname;
                    $firstApproverUser->notify(new ApprovalProcessNotification($firstApprovalProcess,$firstname,$requestForm,$requesterFirstName,$requesterLastName));

                    $notificationCount = $firstApproverUser->unreadNotifications()->count();
                    broadcast(new NotificationEvent($firstApproverUser->id, $notificationCount));

                    //$firstApproverUser->notify(new ApprovalProcessNotification($firstApprovalProcess, $firstname));
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Request forms created successfully',
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Request form creation failed', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'An error occurred',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function updateRequest(Request $request, $id)
{
    try {
        // Find the request form by ID
        $form_data = RequestForm::findOrFail($id);

        // Decode JSON strings
        $form_data_content = json_decode($request->input('form_data'), true);
        $approvers_id = json_decode($request->input('approvers_id'), true);

        // Initialize attachment paths
        $attachment_paths = [];

        // Process existing attachments
        foreach ($request->all() as $key => $value) {
            if (strpos($key, 'attachment_url_') === 0) {
                $attachment_paths[] = 'attachments/' . $value;
            }
        }

        // Process new attachments
        if ($request->hasFile('new_attachments')) {
            foreach ($request->file('new_attachments') as $file) {
                $path = $file->store('attachments', 'public');
                $attachment_paths[] = $path;
            }
        }

        // Update the request form data including attachment
        $form_data->update([
            'form_data' => $form_data_content,
            'approvers_id' => $approvers_id,
            'attachment' => !empty($attachment_paths) ? json_encode($attachment_paths) : $form_data->attachment,
            'updated_at' => $request->input('updated_at'),
        ]);

        return response()->json(['message' => 'Request form updated successfully'], 200);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to update request form',
            'error' => $e->getMessage(),
        ], 500);
    }
}

    
    
    


    public function uploadAttachments(Request $request, $requestFormId)
    {

        $requestForm = RequestForm::findOrFail($requestFormId);
        $attachmentIds = [];

        if ($request->hasFile('attachment')) {
            foreach ($request->file('attachment') as $file) {
                $filePath = $file->store('attachments', 'public');
                $fileName = $file->getClientOriginalName();

                if (!$filePath) {
                    return response()->json([
                        'message' => 'File upload failed',
                    ], 500);
                }

                $attachment = Attachment::create([
                    'file_name' => $fileName,
                    'file_path' => $filePath,
                    'request_form_id' => $requestFormId,
                ]);

                $attachmentIds[] = $attachment->id;
            }
        }

        if (!empty($attachmentIds)) {
            $requestForm->update([
                'attachment' => $attachmentIds,
            ]);
        }

        return response()->json([
            'message' => "Attachment uploaded successfully"
        ]);
    }
    //VIEW REQUEST
    public function viewRequest($id)
    {
        try {

            $requestForm = RequestForm::findOrFail($id);

            return response()->json([
                'message' => 'Request form retrieved successfully',
                'data' => $requestForm
            ], 200);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Request form not found',
            ], 404);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'An error occurred while retrieving the request form',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    //VIEW REQUEST FORM CREATED BY SPECIFIC USER

    public function index()
    {
        try {

            $currentUserId = auth()->user()->id; // Example of fetching current user's ID

            // Fetch only request forms where user_id matches the current user's ID
            $requestForms = RequestForm::where('user_id', $currentUserId)
                ->select('id', 'user_id', 'form_type', 'form_data', 'status', 'approvers_id', 'attachment')
                ->get();

            return response()->json([
                'message' => 'Request forms retrieved successfully',
                'data' => $requestForms
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving request forms',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    //VIEW ALL REQUEST FORM OF ALL USERS
    public function viewAllRequests()
    {
        try {

            $users = RequestForm::select('id', 'user_id', 'form_type', 'form_data', 'approvers_id', 'status', 'attachment')->get();

            return response()->json([
                'message' => 'Request form retrieved successfully',
                'data' => $users
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving request form',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    //DELETE REQUEST
    public function deleteRequest($id)
    {
        try {

            $user = RequestForm::findOrFail($id);

            $user->delete();

            return response()->json([
                'message' => 'Request form deleted successfully',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while deleting the request form',
                'error' => $e->getMessage()
            ], 500);
        }
    }



}