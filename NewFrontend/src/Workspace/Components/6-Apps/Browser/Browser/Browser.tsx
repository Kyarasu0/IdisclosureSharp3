// 基本的な関数をインポート
import { useState, useEffect } from "react";

// 他のコンポーネントをインポート
import { ValidatedInputField } from "../../../1-Atoms/Control/ValidatedInputField/ValidatedInputField";
import { SubmitButton } from "../../../1-Atoms/Control/SubmitButton/SubmitButton";

// 自作関数のインポート
import { getCustomProperties } from "../../../../Functions/3-Photon/getCustomProperties";

// デザインに関するファイルをインポート
import styles from "./Browser.module.css";
import { Search } from "lucide-react";

type Tool = {
    toolName: string;
    toolWebIp: string;
}

type Props = {
    mainColor?: string;
    currentDevice: "PC" | "Server";
}

export const Browser = ({ currentDevice, mainColor = "var(--cyan)" }: Props) => {
    const [searchResults, setSearchResults] = useState("");
    const [activeWebList, setActiveWebList] = useState(JSON.parse(getCustomProperties("activeWebList") || '[]'));
    // 表示時
    useEffect(() => {
        setActiveWebList(JSON.parse(getCustomProperties("activeWebList") || '[]'));
    }, []);
    
    return(
        <div className={styles.browserContainer}>
            <div className={styles.browserHeader}>
                <ValidatedInputField
                    label="SEARCH"
                    value={searchResults}
                    onChange={setSearchResults}
                    required={true}
                    placeholder="ENTER TARGET WEB NAME"
                    icon={<Search size={18} />}
                    className={styles.browserInput}
                    mainColor={mainColor}
                />
                <SubmitButton 
                    type="button"
                    className={styles.browserSubmitButton}
                    mainColor={mainColor}
                >
                    Comfirm
                </SubmitButton>
            </div>
            <div 
                className={styles.browserMain}
                style={{ color: mainColor, textShadow: `0 0 10px ${mainColor}`}}
            >
                {activeWebList.map((activeWeb: Tool) => { return (<span>{`${activeWeb.toolName}: ${activeWeb.toolWebIp}`}</span>)})}
            </div>
        </div>
    )
}