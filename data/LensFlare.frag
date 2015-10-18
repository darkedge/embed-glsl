#version 330 core

// Interpolated values from the vertex shaders
in vec2 texCoord;

// Ouput data
out vec4 out_color;

uniform vec2 iResolution;
uniform sampler2D tex_ghost0;
uniform sampler2D tex_ghost1;
uniform sampler1D tex_gradient;
uniform vec2 sunPos;
uniform float alpha;

const int numGhosts = 13;
const float ghostSizePixels[13] = float[] (
	600.0, 75.0, 180.0, 35.0, 110.0, 50.0, 35.0, 75.0, 130.0, 35.0, 55.0, 190.0, 375.0
);
const float ghostAlpha[13] = float[] (
	0.1, 0.15, 0.2, 0.1, 0.05, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.05
);
const float ghostSpacingRelativeScreen[13] = float[] (
	0.5, 1.0, 1.8, 0.2, 0.2, 1.0, 2.0, 0.3, 0.1, 1.0, 1.5, 1.5, 1.0
);
const int ghostType[13] = int[] (
	1,1,0,1,1,1,1,1,1,1,1,1,0
);

vec4 textureDistorted(
	in sampler2D tex,
	in vec2 texcoord,
	in vec2 direction,
	in vec3 distortion )
{
	return vec4(
		texture( tex, ( texcoord + direction * distortion.r ) ).r,
		texture( tex, ( texcoord + direction * distortion.g ) ).g,
		texture( tex, ( texcoord + direction * distortion.b ) ).b,
		1.0
	);
}

void main()
{
	vec2 PixelToTexCoord = vec2( 1.0, 1.0 ) / iResolution;

	// Get vector from light position to the center
	// Multiplied with a scalar
	vec2 ghostPosition = vec2(0.5, 0.5) + (sunPos - vec2( 0.5, 0.5 )) * 1.5;

	// Calculate spacing between ghosts
	vec2 spacing = vec2(0.5, 0.5) - ghostPosition;
	// Double it
	spacing *= 2;
	// Divide by numGhosts - 1
	spacing /= (numGhosts - 1);

	vec4 result = vec4( 0, 0, 0, 0 );

	// Ghosts
	for ( int i = 0; i < numGhosts; i++ )
	{
		float colorIndex = float(i) / (numGhosts - 1);
		vec3 colorMultiplier = texture(tex_gradient, colorIndex).rgb;

		// Pixel position of ghost
		vec2 ghostPixelPosition = ghostPosition * iResolution;
		vec2 thisPixelPosition = texCoord * iResolution;

		float ghostSize = ghostSizePixels[i];
		float halfSize = ghostSize / 2.0;

		vec2 diff = thisPixelPosition - ghostPixelPosition;
		// Clamp to ghost sprite bounds
		diff = clamp(diff, vec2(-halfSize), vec2(halfSize));
		// Convert to ghost UV
		diff /= vec2(ghostSize, ghostSize);
		// Map from [-0.5...0.5] to [0...1]
		diff += vec2(0.5, 0.5);

		vec4 sample = vec4(0,0,0,0);
		if(ghostType[i] == 1) {
			sample = texture(tex_ghost1, diff);
		} else {
			sample = texture(tex_ghost0, diff);
		}
		
		sample = vec4(sample.rgb * colorMultiplier, sample.a);

		result += sample * ghostAlpha[i];

		ghostPosition += spacing * ghostSpacingRelativeScreen[i];
	}

	result.a = alpha;

	out_color = result;
}
