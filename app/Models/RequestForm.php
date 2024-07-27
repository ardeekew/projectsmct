<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequestForm extends Model
{
    use HasFactory;

    protected $fillable = [
        'form_type',
        'form_data',
        'user_id',
        'approvers_id',
        'attachment'
    ];

    protected $attributes = [
        'status' => '   Pending',
    ];

    protected $casts = [
        'attachment' => 'array'
    ];


    // Accessor to decode form_data
    public function getFormDataAttribute($value)
    {
        return json_decode($value, true);
    }

    // Mutator to encode form_data
    public function setFormDataAttribute($value)
    {
        $this->attributes['form_data'] = json_encode($value);
        $this->attributes['attachment'] = json_encode($value);
    }

    // Relationship definition
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function customApprover()
    {
        return $this->belongsTo(CustomApprovers::class, "custom_approvers_id");
    }

    public function approvalProcess()
    {
        return $this->hasMany(ApprovalProcess::class);
    }
    public function attachments()
    {

        return $this->hasMany(Attachment::class);

    }
}
