import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextInput, Checkbox } from '../../../components/FormElements';

interface OperationSupportFormData {
  // Personal Details
  fullName: string;
  mobileNumber: string;
  healthCardNumber: string;
  email: string;
  
  // Patient Details
  patientName: string;
  age: string;
  gender: string;
  relationship: string;
  
  // Treatment Details
  hospitalName: string;
  doctorName: string;
  expectedOperationDate: string;
  typeOfOperation: string;
  estimatedCost: string;
  
  // Financial Condition
  monthlyIncome: string;
  numberOfFamilyMembers: string;
  insurance: string;
  requiredSupport: string;
  
  // Additional Information
  description: string;
  
  // Declaration
  declaration: boolean;
}

const OperationSupportForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<OperationSupportFormData>({
    defaultValues: {
      gender: 'Male',
      insurance: 'No',
      requiredSupport: '10-20%',
      declaration: false,
    },
  });

  const onSubmit = (data: OperationSupportFormData) => {
    console.log('Form submitted:', data);
    // TODO: Handle form submission (API call)
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Operation Support Form</h1>
        <p className="text-gray-600 mt-2">Apply for financial support for medical operations</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Details */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Personal Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Full Name"
                placeholder=""
                {...register('fullName', { required: 'Full Name is required' })}
                error={errors.fullName?.message}
                required
              />
              
              <TextInput
                label="Mobile Number"
                placeholder=""
                type="tel"
                {...register('mobileNumber', { 
                  required: 'Mobile Number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Please enter a valid 10-digit mobile number'
                  }
                })}
                error={errors.mobileNumber?.message}
                required
              />
              
              <TextInput
                label="Health Card Number"
                placeholder=""
                {...register('healthCardNumber')}
                error={errors.healthCardNumber?.message}
              />
              
              <TextInput
                label="Email"
                placeholder=""
                type="email"
                {...register('email', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
                error={errors.email?.message}
              />
            </div>
          </div>
        </div>

        {/* Patient Details */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Patient Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Patient Name"
                placeholder=""
                {...register('patientName', { required: 'Patient Name is required' })}
                error={errors.patientName?.message}
                required
              />
              
              <TextInput
                label="Age"
                placeholder=""
                type="number"
                {...register('age', { 
                  required: 'Age is required',
                  min: { value: 0, message: 'Age must be positive' }
                })}
                error={errors.age?.message}
                required
              />
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Gender <span className="text-error">*</span></span>
                </label>
                <select
                  className={`select select-bordered w-full ${errors.gender ? 'select-error' : ''}`}
                  {...register('gender', { required: 'Gender is required' })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.gender.message}</span>
                  </label>
                )}
              </div>
              
              <TextInput
                label="Relationship"
                placeholder="Self / Family Member"
                {...register('relationship', { required: 'Relationship is required' })}
                error={errors.relationship?.message}
                required
              />
            </div>
          </div>
        </div>

        {/* Treatment Details */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Treatment Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Hospital Name"
                placeholder="Optional"
                {...register('hospitalName')}
                error={errors.hospitalName?.message}
              />
              
              <TextInput
                label="Doctor Name"
                placeholder="Optional"
                {...register('doctorName')}
                error={errors.doctorName?.message}
              />
              
              <TextInput
                label="Expected Operation Date"
                type="date"
                {...register('expectedOperationDate')}
                error={errors.expectedOperationDate?.message}
              />
              
              <TextInput
                label="Type of Operation"
                placeholder="Optional"
                {...register('typeOfOperation')}
                error={errors.typeOfOperation?.message}
              />
              
              <TextInput
                label="Estimated Cost (₹)"
                placeholder="Optional"
                type="number"
                {...register('estimatedCost')}
                error={errors.estimatedCost?.message}
              />
            </div>
          </div>
        </div>

        {/* Financial Condition */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Financial Condition</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Monthly Income (₹)"
                placeholder=""
                type="number"
                {...register('monthlyIncome')}
                error={errors.monthlyIncome?.message}
              />
              
              <TextInput
                label="Number of Family Members"
                placeholder=""
                type="number"
                {...register('numberOfFamilyMembers')}
                error={errors.numberOfFamilyMembers?.message}
              />
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Insurance?</span>
                </label>
                <select
                  className={`select select-bordered w-full ${errors.insurance ? 'select-error' : ''}`}
                  {...register('insurance')}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
                {errors.insurance && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.insurance.message}</span>
                  </label>
                )}
              </div>
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Required Support <span className="text-error">*</span></span>
                </label>
                <select
                  className={`select select-bordered w-full ${errors.requiredSupport ? 'select-error' : ''}`}
                  {...register('requiredSupport', { required: 'Required Support is required' })}
                >
                  <option value="10-20%">10-20%</option>
                  <option value="20-40%">20-40%</option>
                  <option value="40-60%">40-60%</option>
                  <option value="60-80%">60-80%</option>
                  <option value="80-100%">80-100%</option>
                </select>
                {errors.requiredSupport && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.requiredSupport.message}</span>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">Additional Information</h2>
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Description / Notes</span>
              </label>
              <textarea
                className={`textarea textarea-bordered h-32 ${errors.description ? 'textarea-error' : ''}`}
                placeholder="Please provide any additional information that may help us process your request..."
                {...register('description')}
              />
              {errors.description && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.description.message}</span>
                </label>
              )}
            </div>
            
            <div className="alert alert-info mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-sm">
                <strong>Note:</strong> Document upload feature will be available after form submission. Please keep ready: Prescription, Hospital Estimate, Previous Reports, and ID Proof.
              </span>
            </div>
          </div>
        </div>

        {/* Declaration */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <Controller
              name="declaration"
              control={control}
              rules={{ required: 'You must accept the declaration to proceed' }}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  label="I declare that the information provided above is true and accurate to the best of my knowledge. I understand that any false information may result in rejection of my application."
                  error={errors.declaration?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button type="submit" className="btn btn-primary btn-wide btn-lg">
            Submit Operation Support Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default OperationSupportForm;
