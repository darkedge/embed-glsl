@echo off
msbuild /t:Clean /v:m /p:Platform=x86;Configuration="Debug" embed-glsl.sln
msbuild /t:Clean /v:m /p:Platform=x86;Configuration="Release" embed-glsl.sln
msbuild /t:Clean /v:m /p:Platform=x64;Configuration="Debug" embed-glsl.sln
msbuild /t:Clean /v:m /p:Platform=x64;Configuration="Release" embed-glsl.sln
