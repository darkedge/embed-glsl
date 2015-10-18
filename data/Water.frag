#version 420 core

layout (location = 0) out vec4 out_Color;

uniform vec3 sunColor;
uniform vec3 sunDirection;
uniform vec3 horizonColor;
uniform vec3 zenithColor;
uniform vec3 eye;
uniform float iGlobalTime; // shader playback time (in seconds)

in vec3 worldPosition;
in vec3 mvp_position;
in vec2 TexCoord;
in vec4 P;

uniform vec2 iResolution;
uniform mat4 mv_matrix;

uniform sampler2D normalSampler;
uniform sampler2D reflection_sampler;

vec4 getNoise( vec2 uv ) {
	float time = iGlobalTime / 1000.0;
	vec2 uv0 = ( uv / 0.103 ) + vec2( time / 0.017, time / 0.029 );
	vec2 uv1 = uv / 0.107 - vec2( time / -0.019, time / 0.031 ) + vec2( 0.00023 );
	vec2 uv2 = uv / vec2( 0.897, 0.983 ) + vec2( time / 0.101, time / 0.097 ) + vec2( 0.00051 );
	vec2 uv3 = uv / vec2( 0.991, 0.877 ) - vec2( time / 0.109, time / -0.113 ) + vec2( 0.00071 );
	vec4 noise = ( texture2D( normalSampler, uv0 ) ) +
				 ( texture2D( normalSampler, uv1 ) ) +
				 ( texture2D( normalSampler, uv2 ) ) +
				 ( texture2D( normalSampler, uv3 ) );
	return noise * 0.5 - 1.0;
}

// https://en.wikipedia.org/wiki/Phong_reflection_model
void main() {
	float TexCoordMultiplier = 16.0;
	vec2 uv = gl_FragCoord.xy / iResolution;

	//vec3 normal = vec3(texture(normalSampler, TexCoord * TexCoordMultiplier));

	vec3 normal = vec3(getNoise(TexCoord));

	// Reflection distortion
	//float dist = length(eye - worldPosition);
	//float distortionFactor = max(dist/100.0, 10.0);
	//vec2 distortion = normal.xz / distortionFactor;
	float distortionFactor = 0.02; // [0...1], I think

	vec2 distortion = -normal.xy * distortionFactor / mvp_position.z;

	vec3 reflection = vec3(texture(reflection_sampler, uv + distortion));

	vec3 N = normalize(mat3(mv_matrix) * normal);
	vec3 L = normalize(mat3(mv_matrix) * sunDirection);
	vec3 V = normalize(-P.xyz);

	// Calculate R locally
	vec3 R = reflect(L, N);

	float shininess = 128.0;
	vec3 specular_color = vec3(1.0, 1.0, 1.0);
	vec3 diffuse_color = vec3(0.2, 0.2, 0.6);

	// Compute the diffuse and specular components for each
	// fragment
	vec3 diffuse = max(dot(N, L), 0.0) * diffuse_color * reflection;
	vec3 specular = pow(max(dot(R, V), 0.0), shininess) * specular_color;

	// Ambient color hack
	vec3 ambient = 0.2 * reflection;

	// Write final color to the framebuffer
	out_Color = vec4(diffuse + specular + ambient, 0.8);
}
