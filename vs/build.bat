@echo off
msbuild /v:m /p:Platform=x64;Configuration="Debug" embed-glsl.sln
