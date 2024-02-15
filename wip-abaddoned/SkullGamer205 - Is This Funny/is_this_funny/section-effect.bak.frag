#version 100

precision mediump float;

varying   vec2  v_fbcoord;

uniform   sampler2D u_framebuffer;
uniform   sampler2D u_light_buffer;
uniform   sampler2D u_depth_buffer;

void main()
{
    gl_FragColor = texture2D(u_framebuffer, v_fbcoord);
    gl_FragColor.rgb *= texture2D(u_light_buffer, v_fbcoord).rgb;

    float depth = texture2D(u_depth_buffer, v_fbcoord).r;
    float layer = floor(depth * 32.0) * 8.0;

    if(abs(layer - 96.0) < 0.01)
        gl_FragColor.g = 0.5 + gl_FragColor.g * 0.5;

    if(abs(layer - 40.0) < 0.01)
        gl_FragColor.r = 0.5 + gl_FragColor.r * 0.5;

    if(abs(layer - 64.0) < 0.01)
        gl_FragColor.b = 0.75 + gl_FragColor.r * 0.25;

//    gl_FragColor.rgb = vec3(0.0,0.0,0.0);
//    gl_FragColor.a = 1.0 - texture2D(u_light_buffer, v_fbcoord).r;
}
