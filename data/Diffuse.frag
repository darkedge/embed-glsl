#version 420 core

layout( location = 0 ) out vec4 FragColor;

in VS_OUT {
	vec3 NormalW; // N
	vec2 TexCoord;
} fs_in;

uniform vec3 LightDir; // L
uniform sampler2D diffuseSampler;
uniform vec3 diffuse;
uniform vec3 ambient;

void main( void ) {
	vec4 AmbientColor = vec4( ambient, 1.0f );

	float DiffuseFactor = max(dot( normalize( fs_in.NormalW ), -LightDir ), 0);

	vec4 DiffuseColor = vec4( diffuse, 1.0f ) * DiffuseFactor;

	FragColor = texture( diffuseSampler, fs_in.TexCoord ) * ( AmbientColor + DiffuseColor );
}
