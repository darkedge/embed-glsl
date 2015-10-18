#version 420 core

// Vertex attributes
layout (location = 0) in vec4 position;
layout (location = 2) in vec2 texcoord;

uniform mat4 mvp_matrix;
uniform mat4 m_matrix; // Camera, position only

out vec3 modelPos;
out	vec2 TexCoord;
out vec4 pixelPos;

void main(void) {
	gl_Position = mvp_matrix * position;
	modelPos = vec3(position);
	pixelPos = m_matrix * position;

	TexCoord = texcoord;

	vec4 plane = vec4(0,1,0,0);
	gl_ClipDistance[0] = dot(plane, m_matrix * position);
}
