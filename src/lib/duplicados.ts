import { prisma } from '@/lib/prisma'

export interface CandidatoDuplicado {
  id: string
  nombre: string
  edad: number
  municipio: string
  fechaDesaparicion: string
  fotoPrincipal: string | null
  similitud: number
}

/**
 * Busca posibles duplicados usando similitud de texto con pg_trgm.
 * Umbral de similitud: 0.35 (ajustable)
 */
export async function buscarDuplicados(
  nombre: string,
  municipio: string,
  edad: number
): Promise<CandidatoDuplicado[]> {
  const umbral = 0.3
  const edadMargen = 3 // ±3 años

  // Usamos raw query para aprovechar pg_trgm similarity
  const resultados = await prisma.$queryRaw<
    Array<{
      id: string
      nombre: string
      edad: number
      municipio: string
      fechaDesaparicion: Date
      similitud: number
    }>
  >`
    SELECT
      id,
      nombre,
      edad,
      municipio,
      "fechaDesaparicion",
      similarity(nombre, ${nombre}) AS similitud
    FROM "PersonaDesaparecida"
    WHERE
      "validadoPorAdmin" = true
      AND estado NOT IN ('ARCHIVADO', 'RECHAZADO')
      AND similarity(nombre, ${nombre}) > ${umbral}
      AND ABS(edad - ${edad}) <= ${edadMargen}
    ORDER BY similitud DESC
    LIMIT 5
  `

  // Para cada resultado, obtenemos la foto principal
  const candidatos: CandidatoDuplicado[] = []

  for (const r of resultados) {
    const foto = await prisma.foto.findFirst({
      where: { personaId: r.id, esPrincipal: true },
      select: { urlCloudinary: true },
    })

    candidatos.push({
      id: r.id,
      nombre: r.nombre,
      edad: r.edad,
      municipio: r.municipio,
      fechaDesaparicion: new Date(r.fechaDesaparicion).toISOString(),
      fotoPrincipal: foto?.urlCloudinary ?? null,
      similitud: Number(r.similitud),
    })
  }

  return candidatos
}
