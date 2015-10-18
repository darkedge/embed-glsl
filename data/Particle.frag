#version 330 core

// Interpolated values from the vertex shaders
in vec2 UV;
in vec4 particlecolor;

// Ouput data
out vec4 color;

uniform sampler2D myTextureSampler;

void main(){
	//color = texture2D( myTextureSampler, UV ) * particlecolor;
	vec4 prev = particlecolor * texture2D( myTextureSampler, UV );
	color = mix(vec4(1,1,1,1), prev, prev.a);
}
