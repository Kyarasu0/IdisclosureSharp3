import type { AppKey } from "../../Registries/AppsRegistry";
import { Monitor, HardDrive, Globe, Terminal, BrickWallFire, FishingHook } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const SharpOneAppOutline: {
  appName: AppKey | "PC Desktop" | "Server Desktop";
  isVisible: string[];
  icon: LucideIcon;
  props?: Record<string, unknown>;
}[] = [
  {
    appName: "PC Desktop",
    isVisible: ["Server"],
    icon: Monitor,
  },
  {
    appName: "Server Desktop",
    isVisible: ["PC"],
    icon: HardDrive,
  },
  {
    appName: "Browser",
    isVisible: ["PC", "Server"],
    icon: Globe,
  },
  {
    appName: "Terminal",
    isVisible: ["PC", "Server"],
    icon: Terminal,
  },
  {
    appName: "Firewall",
    isVisible: ["PC", "Server"],
    icon: BrickWallFire,
  },
  {
    appName: "Phishing",
    isVisible: ["Server"],
    icon: FishingHook,
  },
];