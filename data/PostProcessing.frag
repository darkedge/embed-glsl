#version 420 core

layout( location = 0 ) out vec4 FragColor;
in vec2 texCoord;
uniform sampler2D colorTexture;
uniform sampler2D depthTexture;
uniform sampler2D randomTexture;
uniform sampler2D lensFlareTexture;
uniform vec3 hsvColor = vec3(0,0,1);
uniform vec3 depthOfField = vec3(0, 5, 10);
uniform vec2 iResolution;

/************************************************************************/
/* Color Correction                                                     */
/************************************************************************/
vec3 hsv2rgb( in vec3 hsv ) {
	vec3 rgb;
	if ( hsv.y == 0 ) {
		rgb.r = hsv.z;
		rgb.g = hsv.z;
		rgb.b = hsv.z;
		return rgb;
	}
	float hue = hsv.x;
	if ( hue >= 360 ) hue = 0;
	hue /= 60;
	float i = floor(hue);
	float ff = hue - i;
	float p = hsv.z * ( 1 - hsv.y );
	float q = hsv.z * ( 1 - ( hsv.y * ff ) );
	float t = hsv.z * ( 1 - ( hsv.y * ( 1 - ff ) ) );

	if(i == 0) {
		rgb.r = hsv.z;
		rgb.g = t;
		rgb.b = p;
	} else if (i == 1) {
		rgb.r = q;
		rgb.g = hsv.z;
		rgb.b = p;
	} else if (i == 2) {
		rgb.r = p;
		rgb.g = hsv.z;
		rgb.b = t;
	} else if (i == 3) {
		rgb.r = p;
		rgb.g = q;
		rgb.b = hsv.z;
	} else if (i == 4) {
		rgb.r = t;
		rgb.g = p;
		rgb.b = hsv.z;
	} else {
		rgb.r = hsv.z;
		rgb.g = p;
		rgb.b = q;
	}

	return rgb;
}

/************************************************************************/
/* Depth Of Field                                                       */
/************************************************************************/
// 32-point Poisson unit disk kernel - http://www.coderhaus.com/?p=11
const vec2 kernel[32] = vec2[] (
	vec2(-0.2289544, 0.4324208),
	vec2(0.04579107, 0.1657528),
	vec2(-0.4616842, 0.6508322),
	vec2(-0.1855972, -0.02261764),
	vec2(-0.5389659, 0.3199784),
	vec2(0.03343454, 0.6155744),
	vec2(-0.08521816, 0.9431103),
	vec2(-0.7498666, 0.5148172),
	vec2(-0.5952494, 0.01085974),
	vec2(0.2629267, 0.3850264),
	vec2(-0.9250976, -0.07812691),
	vec2(-0.425677, -0.2168834),
	vec2(-0.8478359, 0.2077164),
	vec2(-0.7492986, -0.3341179),
	vec2(0.1892892, 0.8694671),
	vec2(0.357883, -0.08518167),
	vec2(-0.1232791, -0.3178169),
	vec2(0.6016635, 0.1066361),
	vec2(0.439029, 0.666275),
	vec2(0.3859491, -0.4047928),
	vec2(0.1209506, -0.5661244),
	vec2(0.6042194, -0.2271243),
	vec2(0.9042909, -0.1079476),
	vec2(0.7055994, -0.634681),
	vec2(0.9010206, 0.2426511),
	vec2(0.7382721, 0.5499762),
	vec2(-0.5122826, -0.6115772),
	vec2(-0.1884605, -0.6784885),
	vec2(0.3806123, -0.6962301),
	vec2(0.02415066, -0.9426651),
	vec2(-0.3755532, -0.8992355),
	vec2(0.8621264, -0.3957876)
);

vec4 DoDepthOfField() {
	float angle = texture(randomTexture, texCoord).r * 6.283285;
	float sinTheta = sin(angle);
	float cosTheta = cos(angle);

	float FarPlane = 100;
	float NearPlane = 0.01;
	float DOFMin = depthOfField.x;
	float DOFMax = depthOfField.y;
	float kernelSize = depthOfField.z;
	float DOFFocus = (DOFMin + DOFMax) / 2;

	float NonLinearDepth = texture(depthTexture, texCoord).r;
	float depth = (2 * NearPlane) / (FarPlane + NearPlane - NonLinearDepth * (FarPlane - NearPlane));
	float actual_depth = (NearPlane + (depth * (FarPlane - NearPlane)));
	float bluriness = clamp(((actual_depth - DOFFocus) - DOFMin) / (DOFMax - DOFMin), -1.0, 1.0);
	float totalweight = 0.0f;
	vec4 finalcolor = vec4(0,0,0,0);
	for (int i = 0; i < 32; ++i)
	{
		vec2 k = kernel[i];
		k = vec2(k.x * cosTheta + k.y * sinTheta,	k.x * -sinTheta + k.y * cosTheta);

		float weight = 0.0;
		vec2 vec = texCoord + (k * bluriness * kernelSize) / iResolution;
		float SampleDepth = texture(depthTexture, vec).r;
		if (SampleDepth < NonLinearDepth)
		{
			float depth = (2 * NearPlane) / (FarPlane + NearPlane - SampleDepth * (FarPlane - NearPlane));
			float actual_depth = (NearPlane + (depth * (FarPlane - NearPlane)));
			float bluriness = clamp(((actual_depth - DOFFocus) - DOFMin) / (DOFMax - DOFMin), -1.0, 1.0);
			weight = abs(bluriness);
		}
		else
		{
			weight = 1.0;
		}
		totalweight += weight;
		finalcolor += texture(colorTexture, vec) * weight;
	}
	finalcolor /= totalweight;
	return finalcolor;
}

/************************************************************************/
/* Entry point                                                          */
/************************************************************************/
void main( void ) {
	vec4 pixel = DoDepthOfField();

	// Color correction
	vec3 hsvFilter = hsv2rgb(hsvColor);
	pixel = vec4(hsvFilter * pixel.xyz, 1.0);

	pixel += texture(lensFlareTexture, texCoord);

	FragColor = pixel;
}
