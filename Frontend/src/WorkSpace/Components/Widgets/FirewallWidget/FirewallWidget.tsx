import { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Activity, X, Crosshair, Server, Lock, AlertTriangle, Plus } from 'lucide-react';
import styles from './FirewallWidget.module.css';

// ==============================
// Helper Functions
// ==============================
const isValidIP = (ip: string) => {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every((p: string) => {
    const num = parseInt(p, 10);
    return num >= 0 && num <= 255 && p === num.toString();
  });
};

// ==============================
// Main Component
// ==============================
export default function FirewallWidget() {
  const MAX_BLOCKED_IPS = 3;
  const [bootState, setBootState] = useState<number>(0);
  const [blockedIPs, setBlockedIPs] = useState<string[]>([]);
  const [inputIP, setInputIP] = useState<string>('');
  const [threatCount, setThreatCount] = useState<number>(0);
  const [systemStatus, setSystemStatus] = useState<string>('SECURE');
  const [alertActive, setAlertActive] = useState<boolean>(false);

  // Boot Sequence
  useEffect(() => {
    const t1 = setTimeout(() => setBootState(1), 300);   // Show glowing line
    const t2 = setTimeout(() => setBootState(2), 700);   // Expand panel
    const t3 = setTimeout(() => setBootState(3), 1200);  // Show content

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Traffic Simulator (Background logic to trigger alerts)
  useEffect(() => {
    if (bootState < 3) return; // Don't simulate until booted

    const interval = setInterval(() => {
      // 25% chance to simulate an attack from a blocked IP
      const isBlockedAttack = blockedIPs.length > 0 && Math.random() < 0.25;
      
      if (isBlockedAttack) {
        setSystemStatus('BREACH_ATTEMPT');
        setThreatCount(prev => prev + 1);
      }
    }, Math.random() * 2000 + 1000); 
    
    return () => clearInterval(interval);
  }, [blockedIPs, bootState]);

  // Handle temporary alert state
  useEffect(() => {
    if (systemStatus === 'BREACH_ATTEMPT') {
      setAlertActive(true);
      const timer = setTimeout(() => {
        setSystemStatus('SECURE');
        setAlertActive(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [systemStatus]);

  const handleAddIP = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanIP = inputIP.trim();
    
    if (blockedIPs.length >= MAX_BLOCKED_IPS) return;
    if (!isValidIP(cleanIP)) return;
    if (blockedIPs.includes(cleanIP)) return;

    setBlockedIPs(prev => [...prev, cleanIP]);
    setInputIP('');
  };

  const handleRemoveIP = (ipToRemove: string) => {
    setBlockedIPs(prev => prev.filter(ip => ip !== ipToRemove));
  };

  return (
    <div className={styles.container}>
      
      {/* Background Grid & Scanline */}
      <div className={styles.gridBg}></div>

      {/* Main Firewall Panel Container */}
      <div className={`${styles.panel} ${bootState >= 1 ? styles.animatingLine : ''} ${bootState >= 2 ? styles.animatingExpand : ''} ${alertActive ? styles.alertMode : ''}`}>
        
        {/* Decorations */}
        <div className={`${styles.cornerDeco} ${styles.cTl}`}></div>
        <div className={`${styles.cornerDeco} ${styles.cTr}`}></div>
        <div className={`${styles.cornerDeco} ${styles.cBl}`}></div>
        <div className={`${styles.cornerDeco} ${styles.cBr}`}></div>

        {/* Content (Fades in after expansion) */}
        <div className={`${styles.panelContent} ${bootState >= 3 ? styles.show : ''}`}>
          
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <Lock size={16} className={alertActive ? styles.alertIcon : styles.normalIcon} />
              <span className={`${styles.headerTitle} ${alertActive ? styles.glowTextRed : styles.glowTextCyan}`}>
                FIREWALL_NEXUS_v7.2
              </span>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>STATUS:</span>
                <span className={`${styles.statusValue} ${alertActive ? styles.alertText : styles.normalText}`}>
                  {systemStatus}
                </span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>UPTIME:</span>
                <span>99.99%</span>
              </div>
            </div>
          </div>

          {/* Main Layout */}
          <div className={styles.mainLayout}>
            
            {/* Left: Visualizer (55%) */}
            <div className={styles.visualizer}>
              {/* Top Stat */}
              <div className={styles.topStat}>
                <Activity size={24} className={alertActive ? styles.alertIcon : styles.normalIcon} />
                <div className={styles.statLabel}>NETWORK_CORE_VISUALIZER</div>
              </div>

              {/* Shield Graphic */}
              <div className={styles.shieldContainer}>
                {/* Outer Rings */}
                <div className={`${styles.shieldRingOuter} ${styles.shieldRing} ${alertActive ? styles.alertRing : ''}`}></div>
                <div className={`${styles.shieldRingInner} ${styles.shieldRingReverse} ${alertActive ? styles.alertRing : ''}`}></div>
                
                {/* Center Icon */}
                <div className={`${styles.shieldCore} ${alertActive ? styles.alert : ''}`}>
                  {alertActive ? (
                    <ShieldAlert size={100} strokeWidth={1.5} />
                  ) : (
                    <Shield size={100} strokeWidth={1} />
                  )}
                </div>
              </div>

              {/* Bottom Stat */}
              <div className={styles.bottomStats}>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>BLOCKED NODES</div>
                  <div className={`${styles.statNumber} ${styles.glowTextCyan}`}>{blockedIPs.length}/{MAX_BLOCKED_IPS}</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>THREATS PREVENTED</div>
                  <div className={`${styles.statNumber} ${alertActive ? styles.glowTextRed : styles.normalText}`}>
                    {threatCount}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Controls (45%) */}
            <div className={styles.controls}>
              
              <div className={styles.controlsHeader}>
                <Server size={16} />
                <span className={styles.controlsTitle}>THREAT_ISOLATION</span>
              </div>

              {/* Add IP Form */}
              <form onSubmit={handleAddIP} className={styles.formContainer}>
                <div className={styles.formLabel}>TARGET IPv4 ADDRESS</div>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    value={inputIP}
                    onChange={(e) => setInputIP(e.target.value)}
                    placeholder="192.168.1.100"
                    disabled={blockedIPs.length >= MAX_BLOCKED_IPS}
                    className={styles.inputField}
                  />
                  <button 
                    type="submit"
                    disabled={blockedIPs.length >= MAX_BLOCKED_IPS || !inputIP}
                    className={styles.submitBtn}
                  >
                    <Plus size={20} />
                  </button>
                </div>
                {blockedIPs.length >= MAX_BLOCKED_IPS && (
                  <div className={styles.warningMsg}>
                    <AlertTriangle size={12} /> MAXIMUM BLOCK CAPACITY REACHED
                  </div>
                )}
              </form>

              {/* Blocked IP List */}
              <div className={styles.ipList}>
                <div className={styles.listLabel}>ACTIVE BLOCK RULES</div>
                
                {[0, 1, 2].map((index) => {
                  const ip = blockedIPs[index];
                  const isEmpty = !ip;
                  
                  return (
                    <div 
                      key={index} 
                      className={`${styles.ipSlot} ${isEmpty ? styles.empty : styles.blocked}`}
                    >
                      {isEmpty ? (
                        <div className={styles.emptyText}>[ EMPTY_SLOT ]</div>
                      ) : (
                        <>
                          <div className={styles.blockedContent}>
                            <div className={styles.blockedDetails}>
                              <span className={styles.blockedLabel}>BLOCKED_NODE</span>
                              <span className={`${styles.blockedIp} ${styles.glowTextRed}`}>{ip}</span>
                            </div>
                            <button 
                              onClick={() => handleRemoveIP(ip)}
                              className={styles.removeBtn}
                            >
                              <span><X size={18} /></span>
                            </button>
                          </div>
                          {/* Deco lines for blocked item */}
                          <div className={styles.blockedLine}></div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
          
          {/* Footer line */}
          <div className={styles.footer}></div>
        </div>
      </div>
    </div>
  );
}