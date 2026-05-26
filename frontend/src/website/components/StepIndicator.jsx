import React from 'react';
import { Check } from 'lucide-react';
import styles from './styles/stepIndicator.module.css';

export function StepIndicator({ steps, currentStep }) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className={styles.stepList}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isActive = isCompleted || isCurrent;
          
          return (
            <li key={step.name} className={styles.stepItem}>
              <div 
                className={`${styles.stepContainer} ${isActive ? styles.borderActive : styles.borderInactive}`}
              >
                <span 
                  className={`${styles.stepNumber} ${isActive ? styles.textActive : styles.textInactive}`}
                >
                  Step {index + 1}
                </span>
                <span className={styles.stepName}>
                  {step.name}
                  {isCompleted && <Check className={styles.checkIcon} />}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}