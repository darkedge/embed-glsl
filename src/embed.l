%option noyywrap
%option nounistd
%option nodefault

%{
#include "tokens.h"
%}

VertexShader					VertexShader
TessellationControlShader		TessellationControlShader
TessellationEvaluationShader	TessellationEvaluationShader
GeometryShader					GeometryShader
FragmentShader					FragmentShader
ComputeShader					ComputeShader
ID								[A-Z_a-z][A-Z_a-z0-9]*
String							\"[^\"]*\"

%%
"{"       						OnOpenBrace(yytext);
"}"        						OnCloseBrace(yytext);
"="								OnEquals(yytext);
";"								OnSemicolon(yytext);
{VertexShader}					OnKeyword(yytext);
{TessellationControlShader}		OnKeyword(yytext);
{TessellationEvaluationShader}	OnKeyword(yytext);
{GeometryShader}				OnKeyword(yytext);
{FragmentShader}				OnKeyword(yytext);
{ComputeShader}					OnKeyword(yytext);
{String}+						OnString(yytext);
{ID}							OnIdentifier(yytext);
"//".*
"/*"	{
			int c;

			while((c = yyinput()) != 0)
			{
				if(c == '\n')
					;

				else if(c == '*')
				{
					if((c = yyinput()) == '/')
						break;
					else
						unput(c);
				}
			}
		}
[ \t\n]+
.								OnError(yytext);
%%
