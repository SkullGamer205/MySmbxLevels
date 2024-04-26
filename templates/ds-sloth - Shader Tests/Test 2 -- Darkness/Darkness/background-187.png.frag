#version 100

precision mediump float;

varying   vec2  v_fbcoord;

uniform   sampler2D u_framebuffer;
uniform   sampler2D u_light_buffer;

void main()
{
    gl_FragColor = texture2D(u_framebuffer, v_fbcoord);
    gl_FragColor.rgb *= texture2D(u_light_buffer, v_fbcoord).rgb;
//    gl_FragColor.rgb = vec3(0.0,0.0,0.0);
//    gl_FragColor.a = 1.0 - texture2D(u_light_buffer, v_fbcoord).r;
}

