#version 100

precision mediump float;

varying   vec2  v_texcoord;
varying   vec2  v_fbcoord;

uniform   sampler2D u_texture;
uniform   sampler2D u_previous_pass;

uniform highp vec4 u_read_viewport;

uniform   float u_clock;
uniform   vec2 u_framebuffer_pixsize;
uniform   vec2 u_texture_pixsize;

const float c_alpha_test_thresh = (8.0 / 255.0);

void main()
{
    vec4 l_color = texture2D(u_texture, v_texcoord);

    if(l_color.a < c_alpha_test_thresh)
        discard;

    vec2 src = v_fbcoord.xy;

    // reflect about texcoord 0
    src.y -= 2.0 * v_texcoord.y / u_texture_pixsize.y * u_framebuffer_pixsize.y;

    // ripple
    float ripple = v_texcoord.y;
    src.x += ripple * sin((src.y + u_clock / 20.0) * 6.28) * 8.0 * u_framebuffer_pixsize.x;
    src.x += ripple * sin((src.x + src.y + u_clock / 12.0) * 6.28 * 4.0) * 2.0 * u_framebuffer_pixsize.x;

    src.y += ripple * sin((6.28 * src.y + 3.14 * src.x + u_clock / 10.0) * 6.28) * 6.0 * u_framebuffer_pixsize.y;

    // draw

    // don't read from locations off the viewport
    float left_x = u_read_viewport.z - u_read_viewport.x;
    float right_x = u_read_viewport.z + u_read_viewport.x;

    src.x = clamp(src.x, left_x, right_x);

    // don't draw reflections that would read from above the viewport
    float clip_y = u_read_viewport.w - u_read_viewport.y;

    if(src.y < clip_y)
        discard;

    // fully draw reflections that read from 32.0px or below
    float full_y = clip_y + 32.0 * u_framebuffer_pixsize.y;

    vec3 l_rbg = texture2D(u_previous_pass, src).rgb;

    gl_FragColor.rgb = 1.0 - (1.0 - l_rbg) * 0.75;
    gl_FragColor.b = 1.0 - (1.0 - gl_FragColor.b) * 0.75;

    if(src.y > full_y)
        gl_FragColor.a = 1.0;
    else
        gl_FragColor.a = (src.y - clip_y) / (full_y - clip_y);
}

