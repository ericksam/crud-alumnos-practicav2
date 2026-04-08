-- CreateTables
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Aula" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Aula_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Alumno" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "aulaId" TEXT,
    CONSTRAINT "Alumno_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Curso" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "aulaId" TEXT,
    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Inscripcion" (
    "id" TEXT NOT NULL,
    "fechaInscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "alumnoId" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    CONSTRAINT "Inscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateIndexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Alumno_email_key" ON "Alumno"("email");
CREATE UNIQUE INDEX "Inscripcion_alumnoId_cursoId_key" ON "Inscripcion"("alumnoId", "cursoId");

-- AddForeignKeys
ALTER TABLE "Alumno" ADD CONSTRAINT "Alumno_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "Aula"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "Aula"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;