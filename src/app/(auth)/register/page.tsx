import Link from "next/link";

export default function RegisterPage() {
    return (
        <main className="p-10 bg-white min-h-screen min-w-screen flex justify-center">
            <div className="border border-gray-400 rounded w-full grid grid-cols-[50%_40%] gap-[10%]">
                <div className="flex flex-col px-30 py-24 border border-gray-400 rounded">
                    <div>
                        <h2>Crea tu cuenta</h2>
                        <p>Únete a ReadFlow y transforma cada lectura en un conocimiento permanente.</p>
                    </div>
                    <form action="" className="flex flex-col gap-3.5">
                        <label htmlFor="">Nombre <span>*</span></label>
                        <input type="text"/>

                        <label htmlFor="">Email <span>*</span></label>
                        <input type="email"/>

                        <label htmlFor="">Contraseña <span>*</span></label>
                        <input type="password"/>

                        <input type="submit" value="Crear cuenta"/>
                    </form>
                    <div className="text-center">
                        <h4>¿Ya tienes una cuenta? <Link href="/login">Inicia sesión</Link></h4>
                    </div>
                </div>

                <div className="border border-gray-400 rounded h-full w-full flex flex-col justify-between">
                    <div className="flex flex-col">
                        <h3>Con nosotros</h3>
                        <h2>Mejora tu retención</h2>
                    </div>
                    <div>
                        <h2>ReadFlow</h2>
                    </div>
                </div>
            </div>
        </main>
    );
}