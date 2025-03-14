#version 100

precision mediump float;

varying   vec2  v_texcoord;

uniform   sampler2D u_texture;
uniform   sampler2D u_previous_pass;
uniform   sampler2D u_depth_buffer;

uniform   float u_clock;

uniform highp mat4 u_transform;
uniform highp vec4 u_read_viewport;

const float c_alpha_test_thresh = (8.0 / 255.0);

const float l = 24.0 / 128.0;
const float t = 26.0 / 128.0;

const float w = 80.0 / 128.0;
const float h = 60.0 / 128.0;

const float r = l + w;
const float b = t + h;


void main()
{
    vec4 l_color = texture2D(u_texture, v_texcoord);

    if(l_color.a < c_alpha_test_thresh)
        discard;

    if(v_texcoord.x < l || v_texcoord.x > r || v_texcoord.y < t || v_texcoord.y > b)
        gl_FragColor = texture2D(u_texture, v_texcoord);
    else
    {
        vec2 pixel_size = (u_transform * vec4(1.0, 1.0, 0.0, 0.0)).xy * u_read_viewport.xy;
        float pixel_ar = pixel_size.x / pixel_size.y;
        float viewport_ar = u_read_viewport.x / u_read_viewport.y;

        vec2 want_coord = vec2((v_texcoord.x - l) / w, (v_texcoord.y - t) / h) * 2.0 - 1.0;

        // zoom in as needed
#if 0
        if(viewport_ar < 1.0)
            want_coord.y *= viewport_ar;
        else if(viewport_ar > 1.0)
            want_coord.x /= viewport_ar;
#endif

        // zoom out as needed
        if(viewport_ar < 1.0)
            want_coord.x /= viewport_ar;
        else if(viewport_ar > 1.0)
            want_coord.y *= viewport_ar;

        if(abs(want_coord.x) > 1.0 || abs(want_coord.y) > 1.0)
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
        }

        vec2 scale_coord = want_coord * u_read_viewport.xy + u_read_viewport.zw;

        gl_FragColor = texture2D(u_previous_pass, scale_coord);
        return;
        // mock darness shader


        float depth = (texture2D(u_depth_buffer, vec2((v_texcoord.x - l) / w, (v_texcoord.y - t) / h)).r);
        float layer = floor(depth * 32.0) * 8.0;

        gl_FragColor.rgb = vec3(
            abs(layer - 56.0) < 0.01 || abs(layer - 96.0) < 0.01 || abs(layer - 136.0) < 0.01 || abs(layer - 40.0) < 0.01 ? 1.0 : 0.0,
            abs(layer - 64.0) < 0.01 || abs(layer - 120.0) < 0.01 || abs(layer - 88.0) < 0.01 ? 1.0 : 0.0,
            abs(layer - 16.0) < 0.01 || abs(layer - 88.0) < 0.01 || abs(layer - 40.0) < 0.01 ? 1.0 : 0.0
        );
        gl_FragColor.a = 1.0;
    }
}

