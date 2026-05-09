import { BrowserHome } from "../../Workspace/Components/3-Organisms/Control/Apps/Browser/BrowserHome/BrowserHome";
import { Terminal } from "../../Workspace/Components/3-Organisms/Control/Apps/Terminal/Terminal";
import { Firewall } from "../../Workspace/Components/3-Organisms/Control/Apps/Firewall/Firewall";
import { PhishingHome } from "../../Workspace/Components/3-Organisms/Control/Apps/Phishing/PhishingHome/PhishingHome";

export const AppsRegistry = {

    BrowserHome,
    Terminal,
    Firewall,
    PhishingHome,

} as const;

export type AppKey = keyof typeof AppsRegistry;