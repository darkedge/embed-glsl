#version 420 core

layout (location = 0) in vec4 Position;
layout (location = 2) in vec2 TexCoord;

uniform mat4 mvp_matrix;

out vec2 uv;

void main(void) {
	gl_Position = mvp_matrix * Position;
	uv = TexCoord;
}
