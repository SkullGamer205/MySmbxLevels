#version 100
precision mediump float;
varying   vec2      v_texcoord;
varying   vec4      v_tint;

void main()
{
  if((v_texcoord.x - 0.5) * (v_texcoord.x - 0.5)
    + (v_texcoord.y - 0.5) * (v_texcoord.y - 0.5) > 0.25)
      discard;

  gl_FragColor = v_tint;
  gl_FragColor *= v_texcoord.y;
}
