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
    ];

    // Define individual field arrays
   

    // Accessor to decode form_data
    public function getFormDataAttribute($value)
    {
        return json_decode($value, true);
    }

    // Mutator to encode form_data
    public function setFormDataAttribute($value)
    {
        $this->attributes['form_data'] = json_encode($value);
    }
   
    // Relationship definition
    public function form()
    {
        return $this->belongsTo(RequestForm::class);
    }

}

