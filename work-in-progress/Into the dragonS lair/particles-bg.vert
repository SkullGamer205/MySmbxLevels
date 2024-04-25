#version 100
uniform   mat4 u_transform;

uniform   float u_clock;

uniform   float u_particle_z;

attribute float a_index;
attribute vec2 a_texcoord;

varying   vec2 v_texcoord;
varying   vec4 v_tint;


// 1 second
const float c_lifespan = 1.0;

const float num_lifespans_per_particle = 60.0 / c_lifespan;


float noise(in float x, in float seed)
{
    float y = fract(sin(x * 129.898 + seed * 78.233) * 43758.5453);
    return fract(cos(y * 167.842 + seed * 7.0234) * 54538.4375);
}


void adjust(in float position, out float identity, out float life_coord)
{
    float cur_lifespan = u_clock / c_lifespan + position;

    life_coord = fract(cur_lifespan);

    float lifespan_prop = floor(cur_lifespan) / num_lifespans_per_particle;
    identity = (lifespan_prop + position) / 2.0;
}


void main()
{
    float identity, life_coord;

    adjust(a_index, identity, life_coord);

    float opacity = 1.0 - (life_coord - 0.5) * (life_coord - 0.5) * 4.0;


    float base_x = noise(identity, 2.0) * 2.2 - 1.0;
    float base_y = noise(identity, 3.0) * 2.0 - 1.0;
    base_y = -1.1;

    vec2 offset = (a_texcoord - 0.5) * vec2(0.01, 0.3);

    float slope = -0.1 - 0.1 * noise(identity, 4.0);
    float speed = 2.2 + 2.5 * noise(identity, 5.0);

    float y = base_y + offset.y + life_coord * life_coord * speed;
    float x = base_x + offset.x + (offset.y + life_coord * life_coord * speed) * slope;

    gl_Position = vec4(x, y, u_particle_z, 1.0);

    v_texcoord = a_texcoord;

    v_tint = vec4(0.5 * noise(identity, 6.0) + 0.5, 0.5 * noise(identity, 6.0) + 0.5, 1.0, opacity);
}
