import React from 'react';

import maintenancePage from '../assets/maintenancePage.png';

import styles from './styles/maintenancePage.module.css';
import {
    Search,
    MapPin,
    ChevronDown,
    ShoppingCart,
    Bell,
    User
} from 'lucide-react';

export function MaintenancePage() {
    return (
        <div className={styles.pageContainer}>
            
            {/* <header className={styles.navbar}>

                
                <div className={styles.navLeft}>
                    <div className={styles.logoContainer}>
                        <div className={styles.logoMark}>
                            <svg viewBox="0 0 40 40" className={styles.logoSvg}>
                                <path d="M10 10 L20 30 L30 10" stroke="#2563eb" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M15 20 L20 30 L25 20" stroke="#0f172a" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className={styles.brandName}>Vyess FMS</span>
                    </div>

                    <nav className={styles.navLinks}>
                        <a href="#" className={styles.navLinkActive}>Home</a>
                        <button className={styles.navLinkDropdown}>
                            Services <ChevronDown className={styles.chevronIcon} />
                        </button>
                        <a href="#" className={styles.navLinkDisabled}>Become a partner</a>
                    </nav>
                </div>

                
                <div className={styles.navRight}>
                    <button className={styles.iconButton}>
                        <Search className={styles.icon} />
                    </button>

                    <div className={styles.locationSelector}>
                        <MapPin className={styles.locationIcon} />
                        <span className={styles.locationText}>Thillai nagar, Trichy</span>
                        <ChevronDown className={styles.chevronIconSmall} />
                    </div>

                    <button className={styles.iconButton}>
                        <ShoppingCart className={styles.icon} />
                    </button>

                    <button className={styles.iconButton}>
                        <Bell className={styles.icon} />
                        <span className={styles.notificationDot}></span>
                    </button>

                    <button className={styles.iconButton}>
                        <User className={styles.icon} />
                    </button>
                </div>
            </header> */}

            {/* Main Content Area */}
            <main className={styles.mainContent}>

                <div className={styles.illustrationWrapper}>
                    <img src={maintenancePage} alt="Maintenance Illustration" className={styles.illustration} />
                </div>

                <h1 className={styles.title}>We're Under Maintenance</h1>
                <p className={styles.subtitle}>
                    We are currently performing some scheduled maintenance.<br />
                    We'll be back online shortly!
                </p>
            </main>
        </div>
    );
}