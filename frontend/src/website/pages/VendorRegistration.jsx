import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { StepIndicator } from '../components/StepIndicator';
import { Building2, Briefcase, CreditCard, Shield, Plus } from 'lucide-react';

import styles from './styles/vendorRegistration.module.css';

const steps = [
    { name: 'Registration' },
    { name: 'Documents' },
    { name: 'Agreement' },
    { name: 'Sign' }
];

export function VendorRegistration() {
    const navigate = useNavigate();

    // State for standard form fields
    const [formData, setFormData] = useState({
        businessName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        accountHolderName: '',
        accountNumber: '',
        ifscCode: '',
        upiId: '',
        gstNumber: '',
        aadhar: '',
        pan: ''
    });

    const [errors, setErrors] = useState({});
    const [submissionError, setSubmissionError] = useState('');
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    // State for dynamic services
    const [services, setServices] = useState([
        {
            id: Date.now(),
            selectedService: 'AC Service',
            experience: '',
            customServiceName: '',
            customExperience: '',
            customDescription: '',
        },
    ]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddService = () => {
        setServices([
            ...services,
            {
                id: Date.now(),
                selectedService: '',
                experience: '',
                customServiceName: '',
                customExperience: '',
                customDescription: '',
            },
        ]);
    };

    const handleServiceChange = (id, field, value) => {
        setServices(
            services.map((service) =>
                service.id === id ? { ...service, [field]: value } : service
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSubmissionError('');

        const requiredFields = [
            'businessName',
            'contactPerson',
            'email',
            'phone',
            'address',
            'accountHolderName',
            'accountNumber',
            'ifscCode',
            'upiId',
            'aadhar',
            'pan'
        ];

        const validationErrors = {};

        requiredFields.forEach((field) => {
            if (!formData[field]?.trim()) {
                validationErrors[field] = 'This field is required';
            }
        });

        const ifscCode = formData.ifscCode?.trim() || '';
        if (ifscCode && !/^[A-Za-z]{4}[0-9]{7}$/.test(ifscCode)) {
            validationErrors.ifscCode = 'Enter a valid IFSC code (4 letters and 7 numbers)';
        }

        const upiId = formData.upiId?.trim() || '';
        if (upiId && !upiId.includes('@')) {
            validationErrors.upiId = 'UPI ID must contain @';
        }

        const gstNumber = formData.gstNumber?.trim() || '';
        if (gstNumber && gstNumber.length !== 12) {
            validationErrors.gstNumber = 'GST Number must be 12 characters';
        }

        const aadhar = formData.aadhar?.trim() || '';
        if (aadhar && !/^\d{12}$/.test(aadhar)) {
            validationErrors.aadhar = 'Aadhaar must be 12 digits';
        }

        const pan = formData.pan?.trim() || '';
        if (pan && pan.length !== 10) {
            validationErrors.pan = 'PAN must be 10 characters';
        }

        services.forEach((service, index) => {
            if (!service.selectedService) {
                validationErrors[`service_${index}_selectedService`] = 'Please choose a service';
            }
            if (service.selectedService !== 'Other' && !service.experience?.trim()) {
                validationErrors[`service_${index}_experience`] = 'Please enter experience';
            }
            if (service.selectedService === 'Other') {
                if (!service.customServiceName?.trim()) {
                    validationErrors[`service_${index}_customServiceName`] = 'Please enter custom service name';
                }
                if (!service.customExperience?.trim()) {
                    validationErrors[`service_${index}_customExperience`] = 'Please enter experience';
                }
            }
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setSubmissionError('Please fix the highlighted fields before continuing.');
            return;
        }

        const completeData = {
            ...formData,
            services
        };

        try {
            const response = await fetch(`${apiBaseUrl}/vendor-registration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(completeData)
            });

            const result = await response.json();

            if (!response.ok) {
                setSubmissionError(result.error || 'Failed to submit registration.');
                return;
            }

            localStorage.setItem('vendorData', JSON.stringify(completeData));
            localStorage.setItem('vendorRegistrationId', result.data?.id || '');
            navigate('/upload');
        } catch (error) {
            console.error('Registration submit error:', error);
            setSubmissionError('Unable to send registration data to the server.');
        }
    };

    return (
        <div className={styles.wholeWrapper}>
            <div className={styles.container}>
                <div className={styles.headerSection}>
                    <h1 className={styles.pageTitle}>Partner with Vyess FMS</h1>
                    <p className={styles.pageSubtitle}>
                        Join our network of trusted service providers. Fill out the details below to start your onboarding journey.
                    </p>
                </div>

                <div className={styles.stepContainer}>
                    <StepIndicator steps={steps} currentStep={0} />
                </div>

                <form onSubmit={handleSubmit}>
                    {submissionError && (
                        <div className={styles.errorAlert}>
                            {submissionError}
                        </div>
                    )}

                    <div className={styles.formSections}>

                        {/* Section 1: Basic Information */}
                        <Card>
                            <CardHeader
                                title={
                                    <div className={styles.cardTitle}>
                                        <Building2 className={styles.icon} /> Basic Information
                                    </div>
                                }
                                description="Please provide your official business information."
                            />
                            <CardContent>
                                <div className={styles.grid2Col}>
                                    <Input
                                        label="Business Name"
                                        name="businessName"
                                        required
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        placeholder="e.g. Cool Air Tech"
                                        error={errors.businessName}
                                    />
                                    <Input
                                        label="Contact Person"
                                        name="contactPerson"
                                        required
                                        value={formData.contactPerson}
                                        onChange={handleChange}
                                        placeholder="Representative Name"
                                        error={errors.contactPerson}
                                    />
                                    <Input
                                        className={styles.phoneNumberInput}
                                        label="Phone Number"
                                        name="phone"
                                        type="number"
                                        required
                                        minLength={10}
                                        maxLength={10}
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="9876543210"
                                        error={errors.phone}
                                    />
                                    <Input
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="contact@business.com"
                                        error={errors.email}
                                    />
                                    <div className={styles.fullWidth}>
                                        <label className={styles.label}>
                                            Full Address
                                        </label>
                                        <textarea
                                            name="address"
                                            required
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows={2}
                                            className={styles.baseInput}
                                            placeholder="Shop No, Street, Area, City"
                                        />
                                        {errors.address && <p className={styles.errorText}>{errors.address}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section 2: Service Details */}
                        <Card>
                            <CardHeader
                                title={
                                    <div className={styles.cardTitle}>
                                        <Briefcase className={styles.icon} /> Service Details
                                    </div>
                                }
                                description="Specify the services you provide and your experience."
                            />
                            <CardContent>
                                <div className={styles.serviceList}>
                                    {services.map((service, index) => (
                                        <div key={service.id} className={index > 0 ? styles.serviceDivider : ""}>
                                            <div className={styles.grid2Col}>

                                                <div>
                                                    <label className={styles.label}>
                                                        Service Name
                                                    </label>
                                                    <select
                                                        className={styles.baseInput}
                                                        value={service.selectedService}
                                                        onChange={(e) => handleServiceChange(service.id, 'selectedService', e.target.value)}
                                                    >
                                                        <option value="">Select Service</option>
                                                        <option value="Bathroom cleaning">Bathroom cleaning</option>
                                                        <option value="Kitchen cleaning">Kitchen cleaning</option>
                                                        <option value="Home cleaning">Home cleaning</option>
                                                        <option value="Garden cleaning">Garden cleaning</option>
                                                        <option value="Sofa cleaning">Sofa cleaning</option>
                                                        <option value="Carpets & Mattress cleaning">Carpets & Mattress cleaning</option>
                                                        <option value="Water tank cleaning">Water tank cleaning</option>
                                                        <option value="Glass cleaning">Glass cleaning</option>
                                                        <option value="Flooring polish">Flooring polish</option>
                                                        <option value="Painting services">Painting services</option>
                                                        <option value="Electrical & Plumbing">Electrical & Plumbing</option>
                                                        <option value="Pest control">Pest control</option>
                                                        <option value="Water proofing">Water proofing</option>
                                                        <option value="Chimney cleaning">Chimney cleaning</option>
                                                        <option value="Carpenter work">Carpenter work</option>
                                                        <option value="AC Service">AC Service</option>
                                                        <option value="Civil work">Civil work</option>
                                                        <option value="Renovation work">Renovation work</option>
                                                        <option value="Mosquito net">Mosquito net</option>
                                                        <option value="Aluminium work">Aluminium work</option>
                                                        <option value="Packers & Movers">Packers & Movers</option>
                                                        <option value="Laundry">Laundry</option>
                                                        <option value="RO Water Purifier">RO Water Purifier</option>
                                                        <option value="Cab service">Cab service</option>
                                                        <option value="CCTV">CCTV</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                    {errors[`service_${index}_selectedService`] && (
                                                        <p className={styles.errorText}>{errors[`service_${index}_selectedService`]}</p>
                                                    )}
                                                </div>

                                                {/* Standard Experience - Hidden if 'Other' is selected */}
                                                {service.selectedService !== 'Other' ? (
                                                    <div>
                                                        <label className={styles.label}>
                                                            Experience
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            className={styles.baseInput}
                                                            placeholder="e.g. 5 Years"
                                                            value={service.experience}
                                                            onChange={(e) => handleServiceChange(service.id, 'experience', e.target.value)}
                                                        />
                                                        {errors[`service_${index}_experience`] && (
                                                            <p className={styles.errorText}>{errors[`service_${index}_experience`]}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className={styles.spacer}></div> /* Spacer for grid alignment */
                                                )}
                                            </div>

                                            {/* Custom Service Block - Only visible when 'Other' is selected */}
                                            {service.selectedService === 'Other' && (
                                                <div className={styles.customServiceBox}>
                                                    <h4 className={styles.customServiceTitle}>Custom Service Details</h4>
                                                    <div className={styles.grid2Col}>
                                                        <div>
                                                            <label className={styles.label}>
                                                                Custom Service Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className={styles.baseInput}
                                                                placeholder="Enter service name"
                                                                value={service.customServiceName}
                                                                onChange={(e) => handleServiceChange(service.id, 'customServiceName', e.target.value)}
                                                            />
                                                            {errors[`service_${index}_customServiceName`] && (
                                                                <p className={styles.errorText}>{errors[`service_${index}_customServiceName`]}</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className={styles.label}>
                                                                Experience
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className={styles.baseInput}
                                                                placeholder="e.g. 5 Years"
                                                                value={service.customExperience}
                                                                onChange={(e) => handleServiceChange(service.id, 'customExperience', e.target.value)}
                                                            />
                                                            {errors[`service_${index}_customExperience`] && (
                                                                <p className={styles.errorText}>{errors[`service_${index}_customExperience`]}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className={styles.label}>
                                                            Service Description
                                                        </label>
                                                        <textarea
                                                            className={styles.baseInput}
                                                            placeholder="Describe the service in detail...."
                                                            rows={3}
                                                            value={service.customDescription}
                                                            onChange={(e) => handleServiceChange(service.id, 'customDescription', e.target.value)}
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={handleAddService}
                                        className={styles.addServiceBtn}
                                    >
                                        <Plus className={styles.addIcon} /> Add service
                                    </button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section 3: Bank Details */}
                        <Card>
                            <CardHeader
                                title={
                                    <div className={styles.cardTitle}>
                                        <CreditCard className={styles.icon} /> Bank Details (For Payouts)
                                    </div>
                                }
                            />
                            <CardContent>
                                <div className={styles.grid2Col}>
                                    <Input
                                        label="Account Holder Name"
                                        name="accountHolderName"
                                        value={formData.accountHolderName}
                                        required
                                        onChange={handleChange}
                                        placeholder="As per bank records"
                                        error={errors.accountHolderName}
                                    />
                                    <Input
                                        label="Account Number"
                                        name="accountNumber"
                                        required
                                        value={formData.accountNumber}
                                        onChange={handleChange}
                                        placeholder="XXXXXXXXXXXXX"
                                        error={errors.accountNumber}
                                    />
                                    <Input
                                        label="IFSC Code"
                                        name="ifscCode"
                                        required
                                        value={formData.ifscCode}
                                        onChange={handleChange}
                                        placeholder="ABCD0123456"
                                        error={errors.ifscCode}
                                    />
                                    <Input
                                        label="UPI ID"
                                        name="upiId"
                                        required
                                        value={formData.upiId}
                                        onChange={handleChange}
                                        placeholder="mobile@upi"
                                        error={errors.upiId}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section 4: Verification & Access */}
                        <Card>
                            <CardHeader
                                title={
                                    <div className={styles.cardTitle}>
                                        <Shield className={styles.icon} /> Verification & Access
                                    </div>
                                }
                            />
                            <CardContent>
                                <div className={styles.grid2Col}>
                                    <Input
                                        label="GST Number (Optional)"
                                        name="gstNumber"
                                        value={formData.gstNumber}
                                        onChange={handleChange}
                                        placeholder="22AAAAA0000A1Z5"
                                        error={errors.gstNumber}
                                    />
                                    <Input
                                        label="Aadhar"
                                        name="aadhar"
                                        required
                                        value={formData.aadhar}
                                        onChange={handleChange}
                                        placeholder="Aadhar Number"
                                        error={errors.aadhar}
                                    />
                                    <Input
                                        label="PAN"
                                        name="pan"
                                        required
                                        value={formData.pan}
                                        onChange={handleChange}
                                        placeholder="Pan Number"
                                        error={errors.pan}
                                    />
                                </div>
                            </CardContent>

                            <CardFooter className={styles.footerActions}>
                                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                                <Button type="submit" size="lg">Save & Continue</Button>
                            </CardFooter>
                        </Card>

                    </div>
                </form>
            </div>

        </div>
    );
}