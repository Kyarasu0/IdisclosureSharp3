import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { WebStoreKey } from "./../../../WebStores/WebStoreRouter"
import { WebStoreRouter } from "./../../../WebStores/WebStoreRouter"
import { GlassWindow } from "../../Cards/GlassWindow/GlassWindow";
import { Terminal, Search } from "lucide-react";
import { RoundedButton } from "../../Buttons/RoundedButton/RoundedButton";
import styles from './BrowserWidget.module.css';

// Memo
// 戻るボタンいるくね

export const BrowserWidget = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [current, setCurrent] = useState<WebStoreKey | null>(null);

    return (
        <GlassWindow icon={Terminal} title="Browser">

            <div className={styles.browserTop}>
                <div className={styles.searchBox}>
                <Search size={14} className={styles.searchIcon} />
                <input
                    className={styles.urlInput}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter target URL..."
                />
                </div>

                <RoundedButton
                    onClick={() => {
                        const key = query.trim() as WebStoreKey;

                        if (WebStoreRouter[key]) {
                        setCurrent(key);
                        } else {
                        alert("NOT FOUND");
                        }
                    }}
                >
                SEARCH
                </RoundedButton>
            </div>

            <div className={styles.webList}>
                {current ? (
                    (() => {
                        const Component = WebStoreRouter[current].component;
                        return (
                            <Component
                                toolInfo={WebStoreRouter[current].args}
                                onNavigate={navigate}
                                result="success"
                            />
                        );
                    })()
                ) : (
                    [
                        { id: 1, label: "SNSServer", webIp: "123.123.123.123"}
                    ].map((item) => (
                    <div key={item.id} className={styles.webItem}>
                        <span>{item.label}</span>
                        <span> : </span>
                        <span>{item.webIp}</span>
                    </div>
                    ))
                )}
            </div>

        </GlassWindow>
    );
};