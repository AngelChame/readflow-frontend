import Image from "next/image";

interface StreakCardProps {
    streak?: number;
}

export default function StreakCard({ streak = 0 }: StreakCardProps) {
    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#5B5BD6] select-none">
            <div className="relative z-10 p-6 flex flex-col justify-start h-full">
                <span className="text-white font-bold leading-none"
                    style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                    {streak}
                </span>

                <span className="text-white font-semibold mt-2"
                    style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)" }}>
                    Días en racha
                </span>
            </div>

            <div className="absolute bottom-0 right-0 w-3/5 h-full pointer-events-none">
                <Image
                    src="/icons/streak.png"
                    alt="flame"
                    fill
                    className="object-cover object-right-bottom"
                    priority
                />
            </div>
        </div>
    );
}
