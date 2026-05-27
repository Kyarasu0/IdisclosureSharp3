import { SNSSite } from "../../../Workspace/Components/6-Apps/Browser/SNSSite/SNSSite";
import { DownloadSite } from "../../../Workspace/Components/6-Apps/Browser/DownloadSite/DownloadSite";

type ToolProps = {
    mainColor: string;
    subColor: string;
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
                toolName="DoS Tool"
                toolDescription={`
                    DoS(Denial of Service) ToolはDoS攻撃という攻撃を行うことによって、 
                    サーバーやネットワークに大量の負荷をかけて、正常な利用者がサービスを使えなくする攻撃のことです。
                    たとえば、同時に大量のリクエストを送り続けてサーバーを処理不能にし、
                    Webサイトを遅くしたり、完全に落としたりします。 
                    Idisclosureでは「DoSTool [攻撃先のIP]」というコマンドを入力することによって、
                    相手のパソコンに負荷をかけ、バッテリーを大幅に消耗させます。
                `}
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