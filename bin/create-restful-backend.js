#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Función para copiar directorios y archivos de manera recursiva
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

const templateDir = path.resolve(__dirname, '../template');
const projectDir = path.resolve(process.cwd(), process.argv[2] || 'mi-backend');

if (fs.existsSync(projectDir)) {
  console.error(`El directorio ${projectDir} ya existe.`);
  process.exit(1);
}

fs.mkdirSync(projectDir);
copyRecursiveSync(templateDir, projectDir);

console.log(`Proyecto creado en ${projectDir}`);

// Instalar dependencias
execSync('npm install', { cwd: projectDir, stdio: 'inherit' });
