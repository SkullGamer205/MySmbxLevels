#version 100

precision mediump float;

varying   vec2  v_texcoord;
varying   vec2  v_fbcoord;
varying   vec4  v_tint; 

uniform   sampler2D u_texture;
uniform   sampler2D u_framebuffer;

uniform   float u_clock;

uniform   vec2 u_texture_pixsize;
uniform   vec2 u_framebuffer_pixsize;


const float c_flow_rate = 5.0;
//uniform float u_flow_rate;

void main()
{
    float eccen = (v_texcoord.x - 0.5) * (v_texcoord.x - 0.5) * 4.0;

    vec3 l_color = texture2D(u_texture, v_texcoord).rgb;


    float flow_rate = c_flow_rate * (1.0 + 0.2 * (1.0 - eccen));

    if(flow_rate >= -0.1 && flow_rate <= 0.1)
        flow_rate = 0.1;

    float sqrt_rate = sign(flow_rate) * sqrt(abs(flow_rate));


    vec2 fbpix = v_fbcoord / u_framebuffer_pixsize;
    fbpix /= 2.0;

    fbpix = floor(fbpix);

    float main_time = sign(flow_rate) * -fbpix.y / 4.0 / sqrt_rate + u_clock * flow_rate * 3.14;
    float x_weight_1 = 2.0 * sin(0.7 * main_time);
    float x_weight_2 = 2.5 * cos(0.6 * main_time);
    float x_weight_3 = 1.5 * sin(0.4 * main_time);
    float x_weight_4 = 1.0 * cos(0.3 * main_time);

    x_weight_1 = x_weight_1 * x_weight_1;
    x_weight_2 = x_weight_2 * x_weight_2;
    x_weight_3 = x_weight_3 * x_weight_3;
    x_weight_4 = x_weight_4 * x_weight_4;

    float total_time = main_time + x_weight_1 * cos(fbpix.x * 0.3 * sqrt_rate) + x_weight_2 * cos(fbpix.x * 0.24 * sqrt_rate) + x_weight_3 * cos(fbpix.x * 1.2 * sqrt_rate) + x_weight_4 * cos(fbpix.x * 1.8 * sqrt_rate);

    float bubble = sin(total_time);
    bubble = bubble * bubble;
    bubble += eccen * 0.5;
    bubble /= 1.5;


    vec2 fbcoord_lens = v_fbcoord;
    fbcoord_lens.x -= (v_texcoord.x - 0.5) / u_texture_pixsize.x * u_framebuffer_pixsize.x;
    fbcoord_lens.x += eccen * 0.5 * sign(v_texcoord.x - 0.5) / u_texture_pixsize.x * u_framebuffer_pixsize.x;


    float peak_y = (1.0 - bubble) * flow_rate;

    vec3 l_bg = vec3(0.0);
    float div = 0.0;

    for(float i = 0.0; i < 10.0; i++)
    {
        float rate = 1.0 / ((i - peak_y) * (i - peak_y));

        vec2 quantum = vec2(0.0, u_framebuffer_pixsize.y);

        l_bg += texture2D(u_framebuffer, fbcoord_lens - sign(flow_rate) * i * quantum).rgb * rate;

        div += rate;
    }

    l_bg /= div;

    float rate = 0.8 + 0.2 * (1.0 - bubble);

    gl_FragColor.rgb = l_bg * rate + (1.0 - rate);
    gl_FragColor.rg *= rate;
    gl_FragColor.a = 1.0;
}
