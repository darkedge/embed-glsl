#include "parser.h"
#include "tokens.h"
#include <string>
#include <vector>

extern FILE *yyin;
extern int yylex(void);

enum ShaderType {
	VertexShader,
	TessellationControlShader,
	TessellationEvaluationShader,
	GeometryShader,
	FragmentShader,
	ComputeShader,
} s_currentShader;

bool s_success = true;

std::vector<Program> s_programs;

Program s_currentProgram;

enum State {
	AfterIdentifier,
	AfterString,
	AfterOpenBrace,
	AfterCloseBrace,
	AfterEquals,
	AfterSemicolon,
	AfterKeyword,
	AfterError,
} s_state = AfterCloseBrace;

void OnOpenBrace(const char *str) {
	switch (s_state) {
	case AfterIdentifier:
		s_state = AfterOpenBrace;
		break;
	default:
		printf("Unexpected token: %s\n", str);
		s_success = false;
		break;
	}
}

void OnCloseBrace(const char *str){
	switch (s_state) {
	case AfterOpenBrace:
	case AfterSemicolon:
		s_state = AfterCloseBrace;

		s_programs.push_back(s_currentProgram);

		break;
	default:
		printf("Unexpected token: %s\n", str);
		s_success = false;
		break;
	}
}

void OnEquals(const char *str){
	switch (s_state) {
	case AfterKeyword:
		s_state = AfterEquals;
		break;
	default:
		printf("Unexpected token: %s\n", str);
		s_success = false;
		break;
	}
}

void OnSemicolon(const char *str){
	switch (s_state) {
	case AfterString:
		s_state = AfterSemicolon;
		break;
	default:
		printf("Unexpected token: %s\n", str);
		s_success = false;
		break;
	}
}

void OnIdentifier(const char *str) {
	switch (s_state) {
	case AfterCloseBrace:
		s_state = AfterIdentifier;

		printf("Adding program: %s\n", str);
		s_currentProgram.name = str;

		break;
	default:
		printf("Unexpected token: %s\n", str);
		s_success = false;
		break;
	}
}

void OnString(const char *str){
	switch (s_state) {
	case AfterEquals:
		s_state = AfterString;

		switch (s_currentShader) {
		case VertexShader:
			s_currentProgram.vertexShader = str;
			break;
		case TessellationControlShader:
			s_currentProgram.tessellationControlShader = str;
			break;
		case TessellationEvaluationShader:
			s_currentProgram.tessellationEvaluationShader = str;
			break;
		case GeometryShader:
			s_currentProgram.geometryShader = str;
			break;
		case FragmentShader:
			s_currentProgram.fragmentShader = str;
			break;
		case ComputeShader:
			s_currentProgram.computeShader = str;
			break;
		}

		break;
	default:
		printf("Unexpected token: %s\n", str);
		s_success = false;
		break;
	}
}

void OnKeyword(const char *str){
	switch (s_state) {
	case AfterOpenBrace:
	case AfterSemicolon:
		s_state = AfterKeyword;

		if (strcmp("VertexShader", str) == 0) {
			s_currentShader = VertexShader;
		}
		else if (strcmp("TessellationControlShader", str) == 0) {
			s_currentShader = TessellationControlShader;
		}
		else if (strcmp("TessellationEvaluationShader", str) == 0) {
			s_currentShader = TessellationEvaluationShader;
		}
		else if (strcmp("GeometryShader", str) == 0) {
			s_currentShader = GeometryShader;
		}
		else if (strcmp("FragmentShader", str) == 0) {
			s_currentShader = FragmentShader;
		}
		else if (strcmp("ComputeShader", str) == 0) {
			s_currentShader = ComputeShader;
		}

		break;
	default:
		printf("Unexpected token: %s\n", str);
		s_success = false;
		break;
	}
}

void OnError(const char *str){
	printf("Could not parse token: %s\n", str);
	s_success = false;
}

bool Parse(FILE *file) {
	s_success = true;
	yyin = file;
	yylex();
	return s_success;
}
