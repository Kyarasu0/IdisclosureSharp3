import { SNSSite } from "../../../Workspace/Components/6-Apps/Browser/SNSSite/SNSSite";
import { DownloadSite } from "../../../Workspace/Components/6-Apps/Browser/DownloadSite/DownloadSite";
import type { Post } from "../../../Workspace/Components/6-Apps/Browser/SNSSite/SNSSite";
import type { Tool } from "../../../Workspace/Components/6-Apps/Browser/Browser/Browser";

type ToolProps = {
    mainColor: string;
    subColor: string;
    showSOF: (
        result: "success" | "failed",
        title?: string
    ) => void;
    activeWebList?: Tool[];
    snsPosts?: Post[];
};

export type ToolContext = {
    args: string[];
};

export type ToolDefinition = {
    Component: React.ComponentType<ToolProps>;
    execute?: (context: ToolContext) => void | Promise<void>;
};

export const ToolsRegistry = {

    SNSSite: {
        Component: SNSSite,
    },

    DoSTool: {
        Component: (props: ToolProps) => (
            <DownloadSite
                {...props}
                toolName="DoSTool"
                toolDescription={`DoS(Denial of Service)攻撃とは、サーバーやネットワークに大量の負荷をかけて、正常な利用者がサービスを使えなくする攻撃のことです。たとえば、同時に大量のリクエストを送り続けてサーバーを処理不能にし、Webサイトを遅くしたり、完全に落としたりします。 \n\nIdisclosureのDoSToolでは「DoSTool [攻撃先のIP]」というコマンドを入力することによって、相手のパソコンに負荷をかけ、バッテリーを25%消耗させます。その際、自分のパソコンのバッテリーを10%消費します。`}
            />
        ),
        execute: async ({ args }) => {
            const targetIP = args[0];
            if (!targetIP) {
                console.log("IP address is required");
                return;
            }
            console.log(`Simulating DoS attack to ${targetIP}`);
        },
    },

    BatteryCharger_PC25: {
        Component: (props: ToolProps) => (
            <DownloadSite
                {...props}
                toolName="BatteryCharger_PC25"
                toolDescription={`Batteryは、現実世界における「処理時間」を表しています。そのため、パソコンに高い負荷がかかる計算処理を行うほど、より多くのBatteryを消費します。\n\nIdisclosureでは、「BatteryCharger_PC25」というコマンドを入力することで、自身のパソコンのBatteryを25%回復できます。`}
            />
        ),
        execute: async ({ args }) => {
            const targetIP = args[0];
            if (!targetIP) {
                console.log("IP address is required");
                return;
            }
            console.log(`Simulating DoS attack to ${targetIP}`);
        },
    },

    BatteryCharger_Server25: {
        Component: (props: ToolProps) => (
            <DownloadSite
                {...props}
                toolName="BatteryCharger_Server25"
                toolDescription={`Batteryは、現実世界における「処理時間」を表しています。そのため、サーバーに高い負荷がかかる計算処理を行うほど、より多くのBatteryを消費します。\n\nIdisclosureでは、「BatteryCharger_Server25」というコマンドを入力することで、自身のサーバーのバッテリーを25%回復できます。`}
            />
        ),
        execute: async ({ args }) => {
            const targetIP = args[0];
            if (!targetIP) {
                console.log("IP address is required");
                return;
            }
            console.log(`Simulating DoS attack to ${targetIP}`);
        },
    },

    WiFiSniffer: {
        Component: (props: ToolProps) => (
            <DownloadSite
                {...props}
                toolName="WiFiSniffer"
                toolDescription={`「sniff」には「匂いを嗅ぐ」という意味があり、そこから「Sniffer」は、ネットワーク上を流れるデータを観測・解析するツールを表す言葉として使われています。\n\nIdisclosureのWiFiSnifferでは、「WiFiSniffer [WiFi名]」というコマンドを入力することで、指定したWiFi上を流れる通信情報を確認できます。主に、通信元および通信先のIPアドレスを閲覧することが可能です。`}
            />
        ),
        execute: async ({ args }) => {
            const targetIP = args[0];
            if (!targetIP) {
                console.log("IP address is required");
                return;
            }
            console.log(`Simulating DoS attack to ${targetIP}`);
        },
    },

    SecretCracker: {
        Component: (props: ToolProps) => (
            <DownloadSite
                {...props}
                toolName="SecretCracker"
                toolDescription={`「crack」には「突破する」という意味があり、「Cracker」は、認証やセキュリティを突破するツールや行為を表す言葉として使われています。\n\nIdisclosureのSecretCrackerでは、「SecretCracker [推測したSecretID]」というコマンドを入力することで、一致するSecretIDを設定しているプレイヤーの認証を突破し、パソコンを操作不能にできます。\n\nまた、総当り機能にも対応しており、「SecretCracker player?d」のように入力することで、「player0〜9」 を一括で検証できます。\n?l: 任意の英語小文字,\n?u: 任意の英語大文字,\n?d: 任意の1桁の数字,\n?s: 任意の記号`}
            />
        ),
        execute: async ({ args }) => {
            const targetIP = args[0];
            if (!targetIP) {
                console.log("IP address is required");
                return;
            }
            console.log(`Simulating DoS attack to ${targetIP}`);
        },
    },

    Spyware: {
        Component: (props: ToolProps) => (
            <DownloadSite
                {...props}
                toolName="Spyware"
                toolDescription={`Spywareはマルウェアの一種であり、「感染」「潜伏」「発病」といったマルウェアの挙動のうち、主に「潜伏」を目的としたものです。\n感染したパソコン内に長期間潜み、利用者に気付かれないまま情報の収集や送信を行います。\n\nIdisclosureのSpywareでは、「Spyware」というコマンドを入力することで待機状態となり、その後、最初にフィッシングへ引っかかったユーザーのパソコンへ感染します。`}
            />
        ),
        execute: async ({ args }) => {
            const targetIP = args[0];
            if (!targetIP) {
                console.log("IP address is required");
                return;
            }
            console.log(`Simulating DoS attack to ${targetIP}`);
        },
    },

    Worm: {
        Component: (props: ToolProps) => (
            <DownloadSite
                {...props}
                toolName="Worm"
                toolDescription={`Wormはマルウェアの一種であり、「感染」「潜伏」「発病」といったマルウェアの挙動のうち、主に「感染」を目的としたものです。\n感染したパソコン内で自律的に増殖・動作し、継続的にシステムへ負荷を与えたり、さらなる感染を広げたりします。\n\nIdisclosureのWormでは、「Worm」というコマンドを入力することで待機状態となり、その後、最初にフィッシングへ引っかかったユーザーのパソコンへ感染します。\n\n感染後は一定時間ごとに対象のパソコンへ負荷を与え、バッテリーを継続的に減少させます。`}
            />
        ),
        execute: async ({ args }) => {
            const targetIP = args[0];
            if (!targetIP) {
                console.log("IP address is required");
                return;
            }
            console.log(`Simulating DoS attack to ${targetIP}`);
        },
    },

    AntiVirusSoftware: {
        Component: (props: ToolProps) => (
            <DownloadSite
                {...props}
                toolName="AntiVirusSoftware"
                toolDescription={`AntiVirusSoftwareは、マルウェアの検知や除去を行い、パソコンをウイルス感染から保護するためのセキュリティソフトウェアです。感染したマルウェアを削除し、システムを正常な状態へ回復させる役割を持ちます。\n\nIdisclosureのAntiVirusSoftwareでは、「AntiVirusSoftware」というコマンドを入力することで、現在パソコンに感染しているすべてのウイルスを除去できます。\nSpywareやWormなどによる感染状態をリセットし、パソコンを安全な状態へ戻すことが可能です。`}
            />
        ),
        execute: async ({ args }) => {
            const targetIP = args[0];
            if (!targetIP) {
                console.log("IP address is required");
                return;
            }
            console.log(`Simulating DoS attack to ${targetIP}`);
        },
    },

} satisfies Record<string, ToolDefinition>;

export type ToolKey = keyof typeof ToolsRegistry;