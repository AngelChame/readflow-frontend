import Link from "next/link";

interface UserWidgetProps {
  name: string;
  imageSrc?: string;
}

export default function UserWidget({ name, imageSrc }: UserWidgetProps) {
  return (
    <Link href="/profile">
      <div className="flex items-center gap-3 bg-background-secondary px-4 py-2 rounded-2xl shadow-sm hover:bg-hover transition-colors cursor-pointer border border-border shadow-sm w-full">
        <div className="w-9 h-9 bg-background rounded-full flex items-center justify-center overflow-hidden">
          {imageSrc ? (
            <img src={imageSrc} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-background-secondary text-lg">👤</span>
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-regular text-foreground">
            {name}
          </span>
          {/*<span className="text-[10px] text-gray-400 font-medium">
          Ver perfil
        </span>*/}
        </div>
      </div>
    </Link>
  );
}