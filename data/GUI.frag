#version 420 core

layout( location = 0 ) out vec4 FragColor;

in vec2 uv;
in vec4 color;
uniform sampler2D diffuseSampler;

void main( void ) {
	//FragColor = color * texture( diffuseSampler, uv );
	float alpha = texture(diffuseSampler, uv).r;
	FragColor = vec4(color.rgb, color.a * alpha);
}
