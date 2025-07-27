@echo off
echo Starting Personal Inspiration Gallery...
echo.
echo Starting Backend Server...
start cmd /k "cd /d %~dp0 && npm run server"
timeout /t 3 /nobreak > nul
echo Starting Frontend Server...
start cmd /k "cd /d %~dp0 && npm run dev"
echo.
echo Both servers are starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
pause
