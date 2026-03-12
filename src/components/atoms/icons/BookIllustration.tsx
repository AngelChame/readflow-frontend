import Image from "next/image";

interface BookIllustrationProps {
    className?: string;
    size?: number;
}

export function BookIllustration({ className = "", size = 300 }: BookIllustrationProps) {
    return (
        <Image
            src="/icons/book.png"
            alt="Book sessions illustration"
            width={size}
            height={size}
            className={className}
            unoptimized
            quality={100}
            priority
        />
    );
}
