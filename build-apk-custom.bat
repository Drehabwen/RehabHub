@echo off
echo 正在构建Android APK...
echo.

echo 设置环境变量...
set JAVA_HOME=C:\Users\23849\Desktop\DEV\jdk-21.0.9
set ANDROID_HOME=C:\Users\23849\Desktop\DEV\android-sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME\tools;%ANDROID_HOME\platform-tools;%PATH%

echo 1. 构建Web应用...
call npm run build
if %errorlevel% neq 0 (
    echo 构建失败，请检查错误信息
    pause
    exit /b 1
)

echo.
echo 2. 同步到Android平台...
npx cap sync android
if %errorlevel% neq 0 (
    echo Android同步失败，请检查错误信息
    pause
    exit /b 1
)

echo.
echo 3. 构建Android APK...
cd android
call gradlew assembleDebug
if %errorlevel% neq 0 (
    echo APK构建失败，请检查错误信息
    pause
    exit /b 1
)

echo.
echo APK构建成功！
echo APK位置: android/app/build/outputs/apk/debug/app-debug.apk
echo.
echo 是否在模拟器中运行APK？(Y/N)
set /p choice=请输入选择:
if /i "%choice%"=="Y" (
    echo 正在模拟器中启动APK...
    cd ..
    npx cap run android
)
pause