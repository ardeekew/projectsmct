<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'userName',
        'firstName',
        'lastName',
        'contact',
        'branch_code',
        'email',
        'password',
        'position', 
        'signature',
        'role',
        'employee_id',
        'branch',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function requestForms()
    {
        return $this->hasMany(RequestForm::class);
    }
    public function approvalSteps()
    {
        return $this->hasMany(ApprovalStep::class, 'approver_id');
    }
    public function approvers()
    {
        return $this->hasMany(Approver::class, 'user_id');
    }
    public function approver()
    {
        return $this->hasOne(Approver::class, 'user_id');
    }
    public function approvalProcess()
    {
        return $this->hasMany(ApprovalProcess::class);
    }
    // Approver model
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    /**
     * The default values for attributes.
     *
     * @var array<string, mixed>
     */
  

    /**
     * The primary key for the model.
     *
     * @var string
     */

}
