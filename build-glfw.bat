@echo off
call config

pushd %GLFW_DIR%

:: 32-bit shared build
if not exist %WIN32_RELEASE% mkdir %WIN32_RELEASE%
pushd %WIN32_RELEASE%
cmake -G"Visual Studio 14 2015" -DBUILD_SHARED_LIBS=OFF ..
msbuild /v:m /p:Configuration="Release" src\glfw.vcxproj
popd

:: 64-bit shared build
if not exist %X64_RELEASE% mkdir %X64_RELEASE%
pushd %X64_RELEASE%
cmake -G"Visual Studio 14 2015 Win64" -DBUILD_SHARED_LIBS=OFF ..
msbuild /v:m /p:Configuration="Release" src\glfw.vcxproj
popd

popd