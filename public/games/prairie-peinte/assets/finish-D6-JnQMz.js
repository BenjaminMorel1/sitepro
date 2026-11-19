import{$ as e,A as t,B as n,C as r,H as i,I as a,J as o,L as s,R as c,S as l,Y as u,et as d,h as f,rt as p,tt as m,u as h}from"./man-C3WYLH7W.js";import{a as g,i as _,l as v,r as y,s as b}from"./figure-5IQIrrs-.js";var x=e=>`
uniform float uCell;   // this level's square of ground
uniform float uCell0;  // the finest square
uniform vec2 uOrigin;
uniform float uLevel;
uniform float uTop;
uniform float uNear;   // within this, everything is drawn at its true size
const float RN = ${e}.0;
// each: every dab of a square has its own descent (a carpet); otherwise they share it (the fronds of one clump)
bool ringCell(float salt, bool each, out vec2 cell, out float sub) {
  float id = float(gl_InstanceID);
  sub = floor(id / (RN * RN));
  float k = id - sub * RN * RN;
  vec2 block = uOrigin + vec2(mod(k, RN), floor(k / RN)) - RN * 0.5;
  float s = salt + (each ? sub * 17.0 : 0.0);
  if (uLevel < uTop - 0.5) {
    vec2 parent = floor(block * 0.5);
    vec2 pick = parent * 2.0 + step(0.5, hash4(parent, s + (uLevel + 1.0) * 3.3).xy);
    if (pick == block) return false;
  }
  cell = block;
  for (float i = uLevel; i > 0.5; i -= 1.0) cell = cell * 2.0 + step(0.5, hash4(cell, s + i * 3.3).xy);
  return true;
}
// How whole a dab of this level is at this distance, and (lod) how many times its true size things there are drawn.
float ringGrow(float dist, out float lod) {
  lod = max(dist / uNear, 1.0);
  if (uLevel > uTop - 0.5) return 1.0 - smoothstep(0.86, 1.0, dist / (RN * 0.5 * uCell));
  return smoothstep(0.0, 1.0, uLevel + 1.0 - log2(lod));
}
`;function S(e,{head:t=``,body:n,per:i,n:a,cell0:o,levels:s,minPx:c,maxPx:l,cells:u}){let f=new r,p=y(a*a*i),m=[];for(let r=0;r<s;r++){let i=o*2**r,h=_(e,{head:t+x(a),body:n,minPx:c,maxPx:l,cells:u,uniforms:{uCell:{value:i},uCell0:{value:o},uOrigin:{value:new d},uLevel:{value:r},uTop:{value:s-1},uNear:{value:a*o/4*.92}}}),v=g(p,h,2);f.add(v),m.push({cell:i,material:h})}return{group:f,follow(e,t){for(let n of m)n.material.uniforms.uOrigin.value.set(Math.floor(e/n.cell),Math.floor(t/n.cell))}}}var C=new a().set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1);function w(n,r){let i=new p(n,r,{depthBuffer:!0,generateMipmaps:!1});return i.depthTexture=new f(n,r,e),i.depthTexture.compareFunction=515,i.depthTexture.minFilter=i.depthTexture.magFilter=t,i}function T(e,t,r,{sun:i=v,size:a=[4096,2560],box:o=[165,104],centre:s=[0,11,-8],back:l=400,near:u=10,far:d=800}={}){let f=w(a[0],a[1]),p=new n(-o[0],o[0],o[1],-o[1],u,d),h=new m(...s);p.position.copy(h).addScaledVector(i,l),p.lookAt(h),p.updateMatrixWorld(!0),p.updateProjectionMatrix(),e.setRenderTarget(f),e.clear(),e.render(r,p),e.setRenderTarget(null),t.tTreeShade.value=f.depthTexture,t.uTreeShadeMat.value.copy(C).multiply(p.projectionMatrix).multiply(p.matrixWorldInverse);let g=w(256,256),_=new n(-3.2,3.2,3.2,-3.2,1,60);_.layers.set(1),t.tFigShade.value=g.depthTexture;let y=new c({side:2});return{update(n,r){_.position.set(r.x,r.y+1,r.z).addScaledVector(i,30),_.lookAt(r.x,r.y+1,r.z),_.updateMatrixWorld(!0),t.uFigShadeMat.value.copy(C).multiply(_.projectionMatrix).multiply(_.matrixWorldInverse);let a=n.overrideMaterial;n.overrideMaterial=y,e.setRenderTarget(g),e.clear(),e.render(n,_),e.setRenderTarget(null),n.overrideMaterial=a}}}function E(n,r,{samples:c=4}={}){let g=n.getDrawingBufferSize(new d),_=new p(g.x,g.y,{samples:c,depthBuffer:!0,generateMipmaps:!1});_.depthTexture=new f(g.x,g.y,e),_.texture.minFilter=_.texture.magFilter=t;let v={...r,tColor:{value:_.texture},tDepth:{value:_.depthTexture},uInvViewProj:{value:new a},uEye:{value:new m},uShafts:{value:1},uSteps:{value:22},uCanvas:{value:1},uSize:{value:g.clone()}},y=new u({glslVersion:l,uniforms:v,depthTest:!1,depthWrite:!1,vertexShader:`
      out vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,fragmentShader:`
      ${b}
      uniform sampler2D tColor;
      uniform sampler2D tDepth;
      uniform mat4 uInvViewProj;
      uniform vec3 uEye;
      uniform float uShafts;
      uniform float uSteps;
      uniform float uCanvas;
      uniform vec2 uSize;
      in vec2 vUv;
      layout(location = 0) out vec4 outC;

      float weave(vec2 p) {
        // warp and weft of a medium linen, each thread a little uneven
        vec2 q = p / 2.6;
        float n = texture(tNoise, p / 310.0).r;
        float a = sin(q.x * 3.14159) * sin(q.y * 3.14159 + floor(q.x) * 3.14159);
        return a * (0.3 + 1.4 * n * n);
      }

      void main() {
        vec3 col = texture(tColor, vUv).rgb;
        float depth = texture(tDepth, vUv).r;
        vec4 h = uInvViewProj * vec4(vUv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
        vec3 world = h.xyz / h.w;
        vec3 ray = world - uEye;
        float far = length(ray);
        ray /= far;

        // sun in the mist: walk the line of sight and count how much of the air along it stands in the light
        if (uShafts > 0.0) {
          float reach = min(far, 85.0);
          float jit = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
          float lit = 0.0, weight = 0.0;
          for (float i = 0.0; i < uSteps; i++) {
            float t = (i + jit) / uSteps;
            float w = exp(-t * reach * 0.022);
            lit += sunAt(uEye + ray * (t * reach)) * w;
            weight += w;
          }
          lit /= max(weight, 1e-3);
          float sunward = max(dot(ray, uSunDir), 0.0);
          float thick = 1.0 - exp(-reach * 0.03);
          // lit air glows toward the sun; shaded air is a touch darker and cooler than the plain mist
          float streak = 0.75 + 0.5 * texture(tNoise, vec2(dot(world.xz, vec2(uSunDir.z, -uSunDir.x)) * 0.11, world.y * 0.02)).g;
          vec3 glow = vec3(1.0, 0.86, 0.56) * (0.16 + 0.95 * pow(sunward, 2.5));
          col += glow * (lit - 0.34) * thick * streak * uShafts * 0.8;
        }

        if (uCanvas > 0.0) {
          vec2 px = vUv * uSize;
          float w = weave(px);
          float dx = weave(px + vec2(1.0, 0.0)) - w, dy = weave(px + vec2(0.0, 1.0)) - w;
          col *= 1.0 + (0.6 * dx - 0.8 * dy) * 0.022 * uCanvas + w * 0.006 * uCanvas;
        }
        // the brightest passages roll off toward the white of the paint and never past it
        vec3 over = max(col - 0.8, 0.0);
        col = min(col, 0.8) + over / (1.0 + over * 5.0);
        // varnish: a little more depth in the darks, the lights left alone
        col = mix(col, col * col * (3.0 - 2.0 * col), 0.22);
        outC = vec4(col, 1.0);
      }`}),x=new s(new i(2,2),y);x.frustumCulled=!1;let S=new o;S.add(x);let C=new h,w=new a;return{target:_,uniforms:v,resize(){n.getDrawingBufferSize(g),_.setSize(g.x,g.y),v.uSize.value.copy(g)},render(e,t){n.setRenderTarget(_),n.clear(),n.render(e,t),n.setRenderTarget(null),w.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),v.uInvViewProj.value.copy(w).invert(),v.uEye.value.copy(t.position),n.render(S,C)}}}export{T as n,S as r,E as t};