#pragma once
#include <cstdio>
#include <string>

struct Program {
	std::string name;

	// Paths
	std::string vertexShader;
	std::string tessellationControlShader;
	std::string tessellationEvaluationShader;
	std::string geometryShader;
	std::string fragmentShader;
	std::string computeShader;
};

bool Parse(FILE *file);
