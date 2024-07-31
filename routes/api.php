<?php

use App\Http\Controllers\API\BranchController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\RegisterController;
use App\Http\Controllers\API\LoginController;
use App\Http\Controllers\API\ForgotPasswordController;
use App\Http\Controllers\API\ResetPasswordController;
use App\Http\Controllers\API\RequestFormController;
use App\Http\Controllers\API\ChangePasswordController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\CustomApproversController;
use App\Http\Controllers\API\ApproverController;
use App\Http\Controllers\API\AreaManagerController;
use App\Http\Controllers\API\ApprovalProcessController;
use App\Http\Controllers\API\AttachmentController;
use App\Http\Controllers\API\NotificationController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('edit-branch/{branch_id}', function ($branch_id) {
    return "Editing branch with ID: $branch_id";
});
Route::post("register", [RegisterController::class,"register"]);
Route::post("login", [LoginController::class,"login"]);


Route::put('change-password/{id}', [ChangePasswordController::class, 'changePassword'])->name('change.password');
Route::get("view-user/{id}", [UserController::class,"viewUser"])->name('view.user');
Route::get("view-users", [UserController::class,"viewAllUsers"])->name('view.users');
Route::post("update-profile/{id}", [UserController::class,"updateProfile"])->name('update.profile');
Route::put("update-role", [UserController::class,"updateRole"])->name('update.role');
Route::put("update-role/{id}", [UserController::class,"updateRole"])->name('update.role');
Route::delete("delete-user/{id}", [UserController::class,"deleteUser"])->name('delete.user');
Route::post("password/email", [UserController::class,"sendResetLinkEmail"])->name("password.forgot");
Route::post("password/reset", [UserController::class,"reset"])->name("password.reset");

//REQUEST FORM
Route::post("create-request", [RequestFormController::class,"createRequest"])->name('create.request');
Route::post("update-request/{id}", [RequestFormController::class,"updateRequest"])->name('update.request');
Route::middleware('auth:sanctum')->group(function () {
Route::middleware('auth')->get('/view-request', [RequestFormController::class, 'index']);
Route::middleware('auth')->get('/view-requests', [RequestFormController::class, 'viewAllRequests']);

//APPROVERS
Route::post('/approvers', [CustomApproversController::class, 'createApprovers']);
Route::get('/custom-approvers/{user_id}', [CustomApproversController::class, 'viewCustomApproversByUser']);
Route::get('/custom-approvers',[CustomApproversController::class, 'show']);
Route::get('/custom-approversID/{id}', [CustomApproversController::class, 'getCustomApproverById']);



//Setup Branch
Route::post("add-branch", [BranchController::class,"createBranch"])->name('create.branch');
Route::get("view-branch", [BranchController::class,"viewBranch"])->name('view.branch');
Route::get("view-branch/{id}", [BranchController::class,"viewBranch"])->name('view.branch');
Route::put("update-branch/{id}", [BranchController::class,"updateBranch"])->name('update.branch');
Route::delete("delete-branch/{id}", [BranchController::class,"deleteBranch"])->name('delete.branch');


Route::post("create-approvers", [CustomApproversController::class,"createApprovers"])->name('create.approvers');
Route::get('/view-approvers', [ApproverController::class, 'index']);
Route::get('/approvers/{id}', [ApproverController::class, 'show']);
});

//AREA MANAGER
Route::post("create-area-manager", [AreaManagerController::class,"createAreaManager"])->name('create.area.manager');
Route::put("update-area-manager/{id}", [AreaManagerController::class,"updateAreaManager"])->name('update.area.manager');
Route::get("view-area-manager/{id}", [AreaManagerController::class,"viewAreaManager"])->name('view.area.manager');
Route::get("view-area-managers", [AreaManagerController::class,"viewAllAreaManagers"])->name('view.area.managers');
Route::delete("delete-area-manager/{id}", [AreaManagerController::class,"deleteAreaManager"])->name('delete.area.manager');

//APPROVAL PROCESS
Route::put("request-forms/{request_form_id}/process", [ApprovalProcessController::class, 'processRequestForm'])->name('process.request.form');//APPROVAL PROCESS
Route::get('request-forms/for-approval/{user_id}', [ApprovalProcessController::class, 'getRequestFormsForApproval'])->name('get.request.form.for.approval');
Route::get('request-forms/{request_form_id}', [ApprovalProcessController::class, 'viewSingleRequestForm'])->name('view.single.request.form.for.approval');

//attachment
Route::post('/attachments', [AttachmentController::class, 'store']);
Route::post("attachments/upload/{requestFormId}", [RequestFormController::class,"uploadAttachments"])->name('upload.attachments');

//NOTIFICATION
Route::get('notifications/{id}/all', [NotificationController::class, 'getAllNotifications'])->name('get.all.notification');
Route::get('notifications/{id}', [NotificationController::class, 'getNotifications'])->name('get.notification');
Route::get('notifications/{id}/unread', [NotificationController::class, 'getUnreadNotifications'])->name('get.unread.notification');
Route::put('notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('get.mark.as.read.notification');
Route::get('notifications/{id}/count-unread-notification', [NotificationController::class, 'countUnreadNotifications'])->name('count.unread.notification');