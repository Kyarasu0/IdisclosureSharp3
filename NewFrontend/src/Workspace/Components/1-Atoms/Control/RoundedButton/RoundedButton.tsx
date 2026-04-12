// =================================================================
// Components/1-Atoms/Control/RoundedButton/RoundedButton.tsx
// =================================================================

type RoundedButtonProps = {
    label: string;
    icon?: string;
    onClick?: () => void;
    size?: "sm" | "md" | "lg";
}