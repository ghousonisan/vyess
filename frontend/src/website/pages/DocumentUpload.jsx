import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/documentUpload.module.css';
import { Card, CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StepIndicator } from '../components/StepIndicator';
import { Upload, FileText, CheckCircle2, Loader2 } from 'lucide-react';

const steps = [
  { name: 'Registration' },
  { name: 'Documents' },
  { name: 'Agreement' },
  { name: 'Sign' }
];

export function DocumentUpload() {
  const navigate = useNavigate();
  const [files, setFiles] = useState({
    aadhaar: null,
    pan: null,
    gst: null
  });
  const [previewUrls, setPreviewUrls] = useState({
    aadhaar: null,
    pan: null,
    gst: null
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const nextPreviewUrls = {
      aadhaar: null,
      pan: null,
      gst: null
    };

    const createdUrls = [];

    Object.entries(files).forEach(([type, file]) => {
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        nextPreviewUrls[type] = previewUrl;
        createdUrls.push(previewUrl);
      }
    });

    setPreviewUrls(nextPreviewUrls);

    return () => {
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleFileChange = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prevFiles) => ({ ...prevFiles, [type]: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const formData = new FormData();
      if (files.aadhaar) formData.append('aadhaar', files.aadhaar);
      if (files.pan) formData.append('pan', files.pan);
      if (files.gst) formData.append('gst', files.gst);

      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      // Save document URLs to vendor data
      const vendorData = JSON.parse(localStorage.getItem('vendorData') || '{}');
      vendorData.documentUrls = data.urls;
      localStorage.setItem('vendorData', JSON.stringify(vendorData));

      // Update the database record
      const vendorRegistrationId = localStorage.getItem('vendorRegistrationId');
      if (vendorRegistrationId) {
        const updateResponse = await fetch(`http://localhost:3000/vendor-registration/${vendorRegistrationId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            aadhaarUrl: data.urls.aadhaar,
            panUrl: data.urls.pan,
            gstUrl: data.urls.gst
          })
        });

        if (!updateResponse.ok) {
          console.error('Failed to update registration with document URLs');
        }
      }

      navigate('/agreement');
    } catch (error) {
      console.error('Error uploading documents:', error);
      alert('Failed to upload documents. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const renderUploadBox = (title, type, description) => {
    const selectedFile = files[type];
    const selectedPreviewUrl = previewUrls[type];
    const isPdf = selectedFile?.type === 'application/pdf';

    return (
      <div className={styles.uploadBox}>
        <input
          type="file"
          id={`upload-${type}`}
          className={styles.hiddenInput}
          onChange={(e) => handleFileChange(e, type)}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <label htmlFor={`upload-${type}`} className={styles.uploadLabel}>
          {selectedFile ? (
            <div className={styles.selectedFileContainer}>
              <div className={styles.previewBox}>
                {isPdf ? (
                  <iframe
                    src={selectedPreviewUrl}
                    title={`${title} preview`}
                    className={styles.previewMedia}
                  />
                ) : selectedPreviewUrl ? (
                  <img
                    src={selectedPreviewUrl}
                    alt={`${title} preview`}
                    className={styles.previewMediaImg}
                  />
                ) : (
                  <div className={styles.fallbackView}>
                    <FileText className={styles.fallbackIcon} />
                    <p className={styles.fallbackFileName}>{selectedFile.name}</p>
                    <p className={styles.fallbackSubtext}>Preview not available</p>
                  </div>
                )}
              </div>
              <div className={styles.successInfo}>
                <CheckCircle2 className={styles.successIcon} />
                <span className={styles.successFileName}>{selectedFile.name}</span>
                <span className={styles.successSubtext}>Click to change</span>
              </div>
            </div>
          ) : (
            <>
              <Upload className={styles.uploadIcon} />
              <span className={styles.uploadTitle}>Upload {title}</span>
              <span className={styles.uploadDesc}>{description} (PDF, JPG, PNG)</span>
            </>
          )}
        </label>
      </div>
    );
  };

  return (
    <div className={styles.wholeWrapper}>
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.pageTitle}>Upload Documents</h1>
        <p className={styles.pageSubtitle}>Please provide the required KYC documents for verification.</p>
      </div>

      <div className={styles.stepContainer}>
        <StepIndicator steps={steps} currentStep={1} />
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader
            title="KYC Documents"
            description="Ensure all documents are clear and legible."
          />
          <CardContent>
            <div className={styles.uploadList}>
              {renderUploadBox('Aadhaar Card', 'aadhaar', 'Front and back side')}
              {renderUploadBox('PAN Card', 'pan', 'Clear image of PAN card')}
              {renderUploadBox('GST Certificate', 'gst', 'Optional if not applicable')}
            </div>
          </CardContent>
          <CardFooter className={styles.footerActions}>
            <Button variant="outline" type="button" onClick={() => navigate('/register')}>
              Back
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={!files.aadhaar || !files.pan || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className={styles.spinner} /> Saving...
                </>
              ) : (
                'Save & Continue'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
    </div>
  );
}