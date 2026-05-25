import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { PDFDocument, rgb } from 'pdf-lib';
import styles from './styles/digitalSignature.module.css';
import { Card, CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StepIndicator } from '../components/StepIndicator';
import { Eraser, Download } from 'lucide-react';

const steps = [
  { name: 'Registration' },
  { name: 'Documents' },
  { name: 'Agreement' },
  { name: 'Sign' }
];

const agreementPdfUrl = new URL('../assets/VYESSFMS_Vendor_Agreement.pdf', import.meta.url).href;

export function DigitalSignature() {
  const navigate = useNavigate();
  const sigCanvas = useRef(null);
  const [timestamp, setTimestamp] = useState('');
  const [vendorData, setVendorData] = useState({});
  const [businessName, setBusinessName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const vendorName = businessName || vendorData.businessName || vendorData.companyName || 'Vendor';

  useEffect(() => {
    const data = localStorage.getItem('vendorData');
    if (data) {
      const parsedData = JSON.parse(data);
      setVendorData(parsedData);
      setBusinessName(parsedData.businessName || parsedData.companyName || '');
    }
    setTimestamp(new Date().toLocaleString());
  }, []);

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const generatePDF = async () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      alert('Please provide a signature first.');
      return;
    }

    if (!businessName.trim()) {
      alert('Please enter your Vendor Full Name / Business Name.');
      return;
    }

    setIsGenerating(true);

    try {
      const sigDataUrl = sigCanvas.current.getCanvas().toDataURL('image/png');
      const response = await fetch(agreementPdfUrl);
      if (!response.ok) throw new Error('Failed to load agreement PDF');
      const pdfBytes = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const lastPage = pages[pages.length - 1];
      const { width, height } = lastPage.getSize();

      // Right-side table coordinates (A4: 612x792)
      // Draw signature image (centered on signature line)
      const signatureBytes = Uint8Array.from(atob(sigDataUrl.split(',')[1]), (char) => char.charCodeAt(0));
      const signatureImage = await pdfDoc.embedPng(signatureBytes);
      lastPage.drawImage(signatureImage, {
        x: 355,
        y: height - 273,
        width: 100,
        height: 28,
      });

      // Draw name (centered on name line)
      lastPage.drawText(vendorName, {
        x: 355,
        y: height - 330,
        size: 12,
        color: rgb(0.2, 0.2, 0.2),
      });

      // Draw date/time (on Date line)
      lastPage.drawText(timestamp, {
        x: 100,
        y: height - 385,
        size: 11,
        color: rgb(0.2, 0.2, 0.2),
      });
      
      lastPage.drawText(timestamp, {
        x: 355,
        y: height - 425,
        size: 11,
        color: rgb(0.2, 0.2, 0.2),
      });

      // Save and upload as before
      const updatedPdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([updatedPdfBytes], { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('agreement', pdfBlob, 'VYESSFMS_Vendor_Agreement.pdf');

      const responseUpload = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!responseUpload.ok) {
        throw new Error('Upload failed');
      }

      const data = await responseUpload.json();

      const vendorDataToUpdate = JSON.parse(localStorage.getItem('vendorData') || '{}');
      vendorDataToUpdate.documentUrls = {
        ...vendorDataToUpdate.documentUrls,
        signedAgreementUrl: data.urls.agreement,
      };
      localStorage.setItem('vendorData', JSON.stringify(vendorDataToUpdate));

      const vendorRegistrationId = localStorage.getItem('vendorRegistrationId');
      if (vendorRegistrationId) {
        await fetch(`http://localhost:3000/vendor-registration/${vendorRegistrationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agreementUrl: data.urls.agreement })
        });
      }

      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(pdfBlob);
      downloadLink.download = 'VYESSFMS_Vendor_Agreement.pdf';
      downloadLink.click();
      URL.revokeObjectURL(downloadLink.href);

      setTimeout(() => {
        navigate('/pending');
      }, 1500);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.wholeWrapper}>
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.pageTitle}>Digital Signature</h1>
        <p className={styles.pageSubtitle}>Review the agreement and place your signature below.</p>
      </div>

      <div className={styles.stepContainer}>
        <StepIndicator steps={steps} currentStep={3} />
      </div>

      <Card>
        <CardHeader
          title="Sign Agreement"
          description="Review the PDF and complete the signature fields below"
        />
        <CardContent className={styles.cardContent}>
          
          {/* File Info Box */}
          <div className={styles.infoBox}>
            <div className={styles.infoBoxFlex}>
              <div>
                <p className={styles.infoTitle}>VYESSFMS_Vendor_Agreement.pdf</p>
                <p className={styles.infoDesc}>The signed copy will be generated from the official agreement PDF when you click Sign & Download PDF.</p>
              </div>
              <span className={styles.infoBadge}>
                Official PDF
              </span>
            </div>
          </div>

          {/* Input & Canvas Grid */}
          <div className={styles.inputGrid}>
            
            <div className={styles.inputBox}>
              <label htmlFor="businessName" className={styles.inputLabel}>
                Vendor Full Name / Business Name
              </label>
              <input
                id="businessName"
                type="text"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                placeholder="Enter your full business name"
                className={styles.textInput}
              />
              <p className={styles.inputHint}>
                This name will be used in the signed agreement.
              </p>
            </div>

            <div className={styles.inputBox}>
              <p className={styles.inputLabel}>Vendor / Service Provider Signature</p>
              <div className={styles.canvasWrapper}>
                <SignatureCanvas
                  ref={sigCanvas}
                  canvasProps={{ className: styles.sigCanvas }}
                  backgroundColor="rgb(255, 255, 255)"
                />
              </div>
              <p className={styles.inputHint}>
                Draw your signature in the space above.
              </p>
            </div>

          </div>

          {/* Bottom Controls inside Content */}
          <div className={styles.bottomControls}>
            <Button variant="ghost" size="sm" onClick={clearSignature} style={{ color: '#64748b' }}>
              <Eraser className={styles.btnIconSmall} />
              Clear Signature
            </Button>

            <div className={styles.metaInfo}>
              <p>Signer: <strong>{vendorData.contactPerson || 'Pending'}</strong></p>
              <p>Time: {timestamp}</p>
            </div>
          </div>

        </CardContent>
        
        <CardFooter className={styles.cardFooter}>
          <Button variant="outline" onClick={() => navigate('/agreement')}>
            Back
          </Button>
          <Button
            onClick={generatePDF}
            size="lg"
            disabled={isGenerating}
            className={styles.primaryActionBtn}
          >
            {isGenerating ? 'Processing...' : (
              <>
                <Download className={styles.btnIcon} />
                Sign & Download PDF
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
    </div>
  );
}