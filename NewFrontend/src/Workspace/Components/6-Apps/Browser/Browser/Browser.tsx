// 基本的な関数をインポート
import { useState } from "react";

// 他のコンポーネントをインポート
import { ValidatedInputField } from "../../../1-Atoms/Control/ValidatedInputField/ValidatedInputField";
import { SubmitButton } from "../../../1-Atoms/Control/SubmitButton/SubmitButton";

// デザインに関するファイルをインポート
import styles from "./Browser.module.css";
import { Search } from "lucide-react";

type Tool = {
    toolName: string;
    toolWebIp: string;
}

type Props = {
    tools?: Tool[];
    mainColor?: string;
}

export const Browser = ({ tools = [], mainColor = "var(--cyan)" }: Props) => {
    const [searchResults, setSearchResults] = useState("");
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
                {tools.map(tool => { return (<span>{`${tool.toolName}: ${tool.toolWebIp}`}</span>)})}
            </div>
        </div>
    )
}