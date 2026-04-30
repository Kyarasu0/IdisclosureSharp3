import { Introduction } from "../../Workspace/Components/5-Pages/1-Introduction/Introduction";
import { UserSetup } from "../../Workspace/Components/5-Pages/2-UserSetup/UserSetup";
import { SecretSetup } from "../../Workspace/Components/5-Pages/3-SecretSetup/SecretSetup";
import { CreateJoin } from "../../Workspace/Components/5-Pages/4-CreateJoin/CreateJoin";
import { Waiting } from "../../Workspace/Components/5-Pages/5-Waiting/Waiting";
// import { PCDesktop } from "../../Workspace/Components/5-Pages/6-PCDesktop/PCDesktop";

export const PagesRegistry = {

    Introduction,
    UserSetup,
    SecretSetup,
    CreateJoin,
    Waiting,
    // PCDesktop,

} as const;

export type PageKey = keyof typeof PagesRegistry;