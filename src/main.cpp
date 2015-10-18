#include <stdio.h>
#include "parser.h"
#include "glad/glad.h"
#include "GLFW/glfw3.h"

void main(int argc, char *argv[]) {
	if (argc < 2) {
		printf("No file specified.\n");
		return;
	}
	FILE *file = fopen(argv[1], "r");
	if (!file) {
		printf("Could not open file.\n");
		return;
	}
	if (!glfwInit()) {
		printf("Could not load GLFW.\n");
	}
	glfwWindowHint(GLFW_VISIBLE, GL_FALSE);
	auto window = glfwCreateWindow(1, 1, "parser", nullptr, nullptr);
	glfwMakeContextCurrent(window);
	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress)) {
		printf("Could not load OpenGL symbols.\n");
	}
	Parse(file);
	
	fclose(file);

	glfwDestroyWindow(window);
	glfwTerminate();

	system("pause");
}