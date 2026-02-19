import Link from "next/link";

interface UserWidgetProps {
  name: string;
  imageSrc?: string;
}

export default function UserWidget({ name, imageSrc }: UserWidgetProps) {
  return (
    <Link href="/profile">
    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="w-9 h-9 bg-[#E2E8F0] rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
        {imageSrc ? (
          <img src={imageSrc} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500 text-lg">👤</span>
        )}
      </div>

      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-800 font-[family-name:var(--font-inter)]">
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