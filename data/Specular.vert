#version 420 core

// Vertex attributes
layout (location = 0) in vec4 position;
layout (location = 1) in vec3 normal;
layout (location = 2) in vec2 texcoord;

layout (std140) uniform bla {
	mat4 m_matrix;
	mat4 mv_matrix;
	mat4 view_matrix;
	mat4 proj_matrix;
	vec3 LightDir;
};

out VS_OUT {
	vec3 N;
	vec3 L;
	vec3 V;
	vec2 TexCoord;
} vs_out;

void main(void) {
	// Calculate view-space coordinate
	vec4 P = mv_matrix * position;

	// Calculate normal in view-space
	vs_out.N = mat3(mv_matrix) * normal;
	
	// Calculate light vector
	vs_out.L = -normalize(mat3(mv_matrix) * LightDir);

	// Calculate view vector
	vs_out.V = -P.xyz;

	// Calculate the clip-space position of each vertex
	gl_Position = proj_matrix * P;

	vs_out.TexCoord = texcoord;

	vec4 plane = vec4(0,1,0,0);
	gl_ClipDistance[0] = dot(plane, m_matrix * position);
}
