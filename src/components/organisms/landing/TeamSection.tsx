import Image from "next/image";
import LuisPhoto from "@/../public/photos/Luis.jpg";
import AntonioPhoto from "@/../public/photos/Antonio.png";
import AngelPhoto from "@/../public/photos/Angel.png";

const teamMembers = [
  {
    name: "Luis Angel",
    role: "Frontend Developer",
    image: LuisPhoto,
  },
  {
    name: "Angel Eduardo",
    role: "FullStack Developer",
    image: AngelPhoto,
  },
  {
    name: "Luis Antonio",
    role: "Backend Developer",
    image: AntonioPhoto,
  },
];

export function TeamSection() {
  return (
    <section id="equipo" className="w-full py-24 px-6">
      <h2 className="font-bold text-black text-5xl text-center mb-16">
        Equipo
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-16 max-w-5xl mx-auto">
        {teamMembers.map((member) => (
          <div key={member.name} className="flex flex-col items-center gap-4">
            <Image
              src={member.image}
              alt={member.name}
              width={300}
              height={300}
              className="rounded-full object-cover w-[250px] h-[250px] shadow-lg hover:scale-105 duration-300 transition-transform"
            />
            <h3 className="font-bold text-black text-xl">{member.name}</h3>
            <p className="text-black text-lg text-center">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
