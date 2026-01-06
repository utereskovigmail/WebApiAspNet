import GoogleIcon from "./GoogleIcon.tsx"

interface GoogleLoginButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

export default function GoogleLoginButton({
                                              onClick,
                                              disabled = false,
                                          }: GoogleLoginButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                w-full flex items-center justify-center gap-3
                px-4 py-2 rounded-md border
                bg-white text-gray-800
                border-gray-300
                hover:bg-gray-50
                dark:bg-gray-900 dark:text-gray-100
                dark:border-gray-700 dark:hover:bg-gray-800
                transition
                disabled:opacity-50 disabled:cursor-not-allowed
            `}
        >
            <GoogleIcon />
            <span className="text-sm font-medium">
                Continue with Google
            </span>
        </button>
    );
}
