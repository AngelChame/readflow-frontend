import Link from "next/link";

export default function LoginPage() {
    return (
        <main className="p-10 bg-white min-h-screen min-w-screen flex justify-center">
            <div className="border border-gray-400 rounded w-full grid grid-cols-[40%_50%] gap-[10%]">
                <div className="border border-gray-400 rounded h-full w-full flex flex-col justify-between p-10 bg-[linear-gradient(309deg,#9cceff,#00339b,#001f5d)] bg-[length:600%_600%]
    animate-custom-gradient">
                    <div className="flex flex-col">
                        <h3>Con nosotros</h3>
                        <h2>Mejoras cada día</h2>
                    </div>
                    <div className="flex justify-center">
                        <h2>ReadFlow</h2>
                    </div>
                </div>

                <div className="flex flex-col px-30 py-24 border border-gray-400 rounded">
                    <div>
                        <h2>Inicia sesión</h2>
                        <p>Bienvenido de nuevo. Mantén tu racha y sigue optimizando tu retención cognitiva.</p>
                    </div>
                    <form action="" className="flex flex-col gap-3.5">
                        <label htmlFor="">Email <span>*</span></label>
                        <input type="email"/>

                        <label htmlFor="">Contraseña <span>*</span></label>
                        <input type="password"/>

                        <input type="submit" value="Iniciar sesión"/>
                    </form>
                    <div className="text-center">
                        <h4>¿Aún no tienes una cuenta? <Link href="/register">Regístrate</Link></h4>
                    </div>
                </div>
            </div>
        </main>
    );
}
