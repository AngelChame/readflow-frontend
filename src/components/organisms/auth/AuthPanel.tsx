import { BubbleBackground } from "@/components/animate-ui/components/backgrounds/bubble";
import Image from "next/image";
import logo from "@/../public/logo/logo.svg";

interface AuthPanelProps {
  subtitle: string;
}

export function AuthPanel({ subtitle }: AuthPanelProps) {
  return (
    <BubbleBackground
      interactive={true}
      colors={{
        first: "14,23,102",
        second: "18,29,173",
        third: "91,138,210",
        fourth: "101,136,226",
        fifth: "51,96,187",
        sixth: "79,187,233",
      }}
      className="rounded-3xl h-full w-full flex flex-col justify-between px-10 py-16 shadow-[0_5px_30px_rgba(91,106,235,0.6)]"
    >
      <div className="flex flex-col gap-3.5 text-white z-10">
        <h3 className="text-xl font-light">Con nosotros</h3>
        <h2 className="text-3xl font-bold">{subtitle}</h2>
      </div>
      <div className="flex flex-col items-center gap-6 w-full h-fit text-white z-10">
        <h2 className="text-4xl font-bold">ReadFlow</h2>
        <Image src={logo} alt="" className="z-10 w-16" />
      </div>
    </BubbleBackground>
  );
}
