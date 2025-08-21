#version 100

//precision mediump float;
precision highp float;

varying   vec2  v_texcoord;
varying   vec2  v_fbcoord;

uniform   sampler2D u_depth_buffer;

uniform   float u_clock;


const float shadowSoftness = 0.95;
//const float shadowSoftness = 0.5;
const float shadowResolution = 0.5;

vec3 shadow(vec3 col, vec3 lightpos, float lightsize, vec2 pixpos)
{
    vec2 stp = -(lightpos.xy - pixpos);
    float len = length(stp * vec2(800.0, 600.0));
    if(len > lightsize)
        return vec3(0.0);
    col *= (lightsize * lightsize - (len + 1.0) * (len + 1.0)) / (lightsize * lightsize);

    float stepnum = floor(len*shadowResolution);
    const float stepmax = 400.0;
    stepnum = max(1.0, stepnum);
    stepnum = min(stepnum, stepmax);
    stp = stp/stepnum;

    float my_depth = texture2D(u_depth_buffer, pixpos).r;
    my_depth = max(1.0 / 2048.0, my_depth);

    float light_depth = lightpos.z;

    vec2 newpos = pixpos;
    vec3 adder = col/stepnum;
    vec3 agg = vec3(0.0);
    float mult = 1.0;
    for(float i = 0.0; i < stepmax; i++)
    {
        newpos -= stp;
        // float m = 1.0 - (texture2D(u_depth_buffer, newpos).r * 255.0);

        float depth_at = texture2D(u_depth_buffer, newpos).r;

        if(depth_at <= my_depth ^^ my_depth > light_depth)
            agg += adder;
        else
            mult *= shadowSoftness;

        if(i >= stepnum) break;
    }
    agg *= mult;

    return agg;
}

// const float TWOPI = 6.28;
const float TWOPI = 1.0;

void main()
{
//    gl_FragColor = texture2D(u_framebuffer, v_fbcoord);
    gl_FragColor.rgb = vec3(0.2, 0.2, 0.2);

    const float numLights = 32.0;

    for(float i = 0.0; i < numLights; i++)
    {
        float xSinPeriod = mod(i, 6.0) + 1.0;
        float ySinPeriod = mod(i / 6.0, 6.0) + 1.0;

        float xCosPeriod = mod(i / 7.0, 6.0) + 1.0;
        float yCosPeriod = mod(i / 8.0, 6.0) + 1.0;

        float xSinAmplitude = fract(i / 4.0) * 0.5;
        float ySinAmplitude = fract(i / 5.0) * 0.5;
        float xCosAmplitude = fract(i / 6.0) * 0.5;
        float yCosAmplitude = fract(i / 7.0) * 0.5;

        float lightX = 0.5 + xSinAmplitude * sin(u_clock * TWOPI / xSinPeriod) + xCosAmplitude * cos(u_clock * TWOPI / xCosPeriod);
        float lightY = 0.5 + ySinAmplitude * sin(u_clock * TWOPI / ySinPeriod) + yCosAmplitude * cos(u_clock * TWOPI / yCosPeriod);
        // float lightZ = (i + 1.0) / 64.0;
        float lightZ = 1.0;

        float lightSize = 100.0 + 100.0 * i / numLights + sin(xSinPeriod * u_clock + 2.0) * 50.0 + cos(yCosPeriod * u_clock + 1.0) * 40.0;
        float lightR = 3.0 / numLights * float(mod(i, 3.0) == 0.0);
        float lightG = 3.0 / numLights * float(mod(i, 3.0) == 1.0);
        float lightB = 3.0 / numLights * float(mod(i, 3.0) == 2.0);

        gl_FragColor.rgb += shadow(vec3(lightR, lightG, lightB), vec3(lightX, lightY, lightZ), lightSize, v_fbcoord);
    }
    gl_FragColor.a = 1.0;
}

