import { PrismaClient, EstadoCaso, Sexo, Relacion } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const casos = [
  {
    nombre: 'Carlos Eduardo Martínez López',
    edad: 34,
    sexo: Sexo.MASCULINO,
    fechaDesaparicion: new Date('2024-11-15'),
    municipio: 'Reynosa',
    colonia: 'Col. Rodríguez',
    descripcionFisica: 'Complexión delgada, cabello negro corto, ojos cafés, cicatriz en ceja derecha. Vestía playera azul y pantalón de mezclilla.',
    ultimaUbicacion: 'Boulevard Hidalgo esquina con Calle 10',
    estado: EstadoCaso.ACTIVO,
    esMenor: false,
    validadoPorAdmin: true,
    aprobadoEn: new Date('2024-11-16'),
    reportante: {
      nombre: 'María López Vda. de Martínez',
      telefono: '8991234567',
      email: 'maria.lopez.test@ejemplo.com',
      relacion: Relacion.FAMILIAR,
    },
  },
  {
    nombre: 'Ana Sofía Hernández Garza',
    edad: 17,
    sexo: Sexo.FEMENINO,
    fechaDesaparicion: new Date('2024-12-03'),
    municipio: 'Matamoros',
    colonia: 'Jardines de Matamoros',
    descripcionFisica: 'Cabello largo castaño, ojos verdes, 1.62m. Vestía uniforme escolar azul marino.',
    ultimaUbicacion: 'Salió de la Preparatoria Técnica Número 2 a las 14:00 hrs',
    estado: EstadoCaso.ACTIVO,
    esMenor: true,
    validadoPorAdmin: true,
    aprobadoEn: new Date('2024-12-03'),
    reportante: {
      nombre: 'Roberto Hernández Castro',
      telefono: '8681234567',
      email: 'r.hernandez.test@ejemplo.com',
      relacion: Relacion.FAMILIAR,
    },
  },
  {
    nombre: 'Miguel Ángel Torres Sánchez',
    edad: 45,
    sexo: Sexo.MASCULINO,
    fechaDesaparicion: new Date('2024-10-22'),
    municipio: 'Nuevo Laredo',
    colonia: 'Colonia Guerrero',
    descripcionFisica: 'Complexión robusta, cabello canoso, bigote, 1.75m. Vestía camisa a cuadros y botas café.',
    ultimaUbicacion: 'Salió a trabajar al rancho y no regresó',
    estado: EstadoCaso.ACTIVO_PENDIENTE,
    esMenor: false,
    validadoPorAdmin: false,
    reportante: {
      nombre: 'Lucía Sánchez de Torres',
      telefono: '8671234567',
      email: 'lucia.sanchez.test@ejemplo.com',
      relacion: Relacion.FAMILIAR,
    },
  },
  {
    nombre: 'Valeria Gómez Reyes',
    edad: 22,
    sexo: Sexo.FEMENINO,
    fechaDesaparicion: new Date('2024-09-10'),
    municipio: 'Reynosa',
    colonia: 'Colonia Hidalgo',
    descripcionFisica: 'Cabello negro corto, ojos cafés oscuros, tatuaje de rosa en antebrazo izquierdo, 1.58m.',
    ultimaUbicacion: 'Plaza Las Américas Reynosa',
    estado: EstadoCaso.LOCALIZADO_VIVO,
    esMenor: false,
    validadoPorAdmin: true,
    aprobadoEn: new Date('2024-09-11'),
    reportante: {
      nombre: 'Sandra Reyes Morales',
      telefono: '8991239999',
      email: 'sandra.reyes.test@ejemplo.com',
      relacion: Relacion.FAMILIAR,
    },
  },
  {
    nombre: 'José Luis Ramírez Castillo',
    edad: 28,
    sexo: Sexo.MASCULINO,
    fechaDesaparicion: new Date('2025-01-08'),
    municipio: 'Tampico',
    colonia: 'Col. Altamira',
    descripcionFisica: 'Delgado, cabello negro rizado, usa lentes de armazón negro. Vestía pants gris y tenis blancos.',
    ultimaUbicacion: 'Carretera Tampico-Mante km 12',
    estado: EstadoCaso.ACTIVO,
    esMenor: false,
    validadoPorAdmin: true,
    aprobadoEn: new Date('2025-01-09'),
    reportante: {
      nombre: 'Patricia Castillo Vda. de Ramírez',
      telefono: '8331234567',
      email: 'p.castillo.test@ejemplo.com',
      relacion: Relacion.FAMILIAR,
    },
  },
  {
    nombre: 'Daniela Flores Mendoza',
    edad: 15,
    sexo: Sexo.FEMENINO,
    fechaDesaparicion: new Date('2025-01-20'),
    municipio: 'Victoria',
    colonia: 'Col. Jardín',
    descripcionFisica: 'Cabello largo castaño claro con mechas, ojos miel, 1.60m, delgada. Vestía sudadera rosa y pantalón negro.',
    ultimaUbicacion: 'Centro de Ciudad Victoria, cerca del Palacio de Gobierno',
    estado: EstadoCaso.ACTIVO,
    esMenor: true,
    validadoPorAdmin: true,
    aprobadoEn: new Date('2025-01-20'),
    reportante: {
      nombre: 'Fernando Flores Ortiz',
      telefono: '8341234567',
      email: 'f.flores.test@ejemplo.com',
      relacion: Relacion.FAMILIAR,
    },
  },
  {
    nombre: 'Alejandro Ruiz Moreno',
    edad: 39,
    sexo: Sexo.MASCULINO,
    fechaDesaparicion: new Date('2024-08-14'),
    municipio: 'Matamoros',
    colonia: 'Col. Vista Hermosa',
    descripcionFisica: 'Moreno, cabello corto negro con entradas, 1.70m. Cicatriz en mejilla izquierda. Trabajaba en maquiladora.',
    ultimaUbicacion: 'Saliendo del turno nocturno de la empresa TECMA en Parque Industrial',
    estado: EstadoCaso.ARCHIVADO,
    esMenor: false,
    validadoPorAdmin: true,
    aprobadoEn: new Date('2024-08-15'),
    reportante: {
      nombre: 'Claudia Moreno de Ruiz',
      telefono: '8681239988',
      email: 'claudia.moreno.test@ejemplo.com',
      relacion: Relacion.FAMILIAR,
    },
  },
  {
    nombre: 'Paola Jiménez Vázquez',
    edad: 31,
    sexo: Sexo.FEMENINO,
    fechaDesaparicion: new Date('2025-02-01'),
    municipio: 'Nuevo Laredo',
    colonia: 'Colonia Moderna',
    descripcionFisica: 'Cabello lacio negro hasta los hombros, ojos cafés claros, 1.65m. Vestía vestido floreado y tenis blancos.',
    ultimaUbicacion: 'Terminal de autobuses de Nuevo Laredo',
    estado: EstadoCaso.ACTIVO_PENDIENTE,
    esMenor: false,
    validadoPorAdmin: false,
    reportante: {
      nombre: 'Jorge Vázquez Luna',
      telefono: '8671238877',
      email: 'j.vazquez.test@ejemplo.com',
      relacion: Relacion.FAMILIAR,
    },
  },
]

async function main() {
  console.log('Limpiando datos anteriores...')
  await prisma.informacion.deleteMany()
  await prisma.flagComportamiento.deleteMany()
  await prisma.recordatorio.deleteMany()
  await prisma.adminLog.deleteMany()
  await prisma.foto.deleteMany()
  await prisma.reportante.deleteMany()
  await prisma.personaDesaparecida.deleteMany()
  await prisma.adminUser.deleteMany()
  await prisma.suscriptorAlerta.deleteMany()

  console.log('Creando casos de prueba...')
  for (const caso of casos) {
    const { reportante, ...datosCaso } = caso
    await prisma.personaDesaparecida.create({
      data: {
        ...datosCaso,
        reportantes: {
          create: {
            ...reportante,
            aceptaDatosPublicos: true,
          },
        },
      },
    })
  }

  console.log('Creando usuario admin...')
  const passwordHash = await bcrypt.hash('Admin123!', 12)
  await prisma.adminUser.create({
    data: {
      email: 'admin@desaparecidostamaulipas.mx',
      passwordHash,
      nombre: 'Administrador',
      totpEnabled: false,
    },
  })

  console.log('Creando suscriptores de prueba...')
  await prisma.suscriptorAlerta.createMany({
    data: [
      { email: 'suscriptor1@ejemplo.com', municipiosInteres: ['Reynosa', 'Matamoros'] },
      { email: 'suscriptor2@ejemplo.com', municipiosInteres: ['Nuevo Laredo'] },
    ],
  })

  console.log(`✓ Seed completado: ${casos.length} casos, 1 admin, 2 suscriptores`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
