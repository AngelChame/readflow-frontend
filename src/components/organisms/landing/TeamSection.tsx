import Image from "next/image";

const teamMembers = [
  {
    name: "Luis Angel",
    role: "Frontend Developer",
    image: "/images/team/luis-angel.png",
  },
  {
    name: "Angel Eduardo",
    role: "FullStack Developer",
    image: "/images/team/angel-eduardo.png",
  },
  {
    name: "Luis Antonio",
    role: "Backend Developer",
    image: "/photos/Antonio.jpg",
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
              className="rounded-full object-cover w-[250px] h-[250px]"
            />
            <h3 className="font-bold text-black text-xl">{member.name}</h3>
            <p className="text-black text-lg text-center">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
