#version 420 core

layout (location = 0) in vec2 Position;
layout (location = 1) in vec2 TexCoord;
layout (location = 2) in vec4 Color;

uniform mat4 mvp_matrix;

out vec2 uv;
out vec4 color;

void main(void) {
	gl_Position = mvp_matrix * vec4(Position,0,1);
	uv = TexCoord;
	color = Color;
}
