@echo off
:: Kill all node processes (forcefully)
taskkill /IM node.exe /F
:: Delete the .next folder (quiet mode)
rmdir /S /Q .next
:: Start Next.js dev server on port 3000
npx next dev
pause

set PORT=3005
