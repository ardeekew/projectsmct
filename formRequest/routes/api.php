<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\RegisterController;
use App\Http\Controllers\API\LoginController;
use App\Http\Controllers\API\ForgotPasswordController;
use App\Http\Controllers\API\ResetPasswordController;
use App\Http\Controllers\API\RequestFormController;
use App\Http\Controllers\API\ChangePasswordController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post("register", [RegisterController::class,"register"]);
Route::post("login", [LoginController::class,"login"]);

Route::post("password/email", [ForgotPasswordController::class,"sendResetLinkEmail"])->name("password.forgot");
Route::post("password/reset", [ResetPasswordController::class,"reset"])->name("password.reset");
Route::post("change-password", [ChangePasswordController::class,"changePassword"])->name("change.password");

Route::post("create-request", [RequestFormController::class,"createRequest"])->name('create.request');
Route::put("update-request/{id}", [RequestFormController::class,"updateRequest"])->name('update.request');

