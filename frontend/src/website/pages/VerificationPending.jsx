import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/verificationPending.module.css';
import { Card, CardContent } from '../components/ui/Card';
import { CheckCircle } from 'lucide-react';

export function VerificationPending() {
  // navigate is kept in case you want to add a "Return Home" button later
  const navigate = useNavigate();
  
  return (
    <div className={styles.wholeWrapper}>
    <div className={styles.container}>
      <Card className={styles.cardWrapper}>
        <CardContent className={styles.content}>
          
          <div className={styles.iconContainer}>
            <div className={styles.iconBg}>
              <CheckCircle className={styles.icon} />
            </div>
          </div>
          
          <h1 className={styles.title}>Vendor Onboarding Complete</h1>
          
          <p className={styles.description}>
            Thank you for completing your onboarding. Your profile and documents are currently under review by our admin team.
          </p>
          
          <div className={styles.infoBox}>
            <h3 className={styles.infoTitle}>What happens next?</h3>
            <ul className={styles.infoList}>
              <li>Our team will verify your KYC documents within 24-48 hours.</li>
              <li>You will receive an email notification once approved.</li>
              <li>If any additional information is required, we will reach out to you.</li>
            </ul>
          </div>

        </CardContent>
      </Card>
    </div>
    </div>
  );
}