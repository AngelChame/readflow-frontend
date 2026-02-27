import HistoryCard, { HistoryCardData } from "@/components/molecules/HistoryCard";
import { IconPencil } from "@/components/atoms/icons/IconPencil";
import { IconAt } from "@/components/atoms/icons/IconArroba";

const dummySessions: HistoryCardData[] = Array.from({ length: 4 }, (_, i) => ({
  title: "La Ansiedad",
  date: "27/01/2026",
  retentionLevel: 85,
  summaryType: "Fácil",
  testType: "Opción Múltiple",
}));

// Datos dummy del usuario, después vendrán de la sesión/API
const dummyUser = {
  name: "Luis Pérez",
  bio: "Mejorando mi retención :)",
  email: "luisprz38@gmail.com",
  avatarUrl: "./profileTest.jpg",
};

export default function ProfilePage() {
  const { name, bio, email, avatarUrl } = dummyUser;
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <div className="grid grid-rows-[54%_44%] gap-4 h-full pt-6">

      <div className="relative bg-background-secondary rounded-2xl border border-border shadow-sm overflow-visible flex h-full">

        <div className="relative w-48 shrink-0">
          <div className="absolute top-40 -translate-y-1/2 left-20 w-100 h-100 rounded-full overflow-hidden border-4 border-background shadow-lg bg-background">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-main-purple/30 to-main-purple/10">
                <span className="text-5xl font-bold text-main-purple">{initials}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 px-100 py-8 flex-1 relative">

          <button
            aria-label="Editar perfil"
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-main-purple text-white flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <IconPencil size={15} />
          </button>

          <h2 className="text-2xl font-semibold text-foreground">{name}</h2>
          <p className="text-sm text-foreground">{bio}</p>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <IconAt size={14} className="text-foreground" />
            <span>{email}</span>
          </div>
        </div>

      </div>


      <div>
        <div className="bg-background-secondary p-6 rounded-2xl border border-border shadow-sm h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-medium text-foreground">Últimas sesiones</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {dummySessions.map((session, index) => (
              <HistoryCard key={index} {...session} />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
