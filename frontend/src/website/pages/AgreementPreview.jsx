import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import styles from './styles/agreementPreview.module.css';
import { Card, CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StepIndicator } from '../components/StepIndicator';
import agreementPdf from '../assets/VYESSFMS_Vendor_Agreement.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const steps = [
  { name: 'Registration' },
  { name: 'Documents' },
  { name: 'Agreement' },
  { name: 'Sign' }
];

export function AgreementPreview() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [vendorData, setVendorData] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const [hasFullyViewedPdf, setHasFullyViewedPdf] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('vendorData');
    if (data) {
      setVendorData(JSON.parse(data));
    }
  }, []);

  const checkFullView = () => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setHasFullyViewedPdf(true);
    }
  };

  useEffect(() => {
    if (!hasFullyViewedPdf) {
      setAccepted(false);
    }
  }, [hasFullyViewedPdf]);

  const handleContinue = () => {
    if (accepted) {
      navigate('/sign');
    }
  };

  if (!vendorData) return <div className={styles.loadingContainer}>Loading...</div>;

  return (
    <div className={styles.wholeWrapper}>
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.pageTitle}>Service Agreement</h1>
        <p className={styles.pageSubtitle}>Please review the master service agreement generated for your company.</p>
      </div>

      <div className={styles.stepContainer}>
        <StepIndicator steps={steps} currentStep={2} />
      </div>

      <Card>
        <CardHeader
          title="Agreement Preview"
          description="Read carefully before accepting"
          className={styles.cardHeaderBg}
        />
        <CardContent className={styles.cardContent}>
          <div className={styles.previewWrapper}>
            <div className={styles.previewHeader}>
              <div>
                <p className={styles.pdfTitle}>VYESSFMS_Vendor_Agreement.pdf</p>
                <p className={styles.pdfInstruction}>Scroll to the bottom of the last page to enable the agreement acceptance checkbox.</p>
              </div>
              <span className={`${styles.statusBadge} ${hasFullyViewedPdf ? styles.badgeViewed : styles.badgePending}`}>
                {hasFullyViewedPdf ? 'Full PDF viewed' : 'Scroll to complete'}
              </span>
            </div>

            <div className={styles.pdfOuterContainer}>
              <div
                ref={scrollContainerRef}
                onScroll={checkFullView}
                className={styles.scrollableArea}
              >
                <Document
                  file={agreementPdf}
                  onLoadSuccess={({ numPages: loadedPages }) => {
                    setNumPages(loadedPages);
                    setPreviewError(false);
                  }}
                  onLoadError={() => setPreviewError(true)}
                  loading={
                    <div className={styles.loadingText}>
                      Loading agreement PDF...
                    </div>
                  }
                >
                  {Array.from(new Array(numPages || 0), (_, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      width={612}
                      renderTextLayer
                      renderAnnotationLayer
                    />
                  ))}
                </Document>
              </div>
            </div>

            {previewError ? (
              <p className={styles.errorText}>
                The PDF preview could not be loaded in this browser. Please refresh the page and try again.
              </p>
            ) : null}
          </div>

          <div className={styles.checkboxSection}>
            <div className={styles.checkboxWrapper}>
              <input
                id="accept"
                name="accept"
                type="checkbox"
                className={styles.checkbox}
                checked={accepted}
                disabled={!hasFullyViewedPdf}
                onChange={(event) => setAccepted(event.target.checked)}
              />
            </div>
            <div>
              <label htmlFor="accept" className={styles.checkboxLabel}>
                I, {vendorData.contactPerson}, authorized representative of {vendorData.businessName || vendorData.companyName}, have read and agree to the terms and conditions outlined in this agreement.
              </label>
              <p className={styles.checkboxHint}>
                {hasFullyViewedPdf
                  ? 'You can now accept the agreement and continue.'
                  : 'Please scroll through the entire PDF before checking this box.'}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className={styles.footerActions}>
          <Button variant="outline" onClick={() => navigate('/upload')}>
            Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!accepted}
            size="lg"
          >
            Proceed to Sign
          </Button>
        </CardFooter>
      </Card>
    </div>
    </div>
  );
}