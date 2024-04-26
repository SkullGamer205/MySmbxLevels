#version 100

precision mediump float;

varying   vec2  v_texcoord;
varying   vec2  v_fbcoord;

uniform   sampler2D u_framebuffer;
uniform   sampler2D u_depth_buffer;

uniform   float u_clock;


const float shadowSoftness = 0.99;
const float shadowResolution = 0.25;
const vec2  roundTo = vec2(400.0, 300.0);

vec3 shadow(vec3 col, vec3 lightpos, vec2 pixpos)
{
//    pixpos = floor(pixpos * roundTo + 1.0 / 2.0) / roundTo;
    vec2 stp = -(lightpos.xy - pixpos);
    float stepnum = floor(length(stp * vec2(800.0, 600.0))*shadowResolution);
//    float stepnum = 10.0;
    stepnum = max(1.0, stepnum);
    stp = stp/stepnum;

    vec2 newpos = pixpos;
    vec3 adder = col/stepnum;
    vec3 agg = vec3(0.0);
    float mult = 1.0;
    for(float i = 0.0; i < stepnum; i++)
    {
        newpos -= stp;
        // float m = 1.0 - (texture2D(u_depth_buffer, newpos).r * 255.0);

        if(texture2D(u_depth_buffer, newpos).r < (1.0 / 2048.0))
            agg += adder;
        else
            mult *= shadowSoftness;
    }
    agg *= mult;

    return agg;
}


void main()
{
    gl_FragColor = texture2D(u_framebuffer, v_fbcoord);
    gl_FragColor.rgb *= shadow(vec3(1.0, 1.0, 1.0), vec3(0.5, 0.5, 0.0), v_fbcoord);
//    gl_FragColor.rgb = vec3(1.0, 0.0, 0.0);
//    gl_FragColor.a = 1.0;
}

