import Link from "next/link";

export default function RegisterPage() {
    return (
        <main className="py-6 px-10 bg-white min-h-screen w-full h-full flex justify-center">
            <div className="w-full grid grid-cols-[55%_40%] gap-[5%] items-center">

                <div className="grid grid-rows-[auto_1fr] gap-10 px-20 py-24 text-black self-center">
                    <div className="flex flex-col gap-3.5">
                        <h2 className="text-5xl font-semibold">Crea tu cuenta</h2>
                        <p className="text-lg font-light">Únete a ReadFlow y transforma cada lectura en un conocimiento permanente.</p>
                    </div>

                    <div className="flex flex-col gap-8">
                        <form action="" className="flex flex-col gap-2">
                            <label htmlFor="name" className="text-lg font-bold">Nombre <span className="text-red-500">*</span></label>
                            <input id="name" type="text" name="name" className="border border-gray-300 rounded-xl h-10 pl-4" placeholder="Tu nombre completo" required/>

                            <label htmlFor="email" className="text-lg font-bold">Email <span className="text-red-500">*</span></label>
                            <input id="email" type="email" name="email" className="border border-gray-300 rounded-xl h-10 pl-4" placeholder="Ingresa tu correo" required/>

                            <label htmlFor="password" className="text-lg font-bold">Contraseña <span className="text-red-500">*</span></label>
                            <input id="password" type="password" name="password" className="border border-gray-300 rounded-xl h-10 pl-4" placeholder="Crea una contraseña" required/>

                            <input type="submit" value="Crear cuenta" className="text-lg py-2 px-10 bg-blue-700 text-white font-bold rounded-xl mt-8 w-fit self-center cursor-pointer transition-all duration-300 hover:shadow-[0_5px_20px_rgba(91,106,235,0.7)] hover:scale-[1.02]"/>
                        </form>

                        <div className="text-center">
                            <h4 className="font-light text-gray-500">¿Ya tienes una cuenta? <Link href="/login" className="font-bold text-blue-700 transition-all duration-300 hover:text-shadow-[0_5px_20px_rgba(91,106,235,0.7)]">Inicia sesión</Link></h4>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl h-full w-full flex flex-col justify-between px-10 py-16 bg-[url('/gifs/auth8.gif')] bg-no-repeat">
                    <div className="flex flex-col gap-3.5 text-white">
                        <h3 className="text-xl font-light">Con nosotros</h3>
                        <h2 className="text-3xl font-bold">Mejoras cada día</h2>
                    </div>
                    <div className="flex justify-center text-white">
                        <h2 className="text-3xl font-bold">ReadFlow</h2>
                    </div>
                </div>
            </div>
        </main>
    );
}