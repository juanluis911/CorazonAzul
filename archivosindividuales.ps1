# 📝 SCRIPT 3: CREADOR DE ARCHIVOS INDIVIDUALES
# Este script te permite crear archivos específicos uno por uno

$projectPath = "C:\Users\JuanLuis.Ruiz\MenteAzul\menteazul"

# Verificar que el proyecto existe
if (-not (Test-Path $projectPath)) {
    Write-Host "❌ Error: El proyecto no existe en $projectPath" -ForegroundColor Red
    Write-Host "💡 Ejecuta primero el Script 2 para crear la estructura" -ForegroundColor Yellow
    exit
}

# Cambiar al directorio del proyecto
Set-Location $projectPath

Write-Host "📝 CREADOR DE ARCHIVOS INDIVIDUALES" -ForegroundColor Green
Write-Host "📁 Proyecto: $projectPath" -ForegroundColor Cyan
Write-Host ""

# Función para crear archivo
function New-ProjectFile {
    param(
        [string]$FilePath,
        [string]$Content
    )
    
    try {
        # Crear directorios padre si no existen
        $directory = Split-Path $FilePath -Parent
        if ($directory -and (-not (Test-Path $directory))) {
            New-Item -ItemType Directory -Path $directory -Force | Out-Null
        }
        
        # Crear archivo con contenido
        $Content | Out-File -FilePath $FilePath -Encoding UTF8 -NoNewline
        Write-Host "✅ Archivo creado: $FilePath" -ForegroundColor Green
        
        # Verificar que se creó correctamente
        if (Test-Path $FilePath) {
            $size = (Get-Item $FilePath).Length
            Write-Host "   📊 Tamaño: $size bytes" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "❌ Error creando $FilePath`: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Lista de archivos disponibles
Write-Host "📋 ARCHIVOS DISPONIBLES PARA CREAR:" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔧 CONFIGURACIÓN:" -ForegroundColor Cyan
Write-Host "  1. package.json (RECOMENDADO PRIMERO)" -ForegroundColor White
Write-Host "  2. tsconfig.json" -ForegroundColor White
Write-Host "  3. tailwind.config.js" -ForegroundColor White
Write-Host "  4. .gitignore" -ForegroundColor White
Write-Host ""
Write-Host "🌐 PUBLIC:" -ForegroundColor Cyan
Write-Host "  5. public/index.html" -ForegroundColor White
Write-Host "  6. public/manifest.json" -ForegroundColor White
Write-Host ""
Write-Host "⚛️ REACT CORE:" -ForegroundColor Cyan
Write-Host "  7. src/index.tsx" -ForegroundColor White
Write-Host "  8. src/App.tsx" -ForegroundColor White
Write-Host "  9. src/index.css" -ForegroundColor White
Write-Host ""
Write-Host "🎮 COMPONENTES:" -ForegroundColor Cyan
Write-Host "  10. Landing Page" -ForegroundColor White
Write-Host "  11. Header/Footer" -ForegroundColor White
Write-Host "  12. Páginas de juegos" -ForegroundColor White
Write-Host ""

# Instrucciones de uso
Write-Host "💡 INSTRUCCIONES DE USO:" -ForegroundColor Yellow
Write-Host "Este script está preparado para crear archivos bajo demanda." -ForegroundColor White
Write-Host "Simplemente dime qué archivo quieres y te lo creo con el contenido correcto." -ForegroundColor White
Write-Host ""
Write-Host "🚀 RECOMENDACIÓN DE ORDEN:" -ForegroundColor Green
Write-Host "1. Empieza con: 'Dame el package.json'" -ForegroundColor White
Write-Host "2. Luego: 'Dame el src/index.tsx'" -ForegroundColor White
Write-Host "3. Después: 'Dame el public/index.html'" -ForegroundColor White
Write-Host "4. Y así sucesivamente..." -ForegroundColor White
Write-Host ""
Write-Host "✨ ¡Listo para crear archivos! Dime cuál quieres." -ForegroundColor Green