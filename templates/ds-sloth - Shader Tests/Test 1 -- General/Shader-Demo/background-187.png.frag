#version 100

precision mediump float;

varying   vec2  v_texcoord;
varying   vec2  v_fbcoord;

uniform   sampler2D u_texture;
uniform   sampler2D u_framebuffer;
uniform   sampler2D u_depth_buffer;

uniform   float u_clock;

const float c_alpha_test_thresh = (8.0 / 255.0);

uniform   vec2 u_texture_pixsize;
uniform   vec2 u_framebuffer_pixsize;
const vec3 delta = vec3(0.25, 0.25, 0.25);


void main()
{
    vec4 l_color = texture2D(u_texture, v_texcoord);

    if(l_color.a < c_alpha_test_thresh)
        discard;

    vec2 sx = vec2(2.0 * u_framebuffer_pixsize.x, 0.0);
    vec2 sy = vec2(0.0, 2.0 * u_framebuffer_pixsize.y);

    vec3 c = texture2D(u_framebuffer, v_fbcoord).rgb;
    vec3 t = texture2D(u_framebuffer, v_fbcoord - sy).rgb;
    vec3 b = texture2D(u_framebuffer, v_fbcoord + sy).rgb;
    vec3 l = texture2D(u_framebuffer, v_fbcoord - sx).rgb;
    vec3 r = texture2D(u_framebuffer, v_fbcoord + sx).rgb;

    vec3 diff = (abs(c - t) + abs(c - b) + abs(c - l) + abs(c - r)) / 4.0;

    gl_FragColor = vec4(0.0, 0.1 * sin((v_texcoord.y * 48.0 + u_clock + 0.5 * cos(u_clock * 6.28318530718)) * 6.28318530718 * length(texture2D(u_texture, v_texcoord).rgb)) + 0.2, 0.0, 1.0);

    if(any(greaterThan(diff, delta)))
        gl_FragColor.g += length(texture2D(u_texture, v_texcoord).rgb * (1.0 - c));
}

