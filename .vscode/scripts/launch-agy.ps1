# .vscode/scripts/launch-cli.ps1

# Limpa a tela para uma inicialização limpa
Clear-Host

Write-Host "Preparando ambiente da Workspace..." -ForegroundColor Cyan

# (Opcional) Aqui você poderia adicionar checagens lógicas, por exemplo:
# Esperar o backend ou containers Docker subirem antes de iniciar a TUI
# Start-Sleep -Seconds 2 

Write-Host "Iniciando Antigravity CLI..." -ForegroundColor Green
Write-Host "--------------------------------" -ForegroundColor DarkGray

# Executa o comando
agy