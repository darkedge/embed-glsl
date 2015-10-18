#pragma once

void OnOpenBrace(const char *str);
void OnCloseBrace(const char *str);
void OnEquals(const char *str);
void OnSemicolon(const char *str);
void OnIdentifier(const char *str);
void OnString(const char *str);
void OnKeyword(const char *str);
void OnError(const char *str);
