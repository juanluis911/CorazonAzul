# 🏗️ SCRIPT 2: CREAR ESTRUCTURA BASE DEL PROYECTO MENTE-AZUL
# Este script crea la estructura de directorios y archivos básicos VACÍOS

$projectPath = "C:\Users\JuanLuis.Ruiz\MenteAzul\menteazul"
$parentPath = "C:\Users\JuanLuis.Ruiz\MenteAzul"

Write-Host "🏗️ CREANDO ESTRUCTURA BASE DEL PROYECTO MENTE-AZUL" -ForegroundColor Green
Write-Host "📁 Ubicación: $projectPath" -ForegroundColor Cyan

# Crear directorio padre si no existe
if (-not (Test-Path $parentPath)) {
    New-Item -ItemType Directory -Path $parentPath -Force
    Write-Host "✅ Directorio padre creado: $parentPath" -ForegroundColor Green
}

# Crear directorio principal del proyecto
if (-not (Test-Path $projectPath)) {
    New-Item -ItemType Directory -Path $projectPath -Force
    Write-Host "✅ Directorio principal creado: $projectPath" -ForegroundColor Green
}

# Cambiar al directorio del proyecto
Set-Location $projectPath

Write-Host "📂 Creando estructura de directorios..." -ForegroundColor Yellow

# Crear estructura de directorios
$directories = @(
    "public",
    "src",
    "src/components",
    "src/components/common",
    "src/components/games",
    "src/components/layout",
    "src/pages",
    "src/styles",
    "src/utils",
    "src/hooks",
    "src/contexts",
    "src/config",
    "src/types",
    "src/assets",
    "src/assets/images",
    "src/assets/sounds",
    "docs",
    "api"
)

foreach ($dir in $directories) {
    $fullPath = Join-Path $projectPath $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "  ✅ $dir" -ForegroundColor Green
    }
}

Write-Host "📄 Creando archivos base vacíos..." -ForegroundColor Yellow

# Crear archivos base vacíos
$baseFiles = @(
    "package.json",
    "README.md",
    ".gitignore",
    "tsconfig.json",
    "tailwind.config.js",
    "postcss.config.js",
    "public/index.html",
    "public/manifest.json",
    "public/robots.txt",
    "src/index.tsx",
    "src/App.tsx",
    "src/App.css",
    "src/index.css",
    "src/react-app-env.d.ts",
    "docs/DEVELOPMENT.md",
    "docs/STRUCTURE.md"
)

foreach ($file in $baseFiles) {
    $fullPath = Join-Path $projectPath $file
    if (-not (Test-Path $fullPath)) {
        # Crear archivo vacío
        "" | Out-File -FilePath $fullPath -Encoding UTF8
        Write-Host "  ✅ $file" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🎉 ESTRUCTURA BASE CREADA EXITOSAMENTE!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Estructura creada:" -ForegroundColor Cyan
Write-Host "mente-azul/" -ForegroundColor White
Write-Host "├── public/" -ForegroundColor Gray
Write-Host "├── src/" -ForegroundColor Gray
Write-Host "│   ├── components/" -ForegroundColor Gray
Write-Host "│   ├── pages/" -ForegroundColor Gray
Write-Host "│   ├── styles/" -ForegroundColor Gray
Write-Host "│   ├── utils/" -ForegroundColor Gray
Write-Host "│   └── ..." -ForegroundColor Gray
Write-Host "├── docs/" -ForegroundColor Gray
Write-Host "├── api/" -ForegroundColor Gray
Write-Host "└── package.json (vacío)" -ForegroundColor Gray
Write-Host ""
Write-Host "⏭️ SIGUIENTE PASO:" -ForegroundColor Yellow
Write-Host "Solicita el archivo que quieres crear primero:" -ForegroundColor Cyan
Write-Host "  • package.json (recomendado primero)" -ForegroundColor White
Write-Host "  • src/index.tsx" -ForegroundColor White
Write-Host "  • public/index.html" -ForegroundColor White
Write-Host "  • etc..." -ForegroundColor White