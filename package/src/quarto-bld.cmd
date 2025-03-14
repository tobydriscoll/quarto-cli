@ECHO OFF

if NOT DEFINED WIN_CONFIG_TRANSLATED call %~dp0\store_win_configuration.bat
call %~dp0\..\..\win_configuration.bat

if NOT DEFINED QUARTO_DENO (
  SET QUARTO_DENO=%~dp0\..\dist\bin\tools\deno.exe
)

"%QUARTO_DENO%" run --unstable --allow-read --allow-write --allow-run --allow-env --allow-net --allow-ffi --importmap=%~dp0\..\..\src\dev_import_map.json %~dp0\bld.ts %*
