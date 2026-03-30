import { GlassWindow } from "../../Cards/GlassWindow/GlassWindow";
import { Terminal, Search } from "lucide-react";
import { RoundedButton } from "../../Buttons/RoundedButton/RoundedButton";
import styles from './BrowserWidget.module.css';

export const BrowserWidget = () => {
  return (
    <GlassWindow icon={Terminal} title="Browser">

        <div className={styles.browserTop}>
            <div className={styles.searchBox}>
            <Search size={14} className={styles.searchIcon} />
            <input
                className={styles.urlInput}
                placeholder="Enter target URL..."
            />
            </div>

            <RoundedButton onClick={() => {}}>
            SEARCH
            </RoundedButton>
        </div>

        <div className={styles.webList}>
            {[
            {name: "ADMIN_PANEL", ip: "123.123.123.123:80"},
            {name: "ADMIN_PANEL", ip: "123.123.123.123:80"},
            {name: "ADMIN_PANEL", ip: "123.123.123.123:80"},
            ].map((site, i) => (
            <div key={i} className={styles.webItem}>
                <span>{site.name}</span>
                <span> : </span>
                <span>{site.ip}</span>
            </div>
            ))}
        </div>

    </GlassWindow>
  );
};