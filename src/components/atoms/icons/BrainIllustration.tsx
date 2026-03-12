import Image from "next/image";

interface BrainIllustrationProps {
    className?: string;
    size?: number;
}

export function BrainIllustration({ className = "", size = 300 }: BrainIllustrationProps) {
    return (
        <Image
            src="/icons/brain.png"
            alt="Brain illustration"
            width={size}
            height={size}
            className={className}
            unoptimized
            priority
        />
    );
}
