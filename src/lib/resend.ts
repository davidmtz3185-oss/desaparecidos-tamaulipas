import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM_EMAIL ?? 'avisos@desaparecidostamaulipas.mx'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'

// ── Email: notificación al admin cuando llega un nuevo caso ──────────────────
export async function enviarNotificacionAdmin(data: {
  nombre: string
  municipio: string
  casoId: string
}) {
  await resend.emails.send({
    from: `Plataforma Desaparecidos <${FROM}>`,
    to: 'admin@desaparecidostamaulipas.mx',
    subject: `[Nuevo caso] ${data.nombre} — ${data.municipio}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#dc2626">Nuevo reporte pendiente de revisión</h2>
        <p>Se ha recibido un nuevo reporte de persona desaparecida que requiere tu revisión.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr>
            <td style="padding:8px;background:#f9fafb;font-weight:600;width:40%">Nombre</td>
            <td style="padding:8px;background:#f9fafb">${data.nombre}</td>
          </tr>
          <tr>
            <td style="padding:8px;font-weight:600">Municipio</td>
            <td style="padding:8px">${data.municipio}</td>
          </tr>
        </table>
        <a href="${APP_URL}/admin/casos/${data.casoId}"
           style="display:inline-block;background:#dc2626;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          Revisar caso
        </a>
        <p style="color:#9ca3af;font-size:12px;margin-top:32px">
          Plataforma Desaparecidos Tamaulipas · Solo para uso interno
        </p>
      </div>
    `,
  })
}

// ── Email: alerta a suscriptores cuando se publica un nuevo caso ─────────────
export async function enviarAlertaSuscriptor(data: {
  email: string
  nombre: string
  municipio: string
  casoId: string
  edad: number
  sexo: string
  fechaDesaparicion: string
}) {
  const fecha = new Date(data.fechaDesaparicion).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const sexoLabel = data.sexo === 'MASCULINO' ? 'Masculino' : 'Femenino'

  await resend.emails.send({
    from: `Alertas Desaparecidos <${FROM}>`,
    to: data.email,
    subject: `🚨 Nuevo caso en ${data.municipio}: ${data.nombre}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px;margin-bottom:24px">
          <p style="color:#dc2626;font-weight:700;margin:0;font-size:14px">🚨 ALERTA — Nuevo caso en ${data.municipio}</p>
        </div>
        <h2 style="color:#111827;margin-top:0">${data.nombre}</h2>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
          <tr>
            <td style="padding:8px;background:#f9fafb;font-weight:600;width:40%">Edad</td>
            <td style="padding:8px;background:#f9fafb">${data.edad} años</td>
          </tr>
          <tr>
            <td style="padding:8px;font-weight:600">Sexo</td>
            <td style="padding:8px">${sexoLabel}</td>
          </tr>
          <tr>
            <td style="padding:8px;background:#f9fafb;font-weight:600">Municipio</td>
            <td style="padding:8px;background:#f9fafb">${data.municipio}</td>
          </tr>
          <tr>
            <td style="padding:8px;font-weight:600">Desaparecido/a el</td>
            <td style="padding:8px">${fecha}</td>
          </tr>
        </table>
        <a href="${APP_URL}/casos/${data.casoId}"
           style="display:inline-block;background:#dc2626;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-bottom:24px">
          Ver caso completo
        </a>
        <p style="color:#6b7280;font-size:13px">
          Si tienes información sobre el paradero de esta persona, por favor comunícate a través
          de la plataforma o llama al <strong>911</strong>.
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
        <p style="color:#9ca3af;font-size:11px">
          Recibiste este correo porque estás suscrito a alertas de ${data.municipio}.
          <a href="${APP_URL}/desuscribirse" style="color:#9ca3af">Cancelar suscripción</a>
        </p>
      </div>
    `,
  })
}

// ── Email: confirmación al reportante cuando su caso es aprobado ─────────────
export async function enviarConfirmacionAprobacion(data: {
  email: string
  nombreReportante: string
  nombreDesaparecido: string
  casoId: string
}) {
  await resend.emails.send({
    from: `Plataforma Desaparecidos <${FROM}>`,
    to: data.email,
    subject: `Tu reporte fue aprobado — ${data.nombreDesaparecido}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin-bottom:24px">
          <p style="color:#16a34a;font-weight:700;margin:0">✓ Reporte publicado en la plataforma</p>
        </div>
        <h2 style="color:#111827;margin-top:0">Hola, ${data.nombreReportante}</h2>
        <p style="color:#374151">
          El reporte de <strong>${data.nombreDesaparecido}</strong> ha sido revisado y aprobado.
          Ya está visible públicamente en la plataforma y los suscriptores de alertas han sido notificados.
        </p>
        <a href="${APP_URL}/casos/${data.casoId}"
           style="display:inline-block;background:#dc2626;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-bottom:24px">
          Ver el caso publicado
        </a>
        <p style="color:#6b7280;font-size:13px">
          Si tienes actualizaciones sobre el caso, puedes contactarnos respondiendo a este correo.
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
        <p style="color:#9ca3af;font-size:11px">Plataforma Desaparecidos Tamaulipas</p>
      </div>
    `,
  })
}
