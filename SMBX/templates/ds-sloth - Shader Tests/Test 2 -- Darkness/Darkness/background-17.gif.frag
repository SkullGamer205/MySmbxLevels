#version 100

precision mediump float;

varying   vec2  v_texcoord;
varying   vec2  v_fbcoord;
varying   vec4  v_tint; 

uniform   sampler2D u_texture;
uniform   sampler2D u_framebuffer;
uniform   sampler2D u_previous_pass;

const float c_alpha_test_thresh = (8.0 / 255.0);

void main()
{
    vec4 l_color = texture2D(u_texture, v_texcoord);

    if(l_color.a < c_alpha_test_thresh)
        discard;

    vec2 src = v_texcoord.xy;
    src.y = 1.0 - src.y;

    vec3 l_bg = texture2D(u_previous_pass, src).rgb;

    gl_FragColor.rgb = l_bg;
    gl_FragColor.a = 1.0;
}

