@echo off
echo 正在启动RehabHub项目...

echo 1. 安装依赖...
call npm install

echo.
echo 2. 启动后端服务器...
start cmd /k "npm run server"

echo.
echo 3. 等待3秒后启动前端...
timeout /t 3 /nobreak >nul

echo.
echo 4. 启动前端开发服务器...
start cmd /k "npm run dev"

echo.
echo 项目已启动！
echo 前端地址: http://localhost:3000
echo 后端地址: http://localhost:8000
echo.
echo 请等待浏览器自动打开...
timeout /t 5 /nobreak >nul

start http://localhost:3000

pause
