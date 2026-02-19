import Link from "next/link";

export default function LoginPage() {
    return (
        <main className="py-6 px-30 bg-white min-h-screen w-full h-full flex justify-center">
            <div className="w-full grid grid-cols-[40%_50%] gap-[10%]">
                <div className="rounded-3xl h-full w-full flex flex-col justify-between px-10 py-16 bg-[linear-gradient(309deg,#9cceff,#00339b,#001f5d)] bg-[length:600%_600%] animate-custom-gradient">
                    <div className="flex flex-col gap-3.5 text-white">
                        <h3 className="text-xl font-light">Con nosotros</h3>
                        <h2 className="text-3xl font-bold">Mejoras cada día</h2>
                    </div>
                    <div className="flex justify-center text-white">
                        <h2 className="text-3xl font-bold">ReadFlow</h2>
                    </div>
                </div>

                <div className="grid grid-rows-[auto_1fr] gap-10 px-20 py-24 text-black self-center">
                    <div className="flex flex-col gap-3.5">
                        <h2 className="text-4xl font-semibold">Inicia sesión</h2>
                        <p className="text-lg font-light">Bienvenido de nuevo. Mantén tu racha y sigue optimizando tu retención cognitiva.</p>
                    </div>

                    <div className="flex flex-col gap-10">
                        <form action="" className="flex flex-col gap-3.5">
                            <label htmlFor="email" className="text-lg font-bold">Email <span className="text-red-500">*</span></label>
                            <input id="email" type="email" name="email" className="border border-gray-500 rounded-xl h-10 pl-4" placeholder="Ingresa tu correo" required/>

                            <label htmlFor="password" className="text-lg font-bold">Contraseña <span className="text-red-500">*</span></label>
                            <input id="password" type="password" name="password" className="border border-gray-500 rounded-xl h-10 pl-4" placeholder="Ingresa tu contraseña" required/>

                            <input type="submit" value="Iniciar sesión" className="text-lg py-2 px-10 bg-blue-700 text-white font-bold rounded-xl mt-8 w-fit self-center cursor-pointer transition-all duration-300 hover:shadow-[0_5px_20px_rgba(91,106,235,0.7)] hover:scale-[1.02]"/>
                        </form>

                        <div className="text-center">
                            <h4 className="font-light text-gray-500">¿Aún no tienes una cuenta? <Link href="/register" className="font-bold text-blue-700 transition-all duration-300 hover:text-shadow-[0_5px_20px_rgba(91,106,235,0.7)]">Regístrate</Link></h4>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}