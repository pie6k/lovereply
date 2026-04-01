"use client";

import { useEffect, useRef } from "react";
import styled from "styled-components";

const Canvas = styled.canvas`
  width: 100%;
  height: 260px;
  border-radius: 16px;
  margin-bottom: 32px;
  background: #000;

  @media (max-height: 700px) {
    height: 150px;
    margin-bottom: 16px;
  }
`;

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform float iTime;
  uniform vec2 iResolution;

  mat2 m(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
  }

  float map(vec3 p) {
    p.xz *= m(iTime * 0.4);
    p.xy *= m(iTime * 0.3);
    vec3 q = p * 2.0 + iTime;
    return length(p + vec3(sin(iTime * 0.7))) * log(length(p) + 1.0)
      + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;
  }

  void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    p *= 0.8;
    vec3 cl = vec3(0.0);
    float d = 2.5;
    for (int i = 0; i <= 5; i++) {
      vec3 rp = vec3(0.0, 0.0, 5.0) + normalize(vec3(p, -1.0)) * d;
      float rz = map(rp);
      float f = clamp((rz - map(rp + 0.1)) * 0.5, -0.1, 1.0);
      vec3 l = vec3(0.1, 0.3, 0.4) + vec3(5.0, 2.5, 3.0) * f;
      cl = cl * l + smoothstep(2.5, 0.0, rz) * 0.7 * l;
      d += min(rz, 1.0);
    }
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float vignette = smoothstep(0.0, 0.35, uv.x) * smoothstep(1.0, 0.65, uv.x)
                   * smoothstep(0.0, 0.35, uv.y) * smoothstep(1.0, 0.65, uv.y);
    cl *= vignette;
    gl_FragColor = vec4(cl, 1.0);
  }
`;

export function EtherShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      preserveDrawingBuffer: true,
      powerPreference: "low-power",
    });
    if (!gl) return;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERTEX_SHADER));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "iTime");
    const uRes = gl.getUniformLocation(prog, "iResolution");

    const startTime = performance.now();

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }

      gl.viewport(0, 0, w, h);
      gl.uniform1f(uTime, (performance.now() - startTime) / 1000);
      gl.uniform2f(uRes, w, h);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return <Canvas ref={canvasRef} />;
}
