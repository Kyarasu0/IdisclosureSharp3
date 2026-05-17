import { Browser } from "../../../Workspace/Components/6-Apps/Browser/Browser/Browser";
import { Terminal } from "../../../Workspace/Components/6-Apps/Terminal/Terminal";
import { Firewall } from "../../../Workspace/Components/6-Apps/Firewall/Firewall";
import { Phishing } from "../../../Workspace/Components/6-Apps/Phishing/Phishing/Phishing";

export const AppsRegistry = {

    Browser,
    Terminal,
    Firewall,
    Phishing,

} as const;

export type AppKey = keyof typeof AppsRegistry;