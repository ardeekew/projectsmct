<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RequestForm;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class RequestFormController extends Controller
{
    public function createRequest(Request $request)
    {
        try {
            $validated = $request->validate([
                'form_type' => 'required|string',
                'form_data' => 'required|array'
            ]);

            $formType = $validated['form_type'];
            $formDataArray = $validated['form_data'];

            $validationRules = [
                'cash_advance' => [
                    'date' => 'required',
                    'department' => 'required',
                    'amount' => 'required',
                    'liquidation_date' => 'required',
                    'usage' => 'required',
                    'day' => 'required',
                    'itinerary' => 'required',
                    'activity' => 'required',
                    'hotel' => 'required',
                    'rate' => 'required',
                    'per_diem' => 'required',
                    'remarks' => 'required',
                ],
                'cash_disbursement' => [
                    'date' => 'required',
                    'branch' => 'required',
                    'quantity' => 'required',
                    'description' => 'required',
                    'unit_cost' => 'required',
                    'total_amount' => 'required',
                    'usage' => 'required',
                ],
                'liquidation' => [
                    'date' => 'required',
                    'purpose' => 'required',
                    'date_expense' => 'required',
                    'destination' => 'required',
                    'transportation_type' => 'required',
                    'amount' => 'required',
                    'hotel_name' => 'required',
                    'place' => 'required',
                    'per_diem' => 'required',
                    'particulars' => 'required',
                ],
                'purchase_order' => [
                    'date' => 'required',
                    'branch' => 'required',
                    'supplier' => 'required',
                    'address' => 'required',
                    'quantity' => 'required',
                    'description' => 'required',
                    'unit_cost' => 'required',
                    'total_amount' => 'required',
                    'usage' => 'required',
                ],
                'refund_request' => [
                    'branch' => 'required',
                    'date' => 'required',
                    'quantity' => 'required',
                    'description' => 'required',
                    'unit_cost' => 'required',
                    'total_amount' => 'required',
                    'usage' => 'required',
                ],
                'stock_requisition' => [
                    'purpose' => 'required',
                    'branch' => 'required',
                    'date' => 'required',
                    'quantity' => 'required',
                    'description' => 'required',
                    'unit_cost' => 'required',
                    'total_amount' => 'required',
                    'usage' => 'required',
                ],
            ];

            if (!isset($validationRules[$formType])) {
                return response()->json([
                    'message' => 'Invalid form type',
                ], 400);
            }

            DB::beginTransaction();

            $concatenatedFormData = [];
            foreach ($formDataArray as $formData) {
                // Check if all required fields are present and there are no extra fields
                $requiredFields = array_keys($validationRules[$formType]);
                $formDataFields = array_keys($formData);
                
                $missingFields = array_diff($requiredFields, $formDataFields);
                $extraFields = array_diff($formDataFields, $requiredFields);

                if (!empty($missingFields) || !empty($extraFields)) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Validation error',
                        'errors' => [
                            'missing_fields' => $missingFields,
                            'extra_fields' => $extraFields,
                        ],
                    ], 400);
                }

                $validator = Validator::make($formData, $validationRules[$formType]);
                if ($validator->fails()) {
                    DB::rollBack();
                    return response()->json([
                        'errors' => $validator->errors(),
                    ], 400);
                }

                $concatenatedFormData[] = $formData;
            }

            $encodedFormData = $concatenatedFormData;

            $requestForm = RequestForm::create([
                'form_type' => $formType,
                'form_data' => $encodedFormData,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Request forms created successfully',
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'An error occurred',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateRequest(Request $request, $id)
    {
        
    }
}


