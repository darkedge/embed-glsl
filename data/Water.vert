#version 420 core

layout (location = 0) in vec4 position;

layout (location = 2) in vec2 texcoord;

uniform mat4 m_matrix;
uniform mat4 mv_matrix;
uniform mat4 mvp_matrix;

out vec3 worldPosition;
out vec3 mvp_position;
out vec2 TexCoord;
out vec4 P;

void main() {
	P = mv_matrix * position;
	worldPosition = (m_matrix * position).xyz;
	gl_Position = mvp_matrix * position;
	mvp_position = gl_Position.xyz;
	TexCoord = texcoord;
}
