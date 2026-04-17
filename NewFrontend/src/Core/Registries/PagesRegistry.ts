import { Introduction } from "../../Workspace/Components/5-Pages/1-Introduction/Introduction";
import { UserSetup } from "../../Workspace/Components/5-Pages/2-UserSetup/UserSetup";

export const PagesRegistry = {

    Introduction,
    UserSetup,

} as const;

export type PageKey = keyof typeof PagesRegistry;