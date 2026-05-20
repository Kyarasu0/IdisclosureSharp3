import { SNSSite } from "../../../Workspace/Components/6-Apps/Browser/SNSSite/SNSSite";

export const ToolsRegistry = {

    SNSSite,

} as const;

export type ToolKey = keyof typeof ToolsRegistry;