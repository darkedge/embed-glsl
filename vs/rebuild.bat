@echo off
msbuild /t:Rebuild /v:m /p:Platform=x64;Configuration="Debug" embed-glsl.sln
