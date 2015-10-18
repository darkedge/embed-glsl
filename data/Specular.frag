#version 420 core

// Output
layout (location = 0) out vec4 out_Color;

// Input from vertex shader
in VS_OUT {
	vec3 N;
	vec3 L;
	vec3 V;
	vec2 TexCoord;
} fs_in;

// Material properties
uniform sampler2D diffuse_texture;
uniform vec3 diffuse_albedo;
uniform vec3 specular_albedo;
uniform float shininess;

void main(void) {
	// Normalize the incoming N, L, and V vectors
	vec3 N = normalize(fs_in.N);
	vec3 L = normalize(fs_in.L);
	vec3 V = normalize(fs_in.V);

	// Calculate R locally
	vec3 R = reflect(-L, N);

	// Compute the diffuse and specular components for each
	// fragment
	vec3 diffuse = max(dot(N, L), 0.0) * diffuse_albedo * vec3(texture(diffuse_texture, fs_in.TexCoord));
	vec3 specular = pow(max(dot(R, V), 0.0), shininess) * specular_albedo;

	// Ambient color hack
	vec3 ambient = 0.5 * vec3(texture(diffuse_texture, fs_in.TexCoord));

	// Write final color to the framebuffer
	//color = vec4(diffuse + specular, 1.0);
	out_Color = vec4(diffuse + specular + ambient, 1.0);
}
