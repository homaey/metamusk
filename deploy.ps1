# MetaMusk — Deploy Script
# Usage: .\deploy.ps1
# Run from repo root: C:\Users\HOSSEINI\Desktop\wwwwallet

$ErrorActionPreference = "Stop"
$ROOT = $PSScriptRoot

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  MetaMusk Deploy" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Build packages ────────────────────────────────────────────────────
Write-Host "[1/5] Building packages..." -ForegroundColor Yellow
npm run build -w @nova/wallet-core -w @nova/telegram-auth -w @nova/chains
if (-not $?) { Write-Host "ERROR: Package build failed" -ForegroundColor Red; exit 1 }
Write-Host "      Done" -ForegroundColor Green

# ── Step 2: Build miniapp ─────────────────────────────────────────────────────
Write-Host "[2/5] Building miniapp..." -ForegroundColor Yellow
npm run build -w apps/miniapp
if (-not $?) { Write-Host "ERROR: Miniapp build failed" -ForegroundColor Red; exit 1 }
Write-Host "      Done" -ForegroundColor Green

# ── Step 3: Deploy frontend to Surge ─────────────────────────────────────────
Write-Host "[3/5] Deploying frontend to Surge..." -ForegroundColor Yellow
Set-Location "$ROOT\apps\miniapp\dist"
surge --domain thirsty-person.surge.sh
Set-Location $ROOT
Write-Host "      https://thirsty-person.surge.sh" -ForegroundColor Green

# ── Step 4: Push to GitHub ────────────────────────────────────────────────────
Write-Host "[4/5] Pushing to GitHub..." -ForegroundColor Yellow
git add -A
git commit -m "deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm')" 2>$null
git push origin master
Write-Host "      Done" -ForegroundColor Green

# ── Step 5: Deploy API to Railway ─────────────────────────────────────────────
Write-Host "[5/5] Deploying API to Railway..." -ForegroundColor Yellow
railway up --detach
Write-Host "      Done" -ForegroundColor Green

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Deploy complete!" -ForegroundColor Green
Write-Host "  Frontend: https://thirsty-person.surge.sh" -ForegroundColor White
Write-Host "  Run 'railway open' to see API URL" -ForegroundColor White
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
