import { Browser } from "../../../Workspace/Components/Apps/Browser/Browser/Browser";
import { Terminal } from "../../../Workspace/Components/Apps/Terminal/Terminal";
import { Firewall } from "../../../Workspace/Components/Apps/Firewall/Firewall";
import { Phishing } from "../../../Workspace/Components/Apps/Phishing/Phishing/Phishing";

export const AppsRegistry = {

    Browser,
    Terminal,
    Firewall,
    Phishing,

} as const;

export type AppKey = keyof typeof AppsRegistry;