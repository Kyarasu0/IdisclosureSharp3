import styles from './UserHud.module.css';
import { Activity, Terminal, Shield, Gem, Cake } from 'lucide-react';
import { GlitchText } from '../../Texts/GlitchText/GlitchText';

type UserData = {
  userId: string;
  secretId: string;
  score: number;
  birthDate: string;
};

type Props = {
  userData: UserData;
};

export const UserHud = ({ userData }: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        
        {/* Header */}
        <div className={styles.headerTag}>
          <Activity size={12} className={styles.pulseIcon} />
          <span>USER_STATUS_MONITOR</span>
        </div>

        <div className={styles.content}>
          
          {/* Identity */}
          <div className={styles.identitySection}>
            <div className={styles.iconBox}>
              <Terminal size={24} />
            </div>

            <div>
              <div className={styles.identityLabel}>User ID</div>
              <GlitchText
                text={userData.userId}
                className={styles.identityValue}
              />
            </div>
          </div>

          {/* Status Details */}
          <div className={styles.statusList}>

            <div className={`${styles.statusItem} ${styles.hoverItem}`}>
              <span className={styles.statusLabel}>
                <Cake size={14} />
                BIRTH_DATE
              </span>

              <span className={styles.dateValue}>
                {userData.birthDate}
              </span>
            </div>

            <div className={`${styles.statusItem} ${styles.hoverItem}`}>
              <span className={styles.statusLabel}>
                <Shield size={14} />
                SECRET_ID
              </span>

              <span className={styles.secretValue}>
                {userData.secretId}
              </span>
            </div>

            <div className={`${styles.statusItem} ${styles.hoverItem}`}>
              <span className={styles.statusLabel}>
                <Gem size={14} />
                BLUE_SHARD
              </span>

              <span className={styles.scoreValue}>
                {userData.score.toLocaleString()}
              </span>
            </div>

          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} />
            </div>

            <div className={styles.footerMeta}>
              <span>Sync: Stable</span>
              <span>Encryption: AES-256</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
