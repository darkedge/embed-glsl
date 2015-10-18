#version 420 core

layout( location = 0 ) out vec4 FragColor;

in vec2 uv;
uniform sampler2D diffuseSampler;

void main( void ) {
	FragColor = texture( diffuseSampler, uv );
}
