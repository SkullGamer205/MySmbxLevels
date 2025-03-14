#version 100

precision mediump float;

varying   vec2  v_texcoord;
varying   vec2  v_fbcoord;
varying   vec4  v_tint; 

uniform   sampler2D u_texture;
uniform   sampler2D u_framebuffer;
uniform   sampler2D u_previous_pass;

uniform   float u_clock;

const float c_alpha_test_thresh = (8.0 / 255.0);

void main()
{
    vec4 l_color = texture2D(u_texture, v_texcoord);

    if(l_color.a < c_alpha_test_thresh)
        discard;

    vec2 src = v_fbcoord.xy;
    if(src.y < 0.8)
        discard;

    src.y = 0.8 - (src.y - 0.8);


    // ripple
    float ripple = 1.0 - v_fbcoord.y;
    src.x += ripple * sin((src.y + u_clock / 20.0) * 6.28) * .01;
    src.x += ripple * sin((src.x + src.y + u_clock / 12.0) * 6.28 * 4.0) * .002;

    src.y += ripple * sin((6.28 * src.y + 3.14 * src.x + u_clock / 10.0) * 6.28) * .01;

    // reflection

//    src.xy += vec2(0.25, 0.25);
    vec3 l_bbg = texture2D(u_framebuffer, src).rgb;
    vec3 l_rbg = texture2D(u_previous_pass, src).rgb;

    gl_FragColor.rgb = 1.0 - (1.0 - l_rbg) * 0.75;
    gl_FragColor.b = 1.0 - (1.0 - gl_FragColor.b) * 0.75;
    gl_FragColor.a = 1.0;
}

