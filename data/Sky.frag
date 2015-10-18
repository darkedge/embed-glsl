
#version 420 core

layout( location = 0 ) out vec4 out_Color;

in vec2 TexCoord;
in vec3 modelPos; // Vertices in model space
in vec4 pixelPos;

uniform vec3 SunPos;
uniform vec2 iResolution;
uniform vec2 SunPosScreen;
uniform vec2 MoonPosScreen;
uniform sampler1D texBright;
uniform sampler1D texDark;
uniform sampler2D texSun;
uniform sampler2D texMoon;
uniform sampler1D texSunGradient;

void main( void )
{
	float gradientTexCoord = fract( 1 - TexCoord.y );

	// Sun
	vec3 sun = vec3(0,0,0);
	{
		float sunSize = 100.0;
		float halfSize = sunSize / 2.0;
		vec2 diff = SunPosScreen * iResolution; // Pixel position of sun
		diff = gl_FragCoord.xy - diff; // Move axis to sun
		diff = clamp(diff, vec2(-halfSize), vec2(halfSize));
		diff /= vec2(sunSize, sunSize);
		diff += vec2( 0.5, 0.5 ); // Move origin to center of sprite
		vec3 color = texture( texSunGradient, gradientTexCoord ).rgb;
		sun = color * texture( texSun, diff ).rgb;
	}
	// Moon
	vec3 moon = vec3(0,0,0);
	{
		float moonSize = 50.0;
		float halfSize = moonSize / 2.0;
		vec2 diff = MoonPosScreen * iResolution; // Pixel position of moon
		diff = gl_FragCoord.xy - diff; // Move axis to moon
		diff = clamp(diff, vec2(-halfSize), vec2(halfSize));
		diff /= vec2(moonSize, moonSize);
		diff += vec2( 0.5, 0.5 ); // Move origin to center of sprite
		moon = texture( texMoon, diff ).rgb;
	}

	// Sky
	vec4 c = vec4(0,0,0,0);
	{
		float SunElevation = SunPos.y;

		SunElevation *= 20.0;

		vec3 pixelVec = normalize(pixelPos.xyz);

		float res = clamp(dot(SunPos,pixelVec), 0.0, 1.0);

		float SunElevationAbs = abs(SunElevation);
		float f = clamp(SunElevationAbs / 20.0, 0.0, 1.0);
		float d = 1.0;
		
		if (SunElevation < 0.0)
		{
			d = 1.0 - (clamp(SunElevation / -4.0, 0.0, 1.0) * 0.8);
		}

		vec4 bright = texture( texBright, 2 * modelPos.y ) * f;
		vec4 dark = ( texture( texDark, 2 * modelPos.y ) * ( vec4(1.0,0.59,0.16,0.0) * res ) ) * ( 1.0 - f );
		c = d * ( dark + bright );
	}	

	out_Color = vec4( c.rgb + sun + moon, 1.0 );
}
