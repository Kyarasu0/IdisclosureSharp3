import { Introduction } from "../../Workspace/Components/5-Pages/1-Introduction/Introduction";
import { UserSetup } from "../../Workspace/Components/5-Pages/2-UserSetup/UserSetup";
import { SecretSetup } from "../../Workspace/Components/5-Pages/3-SecretSetup/SecretSetup";

export const PagesRegistry = {

    Introduction,
    UserSetup,
    SecretSetup,

} as const;

export type PageKey = keyof typeof PagesRegistry;