import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Aviso de Privacidad — Desaparecidos Tamaulipas',
}

export default function AvisoPrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-700">Inicio</Link>
        <span>/</span>
        <span className="text-gray-900">Aviso de Privacidad</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Aviso de Privacidad</h1>
      <p className="text-gray-400 text-sm mb-10">Última actualización: abril 2026</p>

      <div className="prose prose-gray max-w-none space-y-8">

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Responsable del tratamiento</h2>
          <p className="text-gray-600 leading-relaxed">
            La plataforma <strong>Desaparecidos Tamaulipas</strong> es una iniciativa ciudadana sin fines de lucro
            operada de forma independiente con el objetivo de ayudar a localizar personas desaparecidas en el estado
            de Tamaulipas, México. Para cualquier consulta relacionada con privacidad, puedes escribir a:{' '}
            <a href="mailto:admin@desaparecidostamaulipas.mx" className="text-red-600 hover:underline">
              admin@desaparecidostamaulipas.mx
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Datos personales que recabamos</h2>
          <p className="text-gray-600 leading-relaxed mb-3">Recabamos los siguientes datos según la función:</p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex gap-2"><span className="text-red-500 font-bold">·</span><span><strong>Reportantes de casos:</strong> Nombre, teléfono, email y relación con la persona desaparecida.</span></li>
            <li className="flex gap-2"><span className="text-red-500 font-bold">·</span><span><strong>Personas con información:</strong> Nombre, teléfono o email, y el mensaje con la información proporcionada.</span></li>
            <li className="flex gap-2"><span className="text-red-500 font-bold">·</span><span><strong>Suscriptores de alertas:</strong> Correo electrónico y municipio de interés.</span></li>
            <li className="flex gap-2"><span className="text-red-500 font-bold">·</span><span><strong>Personas desaparecidas:</strong> Nombre, edad, sexo, descripción física, fotografías y datos de la desaparición.</span></li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Finalidades del tratamiento</h2>
          <p className="text-gray-600 leading-relaxed mb-3">Los datos se utilizan exclusivamente para:</p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex gap-2"><span className="text-red-500 font-bold">·</span><span>Publicar información sobre personas desaparecidas para facilitar su localización.</span></li>
            <li className="flex gap-2"><span className="text-red-500 font-bold">·</span><span>Conectar a ciudadanos con información relevante con las familias de los desaparecidos.</span></li>
            <li className="flex gap-2"><span className="text-red-500 font-bold">·</span><span>Enviar alertas por correo a suscriptores cuando se registra un nuevo caso en su municipio.</span></li>
            <li className="flex gap-2"><span className="text-red-500 font-bold">·</span><span>Verificar y moderar el contenido publicado en la plataforma.</span></li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Confidencialidad de los datos</h2>
          <p className="text-gray-600 leading-relaxed">
            Los datos de contacto de los reportantes y de quienes proporcionan información son{' '}
            <strong>estrictamente confidenciales</strong>. Solo el administrador de la plataforma y,
            en su caso, la familia directa del desaparecido tienen acceso a ellos. No compartimos,
            vendemos ni cedemos datos personales a terceros bajo ninguna circunstancia.
          </p>
          <p className="text-gray-600 leading-relaxed mt-3">
            La información de personas desaparecidas (nombre, edad, descripción, fotografía) se publica
            de forma pública con el único fin de facilitar su localización. Si el reportante no otorga
            su consentimiento para mostrar datos públicamente, estos no serán visibles en la plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Transferencias de datos</h2>
          <p className="text-gray-600 leading-relaxed">
            No realizamos transferencias de datos personales a terceros con fines comerciales. Los datos
            son almacenados en servidores seguros (Railway / PostgreSQL) ubicados en Estados Unidos,
            con cifrado en tránsito y en reposo. Las fotografías son alojadas en Cloudinary con acceso
            restringido.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Derechos ARCO</h2>
          <p className="text-gray-600 leading-relaxed">
            Tienes derecho a <strong>Acceder, Rectificar, Cancelar u Oponerte</strong> al tratamiento
            de tus datos personales (derechos ARCO). Para ejercerlos, envía un correo a{' '}
            <a href="mailto:admin@desaparecidostamaulipas.mx" className="text-red-600 hover:underline">
              admin@desaparecidostamaulipas.mx
            </a>{' '}
            indicando tu nombre completo, el dato que deseas modificar o eliminar, y una copia de tu
            identificación oficial. Daremos respuesta en un plazo máximo de 20 días hábiles.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Suscripción a alertas</h2>
          <p className="text-gray-600 leading-relaxed">
            Si te suscribes a alertas por correo, puedes cancelar tu suscripción en cualquier momento
            desde el enlace al final de cada correo o visitando{' '}
            <Link href="/desuscribirse" className="text-red-600 hover:underline">/desuscribirse</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Cookies y tecnologías de rastreo</h2>
          <p className="text-gray-600 leading-relaxed">
            Esta plataforma utiliza únicamente cookies de sesión estrictamente necesarias para el
            funcionamiento del panel de administración. No utilizamos cookies de publicidad ni de
            rastreo de terceros.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">9. Cambios a este aviso</h2>
          <p className="text-gray-600 leading-relaxed">
            Nos reservamos el derecho de actualizar este aviso de privacidad. Cualquier cambio
            significativo será notificado a los suscriptores activos por correo electrónico.
          </p>
        </section>

      </div>

      <div className="mt-12 pt-8 border-t border-gray-100 flex gap-4">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">← Ir al inicio</Link>
        <Link href="/suscribirse" className="text-sm text-red-600 hover:text-red-700">Suscribirme a alertas</Link>
      </div>
    </div>
  )
}
