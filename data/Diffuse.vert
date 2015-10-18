/*
	From ogldev.atspace.co.uk:
	There are many sources online that tell you that you need the transpose
	of the inverse of the world matrix in order to transform the normal vector.
	This is correct, however, we usually don't need to go that far.
	Our world matrices are always orthogonal (their vectors are always orthogonal).
	Since the inverse of an orthogonal matrix is equal to its transpose,
	the transpose of the inverse is actually the transpose of the transpose,
	so we end up with the original matrix. As long as we avoid doing distortions
	(scaling one axis differently than the rest) we are fine with the approach
	I presented above.
*/
#version 420 core

layout (location = 0) in vec4 Position;
layout (location = 1) in vec3 Normal;
layout (location = 2) in vec2 TexCoord;

uniform mat4 m_matrix;
uniform mat4 mvp_matrix;

out VS_OUT {
	vec3 NormalW;
	vec2 TexCoord;
} vs_out;

void main(void) {
	gl_Position = mvp_matrix * Position;
	vs_out.TexCoord = TexCoord;
	vs_out.NormalW = (transpose(inverse(m_matrix)) * vec4(Normal, 0)).xyz;

	vec4 plane = vec4(0,1,0,0);
	gl_ClipDistance[0] = dot(plane, m_matrix * Position);
}
