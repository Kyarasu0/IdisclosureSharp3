// ==========================================
// ページ2: 登録画面 (Registration)
// ==========================================
import { useState } from 'react';
import { ShieldCheck, User, Calendar, ArrowRight } from 'phosphor-react';
import styles from './Registration.module.css';
import { NormalInputField } from '../../Components/InputFields/NormalInputField/NormalInputField';
import { WarningMessage } from '../../Components/Infomation/WarningMessage/WarningMessage';
import { SubmitButton } from '../../Components/Buttons/SubmitButton/SubmitButton';

export const Registration = () => {
  const [formData, setFormData] = useState({ userId: '', birthDate: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert(`Access Granted.\nWelcome, Agent ${formData.userId}.`);
    }, 1500);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {/* スキャンライン */}
        <div className={styles.scanLine} />

        <div className={styles.header}>
          <div className={styles.iconBox}>
            <ShieldCheck size={24} className={styles.icon} />
          </div>
          <div>
            <h2 className={styles.title}>REGISTRATION</h2>
            <p className={styles.subtitle}>Please enter your User ID and date of birth.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* User ID */}
          <NormalInputField
            label="USER ID"
            icon={<User size={12} />}
            value={formData.userId}
            onChange={(value) => setFormData({ ...formData, userId: value })}
            placeholder="ENTER USER ID"
            showStatusDot={true}
            pattern={/^[A-Za-z0-9]+$/}
            htmlPattern="[A-Za-z0-9]+"
          />

          {/* Birth Date */}
          <NormalInputField
            label="BIRTH DATE"
            icon={<Calendar size={12} />}
            type="date"
            value={formData.birthDate}
            onChange={(value) => setFormData({ ...formData, birthDate: value })}
            placeholder="YYYY-MM-DD"
          />

          {/* Warning */}
          <WarningMessage message="Only the characters A-Z, a-z, and 0-9 are allowed in the User ID." />

          {/* Submit */}
          <SubmitButton
            type="submit"
            isLoading={isLoading}
          >
            Submit
            <ArrowRight size={18} />
          </SubmitButton>

        </form>
      </div>

      <div className={styles.footer}>
        Accessing player domain // Controller: Idisclosure#3
      </div>
    </div>
  );
};
