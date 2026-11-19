import{A as e,C as t,F as n,H as r,I as i,J as a,K as o,L as s,M as c,P as l,Q as u,R as d,S as f,U as p,V as m,W as h,Y as g,Z as _,a as v,b as y,c as b,d as x,et as S,f as C,i as w,l as ee,m as T,nt as E,p as te,s as ne,tt as D,y as re}from"./man-C3WYLH7W.js";import{i as ie,n as ae,r as O,t as k}from"./noise-B7r2aWeR.js";import{a as A,i as oe,n as se,r as ce,t as le}from"./camera-BQwrb13s.js";import{a as j,c as ue,d as de,i as M,n as fe,o as pe,r as N,s as me,u as he}from"./figure-5IQIrrs-.js";import{n as ge,r as _e,t as ve}from"./finish-D6-JnQMz.js";var P=`
uniform vec3 uGlow; // x: how strongly the aurora burns just now (about 0.6..1.3)
uniform vec4 uWarm[3]; // the cabin's lit openings: where each is, and how strong (+ it looks south, - north)
uniform vec4 uRoom; // the cabin's floor: its middle (x, z) and half its width and depth

// Indoors: no snow lies there and none blows through.
bool inRoom(vec2 xz) { return abs(xz.x - uRoom.x) < uRoom.z && abs(xz.y - uRoom.y) < uRoom.w; }
// The light of the cabin's windows and door on what is outside them: a wedge that widens away from each opening.
float warmAt(vec3 P, vec3 Nn) {
  float sum = 0.0;
  for (int i = 0; i < 3; i++) {
    vec3 to = uWarm[i].xyz - P;
    float front = sign(uWarm[i].w) * (P.z - uWarm[i].z);
    float d2 = dot(to, to);
    float wedge = smoothstep(0.0, 0.8, front) * smoothstep(0.35, 1.3, front / (abs(to.x) + 0.4));
    sum += abs(uWarm[i].w) * wedge * clamp(dot(Nn, to) * inversesqrt(d2 + 1e-4) * 0.6 + 0.5, 0.0, 1.0) / (1.0 + d2 * 0.3);
  }
  return sum;
}

// How lit a spot is by the moon, for paint3: flat snow is in the light, ground turned from the moon in half-tone,
// and whatever the horns' shadow covers in shade.
float moonOn(vec3 P, vec3 Nn) {
  return woodSunAt(P + Nn * 0.6 + vec3(0.0, 0.3, 0.0)) * clamp(dot(Nn, uSunDir) * 1.4 + 0.06, 0.0, 1.0);
}
// The aurora's light comes down in slow patches that wander over the land; only what faces the sky takes it.
float auroraOn(vec2 xz, vec3 Nn) {
  float patch_ = texture(tNoise, xz / 900.0 + vec2(uTime * 0.009, -uTime * 0.0055)).r;
  return clamp(uGlow.x * smoothstep(0.2, 0.75, patch_) * max(Nn.y, 0.0), 0.0, 0.85);
}
// Snow: a blue white under the moon, mint where the aurora is on it. kind drifts slowly over the ground:
// packed snow, wind crust (greyer), and now and then blue ice.
vec3 snowPaint(float x, float r, float a, float kind) {
  vec3 L = mix(vec3(0.42, 0.6, 0.74), vec3(0.3, 0.68, 0.64), a);
  vec3 M = mix(vec3(0.16, 0.29, 0.46), vec3(0.1, 0.36, 0.42), a);
  vec3 S = mix(vec3(0.05, 0.1, 0.25), vec3(0.035, 0.13, 0.23), a);
  float crust = smoothstep(0.52, 0.66, kind), ice = smoothstep(0.8, 0.9, kind);
  L = mix(L, L * vec3(0.84, 0.9, 0.9), crust); M = mix(M, M * vec3(0.9, 0.96, 0.92), crust);
  L = mix(L, vec3(0.26, 0.58, 0.72), ice); M = mix(M, vec3(0.07, 0.28, 0.44), ice);
  return paint3(L, M, S, x, r);
}
// Rock: nearly black, blue in the shade, a grey green where the moon finds it; kind moves it between a cold
// slate and a warmer, browner stone.
vec3 rockPaint(float x, float r, float kind) {
  vec3 L = mix(vec3(0.12, 0.2, 0.28), vec3(0.16, 0.17, 0.27), smoothstep(0.45, 0.7, kind));
  vec3 M = mix(vec3(0.04, 0.07, 0.12), vec3(0.06, 0.06, 0.115), smoothstep(0.45, 0.7, kind));
  vec3 S = vec3(0.012, 0.024, 0.055);
  return paint3(L, M, S, x, r);
}

// Paint in the lantern's light is a warm colour of its own, not the night's colour with orange added (that only
// greys it): the nearer the lamp, the more wholly a thing is its own colour in that light.
vec3 lampOn(vec3 c, vec3 own, vec3 P, vec3 Nn) {
  float k = clamp((lampAt(P, Nn) + warmAt(P, Nn)) * 1.55, 0.0, 1.0);
  float whole = pow(k, 1.1);
  vec3 warm = own * vec3(1.0, 0.72, 0.38);
  // (the second part keeps the edge of the pool a warm light on the snow, where a plain mix of blue shade and
  // orange would go to mud)
  return mix(c, warm, whole) + warm * 0.4 * k * (1.0 - whole);
}

// The sky with nothing in it: deep above, a green teal low down where the aurora's light hangs in the air, and a
// pale ring round the moon.
vec3 nightSky(vec3 v) {
  if (v.y < 0.0) return airColour(v);
  float up = pow(clamp(v.y, 0.0, 1.0), 0.5);
  vec3 c = mix(vec3(0.04, 0.15, 0.2), vec3(0.01, 0.036, 0.09), up);
  float north = max(-v.z, 0.0) / max(length(v.xz), 1e-4);
  c += vec3(0.015, 0.11, 0.08) * north * north * exp(-pow((v.y - 0.24) / 0.3, 2.0)) * uGlow.x;
  float moon = max(dot(v, uSunDir), 0.0);
  c += vec3(0.1, 0.14, 0.18) * pow(moon, 30.0) + vec3(0.25, 0.3, 0.32) * pow(moon, 600.0);
  return mix(airColour(v), c, smoothstep(0.0, 0.06, v.y));
}
// Where the aurora is, roughly, for things that only catch its glow (water).
vec3 auroraSoft(vec3 v) {
  float az = atan(v.x, -v.z);
  float band = exp(-pow((v.y - 0.3 - 0.05 * sin(az * 3.0 + uTime * 0.02)) / 0.13, 2.0));
  float low = 0.55 * exp(-pow((v.y - 0.17) / 0.06, 2.0));
  return vec3(0.08, 0.6, 0.38) * (band + low) * smoothstep(1.7, 0.4, abs(az)) * uGlow.x;
}
`,ye=new D(-.78,.44,.3).normalize(),F=(e,t,n)=>{let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)},be=(e,t,n)=>{let r=Math.max(0,Math.min(1,.5+.5*(t-e)/n));return t+(e-t)*r-n*r*(1-r)},I=e=>30*Math.sin(e/140)+12*Math.sin(e/47+1),xe=e=>222+28*Math.exp(-(((e-150)/80)**2)),Se={x:I(300),z:300};I(150);var L={x:I(-64)-.5,y:226.6,z:-64},Ce=[{x:I(-175)+4,z:-175,top:378,fall:1.52,sx:.94,sz:-.34,sheer:3,turn:.2},{x:I(-175)-96,z:-226,top:318,fall:1.5,sx:-.9,sz:-.44,sheer:1.8,turn:1.9}];Ce[0];function we(e,t,n){let r=e-n.x,i=t-n.z,a=r*n.sx+i*n.sz;a>0&&(r+=n.sx*a*(n.sheer-1),i+=n.sz*a*(n.sheer-1));let o=Math.hypot(r,i),s=o*(1+.5*(1-Math.abs(Math.cos(1.5*(Math.atan2(i,r)-n.turn))))*F(0,30,o)+.26*k(e/52+n.x,t/52)+.09*k(e/19,t/19+n.z));return n.top-n.fall*100*(s/100)**.76}function Te(e,t,n){let r=e-I(t),i=Math.abs(r),a=r<0?.95:.72,o=15+16*Math.exp(-(((t-150)/60)**2)),s=xe(t)-a*(Math.sqrt(r*r+o*o)-o);s+=16*k(e/190+2.3,t/190-1.1)*F(15,120,i),s+=5*k(e/55,t/55+7)*F(8,60,i);let c=1-Math.abs(k(t/44+.5*k(e/90,t/90),e/420+3));s-=15*c*c*c*F(30,150,i),s+=.9*k(e/17+3,t/17)*F(3,25,i)+.3*k(e/9,t/9+2);let l=-be(-we(e,t,Ce[0]),-we(e,t,Ce[1]),10),u=F(-6,30,l-s),d=Math.max(0,k(e/27+11,t/27-4)-.4);s+=24*d**1.15*F(8,26,i)*(1-u),s=-be(-s,-l,14);let f=Math.max(u,.4*F(60,150,i),F(.05,.3,d)*(1-u)),p=s+.42*e+.2*t+9*k(e/90,t/90),m=F(-.25,.3,k(e/33+5,t/33-2));s+=f*(1.6*m*Math.sin(p*.571)+2.6*u*Math.sin(p*.17+1.3));let h=512-(e*e*e*e+t*t*t*t)**.25;s=be(s,1.25*(h-18),22);let g=Math.hypot(e-L.x,t-L.z);return g<27&&(s+=(L.y-s)*F(27,9,g)),n[0]=s,n[1]=u,s}var R=ue,z=new Float32Array(R*R),Ee=new Uint8Array(R*R*4),De=e=>-512+e/(R-1)*2*512;async function Oe(e){let t=[0,0];for(let n=0;n<R;n++){e&&n%24==0&&await e(.8*n/R);let r=De(n);for(let e=0;e<R;e++)z[e+n*R]=Te(De(e),r,t),Ee[(e+n*R)*4+1]=Math.round(255*t[1])}for(let t=0;t<R;t++){e&&t%64==0&&await e(.8+.2*t/R);for(let e=0;e<R;e++){let n=Math.max(0,e-1),r=Math.min(R-1,e+1),i=Math.max(0,t-1),a=Math.min(R-1,t+1),o=(z[r+t*R]-z[n+t*R])/(r-n),s=(z[e+a*R]-z[e+i*R])/(a-i),c=1/Math.sqrt(1+o*o+s*s),l=(e+t*R)*4,u=De(e),d=De(t),f=.64+.05*(Ee[l+1]/255);Ee[l]=Math.round(255*F(f+.05,f-.05,c+.07*k(u/9,d/9)+.14*Math.max(0,k(u/41+8,d/41)))),Ee[l+2]=Math.round(255*c),Ee[l+3]=255}}}function B(e,t){let n=Math.min(R-1.001,Math.max(0,(e+512)/1024*(R-1))),r=Math.min(R-1.001,Math.max(0,(t+512)/1024*(R-1))),i=Math.floor(n),a=Math.floor(r),o=n-i,s=r-a,c=z[i+a*R],l=z[i+1+a*R],u=z[i+(a+1)*R],d=z[i+1+(a+1)*R];return(c+(l-c)*o)*(1-s)+(u+(d-u)*o)*s}function ke(e,t){let n=(Math.min(R-1,Math.max(0,Math.round((e+512)/1024*(R-1))))+Math.min(R-1,Math.max(0,Math.round((t+512)/1024*(R-1))))*R)*4;return[Ee[n]/255,Ee[n+1]/255]}function Ae(e,t,n=new D){let r=1.2;return n.set(B(e-r,t)-B(e+r,t),2*r,B(e,t-r)-B(e,t+r)).normalize()}function je(t){let n=new T(z,R,R,h,y);n.minFilter=n.magFilter=e,n.needsUpdate=!0;let i=new T(Ee,R,R);i.minFilter=i.magFilter=e,i.needsUpdate=!0,t.tHeight.value=n,t.tLand.value=i,t.uExtent.value=512;let o=new r(1024,1024,512,512);o.rotateX(-Math.PI/2);let c=o.attributes.position;for(let e=0;e<c.count;e++)c.setY(e,B(c.getX(e),c.getZ(e))-.06);let l=new g({glslVersion:f,uniforms:t,vertexShader:`
      ${me}
      out vec3 vWorld;
      void main() { vWorld = position; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }`,fragmentShader:`
      ${me}
      ${P}
      in vec3 vWorld;
      layout(location = 0) out vec4 outC;
      void main() {
        if (vWorld.y < -3.0) discard;
        vec4 m = texture(tLand, landUv(vWorld.xz));
        vec3 Nn = normalAt(vWorld.xz);
        // near the eye it is asked square by ragged square, so that it is in touches; far off, point by point
        float near = 1.0 - smoothstep(25.0, 110.0, distance(vWorld, cameraPosition));
        vec4 n = texture(tNoise, vWorld.xz / 3.1);
        vec2 sq = mix(vWorld.xz, floor(vWorld.xz / 0.7 + (n.rg - 0.5) * 1.8) * 0.7, near);
        vec3 P = vec3(sq.x, vWorld.y, sq.y);
        float x = moonOn(P, Nn);
        float wide = texture(tNoise, vWorld.xz / 37.0).b;
        vec3 snow = snowPaint(x, wide, auroraOn(vWorld.xz, Nn), wide) * 0.9;
        vec3 rock = rockPaint(x, n.b, wide) * 0.85;
        vec3 c = mix(snow, rock, step(0.5, m.r + (n.a - 0.5) * 0.3));
        c = lampOn(c, mix(vec3(0.8), vec3(0.4), m.r), vWorld, Nn);
        outC = vec4(hazed(c, vWorld), 1.0);
      }`}),u=new s(o,l);u.frustumCulled=!1;let p=new s(o,new d({side:2}));p.frustumCulled=!1;let m=new a;m.add(p);function _(e=512,t=512){let n=new Float32Array((e+1)*(e+1));for(let r=0;r<=e;r++)for(let i=0;i<=e;i++)n[i+r*(e+1)]=B(-t+r/e*2*t,-t+i/e*2*t);return{heights:n,cells:e,half:t}}return{mesh:u,shade:m,heightField:_}}var Me=`
void makeDab(inout Dab d) {
  vec2 cell; float sub;
  if (!ringCell(0.0, true, cell, sub)) { d.alive = 0.0; return; }
  vec4 r = hash4(cell, sub * 3.0 + 1.0);
  vec4 q = hash4(cell + 31.7, sub + 11.0);
  vec2 xz = (cell + r.xy) * uCell0;
  float lod;
  float dist = distance(xz, cameraPosition.xz);
  d.alive = ringGrow(dist, lod);
  if (d.alive <= 0.0) return;
  float h = heightAt(xz);
  if (h < 0.5 || max(abs(xz.x), abs(xz.y)) > uExtent || inRoom(xz)) { d.alive = 0.0; return; }
  vec3 P = vec3(xz.x, h, xz.y);
  vec3 Nn = normalAt(xz);
  vec4 m = texture(tLand, landUv(xz));
  float x = moonOn(P, Nn);
  vec3 contour = normalize(cross(Nn, vec3(0.0, 1.0, 0.0)) + vec3(1e-4, 0.0, 0.0));
  vec3 c1, c2, own;
  if (m.r + (q.x - 0.5) * 0.35 > 0.5) {
    // rock underfoot; further off the scattered strokes have it
    d.alive *= 1.0 - smoothstep(70.0, 130.0, dist);
    float kind = texture(tNoise, xz / 41.0).g;
    c1 = rockPaint(x, q.y, kind);
    c2 = rockPaint(x + 0.1, q.w, kind + 0.2) * 1.3;
    d.dir = normalize(mix(cross(contour, Nn), contour, step(0.7, r.z)) + (q.xyz - 0.5) * 0.5);
    d.size = uCell0 * vec2(1.0 + 0.6 * r.z, 1.9 + 1.2 * r.w) * lod;
    own = vec3(0.45, 0.42, 0.42);
  } else {
    float a = auroraOn(xz, Nn);
    float kind = texture(tNoise, xz / 23.0).r + (q.z - 0.5) * 0.25;
    c1 = snowPaint(x, q.y, a, kind);
    c2 = snowPaint(x + 0.14, q.w, a, kind + 0.12);
    // here and there the crust throws the moon straight back
    if (q.w > 0.955 && x > 0.6) c2 = vec3(0.72, 0.9, 0.9);
    // the wind has cut the snow into long low waves; where the ground turns, the strokes follow its form
    float wa = (texture(tNoise, xz / 31.0).a - 0.5) * 1.7 + (q.y - 0.5) * 0.5;
    vec3 along = vec3(uWind.x * cos(wa) - uWind.y * sin(wa), 0.0, uWind.x * sin(wa) + uWind.y * cos(wa));
    d.dir = normalize(mix(along, contour, smoothstep(0.97, 0.8, Nn.y)));
    d.size = uCell0 * vec2(0.9 + 0.5 * r.z, 2.4 + 1.6 * r.w) * lod;
    own = vec3(0.95);
  }
  d.pos = P;
  d.c1 = hazed(lampOn(jitter(c1, r.wzy, 0.3), own, P, Nn), P);
  d.c2 = hazed(lampOn(jitter(c2, q.wzy, 0.3), own * 1.12, P, Nn), P);
  d.seed = dot(cell, vec2(1.0, 57.0)) + sub * 0.37;
  d.turnabout = 1.0;
  d.lie = 1.0;
  d.nrm = Nn;
  d.height = (0.03 + 0.07 * q.z) * pow(lod, 0.35);
  d.glaze = 1.0;
}
`,Ne=`
void makeDab(inout Dab d) {
  vec4 r = hash4(aData.x);
  vec4 q = hash4(aData.x * 1.7 + 41.0);
  vec3 P = aPos, Nn = normalize(aNrm);
  float dist = distance(P, cameraPosition);
  float x = moonOn(P, Nn);
  vec3 contour = normalize(cross(Nn, vec3(0.0, 1.0, 0.0)) + vec3(1e-4, 0.0, 0.0));
  vec3 down = cross(contour, Nn);
  vec3 c, own;
  if (aData.y > 0.5) {
    // close to, the strokes lying on the rock have it
    d.alive = smoothstep(10.0, 34.0, dist);
    if (d.alive <= 0.0) return;
    float kind = texture(tNoise, P.xz / 41.0).g + (q.x - 0.5) * 0.2;
    c = rockPaint(x, q.y, kind);
    // most strokes run down the rock; some lie along its beds, and those on a ledge are the snow caught there
    bool bed = r.z > 0.8 && aData.z < 0.97;
    d.dir = normalize((bed ? contour : down) + (q.xyz - 0.5) * 0.45);
    if (bed && Nn.y > 0.42 && q.w > 0.35) c = snowPaint(x + 0.1, q.y, 0.5 * auroraOn(P.xz, Nn), 0.3);
    // the sky's green finds the upper edges of things
    c += vec3(0.0, 0.05, 0.035) * max(Nn.y, 0.0) * uGlow.x;
    d.size = vec2(1.3, 3.8) * (0.65 + 0.9 * r.y) * aData.w;
    own = vec3(0.45, 0.42, 0.42);
  } else {
    d.alive = smoothstep(120.0, 240.0, dist);
    if (d.alive <= 0.0) return;
    float kind = texture(tNoise, P.xz / 23.0).r + (q.z - 0.5) * 0.25;
    c = snowPaint(x, q.y, 0.6 * auroraOn(P.xz, Nn), kind);
    // on open slopes the strokes follow the form round; on the horns snow lies in streaks down the rock
    d.dir = normalize(mix(contour, down, mix(0.25 + 0.5 * q.x, 0.9, aData.z)) + (q.yzw - 0.5) * 0.25);
    d.size = vec2(2.6, 7.5) * (0.7 + 0.8 * r.y) * aData.w;
    own = vec3(0.95);
  }
  // seen edge on, at the skyline, a stroke is kept small: the outline of a mountain is drawn, not feathered
  d.size *= mix(0.45, 1.0, smoothstep(0.05, 0.5, abs(dot(Nn, normalize(cameraPosition - P)))));
  c = lampOn(jitter(c, r.wzy, 0.32), own, P, Nn);
  d.pos = P + Nn * 0.12;
  d.c1 = hazed(c, P);
  d.c2 = hazed(c * 1.3 + vec3(0.0, 0.01, 0.015), P);
  d.seed = aData.x;
  d.turnabout = 1.0;
  d.lift = 0.15;
}
`;function Pe(e){let n=_e(e,{head:P,body:Me,per:2,n:192,cell0:.4,levels:4,minPx:[5,9],maxPx:[4e3,4e3],cells:[0,8]}),r=ae(4141),i=[],a=new D,o=0,s=0;for(let e=0;e<26e5&&o<26e4;e++){let e=(r()*2-1)*512,t=(r()*2-1)*512,n=B(e,t);if(n<1.5)continue;let[c,l]=ke(e,t),u=c>.5;r()>(u?.5:.07+.5*l)||(Ae(e,t,a),i.push([e,n,t,a.x,a.y,a.z,r()*1e3,+!!u,l,u?1.2+.5*l:1+.2*l]),u?o++:s++)}i.sort((e,t)=>e[2]-t[2]);let c=i.length,l=new Float32Array(c*3),u=new Float32Array(c*3),d=new Float32Array(c*4);i.forEach((e,t)=>{l.set(e.slice(0,3),t*3),u.set(e.slice(3,6),t*3),d.set(e.slice(6),t*4)});let f=j(N(c,{aPos:[l,3],aNrm:[u,3],aData:[d,4]}),M(e,{head:P+`in vec3 aPos; in vec3 aNrm; in vec4 aData;`,body:Ne,minPx:[6,14],maxPx:[150,380],cells:[0,8],depthWrite:!1}),3),p=new t;return p.add(n.group,f),{group:p,follow:n.follow,counts:{rock:o,snow:s}}}var Fe=11e3,Ie=`
// Where the foot of curtain k is at u (-1 west .. 1 east), in metres from the eye.
vec3 foot(float u, float k) {
  float t = uTime;
  if (k < 0.5) {
    float ph = u * 8.0 - t * 0.05; // the great folds travel east
    return vec3(11000.0 * u + 1500.0 * sin(ph),
      2300.0 + 260.0 * sin(u * 5.0 + t * 0.05) + 90.0 * sin(u * 31.0 - t * 0.7),
      -9200.0 + 2300.0 * cos(ph * 0.83 + 0.5) + 800.0 * sin(u * 19.0 + t * 0.33) + 260.0 * sin(u * 47.0 - t * 0.65));
  }
  if (k < 1.5) return vec3(16000.0 * u + 800.0 * sin(u * 6.0 + t * 0.04), 2700.0 + 120.0 * sin(u * 23.0 + t * 0.5),
    -17500.0 + 1600.0 * sin(u * 5.0 + 1.3 + t * 0.03) + 500.0 * sin(u * 29.0 - t * 0.4));
  // The third is seen along its length: a river of it that comes up out of the north behind the horn, climbs,
  // and passes overhead. u is the angle it is seen at from straight above, so that its strokes are as thick on
  // the canvas far off as near.
  float z = 2600.0 * tan(mix(-1.46, 1.15, u * 0.5 + 0.5));
  return vec3(1900.0 + 1500.0 * sin(z / 2600.0 + t * 0.05) + 420.0 * sin(z / 700.0 - t * 0.33), 2600.0 + 120.0 * sin(z / 500.0 + t * 0.6), z);
}
// One stroke of a curtain. Every stroke is planted: it starts at a height on the curtain (s0, a share of the
// curtain's height above its foot) and runs from there, so the loaded end of the brush is where it starts and the
// dry, broken end is where it leaves off. The curtain's lower edge is nothing but the feet of its rays.
struct Hang { vec3 P; float u; float s; float I; float len; float edge; float surge; };
Hang hang(vec4 aC, float s0) {
  Hang h;
  float k = aC.w;
  // carried along the curtain: east on the near ones, west on the far one
  float u = fract(aC.x + uTime * (k > 0.5 && k < 1.5 ? -0.002 : 0.0032)) * 2.0 - 1.0;
  h.u = u;
  // where along the curtain the light is: broad reaches of it, the rays within them going with the strokes, and
  // a finer shimmer running against them
  float reach = smoothstep(0.3, 0.7, texture(tNoise, vec2(u * 0.33 + uTime * 0.004 + k * 0.31, 0.21 + k * 0.17)).r);
  // (the river is seen from close under it, where its rays must be finer or they are lumps; and it never quite
  // goes out, or overhead it would be a string of beads)
  float near = step(1.5, k);
  reach = max(reach, 0.5 * near);
  float ray = mix(1.0, 0.45, near) * texture(tNoise, vec2(u * mix(5.0, 17.0, near) - uTime * 0.028, 0.63 + k * 0.29)).g + 0.33 * near;
  float fine = texture(tNoise, vec2(u * mix(21.0, 55.0, near) + uTime * 0.07, 0.11 + k * 0.4)).b;
  // and now and then a surge: one wave of brightness that travels the whole length of the curtain, through its
  // dark reaches too, with the rays leaping up as it passes
  h.surge = exp(-pow((fract(u * 0.5 + 0.5 - uTime * 0.035 + k * 0.37) - 0.5) / 0.07, 2.0));
  h.I = max(reach, 0.55 * h.surge) * (0.3 + 0.7 * smoothstep(0.3, 0.75, ray)) * (0.55 + 0.9 * fine) * (1.0 + 1.5 * h.surge);
  h.len = (k > 0.5 && k < 1.5 ? 2000.0 : 2600.0) * (0.5 + 0.9 * texture(tNoise, vec2(u * 1.1 - uTime * 0.003, 0.77)).a) * (1.0 + 0.45 * h.surge);
  h.s = s0;
  h.P = foot(u, k) + vec3(0.0, s0 * h.len, 0.0);
  h.edge = smoothstep(1.0, 0.8, abs(u)) * uGlow.x;
  return h;
}
// The rays are not of a height: here and there one stands far above its neighbours (0..1, squared when used).
float spire(Hang h, float k) { return texture(tNoise, vec2(h.u * (k > 1.5 ? 83.0 : 37.0) - uTime * 0.02, 0.37 + k * 0.2)).a; }
// How strongly the curtain burns at height s: most at its foot, dying upward; over its brightest reaches a second,
// fainter light stands high above, and that one is violet. The light climbs the rays in pulses.
float burn(Hang h, float s) {
  float crown = 0.24 * smoothstep(0.4, 0.75, s) * smoothstep(0.4, 0.85, h.I);
  return h.I * (exp(-s * 2.3) + crown) * (0.8 + 0.3 * sin(s * 7.0 - uTime * 1.7 + h.u * 55.0)) * h.edge;
}
// Yellow green where it burns hardest at the foot, emerald above that, then teal, then violet going to rose.
vec3 curtainColour(float s, float I) {
  vec3 c = mix(vec3(0.05, 0.92, 0.45), vec3(0.03, 0.55, 0.62), smoothstep(0.18, 0.5, s));
  c = mix(c, vec3(0.5, 0.2, 0.82), smoothstep(0.45, 0.8, s));
  c = mix(c, vec3(0.78, 0.2, 0.55), smoothstep(0.8, 1.1, s));
  return mix(c, vec3(0.38, 1.0, 0.36), (1.0 - smoothstep(0.0, 0.16, s)) * smoothstep(0.3, 0.85, I));
}
// Pins a stroke of the curtain to the sky by its foot: its place, the way it runs on the canvas (with the
// leaning-together that distance gives things overhead) and its size as seen from here.
void pin(inout Dab d, Hang h, vec3 run, vec2 size) {
  float dist = length(h.P);
  vec3 v = h.P / dist;
  vec3 vp = mat3(viewMatrix) * v, vd = mat3(viewMatrix) * run;
  vec2 on = vd.xy * (-vp.z) + vp.xy * vd.z;
  d.dir = dot(on, on) > 1e-8 ? transpose(mat3(viewMatrix)) * vec3(on, 0.0) : run;
  size.y *= max(length(run - v * dot(run, v)), 0.15); // a ray pointed at the eye is seen end on
  d.pos = cameraPosition + v * ${Fe}.0;
  d.size = size * ${Fe}.0 / dist;
  d.lift = 0.0;
  d.base = 1.0;
}
`;function Le(e){let n=new t,r=new s(new _(900,24,16),new g({glslVersion:f,uniforms:e,side:1,depthTest:!1,depthWrite:!1,vertexShader:`
      ${me}
      out vec3 vDir;
      void main() { vDir = position; gl_Position = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.0); }`,fragmentShader:`
      ${me}
      ${P}
      in vec3 vDir;
      layout(location = 0) out vec4 outC;
      void main() { outC = vec4(nightSky(normalize(vDir)) * 0.96, 1.0); }`}));r.frustumCulled=!1,r.renderOrder=-10,n.add(r);let i=ae(909);{let t=2600,r=new Float32Array(t*4);for(let e=0;e<t;e++){let t=i()*Math.PI*2,n=.02+i()**1.4*.98,a=Math.sqrt(Math.max(0,1-n*n));r.set([Math.cos(t)*a,n,Math.sin(t)*a,i()*1e3],e*4)}n.add(j(N(t,{aDir:[r,4]}),M(e,{head:P+`in vec4 aDir;`,body:`
        void makeDab(inout Dab d) {
          vec4 r = hash4(aDir.w);
          vec3 v = normalize(aDir.xyz);
          d.pos = cameraPosition + v * 800.0;
          // strokes lie level, tipping a little
          vec3 level = normalize(cross(vec3(0.0, 1.0, 0.0), v));
          d.dir = normalize(level + vec3(0.0, (r.x - 0.5) * 0.7, 0.0));
          d.size = vec2(46.0 + 40.0 * r.y, 150.0 + 130.0 * r.z);
          vec3 c = nightSky(v);
          d.c1 = jitter(c, r.yzw, 0.13);
          d.c2 = jitter(c * 1.06 + vec3(0.0, 0.004, 0.005), r.wxy, 0.18);
          d.seed = aDir.w;
          d.lift = 0.0;
        }`,uniforms:{uImpasto:{value:.55}},minPx:[10,20],maxPx:[900,1800],cells:[0,8],depthTest:!1,depthWrite:!1}),-9))}{let t=3e3,r=new Float32Array(t*4);for(let e=0;e<t;e++){let t=i()*Math.PI*2,n=.03+i()*.97,a=Math.sqrt(Math.max(0,1-n*n));r.set([Math.cos(t)*a,n,Math.sin(t)*a,i()*1e3],e*4)}n.add(j(N(t,{aDir:[r,4]}),M(e,{head:P+`in vec4 aDir;`,body:`
        void makeDab(inout Dab d) {
          vec4 r = hash4(aDir.w);
          bool moon = gl_InstanceID == 0;
          vec3 v = moon ? uSunDir : normalize(aDir.xyz);
          float big = r.x * r.x * r.x;
          d.pos = cameraPosition + v * 800.0;
          d.dir = vec3(0.0, 1.0, 0.0);
          d.spin = r.z * TAU;
          d.size = moon ? vec2(30.0) : vec2(800.0 * (0.0016 + 0.0042 * big));
          // a star wavers; the low ones are drowned in the glow
          float waver = 0.8 + 0.2 * sin(uTime * (1.5 + 4.0 * r.y) + r.w * 60.0);
          vec3 c = mix(vec3(0.7, 0.84, 1.0), vec3(1.0, 0.9, 0.72), step(0.8, r.w)) * (0.4 + 0.75 * big) * waver * smoothstep(0.03, 0.2, v.y);
          d.c1 = moon ? vec3(0.9, 0.93, 0.86) : max(c, nightSky(v));
          d.c2 = d.c1;
          d.seed = aDir.w;
          d.lift = 0.0;
        }`,uniforms:{uImpasto:{value:.2}},minPx:[2.2,2.2],maxPx:[60,60],cells:[4,2],depthTest:!1,depthWrite:!1}),-8))}let a=e=>{let t=[];return e.forEach((e,n)=>{for(let r=0;r<e;r++){let e=i();t.push(i(),e*e,i()*1e3,n)}}),new Float32Array(t)},o=a([5200,0,4200]);n.add(j(N(o.length/4,{aC:[o,4]}),M(e,{head:P+Ie+`in vec4 aC;`,body:`
      void makeDab(inout Dab d) {
        vec4 r = hash4(aC.z + 7.7);
        Hang h = hang(aC, r.x < 0.6 ? (r.w - 0.35) * 0.05 : aC.y * 0.45);
        float tall = 0.16 + 0.2 * r.z, mid = h.s + tall * 0.5;
        float tone = clamp(burn(h, mid) * 2.0, 0.0, 1.0);
        d.alive = smoothstep(0.2, 0.55, tone + (r.y - 0.5) * 0.2);
        if (d.alive <= 0.0) return;
        vec3 c = curtainColour(mid, h.I);
        pin(d, h, normalize(vec3((r.w - 0.5) * 0.16, 1.0, 0.0)), vec2(150.0 + 130.0 * r.y, h.len * tall));
        vec3 sky = nightSky(normalize(h.P));
        float body = smoothstep(0.15, 0.75, tone);
        d.c1 = mix(sky, jitter(c, r.yzx, 0.35) * (0.12 + 0.32 * tone), body);
        d.c2 = mix(sky, mix(c, vec3(0.6, 1.0, 0.8), 0.3) * (0.16 + 0.4 * tone), body);
        d.seed = aC.z;
      }`,uniforms:{uImpasto:{value:.9}},minPx:[4,10],maxPx:[500,1600],cells:[0,3],depthTest:!1,depthWrite:!1}),-7.9));{let t=new Float32Array(1680);for(let e=0;e<420;e++){let n=(i()-.5)*Math.PI*1.7,r=.12+.8*i(),a=Math.sqrt(1-r*r);t.set([Math.sin(n)*a,r,-Math.cos(n)*a,i()*1e3],e*4)}let r=j(N(420,{aDir:[t,4]}),M(e,{head:P+`in vec4 aDir;`,body:`
        void makeDab(inout Dab d) {
          vec4 r = hash4(aDir.w);
          vec3 v = normalize(aDir.xyz);
          float az = atan(v.x, -v.z);
          float patch_ = texture(tNoise, vec2(az * 0.3 + uTime * 0.004, v.y * 0.8 - uTime * 0.003)).r;
          float beat = 0.7 + 0.3 * sin(uTime * (0.7 + 0.6 * r.x) + r.y * TAU);
          float power = smoothstep(0.42, 0.75, patch_) * beat * uGlow.x;
          d.alive = smoothstep(0.0, 0.3, power);
          if (d.alive <= 0.0) return;
          d.pos = cameraPosition + v * 800.0;
          d.dir = normalize(cross(vec3(0.0, 1.0, 0.0), v) + vec3(0.0, (r.z - 0.5) * 0.5, 0.0));
          d.size = vec2(110.0 + 90.0 * r.y, 300.0 + 240.0 * r.w);
          d.c1 = jitter(mix(vec3(0.05, 0.5, 0.3), vec3(0.04, 0.36, 0.42), r.z), r.yzx, 0.3) * power * 0.085;
          d.c2 = d.c1 * 1.3;
          d.seed = aDir.w;
          d.lift = 0.0;
        }`,uniforms:{uImpasto:{value:.4}},minPx:[10,20],maxPx:[900,1800],cells:[0,8],depthTest:!1,depthWrite:!1}),-7.85);r.material.blending=2,r.material.alphaToCoverage=!1,r.name=`veil`,n.add(r)}let c=a([14e3,4e3,11e3]),l=j(N(c.length/4,{aC:[c,4]}),M(e,{head:P+Ie+`in vec4 aC; uniform float uGain;`,body:`
      void makeDab(inout Dab d) {
        vec4 r = hash4(aC.z);
        float kind = r.w < 0.52 ? 0.0 : r.w < 0.78 ? 1.0 : r.w < 0.93 ? 2.0 : 3.0;
        vec4 q = hash4(aC.z * 1.7 + 3.0);
        // (the feet of the rays are not all on one line: the edge is ragged, as a brush leaves it)
        Hang h = hang(aC, kind < 0.5 ? (r.x < 0.5 ? (q.y - 0.35) * 0.05 : aC.y * 0.8) : kind < 1.5 ? aC.y * 0.6 : (q.y - 0.5) * 0.03);
        vec3 run = vec3(0.0, 1.0, 0.0), c;
        vec2 size;
        float power;
        if (kind < 0.5) {
          float sp = spire(h, aC.w);
          float tall = (0.2 + 0.3 * r.z) * (0.65 + 1.7 * sp * sp), mid = h.s + (0.2 + 0.3 * r.z) * 0.4;
          // no two rays are loaded alike, and one in eight is a broad bold one: they are what reads as brushwork
          bool bold = q.x > 0.875;
          power = burn(h, mid) * (0.5 + 1.0 * q.z * q.z) * (bold ? 1.25 : 1.0);
          c = curtainColour(mid, h.I);
          size = vec2((95.0 + 110.0 * r.y) * (bold ? 2.3 : 1.0), h.len * tall);
        } else if (kind < 1.5) {
          float tall = 0.22 + 0.22 * r.z, mid = h.s + tall * 0.5;
          power = burn(h, mid) * 0.42;
          c = curtainColour(mid, h.I);
          size = vec2(520.0 + 160.0 * r.y, h.len * tall);
        } else if (kind < 2.5) {
          power = smoothstep(0.28, 0.8, h.I) * 0.85 * h.edge;
          c = mix(vec3(0.38, 1.0, 0.36), vec3(0.8, 1.0, 0.78), 0.35 + 0.4 * r.x);
          size = vec2(130.0 + 130.0 * r.y, h.len * (0.05 + 0.07 * r.z));
        } else {
          power = smoothstep(0.45, 0.9, h.I) * (0.45 + 0.5 * h.surge) * h.edge;
          c = mix(vec3(1.0, 0.25, 0.5), vec3(0.85, 0.2, 0.75), r.x);
          run = vec3(0.0, -1.0, 0.0);
          size = vec2(80.0 + 80.0 * r.y, h.len * (0.07 + 0.09 * r.z));
        }
        power = min(power, 0.75); // where strokes stand behind each other it adds up by itself
        d.alive = smoothstep(0.03, 0.14, power);
        if (d.alive <= 0.0) return;
        pin(d, h, run, size);
        d.c1 = jitter(c, r.yzx, 0.3) * power * uGain;
        d.c2 = d.c1 * 1.4;
        d.seed = aC.z;
      }`,uniforms:{uGain:{value:.075},uImpasto:{value:.3}},minPx:[3,8],maxPx:[500,1600],cells:[0,3],depthTest:!1,depthWrite:!1}),-7.8);return l.material.blending=2,l.material.alphaToCoverage=!1,n.add(l),{group:n}}var Re=`
// The fjord gives back the sky it faces, darker, and nearly black where the eye looks down into it.
vec3 waterPaint(vec3 P, vec3 wobble) {
  vec3 v = normalize(P - cameraPosition);
  vec3 up = normalize(vec3(v.x, -v.y, v.z) + wobble);
  up.y = abs(up.y);
  vec3 sky = nightSky(up) * 1.5 + auroraSoft(up) * 0.75;
  // moving water draws a light out into a long column: it gives back the aurora from far above where a mirror would
  sky += auroraSoft(normalize(vec3(up.x, up.y * 2.6 + 0.13, up.z))) * 0.5;
  float graze = pow(1.0 - clamp(-v.y, 0.0, 1.0), 3.0);
  return mix(vec3(0.012, 0.06, 0.09), sky, 0.35 + 0.65 * graze);
}
`,ze=[{r:2300,top:620,seed:3.1,open:[0,.3,1],count:52e3},{r:4300,top:1e3,seed:11.7,open:[.35,.12,.6],count:46e3},{r:7600,top:1500,seed:23.9,open:[0,0,0],count:4e4}],Be=(e,t,n)=>{let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)};function Ve(e,t,n=!1){let r=ze[e],i=Math.cos(t),a=Math.sin(t),o=.45+.55*k(i*2.2+r.seed,a*2.2)+.28*k(i*6.5,a*6.5+r.seed);n||(o+=.12*k(i*17+r.seed,a*17)+.05*k(i*41,a*41+r.seed));let s=Math.abs((t-r.open[0]+Math.PI*3)%(Math.PI*2)-Math.PI),c=r.open[2]>0?.1+.9*Be(r.open[1],r.open[2],s):1;return r.top*c*Math.min(1.4,Math.max(.1,o))}function He(e){let n=new t,r=ae(7373),i=(e,t)=>(e.material.depthTest=!1,e.material.depthWrite=!1,e.renderOrder=t,e.frustumCulled=!1,n.add(e),e),a=[[60,2200],[2200,4200],[4200,7500],[7500,15500]],c=()=>new g({glslVersion:f,uniforms:e,vertexShader:`
      out vec3 vWorld;
      void main() { vWorld = position; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }`,fragmentShader:`
      ${me}
      ${P}
      ${Re}
      in vec3 vWorld;
      layout(location = 0) out vec4 outC;
      void main() { outC = vec4(hazed(waterPaint(vWorld, vec3(0.0)) * 0.9, vWorld), 1.0); }`}),l=()=>M(e,{head:P+Re+`in vec4 aW;`,body:`
      void makeDab(inout Dab d) {
        vec4 r = hash4(aW.z);
        float rad = aW.y;
        vec3 P = vec3(sin(aW.x) * rad, 0.0, -cos(aW.x) * rad);
        if (heightAt(P.xz) > -0.5 && max(abs(P.x), abs(P.z)) < uExtent) { d.alive = 0.0; return; }
        vec2 q = normalize(P.xz - cameraPosition.xz);
        vec3 along = vec3(-q.y, 0.0, q.x);
        vec2 size = rad * vec2(0.035 + 0.04 * r.y, 0.045 + 0.06 * r.w);
        // the swell: it comes up the fjord from the south-west, and each stroke slides along its own length with
        // it and back, lengthening on the crest
        float swell = (dot(P.xz, vec2(0.6, -0.8)) / 240.0 - uTime * 0.21 + r.z * 0.35) * TAU;
        P += along * sin(swell) * size.y * 0.4;
        size.y *= 1.0 + 0.3 * cos(swell);
        // each stroke takes its piece of sky a little wrong, and wrong a different way as the swell passes: that
        // is what breaks the reflection up and keeps it alive
        vec3 c = waterPaint(P, (vec3(r.x - 0.5, (r.y - 0.5) * 0.5, r.z - 0.5) + 0.5 * vec3(sin(swell + r.x * 9.0), 0.0, cos(swell * 0.7 + r.y * 9.0))) * 0.16);
        // a few catch the light whole, on the face of the swell that is turned to it
        if (aW.w > 0.84) {
          float flash = pow(0.5 + 0.5 * sin(swell * 2.0 + r.y * TAU), 3.0);
          c += (auroraSoft(normalize(vec3(P.x - cameraPosition.x, 0.3 * length(P.xz - cameraPosition.xz), P.z - cameraPosition.z))) * 0.45 + vec3(0.01, 0.045, 0.05)) * (0.25 + 1.5 * flash);
        }
        // and no two are loaded alike: some dark, a few bright
        c *= 0.55 + 1.1 * r.x * r.x;
        d.dir = along;
        d.pos = P;
        d.size = size;
        d.c1 = hazed(jitter(c, r.yzw, 0.3), P);
        d.c2 = hazed(c * 1.4 + vec3(0.0, 0.012, 0.01), P);
        d.seed = aW.z;
        d.lie = 1.0;
        d.nrm = vec3(0.0, 1.0, 0.0);
        d.height = 0.5;
      }`,minPx:[4,9],maxPx:[4e3,4e3],cells:[0,3]});{let e=[];for(let t=0;t<52e3;t++)e.push([r()*Math.PI*2,330*Math.exp(r()*Math.log(15e3/330)),r()*1e3,r()]);a.forEach(([t,n],r)=>{let a=-6.4-.4*r;i(new s(new o(t,n,128,1).rotateX(-Math.PI/2),c()),a);let u=e.filter(e=>e[1]>=t&&e[1]<n).sort((e,t)=>t[1]-e[1]);u.length&&i(j(N(u.length,{aW:[new Float32Array(u.flat()),4]}),l()),a+.1)})}ze.forEach((t,n)=>{let a=-6.6-.4*n,o=new ee,c=new Float32Array(4326),l=[];for(let e=0;e<=720;e++){let r=e/720*Math.PI*2,i=Math.sin(r)*t.r,a=-Math.cos(r)*t.r;c.set([i,-20,a,i,Ve(n,r),a],e*6),e<720&&l.push(e*2,e*2+1,e*2+2,e*2+1,e*2+3,e*2+2)}o.setAttribute(`position`,new b(c,3)),o.setIndex(l),i(new s(o,new g({glslVersion:f,uniforms:e,side:2,vertexShader:`
        out vec3 vWorld;
        void main() { vWorld = position; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }`,fragmentShader:`
        ${me}
        ${P}
        in vec3 vWorld;
        layout(location = 0) out vec4 outC;
        void main() { outC = vec4(hazed(mix(vec3(0.03, 0.05, 0.08), vec3(0.1, 0.2, 0.3), smoothstep(40.0, 420.0, vWorld.y)), vWorld), 1.0); }`})),a);let u=new Float32Array(t.count*3),d=new Float32Array(t.count*3),p=new Float32Array(t.count*4);for(let e=0;e<t.count;e++){let i=r()*Math.PI*2,a=Ve(n,i),o=r()**.8,s=.012,c=i+(1-o)*.04*k(i*9+n*5,.5),l=(Ve(n,c+s)-Ve(n,c-s))/(2*s*t.r),f=(Ve(n,c+3*s,!0)-Ve(n,c-3*s,!0))/(6*s*t.r),m=f+(l-f)*o,h=Math.sin(i),g=-Math.cos(i),_=Math.cos(i),v=Math.sin(i),y=m*1.7+.2*k(i*38+n*9,o*3.5)+(r()-.5)*.12,b=t.r-40-60*r();u.set([h*b,o*a,g*b],e*3);let x=Math.hypot(.75,y,.55);d.set([(-h*.75-_*y)/x,.55/x,(-g*.75-v*y)/x],e*3),p.set([r()*1e3,o,a,t.r],e*4)}i(j(N(t.count,{aPos:[u,3],aNrm:[d,3],aData:[p,4]}),M(e,{head:P+`in vec3 aPos; in vec3 aNrm; in vec4 aData;`,body:`
        void makeDab(inout Dab d) {
          vec4 r = hash4(aData.x);
          vec3 Nn = normalize(aNrm);
          float x = clamp(dot(Nn, uSunDir) * 1.5 + 0.25, 0.0, 1.0);
          // rock shows in bands and along the shore; the rest is snow
          float band = texture(tNoise, vec2(aPos.x + aPos.z, aPos.y * 2.0) / 2600.0).g;
          bool stone = aData.y < 0.07 || band + (r.x - 0.5) * 0.08 > 0.6;
          vec3 c = stone ? rockPaint(x, r.y, r.z) : snowPaint(x, r.y, clamp(uGlow.x * 0.6 * Nn.y, 0.0, 1.0), r.z * 0.6);
          vec3 side = normalize(cross(Nn, vec3(0.0, 1.0, 0.0)));
          d.dir = normalize(cross(side, Nn) * 0.6 + side * (Nn.x * side.z - Nn.z * side.x > 0.0 ? 1.0 : -1.0) + vec3(0.0, (r.w - 0.5) * 0.4, 0.0));
          d.pos = aPos;
          d.size = aData.w * vec2(0.008 + 0.006 * r.z, 0.02 + 0.02 * r.w);
          d.c1 = hazed(jitter(c, r.yzw, 0.18) * 0.82, aPos);
          d.c2 = hazed(c * 0.92, aPos);
          d.seed = aData.x;
          d.turnabout = 1.0;
          d.lift = 0.0;
        }`,uniforms:{uImpasto:{value:.45}},minPx:[4,8],maxPx:[200,500],cells:[0,8]})),a+.1)});{let t=[];for(let[e,n]of[[.86,16],[-1.12,9],[2.3,7]])for(let i=0;i<n;i++){let n=e+(r()-.5)*.09,i=ze[0].r-110-r()*50;t.push(Math.sin(n)*i,4+r()*16,-Math.cos(n)*i,r()*1e3)}let n=t.length/4;i(j(N(n*4,{aL:[new Float32Array([...t,...t,...t,...t]),4]}),M(e,{head:`in vec4 aL;`,body:`
        void makeDab(inout Dab d) {
          vec4 r = hash4(aL.w);
          float glint = floor(float(gl_InstanceID) / ${n}.0); // 0: the lamp itself
          bool onWater = glint > 0.5;
          vec3 run = vec3(0.0, 1.0, 0.0);
          vec3 P = aL.xyz;
          vec3 c = mix(vec3(1.0, 0.7, 0.32), vec3(1.0, 0.86, 0.6), r.x) * (0.75 + 0.25 * sin(uTime * (1.0 + r.y) + r.z * 40.0));
          if (onWater) {
            // its light on the water: short level touches below it, each dimmer and shorter than the last, that the
            // water keeps breaking and mending
            vec4 g = hash4(aL.w + glint * 13.7);
            vec2 toEye = normalize(cameraPosition.xz - P.xz);
            float reach = 130.0 + 75.0 * glint + 40.0 * g.x;
            P = vec3(P.x + toEye.x * reach + toEye.y * (g.y - 0.5) * 14.0, 1.5, P.z + toEye.y * reach - toEye.x * (g.y - 0.5) * 14.0);
            c *= (0.5 - 0.11 * glint) * (0.6 + 0.4 * sin(uTime * (1.1 + g.z) + g.w * 30.0));
            run = vec3(-toEye.y, 0.0, toEye.x);
            d.size = vec2(3.5, (30.0 - 6.0 * glint) * (0.7 + 0.6 * g.z));
          } else d.size = vec2(7.0 + 6.0 * r.y);
          d.pos = P;
          d.dir = run;
          d.c1 = hazed(c, P);
          d.c2 = d.c1 * 1.2;
          d.seed = aL.w;
          d.lift = 0.0;
        }`,uniforms:{uImpasto:{value:.2}},minPx:[2.4,2.4],maxPx:[40,200],cells:[4,2]})),-6.2)}return{group:n}}function Ue(e,t=900){let n=new Float32Array(t*2*3),r=new Float32Array(t*2*4),i=N(t*2,{aPos:[n,3],aData:[r,4]},!0),a=j(i,M(e,{head:P+`in vec3 aPos; in vec4 aData;`,body:`
      void makeDab(inout Dab d) {
        if (aData.y < 0.5) { d.alive = 0.0; return; }
        vec4 r = hash4(aData.z);
        vec3 Nn = normalAt(aPos.xz);
        if (texture(tLand, landUv(aPos.xz)).r > 0.5) { d.alive = 0.0; return; } // rock keeps no prints
        vec3 P = vec3(aPos.x, heightAt(aPos.xz), aPos.z);
        float x = moonOn(P, Nn);
        vec3 ahead = vec3(sin(aData.x), 0.0, cos(aData.x));
        vec3 c;
        if (aData.w < 0.5) {
          c = mix(vec3(0.05, 0.1, 0.27), vec3(0.13, 0.26, 0.47), x * 0.7 + (r.x - 0.5) * 0.2);
          d.dir = ahead;
          d.size = vec2(0.17, 0.37) * (0.9 + 0.2 * r.y);
          d.height = 0.2;
        } else {
          vec3 away = normalize(vec3(-uSunDir.x, 0.0, -uSunDir.z));
          P += away * 0.1;
          c = snowPaint(x + 0.25, r.x, auroraOn(P.xz, Nn), 0.2) * 1.08;
          d.dir = cross(vec3(0.0, 1.0, 0.0), away) + ahead * 0.4;
          d.size = vec2(0.06, 0.3);
          d.height = 0.23;
        }
        c = lampOn(c, aData.w < 0.5 ? vec3(0.5, 0.42, 0.5) : vec3(0.95), P, Nn);
        d.pos = P;
        d.c1 = hazed(c, P);
        d.c2 = hazed(c * 1.15, P);
        d.seed = aData.z;
        d.lie = 1.0;
        d.nrm = Nn;
        d.glaze = 1.0;
        d.cell = aData.w < 0.5 ? 4.0 + step(0.5, r.z) : floor(r.z * 2.99);
      }`,minPx:[1.5,3],maxPx:[4e3,4e3],cells:[0,8]}),4),o=0,s=0,c=!1,l=null,u=0;function d(e,a,s){for(let t of[0,1]){let i=o*2+t;n.set([e,0,a],i*3),r.set([s,1,(o*7.31+t*3.7)%1e3,t],i*4)}o=(o+1)%t,i.attributes.aPos.needsUpdate=!0,i.attributes.aData.needsUpdate=!0}return{mesh:a,update(e,t,n,r){if(l==null){l=e.x,u=e.z;return}let i=Math.hypot(e.x-l,e.z-u);if(l=e.x,u=e.z,!r||i>3)return;s+=i;let a=.62+.09*Math.min(n,6);if(s<a)return;s=0,c=!c;let o=c?.1:-.1;d(e.x+Math.cos(t)*o,e.z-Math.sin(t)*o,t)},lay(e,t,n){let r=Math.sign(n-t);for(let i=t;(n-i)*r>0;i+=r*.72){let t=e(i),n=Math.atan2(e(i+r)-t,r);c=!c;let a=(c?.1:-.1)+Math.sin(i*12.9898)*.03;d(t+Math.cos(n)*a,i-Math.sin(n)*a,n)}}}}var We=.18;function Ge(e){let n=new t;n.rotation.order=`YXZ`;let r=new d({color:new x(.05,.045,.05)}),i=new d({color:new x(1,.8,.42)}),a=new s(new te(.05,.058,.15,6),i),o=new s(new C(.075,.06,6),r);o.position.y=.105;let c=new s(new te(.066,.066,.025,6),r);c.position.y=-.085;let l=new s(new u(.062,.008,5,12,Math.PI),r);l.position.y=.115,n.add(a,o,c,l);for(let e of[-.062,.062]){let t=new s(new ne(.018,.055,.018),r);t.position.set(e,.095,0),n.add(t)}for(let e=0;e<3;e++){let t=new s(new ne(.008,.16,.008),r);t.position.set(Math.cos(e*2.094)*.058,0,Math.sin(e*2.094)*.058),n.add(t)}let f=j(N(22),M(e,{body:`
      void makeDab(inout Dab d) {
        float id = float(gl_InstanceID);
        vec4 r = hash4(id * 7.3 + 2.0);
        float a = r.x * TAU + uTime * 0.2 * (r.w - 0.5);
        vec3 out_ = normalize(vec3(cos(a), (r.y - 0.45) * 1.6, sin(a)));
        bool flame = id < 3.5;
        float flicker = 0.85 + 0.15 * sin(uTime * (7.0 + 9.0 * r.z) + r.w * 30.0);
        d.pos = uLamp.xyz + (flame ? vec3(0.0) : out_ * (0.1 + 0.3 * r.z));
        d.dir = flame ? vec3(0.0, 1.0, 0.0) : out_;
        d.size = flame ? vec2(0.11, 0.17) : vec2(0.14, 0.34) * (0.6 + 0.9 * r.w);
        d.c1 = (flame ? vec3(1.0, 0.9, 0.62) * 0.55 : uLampCol * 0.13 / (1.0 + 3.0 * r.z)) * flicker * uLamp.w;
        d.c2 = d.c1 * 1.3;
        d.seed = id;
        d.lift = 0.0;
      }`,uniforms:{uImpasto:{value:.3}},minPx:[3,5],maxPx:[300,600],cells:[0,6]}),21),p=f.material;p.transparent=!0,p.blending=2,p.alphaToCoverage=!1,p.depthWrite=!1;let m=0,h=0,g=null,_=0;return{object:n,glow:f,update(t,r,i){g??(g=r.x,_=r.z);let a=(r.x-g)/Math.max(t,.001),o=(r.z-_)/Math.max(t,.001);g=r.x,_=r.z;let s=Math.max(-6,Math.min(6,a*Math.sin(i)+o*Math.cos(i)));h+=(-m*30-h*3.5-s*.9)*t,m=Math.max(-.6,Math.min(.6,m+h*t)),n.position.set(r.x+Math.sin(i)*Math.sin(m)*We,r.y-Math.cos(m)*We,r.z+Math.cos(i)*Math.sin(m)*We),n.rotation.set(-m,i,0),e.uLamp.value.set(n.position.x,n.position.y+.02,n.position.z,1)}}}function Ke(e,t=2400){return j(N(t),M(e,{head:P,body:`
      const vec3 BOX = vec3(56.0, 14.0, 56.0);
      void makeDab(inout Dab d) {
        float id = float(gl_InstanceID);
        vec4 r = hash4(id * 1.13 + 3.0);
        vec4 q = hash4(id * 2.71 + 19.0);
        bool flake = q.x > 0.7;
        vec3 p = r.xyz * BOX;
        p.xz += uWind.xy * uTime * (flake ? 1.2 + 1.5 * q.y : 5.0 + 6.0 * q.y);
        if (flake) {
          p.y -= uTime * (0.35 + 0.4 * r.w);
          p.xz += vec2(sin(uTime * (0.7 + q.z) + q.w * 20.0), cos(uTime * (0.9 + q.w) + q.z * 20.0)) * 0.5;
        }
        vec3 origin = vec3(cameraPosition.x, uFocus.y + 5.0, cameraPosition.z);
        p = mod(p - origin + BOX * 0.5, BOX) - BOX * 0.5 + origin;
        float ground = heightAt(p.xz);
        float edge = 1.0 - smoothstep(BOX.x * 0.36, BOX.x * 0.5, distance(p.xz, cameraPosition.xz));
        if (flake) {
          d.alive = smoothstep(ground, ground + 0.4, p.y) * edge;
          d.size = vec2(0.028 + 0.02 * q.z);
          d.cell = 4.0;
        } else {
          float gust = gustAt(p.xz);
          p.y = ground + 0.05 + 0.5 * r.y * r.y + 0.12 * sin(uTime * 3.0 + q.z * 30.0) * gust;
          d.alive = smoothstep(0.35, 0.7, gust + (q.w - 0.5) * 0.4) * edge;
          d.dir = normalize(vec3(uWind.x, 0.12 * sin(uTime * 2.0 + q.w * 9.0), uWind.y));
          d.size = vec2(0.035, 0.5 + 0.7 * q.z);
        }
        if (d.alive <= 0.0 || inRoom(p.xz)) { d.alive = 0.0; return; }
        vec3 c = mix(vec3(0.28, 0.46, 0.56), vec3(0.46, 0.68, 0.72), q.z) * (flake ? 0.8 : 1.0) * (0.45 + 0.55 * woodSunAt(p));
        c = mix(c, vec3(0.95, 0.74, 0.46), clamp(lampAt(p, normalize(uLamp.xyz - p)) * 1.3, 0.0, 0.75));
        d.pos = p;
        d.c1 = hazed(c, p);
        d.c2 = d.c1 * 1.15;
        d.seed = id;
        d.lift = 0.0;
      }`,uniforms:{uImpasto:{value:.3}},minPx:[1.6,2.4],maxPx:[6,160],cells:[0,3]}),6)}var qe=Math.PI*2,Je=(e,t,n)=>{let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)};function Ye(e){let n=ae(31337),r=[],i=new D,a=(e,t,n)=>r.every(r=>Math.hypot(r.x-e,r.z-t)>n),o=(e,t,i,a)=>{let o=B(e,t);r.push({x:e,y:o-.25,z:t,h:i,r:i*(.13+.07*n())+.25,full:a})};for(let e=172;e<350;e+=3.6)for(let t=-96;t<=96;t+=3.6){let r=I(e)+t+(n()-.5)*3,s=e+(n()-.5)*3,c=Math.abs(r-I(s)),l=.5+.5*k(r/23+4,s/23-9),u=Je(176,250,s)*(.2+.8*l)*(1-.5*Je(40,96,c));if(n()>u||c<2.7||B(r,s)<12||ke(r,s)[0]>.4||Ae(r,s,i).y<.66)continue;let d=(3+8.5*n()**1.4)*(.55+.45*Je(180,240,s))*(.7+.3*Je(2.7,7,c));a(r,s,1.6+d*.16)&&o(r,s,d,!0)}for(let[e,t,n]of[[-7.5,143,5.6],[12.5,137,4.1],[-11,122,3.3],[8.5,104,2.7],[-6,166,4.6],[15,171,6.2]])o(I(t)+e,t,n,!0);for(let e=0;e<9e3;e++){let e=(n()*2-1)*440,t=-330+n()*780,r=B(e,t);r<10||r>150+70*Je(100,250,t)||Math.abs(e-I(t))<100&&t>165||k(e/37+1,t/37+6)<.12||ke(e,t)[0]>.4||Ae(e,t,i).y<.7||a(e,t,3)&&o(e,t,3+6*n(),!1)}r.sort((e,t)=>e.z-t.z);let c=new Float32Array(r.length*7*9);r.forEach((e,t)=>{for(let n=0;n<7;n++){let r=n/7*qe,i=(n+1)/7*qe,a=e.r*.72;c.set([e.x,e.y+e.h*.98,e.z,e.x+Math.cos(i)*a,e.y,e.z+Math.sin(i)*a,e.x+Math.cos(r)*a,e.y,e.z+Math.sin(r)*a],(t*7+n)*9)}});let l=new ee;l.setAttribute(`position`,new b(c,3));let u=new s(l,new g({glslVersion:f,uniforms:e,vertexShader:`
      out vec3 vWorld;
      void main() { vWorld = position; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }`,fragmentShader:`
      ${me}
      in vec3 vWorld;
      layout(location = 0) out vec4 outC;
      void main() { outC = vec4(hazed(vec3(0.012, 0.03, 0.045), vWorld), 1.0); }`}));u.frustumCulled=!1;let p=new s(l,new d({side:2}));p.frustumCulled=!1;let m=[],h=[],_=[],v=[],y=(e,t,r,i,a,o)=>{m.push(...e),h.push(...t),_.push(...r),v.push(n()*1e3,i,a,o)};for(let e of r){let t=e.full?Math.round(5+e.h*.95):4,r=[(n()-.5)*.07,(n()-.5)*.07],i=[(n()-.5)*.2,(n()-.5)*.2];for(let a=0;a<t;a++){let o=(a+.4)/t,s=e.y+e.h*(.12+.86*o),c=e.r*(1-o)**.8+.1,l=e.x+e.h*(r[0]*o+i[0]*o*o*o),u=e.z+e.h*(r[1]*o+i[1]*o*o*o),d=e.full?Math.max(3,Math.round(3+c*4.2)):3,f=n()*qe,p=.35+.55*(1-o);for(let e=0;e<d;e++){let t=f+(e+n()*.5)/d*qe,r=Math.cos(t),i=Math.sin(t);y([l+r*c*.55,s-c*p*.45,u+i*c*.55],[r,-p,i],[r,-.25,i],0,c*(.85-.3*o),c*(1.35-.4*o)),y([l+r*c*.6,s-c*p*.22+.06,u+i*c*.6],[r,-p*.7,i],[r*.6,1,i*.6],1,c*(.62+.3*o),c*(.95+.25*o))}}let a=e.x+e.h*(r[0]+i[0]),o=e.z+e.h*(r[1]+i[1]);y([a,e.y+e.h*.99,o],[i[0]*2,1,i[1]*2],[0,1,0],1,.2+e.h*.02,.45+e.h*.04)}let x=v.length/4,S=j(N(x,{aPos:[new Float32Array(m),3],aDir:[new Float32Array(h),3],aNrm:[new Float32Array(_),3],aData:[new Float32Array(v),4]}),M(e,{head:P+`in vec3 aPos; in vec3 aDir; in vec3 aNrm; in vec4 aData;`,body:`
      void makeDab(inout Dab d) {
        vec4 r = hash4(aData.x);
        vec3 P = aPos, Nn = normalize(aNrm);
        bool snow = aData.y > 0.5;
        // a breath of wind in the boughs
        P.xz += uWind.xy * gustAt(P.xz) * 0.035 * sin(uTime * (1.3 + r.x) + r.y * 30.0) * smoothstep(0.0, 4.0, P.y - heightAt(P.xz));
        float x = moonOn(P, Nn);
        vec3 c, own;
        if (snow) {
          c = snowPaint(x, r.y, 0.7 * auroraOn(P.xz, Nn), 0.25 + 0.25 * r.z);
          own = vec3(0.95);
        } else {
          c = paint3(vec3(0.085, 0.2, 0.19), vec3(0.035, 0.085, 0.1), vec3(0.012, 0.03, 0.055), x * 0.8, r.y);
          c += vec3(0.0, 0.028, 0.02) * max(Nn.y + 0.4, 0.0) * uGlow.x;
          own = vec3(0.15, 0.2, 0.09);
        }
        c = lampOn(jitter(c, r.wzy, snow ? 0.25 : 0.4), own, P, Nn);
        d.pos = P;
        d.dir = aDir;
        d.size = aData.zw * (0.85 + 0.3 * r.x);
        d.c1 = hazed(c, P);
        d.c2 = hazed(c * (snow ? 1.25 : 1.5) + vec3(0.0, 0.006, 0.01), P);
        d.seed = aData.x;
        d.lift = snow ? 0.55 : 0.25;
        d.turnabout = snow ? 1.0 : 0.0;
      }`,minPx:[3,6],maxPx:[100,210],cells:[0,8]}),3),C=new t;C.add(u,S);let w=r.filter(e=>e.full&&Math.abs(e.x-I(e.z))<40).map(e=>({x:e.x,y:e.y,z:e.z,r:e.r*.45})),T=r.filter(e=>e.full);function E(e,t,n){let r=null,i=t.x*t.x+t.z*t.z;if(i<1e-6)return null;for(let a of T){let o=e.x-a.x,s=e.z-a.z;if(Math.abs(o)>n+3||Math.abs(s)>n+3)continue;let c=a.r*.8,l=2*(o*t.x+s*t.z),u=o*o+s*s-c*c,d=l*l-4*i*u;if(d<=0||u<0)continue;let f=Math.max(0,(-l-Math.sqrt(d))/(2*i));if(f>=n||(-l+Math.sqrt(d))/(2*i)<0)continue;let p=(e.y+t.y*f-a.y)/a.h;p<0||p>.8||(r==null||f<r)&&(r=f)}return r}return{group:C,caster:p,colliders:w,block:E,counts:{trees:r.length,strokes:x}}}function Xe(e,{palettes:r,head:a=``,light:o,origin:c=[0,0,0],seed:l=1,haze:u=!1,order:d=3}){let m=ae(l),h=Object.keys(r),_=e=>{let t=h.indexOf(e);if(t<0)throw Error(`no palette ${e}`);return t},v=new D(...c),y={pos:[],nrm:[],pal:[],tone:[]},b={pos:[],nrm:[],dir:[],data:[],more:[]},x=new D,S=new D,C=new D,w=new D,T=new D,E=new D,ie=new D,O=new D;function k(e,t,n,r,i,a,o=1,s=0){b.pos.push(e.x+v.x,e.y+v.y,e.z+v.z),b.nrm.push(t.x,t.y,t.z),b.dir.push(n.x,n.y,n.z),b.data.push(m()*1e3,r,i,_(a)),b.more.push(o,s)}function A(e,t,n,r,i,a,o,s){for(let[c,l]of[[e,r],[t,i],[n,a]])y.pos.push(c.x+v.x,c.y+v.y,c.z+v.z),y.nrm.push(l.x,l.y,l.z),y.pal.push(_(o)),y.tone.push(s)}function oe(e,t,n,r,i,a,o,{grain:s=null,stroke:c=[.07,.2],density:l=1,tone:u=1,free:d=!1,lift:f=0}){w.subVectors(t,e),T.subVectors(n,e),E.crossVectors(w,T);let p=E.length()/2;E.normalize();let h=new D().copy(s??w);h.addScaledVector(E,-h.dot(E)),h.lengthSq()<1e-8&&h.copy(w),h.normalize();let g=new D().crossVectors(E,h),_=new D().subVectors(T,w),v=Math.max(Math.abs(w.dot(h)),Math.abs(T.dot(h)),Math.abs(_.dot(h))),y=Math.max(Math.abs(w.dot(g)),Math.abs(T.dot(g)),Math.abs(_.dot(g)));d||(c=[Math.max(.012,Math.min(c[0],y*1.05)),Math.max(.02,Math.min(c[1],v*1.05))]);let b=new D().copy(e).add(t).add(n).divideScalar(3),x=d?0:.7*Math.min(1,Math.max(c[0]/Math.max(y,1e-4),c[1]/Math.max(v,1e-4))),S=p/(c[0]*c[1])*2.6*l,C=Math.min(3e3,Math.floor(S+m()));for(let t=0;t<C;t++){let t=m(),n=m();t+n>1&&(t=1-t,n=1-n),ie.copy(e).addScaledVector(w,t).addScaledVector(T,n).lerp(b,x);let l=new D().copy(r).multiplyScalar(1-t-n).addScaledVector(i,t).addScaledVector(a,n).normalize();O.copy(s??w),O.addScaledVector(l,-O.dot(l)),O.lengthSq()<1e-6&&O.copy(w),O.normalize().addScaledVector(new D().crossVectors(l,O),(m()-.5)*.35),k(ie,l,O,c[0]*(.8+.4*m()),c[1]*(.75+.5*m()),o,u*(.88+.24*m()),f*(.4+1.2*m()))}}function se(e,t,r,i={}){let a=e.index?e.toNonIndexed():e,o=a.attributes.position,s=a.attributes.normal,c=new n().getNormalMatrix(t);for(let e=0;e<o.count;e+=3){x.fromBufferAttribute(o,e).applyMatrix4(t),S.fromBufferAttribute(o,e+1).applyMatrix4(t),C.fromBufferAttribute(o,e+2).applyMatrix4(t);let n=new D().crossVectors(w.subVectors(S,x),T.subVectors(C,x)).normalize(),a=i.smooth?new D().fromBufferAttribute(s,e).applyMatrix3(c).normalize():n,l=i.smooth?new D().fromBufferAttribute(s,e+1).applyMatrix3(c).normalize():n,u=i.smooth?new D().fromBufferAttribute(s,e+2).applyMatrix3(c).normalize():n;A(x,S,C,a,l,u,r,i.tone??1),oe(x.clone(),S.clone(),C.clone(),a,l,u,r,i)}}let ce=(e,t,n,r=0,a=[1,1,1])=>new i().compose(new D(e,t,n),new p().setFromAxisAngle(new D(0,1,0),r),new D(...a));function le(e,t,n,r,i,a,o,s={}){let c=s.grain?new D(+(s.grain===`x`),+(s.grain===`y`),+(s.grain===`z`)):null;c&&s.rotY&&c.applyAxisAngle(new D(0,1,0),s.rotY),se(new ne(r,i,a),ce(e,t,n,s.rotY??0),o,{...s,grain:c})}function ue(e,t,n,r,a,o,s={}){se(new te(s.top??r,r,a,s.sides??9),ce(e,t,n,0).multiply(s.turn??new i),o,{smooth:!0,grain:s.grain??new D(0,1,0),...s})}function de(e,t,n,r,{grain:i=`u`,stroke:a=[.07,.2],density:o=1,rows:s=0,holes:c=[],tone:l=1,detail:u=!1}={}){e=new D(...e),t=new D(...t),n=new D(...n);let d=new D().crossVectors(t,n).normalize(),f=(r,i)=>new D().copy(e).addScaledVector(t,r).addScaledVector(n,i),p=(e,t)=>c.some(n=>e>n[0]&&e<n[1]&&t>n[2]&&t<n[3]),h=[],g=0;for(let e of[...c].sort((e,t)=>e[0]-t[0]))e[0]>g&&h.push([g,e[0],0,1]),e[2]>0&&h.push([e[0],e[1],0,e[2]]),e[3]<1&&h.push([e[0],e[1],e[3],1]),g=e[1];g<1&&h.push([g,1,0,1]);let _=t.length(),v=n.length();for(let[e,c,u,p]of h){let m=f(e,u),h=f(c,u),g=f(c,p),_=f(e,p);if(A(m,h,g,d,d,d,r,l),A(m,g,_,d,d,d,r,l),s)continue;let v={grain:i===`u`?t:n,stroke:a,density:o,tone:l};oe(m,h,g,d,d,d,r,v),oe(m,g,_,d,d,d,r,v)}if(!s)return;let y=t.clone().normalize(),b=(e,t,n)=>e>.01&&e<.99&&!p(e,t)&&!p(e-n/2/_,t)&&!p(e+n/2/_,t),x=Math.max(1,Math.round(v/s)),S=v/x;for(let e=0;e<x;e++){let t=l*(.78+.44*m());for(let n=0;n<2;n++)for(let i=-m()*a[1];i<_;){let o=a[1]*(.7+.7*m()),s=(i+o/2)/_,c=(e+.5+(n?(m()-.5)*.3:0))/x,l=Math.min(o*1.15,_);b(s,c,l)||(l=o*.35),b(s,c,l)&&k(f(s,c),d,y,S*1.12,l,r,t*(.9+.2*m()),n*.002),i+=o*.9}if(u){for(let n=m()*a[1];n<_;){let i=a[1]*(.35+.6*m()),o=(n+i/2)/_,s=(e+.66+.16*m())/x;b(o,s,i)&&m()<.7&&k(f(o,s),d,y,S*.16,i,r,t*1.3,.008),n+=i*(1.1+m())}for(let n=m()*1.6;n<_;n+=.9+2.4*m()){let i=n/_,a=(e+.3+.4*m())/x;b(i,a,.14)&&(k(f(i,a),d,y,S*.34,S*.52,r,t*.5,.009),k(f(i,a),d,y,S*.14,S*.2,r,t*.28,.011))}}if(e>0)for(let t=0;t<_;){let n=a[1]*(.6+.6*m()),i=(t+n/2)/_,o=e/x;b(i,o,n)&&m()<.85&&k(f(i,o),d,y,S*.2,n,r,l*.32,.006),t+=n*.95}}}function fe(e,t,n,r,i={}){x.set(...e),S.set(...t),C.set(...n);let a=new D().crossVectors(w.subVectors(S,x),T.subVectors(C,x)).normalize();A(x,S,C,a,a,a,r,i.tone??1),oe(x.clone(),S.clone(),C.clone(),a,a,a,r,{...i,grain:i.grain?new D(...i.grain):null})}function pe(){let n=(e,t)=>h.map(n=>`vec3(${(r[n][e]??r[n][t]).map(e=>e.toFixed(3))})`).join(`, `),i=h.length,c=`
      const vec3 PAL_L[${i}] = vec3[${i}](${n(`l`,`l`)});
      const vec3 PAL_M[${i}] = vec3[${i}](${n(`m`,`l`)});
      const vec3 PAL_S[${i}] = vec3[${i}](${n(`s`,`l`)});
      const vec3 PAL_O[${i}] = vec3[${i}](${n(`own`,`l`)});
      const float PAL_G[${i}] = float[${i}](${h.map(e=>r[e].glow===2?`2.0`:r[e].glow?`1.0`:`0.0`).join(`, `)});
      ${a}
      ${o}`,l=new ee;l.setAttribute(`position`,new re(y.pos,3)),l.setAttribute(`normal`,new re(y.nrm,3)),l.setAttribute(`aPal`,new re(y.pal,1)),l.setAttribute(`aTone`,new re(y.tone,1));let p=new s(l,new g({glslVersion:f,uniforms:e,vertexShader:`
        in float aPal; in float aTone;
        out vec3 vWorld; out vec3 vN; out float vPal; out float vTone;
        void main() { vWorld = position; vN = normal; vPal = aPal; vTone = aTone; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }`,fragmentShader:`
        ${me}
        ${c}
        in vec3 vWorld; in vec3 vN; in float vPal; in float vTone;
        layout(location = 0) out vec4 outC;
        void main() {
          float r = texture(tNoise, (vWorld.xz + vWorld.y) * 0.9).r;
          vec3 c = kitPaint(vWorld, normalize(vN), int(vPal + 0.5), vTone, r) * 0.82;
          outC = vec4(${u?`hazed(c, vWorld)`:`c`}, 1.0);
        }`}));p.frustumCulled=!1;let m=j(N(b.data.length/4,{aPos:[new Float32Array(b.pos),3],aNrm:[new Float32Array(b.nrm),3],aDir:[new Float32Array(b.dir),3],aData:[new Float32Array(b.data),4],aMore:[new Float32Array(b.more),2]}),M(e,{head:`in vec3 aPos; in vec3 aNrm; in vec3 aDir; in vec4 aData; in vec2 aMore;`+c,body:`
        void makeDab(inout Dab d) {
          vec3 Nn = normalize(aNrm);
          // seen from its outer side only
          if (dot(Nn, cameraPosition - aPos) < 0.0) { d.alive = 0.0; return; }
          vec4 r = hash4(aData.x);
          int k = int(aData.w + 0.5);
          vec3 c = kitPaint(aPos, Nn, k, aMore.x, r.y);
          float wild = PAL_G[k] > 0.5 ? 0.12 : 0.3;
          vec3 c1 = jitter(c, r.wzy, wild), c2 = c * 1.22 + vec3(0.012, 0.008, 0.004);
          d.pos = aPos;
          d.dir = aDir;
          d.size = aData.yz;
          d.c1 = ${u?`hazed(c1, aPos)`:`c1`};
          d.c2 = ${u?`hazed(c2, aPos)`:`c2`};
          d.seed = aData.x;
          d.turnabout = 1.0;
          d.lie = 1.0;
          d.nrm = Nn;
          d.height = 0.004 + aMore.y + 0.01 * r.z;
        }`,minPx:[1.5,3],maxPx:[4e3,4e3],cells:[0,8]}),d),_=new t;return _.add(p,m),{group:_,under:p,strokes:m,count:b.data.length/4}}return{stroke:k,add:se,box:le,round:ue,quad:de,tri:fe,place:ce,build:pe,rand:m}}var V=(e,t,n)=>new D(e,t,n);function Ze(e,t){let n=e.rand,r=(t,n,r,i,a,o,s)=>e.quad([t-r/2,a,n+i/2],[r,0,0],[0,0,-i],o,s),a=(e,t,n,r,a,o={})=>{let s=V(...t),c=V(...n),l=new i().lookAt(s,c,V(.01,1,.02));l.setPosition(s.clone().add(c).multiplyScalar(.5)),e.add(new ne(r,r,s.distanceTo(c)),l,a,{grain:c.clone().sub(s).normalize(),stroke:[r*1.1,.16],...o})},o=(t,n,r,i,a,o={})=>e.add(new _(i,7,5),e.place(t,n,r),a,{smooth:!0,stroke:[i*.7,i*1.1],...o}),s=(t,n,r,i,a=.035)=>e.stroke(V(t,n,r),V(...i).normalize(),V(.2,1,.1),a*.55,a,`glint`,1,.014),c=(t,n,r,i,a,o,s,c,l=1)=>e.stroke(V(t,n,r),i,a,o,s,c,l,.006),l=(e,t,n,i)=>r(e,t,n,i,.027,`umbra`,{stroke:[.09,.24],density:1.7});l(1.2,.62,1.55,.92),l(1.2,1.42,.5,.36),l(.2,.98,.5,.36),l(-1.16,-1.05,.72,.6),l(1.95,-1.3,2,.2),l(.62,-1.33,.56,.16),l(-2.4,1.72,.2,1.2),l(-1.5,-1.62,.4,.34);{let t=V(.07,.029,1.72),n=V(1.1,0,0),r=V(1.6,0,-.62);for(let i of[0,1])for(let a of[0,1]){let o=t.clone().addScaledVector(n,i*.53).addScaledVector(r,a*.53);e.quad(o.toArray(),n.clone().multiplyScalar(.47).toArray(),r.clone().multiplyScalar(.47).toArray(),`moon`,{grain:`v`,stroke:[.1,.26],density:2.2})}}r(.9,.6,1.3,.24,.794,`crimson`,{stroke:[.05,.14]}),r(.9,.735,1.3,.03,.796,`ochre`,{stroke:[.025,.1]}),r(.9,.465,1.3,.03,.796,`ochre`,{stroke:[.025,.1]}),o(1.11,.9,.7,.045,`crimson`),o(1.19,.9,.76,.045,`green`),o(1.16,.905,.66,.04,`crimson`),s(1.1,.94,.72,[-.6,.7,-.2],.025),s(1.18,.94,.76,[-.6,.7,-.2],.025),e.round(.5,.8,.33,.11,.012,`cream`,{stroke:[.04,.07]}),e.box(.5,.835,.33,.09,.05,.06,`ochre`,{stroke:[.03,.05],rotY:.5}),a(e,[.34,.8,.27],[.56,.8,.2],.012,`iron`),e.round(1.4,.89,.8,.06,.2,`cream`,{top:.042,stroke:[.04,.08]});for(let t=0;t<7;t++){let n=t/7*Math.PI*2;e.stroke(V(1.4+Math.cos(n)*.058,.88,.8+Math.sin(n)*.058),V(Math.cos(n),0,Math.sin(n)),V(-Math.sin(n),0,Math.cos(n)),.018,.045,`blue`,1,.006)}s(1.36,.93,.76,[-.7,.4,-.5]),s(1.29,.86,.4,[-.8,.4,-.2],.025);for(let e=0;e<16;e++)c(-2.598,1.21+.22*n(),-.55+1.1*n(),V(1,0,0),V(0,1,(n()-.5)*.5),.07,.17,`soot`,.8+.5*n());e.round(-2.74,.62,0,.11,.16,`iron`,{top:.14,stroke:[.05,.09]}),a(e,[-2.74,.72,0],[-2.74,1.19,0],.014,`iron`),s(-2.63,.66,.04,[1,.3,.2]),a(e,[-2.06,.09,-.86],[-2.5,1.02,-.74],.018,`iron`),a(e,[-2,.09,-.74],[-2.46,.95,-.68],.018,`iron`),e.box(-2.03,.1,-.74,.12,.02,.1,`iron`,{stroke:[.04,.06]}),s(-2.14,.3,.74,[.4,.7,-.6]),s(-2.59,1.71,-.72,[1,.4,.2]),s(-2.62,1.67,-.48,[1,.4,.2],.025),s(-2.6,1.74,.28,[1,.4,-.2]),s(-2.93,1.67,-1.3,[1,.1,.3],.05),s(-2.93,1.47,-1.71,[1,.1,.3],.04);for(let e of[-.9,.9])t.box(e,2.44,0,.16,.16,4.8,`wood`,{grain:`z`,stroke:[.14,.6],tone:.72});let d=new i().makeRotationX(Math.PI);for(let[t,n]of[[-1.5,`green`],[-1.12,`ochre`],[-.74,`green`],[1.9,`ochre`]])e.add(new C(.09,.34,6),e.place(-.9,2.14,t).multiply(d),n,{stroke:[.03,.1],grain:V(0,1,0),tone:.85}),a(e,[-.9,2.3,t],[-.9,2.37,t],.012,`wood`);for(let e=0;e<6;e++)o(.9+(e%2?.035:-.035),2.3-e*.075,-1.6,.045,e%3?`cream`:`ochre`);a(e,[.9,2.36,.6],[.9,2.08,.6],.012,`iron`),e.round(.9,2.06,.6,.085,.03,`iron`,{top:.03,stroke:[.04,.05]}),e.round(.9,1.985,.6,.045,.11,`flame`,{stroke:[.03,.06]}),e.round(.9,1.92,.6,.06,.025,`iron`,{stroke:[.04,.05]});let f=(t,r,i,a,o)=>{for(let[s,c]of[[0,0],[.5,0],[0,.5],[.5,.5]])for(let[l,u]of[[0,0],[1,0],[0,1],[1,1]])for(let d=0;d<(u?2:4);d++){let d=l?-1:1,f=u?-1:1,p=(.1+.8*n())*Math.PI/2,m=.05+.09*n(),h=Math.cos(p)*d,g=Math.sin(p)*f,_=V(...t).addScaledVector(r,(s+l*.5)*i+d*.035+h*m/2).add(V(0,(c+u*.5)*a+f*.03+g*m/2,0));e.stroke(_,o,V(0,g,0).addScaledVector(r,h),.024,m,`frost`,.7+.5*n(),.002)}};f([-.9,1,-2.385],V(1,0,0),1.2,.9,V(0,0,1)),f([-1.7,1,2.385],V(1,0,0),1.1,.9,V(0,0,-1)),f([2.985,1,.1],V(0,0,1),1.2,.9,V(-1,0,0)),e.round(-1.45,1.05,2.3,.055,.1,`crimson`,{top:.07,stroke:[.04,.07]}),e.add(new C(.1,.24,6),e.place(-1.45,1.22,2.3),`green`,{stroke:[.03,.09],grain:V(0,1,0)}),e.box(2.9,1.02,1.06,.14,.04,.2,`blue`,{stroke:[.04,.1]}),e.box(2.9,1.06,1.05,.13,.035,.18,`crimson`,{stroke:[.04,.1],rotY:.2});for(let t=1;t<5;t++)for(let n=-2.33;n<-1.37;n+=.085)e.stroke(V(.95+.28*t,.542,n),V(0,1,0),V(0,0,1),.012,.05,`cream`,1,.004);for(let t=1;t<3;t++)for(let n=.98;n<2.34;n+=.085)e.stroke(V(n,.542,-2.36+.333*t),V(0,1,0),V(1,0,0),.012,.05,`cream`,1,.004);e.box(2.42,.66,-1.62,.3,.1,.32,`teal`,{stroke:[.06,.12],rotY:.3});for(let t=0;t<9;t++){let n=t/9*Math.PI*2;e.stroke(V(2.6+Math.cos(n)*.12,.688,-1.86+Math.sin(n)*.2),V(0,1,0),V(-Math.sin(n),0,Math.cos(n)),.02,.05,t%2?`crimson`:`blue`,1,.004)}e.box(2.88,1.6,-1.75,.2,.035,1,`wood`,{grain:`z`}),[`crimson`,`ochre`,`crimson`,`green`,`ochre`].forEach((t,n)=>{let r=-2.15+n*.2;e.round(2.88,1.69,r,.055,.14,t,{stroke:[.035,.07]}),e.round(2.88,1.77,r,.058,.025,`cream`,{stroke:[.03,.05]}),s(2.83,1.71,r+.02,[-1,.3,.3],.03)});for(let e of[1.25,1.75])for(let t=0;t<9;t++)c(-2.6+n()*(e>1.5?.8:1.15),e+.1+.1*n(),-2.188,V(0,0,1),V(1,0,0),.012,.035,`ochre`,1.3);[`teal`,`cream`,`crimson`,`ochre`].forEach((t,n)=>e.round(-2.5+n*.27,1.13,-2.3,.04,.08,t,{stroke:[.03,.05]}));{let t=V(.98,-.2,0),n=V(.2,.98,0),r=V(0,0,1);for(let i of[1.33,1.71])for(let a of[1.33,1.61,1.89,2.17])for(let o=0;o<9;o++){let s=o/9*Math.PI*2,c=V(-2.69,i,a).addScaledVector(t,.016);e.stroke(c.addScaledVector(n,Math.sin(s)*.085).addScaledVector(r,Math.cos(s)*.085),t,n.clone().multiplyScalar(Math.cos(s)).addScaledVector(r,-Math.sin(s)),.016,.034,`blue`,1,.004)}}for(let t of[-1.6,-.95,-.3])for(let[n,r,i]of[[.2,.058,`ochre`],[.1,.062,`blue`]])e.quad([t,r,.1+n],[n,0,-n],[-n,0,-n],i,{stroke:[.05,.1]});for(let t=-.68;t<.9;t+=.055)e.stroke(V(.25,.031,t),V(0,1,0),V(1,0,(n()-.5)*.4),.018,.1,`cream`,.8+.3*n(),.002);r(1.75,2.05,.9,.5,.03,`ochre`,{stroke:[.05,.14],tone:.8}),r(1.75,2.17,.9,.05,.034,`crimson`,{stroke:[.03,.1]}),r(1.75,1.93,.9,.05,.034,`crimson`,{stroke:[.03,.1]}),r(2.6,1.85,.6,.5,.028,`teal`,{stroke:[.06,.14],tone:.55,density:.7});for(let t of[1.78,1.94])e.box(2.62,.14,t,.1,.26,.11,`soot`,{stroke:[.05,.1],tone:1.6}),e.box(2.56,.05,t,.22,.08,.11,`soot`,{stroke:[.05,.1],tone:1.6});a(e,[2.8,.03,2.12],[2.9,1.95,2.3],.07,`crimson`,{stroke:[.05,.3]}),a(e,[2.68,.03,2.2],[2.8,1.92,2.32],.07,`crimson`,{stroke:[.05,.3]}),a(e,[2.58,.03,2.28],[2.62,1.5,2.34],.02,`wood`);for(let t of[-.22,.14]){e.add(new u(.16,.016,4,12),e.place(t,1.5,2.36,0,[.62,1.5,1]),`wood`,{stroke:[.02,.08]});for(let n of[-.08,.02,.12])a(e,[t-.09,1.5+n,2.36],[t+.09,1.5+n,2.36],.01,`cream`)}e.box(-1.45,.475,-1,.44,.05,.44,`teal`,{stroke:[.06,.12]});{let t=V(-1,0,0),r=V(0,1,0),i=2.95;e.box(2.975,1.5,-.6,.03,.54,.68,`wood`,{tone:.65}),e.quad([2.957,1.27,-.9],[0,0,.6],[0,.46,0],`ochre`,{stroke:[.05,.09],tone:.95});for(let e=0;e<9;e++)c(i,1.29+.05*n(),-.88+.56*n(),t,V(0,.1,1),.03,.09,`fur`,.7+.5*n());for(let e of[-.84,-.71,-.47,-.38])c(i,1.5,e,t,r,.022+.012*n(),.34,`soot`,1.4);for(let e=0;e<16;e++)c(i,1.56+.14*n(),-.88+.56*n(),t,V(0,n()-.5,1),.04,.07,e%3?`crimson`:`fur`,.9+.3*n());c(2.9480000000000004,1.5,-.6,t,V(0,1,.5),.018,.2,`glint`,.75),c(2.947,1.365,-.6,t,r,.026,.06,`blue`,1.2),c(2.946,1.402,-.6,t,V(0,0,1),.012,.036,`glint`,.9)}}var H=(e,t,n)=>new D(e,t,n),Qe=.654,$e=e=>4.25-Qe*Math.abs(e),et=(e,t)=>.22+.12*k(e*.8+3,t*.9)+.05*k(e*2.3,t*2.1+5)+.07*Math.exp(-((t/.5)**2));function tt(e){let{rand:t}=e,n={grain:`v`,stroke:[.14,.6]};e.quad([-3.55,2.138,3],[0,1.962,-3],[7.1,0,0],`frame`,n),e.quad([3.55,2.138,-3],[0,1.962,3],[-7.1,0,0],`frame`,n),e.quad([-3.55,2.138,3],[7.1,0,0],[0,.15,0],`frame`,{stroke:[.12,.6]}),e.quad([3.55,2.138,-3],[-7.1,0,0],[0,.15,0],`frame`,{stroke:[.12,.6]});let r={stroke:[.12,.6]};e.quad([-3.55,2.138,3],[0,.15,0],[0,1.962,-3],`frame`,{...r,grain:`v`}),e.quad([-3.55,2.138,-3],[0,1.962,3],[0,.15,0],`frame`,r),e.quad([3.55,2.138,3],[0,1.962,-3],[0,.15,0],`frame`,r),e.quad([3.55,2.138,-3],[0,.15,0],[0,1.962,3],`frame`,{...r,grain:`v`});let a=[-3.58,-3.68,-3.48],o=[.04,.6,1];for(let e=-3.2;e<3.21;e+=.4)a.push(e),o.push(1);a.push(3.48,3.68,3.58),o.push(1,.6,.04);let s=[2.86,2.5,2.14,1.78,1.42,1.06,.7,.35,0],c=a.length,l=3+s.length;for(let n of[1,-1]){let r=new Float32Array(c*l*3);for(let e=0;e<l;e++)for(let t=0;t<c;t++){let i=a[t],l=o[t],u=.05*k(i*1.1,7.3+n),d,f;e===0?(d=3.03,f=2.25):e===1?(d=3.13+u,f=2.25+.1*l):e===2?(d=3.09+u,f=2.25+.25*l):(d=s[e-3],f=$e(d)+et(i,d*n)*l),r.set([i,f,d*n],(t+e*c)*3)}let u=[],d=[];for(let e=0;e<l-1;e++)for(let t=0;t<c-1;t++){let r=t+e*c,i=r+1,a=i+c,o=r+c;(e<2?u:d).push(...n>0?[r,i,a,r,a,o]:[r,a,i,r,o,a])}let f=new ee;f.setAttribute(`position`,new b(r,3)),f.setIndex([...u,...d]),f.computeVertexNormals();let p=e=>{let t=new ee;return t.setAttribute(`position`,f.attributes.position),t.setAttribute(`normal`,f.attributes.normal),t.setIndex(e),t},m=new i;e.add(p(d),m,`snow`,{smooth:!0,free:!0,lift:.02,grain:H(0,-.55,n*.84),stroke:[.3,.62],density:2.1}),e.add(p(u),m,`snow`,{smooth:!0,grain:H(1,0,0),stroke:[.15,.32],density:1.7});let h=H(0,.84,n*.55);for(let r=0;r<260;r++){let i=-3.3+6.6*t(),a=(.15+2.6*t())*n,o=et(i,a)-.22,s=H(i,$e(a)+et(i,a)+.05,a),c=H(1,(t()-.5)*.3,(t()-.5)*.5);o>.05?e.stroke(s,h,c,.07,.24+.2*t(),`ice`,1,.01):o<-.06&&r%2&&e.stroke(s,h,H(.3,-.55,n*.84),.2,.45+.3*t(),`snow`,.72,.01)}for(let r=0;r<26;r++){let r=-3.4+6.8*t(),i=.14+.45*t()*t();e.stroke(H(r,2.26-i/2,n*3.07),H(0,0,n),H(0,1,0),.045,i,`ice`,1,.01)}}}var U=(e,t,n)=>new D(e,t,n);function nt(e){let n=[L.x,L.y,L.z],r=(e,t,n)=>U(L.x+e,L.y+t,L.z+n),a=r(-2.4,.6,0),o=r(.6,1.03,.5);e.uFire={value:new E(a.x,a.y,a.z,1)},e.uCandle={value:new E(o.x,o.y,o.z,.5)},e.uPane={value:r(-.3,1.45,-2.4)},e.uWarm.value[0].set(...r(-1.15,1.3,2.75).toArray(),.75),e.uWarm.value[1].set(...r(1.75,1.1,2.75).toArray(),1.1),e.uWarm.value[2].set(...r(-.3,1.3,-2.75).toArray(),-.7),e.uRoom.value.set(L.x,L.z,3.15,2.55);let c=Xe(e,{origin:n,seed:811,haze:!0,order:3,head:P,palettes:{log:{l:[.2,.19,.2],m:[.085,.075,.09],s:[.028,.026,.045],own:[.55,.36,.2]},snow:{l:[.42,.6,.74],own:[.95,.95,.95]},stone:{l:[.22,.26,.3],m:[.09,.11,.14],s:[.03,.04,.06],own:[.5,.45,.4]},frame:{l:[.13,.12,.13],m:[.06,.055,.065],s:[.022,.02,.035],own:[.4,.26,.15]},door:{l:[.2,.17,.17],m:[.09,.075,.08],s:[.03,.026,.04],own:[.62,.36,.18]},ice:{l:[.5,.75,.85],m:[.25,.45,.6],s:[.1,.2,.35],own:[1,.9,.7]},pane:{l:[1,.7,.28],glow:!0}},light:`
      vec3 kitPaint(vec3 P, vec3 Nn, int k, float tone, float r) {
        float x = moonOn(P, Nn);
        // snow is never one white: it is packed here and crusted there, and a stroke of it may be laid darker
        vec3 c = k == 1 ? snowPaint(x, r, 0.7 * auroraOn(P.xz, Nn), 0.15 + 0.6 * texture(tNoise, P.xz / 2.7 + P.y * 0.3).r) * mix(1.0, tone, 0.75) : paint3(PAL_L[k], PAL_M[k], PAL_S[k], x, r) * tone;
        c = lampOn(c, PAL_O[k], P, Nn);
        vec3 lit = PAL_L[k] * tone * (0.82 + 0.18 * sin(uTime * 6.0 + P.x * 7.0 + P.y * 5.0));
        return PAL_G[k] > 0.5 ? lit : c;
      }`}),l={rows:.27,stroke:[.27,1.1],detail:!0};c.quad([-3.2,0,2.6],[6.4,0,0],[0,2.4,0],`log`,{...l,holes:[[.234,.406,.417,.792],[.695,.852,0,.833]]}),c.quad([3.2,0,-2.6],[-6.4,0,0],[0,2.4,0],`log`,{...l,holes:[[.453,.641,.417,.792]]}),c.quad([-3.2,0,-2.6],[0,0,5.2],[0,2.4,0],`log`,l),c.quad([3.2,0,2.6],[0,0,-5.2],[0,2.4,0],`log`,{...l,holes:[[.25,.481,.417,.792]]}),c.quad([3.16,1,1.3],[0,0,-1.2],[0,.9,0],`pane`,{stroke:[.14,.22],density:1.3}),c.box(3.21,1.45,.7,.05,.9,.045,`frame`),c.box(3.21,1.45,.7,.05,.045,1.2,`frame`),c.box(3.21,.97,.7,.12,.07,1.34,`frame`),c.box(3.21,1.93,.7,.1,.07,1.34,`frame`),c.box(3.21,1.45,1.335,.1,.96,.07,`frame`),c.box(3.21,1.45,.065,.1,.96,.07,`frame`),c.box(3.3,2,.7,.2,.09,1.4,`snow`,{stroke:[.1,.3]}),c.tri([-3.2,2.4,-2.6],[-3.2,2.4,2.6],[-3.2,4.1,0],`log`,{stroke:[.24,.8],grain:[0,0,1]}),c.tri([3.2,2.4,2.6],[3.2,2.4,-2.6],[3.2,4.1,0],`log`,{stroke:[.24,.8],grain:[0,0,1]}),tt(c),c.box(-3.65,2.45,0,.9,4.9,1,`stone`,{stroke:[.17,.26]}),c.box(-3.65,4.99,0,1.02,.18,1.12,`snow`,{stroke:[.2,.4]});for(let[e,t,n]of[[-1.7,2.56,1],[.3,-2.56,-1]]){c.quad([e,1,t],[1.1*n,0,0],[0,.9,0],`pane`,{stroke:[.14,.22],density:1.3});let r=e+.55*n,i=t+.05*n;c.box(r,1.45,i,.045,.9,.05,`frame`),c.box(r,1.45,i,1.1,.045,.05,`frame`),c.box(r,.97,i,1.24,.07,.12,`frame`),c.box(r,1.93,i,1.24,.07,.1,`frame`),c.box(e-.035*n,1.45,i,.07,.96,.1,`frame`),c.box(e+1.135*n,1.45,i,.07,.96,.1,`frame`),c.box(r,2,t+.1*n,1.3,.09,.2,`snow`,{stroke:[.1,.3]})}c.box(1.2,1,2.62,.1,2,.14,`frame`),c.box(2.3,1,2.62,.1,2,.14,`frame`),c.box(1.75,2.05,2.62,1.2,.1,.14,`frame`),c.box(2.42,1,3.12,.07,1.96,1,`door`,{grain:`y`,stroke:[.16,.7]}),c.box(1.75,.03,3,1.5,.06,.7,`stone`,{stroke:[.16,.3]}),c.box(-2.6,.45,2.85,1.1,.9,.45,`door`,{stroke:[.13,.16],density:1.4}),c.box(-2.6,.95,2.87,1.2,.14,.55,`snow`,{stroke:[.2,.4]}),c.box(-.3,1.04,-2.68,1.24,.09,.15,`snow`,{stroke:[.1,.3]}),c.box(-1.15,1.04,2.68,1.24,.09,.15,`snow`,{stroke:[.1,.3]}),c.box(3.28,1.04,.7,.15,.09,1.3,`snow`,{stroke:[.1,.3]});let u=c.build(),f=t=>Xe(e,{origin:n,seed:t,order:3,head:P,palettes:{wall:{l:[.8,.46,.2],m:[.42,.2,.11],s:[.13,.062,.065]},floor:{l:[.72,.43,.2],m:[.37,.2,.11],s:[.11,.06,.06]},stone:{l:[.74,.62,.5],m:[.38,.3,.27],s:[.12,.1,.12]},soot:{l:[.2,.1,.07],m:[.08,.045,.04],s:[.03,.02,.03]},wood:{l:[.62,.35,.16],m:[.31,.16,.09],s:[.09,.05,.05]},iron:{l:[.32,.27,.26],m:[.12,.1,.12],s:[.04,.035,.05]},crimson:{l:[.86,.17,.12],m:[.5,.07,.09],s:[.18,.03,.07]},ochre:{l:[.96,.7,.25],m:[.6,.4,.14],s:[.2,.13,.08]},teal:{l:[.2,.56,.55],m:[.1,.3,.34],s:[.04,.11,.16]},blue:{l:[.28,.4,.76],m:[.14,.2,.45],s:[.05,.07,.2]},green:{l:[.32,.6,.3],m:[.14,.32,.17],s:[.05,.12,.09]},cream:{l:[.98,.9,.72],m:[.66,.56,.45],s:[.24,.2,.22]},fur:{l:[.92,.56,.24],m:[.52,.28,.14],s:[.17,.09,.07]},ember:{l:[1,.42,.07],glow:!0},flame:{l:[1,.86,.5],glow:!0},umbra:{l:[.26,.13,.1],m:[.13,.065,.065],s:[.05,.028,.045]},glint:{l:[1,.93,.7],glow:2},frost:{l:[.5,.72,.82],glow:2},moon:{l:[.36,.44,.46],glow:2}},light:`
      uniform vec4 uFire; uniform vec4 uCandle; uniform vec3 uPane;
      // How lit a spot of the room is: by the fire, the candle, and the lantern he brings in.
      float roomLight(vec3 P, vec3 Nn) {
        vec3 to = uFire.xyz - P;
        float d2 = dot(to, to);
        float f = uFire.w * clamp(dot(Nn, to) * inversesqrt(d2 + 1e-4) * 0.75 + 0.38, 0.0, 1.0) / (0.5 + d2 * 0.17);
        to = uCandle.xyz - P; d2 = dot(to, to);
        f += uCandle.w * clamp(dot(Nn, to) * inversesqrt(d2 + 1e-4) * 0.7 + 0.4, 0.0, 1.0) / (0.2 + d2 * 1.2);
        return clamp(0.06 + f + lampAt(P, Nn) * 0.7, 0.0, 1.0);
      }
      vec3 kitPaint(vec3 P, vec3 Nn, int k, float tone, float r) {
        vec3 lit = PAL_L[k] * tone * (PAL_G[k] > 1.5 ? 1.0 : 0.8 + 0.2 * sin(uTime * 9.0 + P.z * 23.0 + P.y * 17.0));
        float x = roomLight(P, Nn);
        vec3 c = paint3(PAL_L[k], PAL_M[k], PAL_S[k], x, r) * tone;
        // the night comes in at the north window, green and cool, where the fire does not reach
        vec3 to = uPane - P;
        float night = clamp(dot(Nn, to) * 0.5 + 0.5, 0.0, 1.0) / (1.0 + dot(to, to) * 0.5);
        c += vec3(0.01, 0.085, 0.07) * night * (1.0 - x) * uGlow.x;
        return PAL_G[k] > 0.5 ? lit : c;
      }`}),p=f(4127),m=f(77),h={rows:.2,stroke:[.2,1.2],detail:!0},g={rows:.27,stroke:[.27,1.1],detail:!0};p.quad([-3,.02,2.4],[6,0,0],[0,0,-4.8],`floor`,h),p.quad([-3,0,-2.4],[6,0,0],[0,2.4,0],`wall`,{...g,holes:[[.35,.55,.417,.792]]}),p.quad([3,0,2.4],[-6,0,0],[0,2.4,0],`wall`,{...g,holes:[[.125,.292,0,.833],[.6,.783,.417,.792]]}),p.quad([-3,0,2.4],[0,0,-4.8],[0,2.4,0],`wall`,g),p.quad([3,0,-2.4],[0,0,4.8],[0,2.4,0],`wall`,{...g,holes:[[.521,.771,.417,.792]]}),p.box(2.96,1.45,.7,.05,.9,.04,`wood`),p.box(2.96,1.45,.7,.05,.04,1.2,`wood`),p.box(2.92,.97,.7,.2,.06,1.36,`wood`,{grain:`z`}),p.box(2.96,1.93,.7,.08,.07,1.32,`wood`),p.box(2.96,1.45,.07,.08,.96,.07,`wood`),p.box(2.96,1.45,1.33,.08,.96,.07,`wood`),p.box(2.91,2.04,.7,.035,.035,1.9,`iron`);for(let e of[-.26,1.3])p.quad([2.94,.86,e],[0,0,.36],[0,1.17,0],`crimson`,{grain:`v`,stroke:[.06,.4]});p.round(2.88,1.07,.38,.022,.14,`cream`,{stroke:[.03,.06]}),p.stroke(U(2.88,1.19,.38),U(-.9,.2,.3).normalize(),U(0,1,0),.045,.09,`flame`,1,.01),p.tri([-3,2.4,2.4],[-3,2.4,-2.4],[-3,3.95,0],`wall`,{stroke:[.24,.8],grain:[0,0,1]}),p.tri([3,2.4,-2.4],[3,2.4,2.4],[3,3.95,0],`wall`,{stroke:[.24,.8],grain:[0,0,1]}),m.quad([3,2.4,2.4],[-6,0,0],[0,1.55,-2.4],`wood`,{...h,tone:.7}),m.quad([-3,2.4,-2.4],[6,0,0],[0,1.55,2.4],`wood`,{...h,tone:.7});let v={stroke:[.15,.22]};p.box(-2.8,.6,-.78,.4,1.2,.34,`stone`,v),p.box(-2.8,.6,.78,.4,1.2,.34,`stone`,v),p.box(-2.8,1.36,0,.4,.32,1.9,`stone`,v),p.box(-2.86,2,0,.28,.96,1.5,`stone`,v),p.box(-2.5,.04,0,1,.08,2,`stone`,{stroke:[.2,.3]}),p.quad([-2.97,.08,.61],[0,0,-1.22],[0,1.12,0],`soot`,{stroke:[.14,.24]});let y=new i().makeRotationX(Math.PI/2);p.round(-2.74,.17,-.05,.065,.62,`soot`,{turn:y,grain:U(0,0,1),stroke:[.06,.2]}),p.round(-2.66,.2,.08,.055,.55,`ember`,{turn:new i().makeRotationX(Math.PI/2).premultiply(new i().makeRotationY(.5)),grain:U(0,0,1),stroke:[.05,.12]}),p.box(-2.7,.1,0,.34,.04,.6,`ember`,{stroke:[.05,.08],density:1.5}),p.box(-2.68,1.55,0,.6,.06,2.06,`wood`,{grain:`z`,stroke:[.1,.5]}),p.round(-2.66,1.67,-.72,.075,.18,`teal`,{stroke:[.05,.1]}),p.round(-2.68,1.65,-.48,.055,.14,`ochre`,{stroke:[.04,.08]}),p.round(-2.66,1.7,.28,.06,.24,`blue`,{stroke:[.04,.1],top:.03}),p.round(-2.66,1.68,.7,.024,.2,`cream`,{stroke:[.03,.08]}),p.stroke(U(-2.66,1.83,.7),U(1,0,0),U(0,1,0),.05,.1,`flame`,1,.01),p.add(new _(.15,9,7),p.place(-2.22,.22,.78,0,[1,.85,1]),`iron`,{smooth:!0,stroke:[.06,.1]}),p.round(-2.22,.37,.78,.05,.04,`iron`,{stroke:[.04,.05]});for(let e=0;e<9;e++){let t=e<4?0:e<7?1:2,n=e<4?e:e<7?e-4:e-7;p.round(-2.72,.09+t*.15,-1.3-n*.17-t*.085,.078,.5,e%3?`wood`:`ochre`,{turn:new i().makeRotationZ(Math.PI/2),grain:U(1,0,0),stroke:[.06,.2],tone:.8+.3*p.rand()})}p.round(-2.955,1.6,-1.35,.15,.03,`iron`,{turn:new i().makeRotationZ(Math.PI/2),stroke:[.05,.1]}),p.round(-2.955,1.42,-1.75,.11,.03,`iron`,{turn:new i().makeRotationZ(Math.PI/2),stroke:[.05,.1]});let b=(e,t,n,r,i,a,o)=>p.quad([e-n/2,i,t+r/2],[n,0,0],[0,0,-r],a,o),x={stroke:[.06,.15]};b(-.95,.1,2.3,1.6,.03,`ochre`,x),b(-.95,.1,2.1,1.4,.036,`teal`,x),b(-.95,.1,1.86,1.16,.042,`crimson`,x),b(-.95,.1,.8,.44,.048,`ochre`,x),b(-.95,.1,.5,.2,.054,`blue`,x),p.add(new _(1,10,7),p.place(-1.55,.16,.42,.5,[.3,.13,.2]),`fur`,{smooth:!0,stroke:[.05,.1],grain:U(1,0,.4)}),p.add(new _(.085,8,6),p.place(-1.33,.17,.57),`fur`,{smooth:!0,stroke:[.04,.06]});for(let e of[-.045,.045])p.add(new C(.03,.06,5),p.place(-1.32,.26,.57+e),`fur`,{stroke:[.02,.04]});p.box(-1.45,.42,-1,.5,.06,.5,`wood`,{grain:`x`}),p.box(-1.2,.83,-1,.06,.82,.5,`wood`,{grain:`y`});for(let[e,t]of[[-.21,-.21],[-.21,.21],[.21,-.21],[.21,.21]])p.box(-1.45+e,.2,-1+t,.05,.4,.05,`wood`,{grain:`y`});p.box(-1.2,1,-1,.1,.5,.54,`crimson`,{stroke:[.07,.16]}),p.box(-1.2,.86,-1,.105,.07,.545,`ochre`,{stroke:[.05,.12]}),p.box(.9,.76,.6,1.3,.06,.8,`wood`,{grain:`x`,stroke:[.1,.5]});for(let[e,t]of[[-.57,-.32],[-.57,.32],[.57,-.32],[.57,.32]])p.box(.9+e,.365,.6+t,.07,.73,.07,`wood`,{grain:`y`});p.round(.6,.89,.5,.024,.2,`cream`,{stroke:[.03,.08]}),p.stroke(U(.6,1.04,.5),U(.6,.3,.7).normalize(),U(0,1,0),.05,.1,`flame`,1,.01),p.round(1.15,.825,.72,.13,.07,`teal`,{top:.15,stroke:[.05,.09]}),p.box(.95,.845,.38,.28,.11,.15,`ochre`,{stroke:[.05,.09],rotY:.4}),p.round(1.32,.84,.42,.045,.1,`crimson`,{stroke:[.03,.06]}),b(.47,.82,.17,.24,.795,`cream`,{stroke:[.04,.08]}),b(.66,.82,.17,.24,.797,`cream`,{stroke:[.04,.08],tone:.9}),p.round(.95,.225,1.38,.17,.45,`wood`,{stroke:[.07,.2]}),p.round(-.05,.225,.95,.17,.45,`wood`,{stroke:[.07,.2]}),p.box(1.95,.26,-1.86,2,.52,1,`wood`,{grain:`x`,stroke:[.1,.5]}),p.box(2.94,.62,-1.86,.08,1.24,1,`wood`,{grain:`z`}),p.box(2.6,.61,-1.86,.5,.15,.76,`cream`,{stroke:[.08,.16]});let S=[`crimson`,`ochre`,`teal`,`cream`,`blue`,`green`,`crimson`,`blue`,`ochre`,`green`,`cream`,`teal`,`ochre`,`crimson`,`blue`];for(let e=0;e<5;e++){for(let t=0;t<3;t++)b(1.09+e*.28,-2.19+t*.333,.28,.333,.535+.002*((e+t)%2),S[e*3+t],{stroke:[.06,.12]});p.quad([.95+e*.28,.2,-1.355],[.28,0,0],[0,.335,0],S[(e*3+7)%15],{stroke:[.06,.12]})}for(let e of[1.25,1.75]){p.box(-1.97,e,-2.28,1.46,.04,.22,`wood`,{grain:`x`});let t=[`crimson`,`blue`,`green`,`ochre`,`cream`,`teal`];for(let n=-2.64,r=0;n<(e>1.5?-1.75:-1.4);r++){let r=.045+.035*p.rand(),i=.2+.09*p.rand();p.box(n+r/2,e+.02+i/2,-2.27,r,i,.16,t[Math.floor(p.rand()*6)],{grain:`y`,stroke:[.04,.12]}),n+=r+.004}}p.round(-1.55,1.87,-2.27,.07,.2,`teal`,{stroke:[.04,.09]}),p.round(-1.37,1.84,-2.27,.055,.14,`ochre`,{stroke:[.04,.08]});for(let[e,t,n]of[[-.3,-2.36,1],[-1.15,2.36,-1]]){p.box(e,1.45,t,.04,.9,.05,`wood`),p.box(e,1.45,t,1.2,.04,.05,`wood`),p.box(e,.97,t+.04*n,1.36,.06,.2,`wood`,{grain:`x`}),p.box(e,1.93,t,1.32,.07,.08,`wood`),p.box(e-.63,1.45,t,.07,.96,.08,`wood`),p.box(e+.63,1.45,t,.07,.96,.08,`wood`),p.box(e,2.04,t+.05*n,1.9,.035,.035,`iron`);for(let r of[-1,1]){let i=Math.min(e+r*.6,e+r*.96),a=n>0?i:i+.36;p.quad([a,.86,t+.06*n],[.36*n,0,0],[0,1.17,0],`crimson`,{grain:`v`,stroke:[.06,.4]})}}for(let e of[-.72,.1])p.round(e,1.07,-2.26,.022,.14,`cream`,{stroke:[.03,.06]}),p.stroke(U(e,1.19,-2.26),U(.3,.2,.9).normalize(),U(0,1,0),.045,.09,`flame`,1,.01);p.box(-2.74,.45,1.75,.5,.9,1.15,`wood`,{grain:`z`,stroke:[.1,.4]}),p.box(-2.86,1.4,1.75,.26,1,1.15,`wood`,{grain:`y`,stroke:[.1,.4],tone:.8});for(let e of[1.18,1.56]){p.box(-2.72,e,1.75,.3,.035,1.12,`wood`,{grain:`z`});for(let t of[1.33,1.61,1.89,2.17])p.round(-2.69,e+.15,t,.115,.025,p.rand()<.3?`teal`:`cream`,{turn:new i().makeRotationZ(Math.PI/2-.2),stroke:[.05,.08]})}p.round(-2.76,2,1.4,.08,.2,`green`,{stroke:[.04,.09]}),p.round(-2.76,1.97,1.72,.065,.14,`crimson`,{stroke:[.04,.08]}),p.round(-2.76,2.02,2.05,.07,.24,`ochre`,{stroke:[.04,.1],top:.035}),p.round(-2.71,2.05,0,.19,.03,`cream`,{turn:new i().makeRotationZ(Math.PI/2),stroke:[.05,.08]}),p.round(-2.715,2.05,0,.215,.022,`wood`,{turn:new i().makeRotationZ(Math.PI/2),stroke:[.03,.08],tone:.7});for(let[e,t]of[[-.95,`green`],[.93,`ochre`],[1.02,`green`]])p.add(new C(.07,.3,6),p.place(-2.5,1.36,e).multiply(new i().makeRotationX(Math.PI)),t,{stroke:[.03,.1],grain:U(0,1,0)});let w=(e,t,n,r,i,a)=>{p.box(e,t,-2.375,n,r,.03,`wood`,{tone:.75}),p.quad([e-n/2+.04,t-r/2+.04,-2.355],[n-.08,0,0],[0,r-.08,0],i,{stroke:[.04,.08]}),p.quad([e-n/4,t-r/4,-2.35],[n/2,0,0],[0,r/3,0],a,{stroke:[.04,.07]})};w(1.35,1.72,.5,.4,`blue`,`cream`),w(1.95,1.8,.34,.44,`ochre`,`crimson`),p.box(2.55,1.86,-2.36,.5,.05,.05,`wood`),p.quad([2.36,1.02,-2.33],[.2,0,0],[0,.84,0],`blue`,{grain:`v`,stroke:[.07,.3]}),p.quad([2.62,1.2,-2.33],[.12,0,0],[0,.66,0],`crimson`,{grain:`v`,stroke:[.05,.25]}),p.box(.62,.24,-1.86,.5,.48,.9,`teal`,{grain:`z`,stroke:[.08,.3]}),p.box(.62,.5,-1.86,.54,.05,.94,`wood`,{grain:`z`}),p.box(.62,.57,-1.8,.4,.1,.5,`ochre`,{stroke:[.06,.14]}),p.box(.62,.65,-1.8,.36,.06,.46,`crimson`,{stroke:[.06,.14]}),b(1.9,-.95,1.5,.62,.03,`blue`,x),b(1.9,-.95,1.3,.42,.036,`cream`,x),b(1.9,-.95,1.1,.24,.042,`blue`,x),p.round(-1.75,.13,-1.55,.2,.26,`ochre`,{top:.24,stroke:[.05,.1],tone:.8});for(let[e,t,n]of[[-.07,.03,`crimson`],[.08,-.04,`cream`],[0,.09,`teal`]])p.add(new _(.085,7,5),p.place(-1.75+e,.3,-1.55+t),n,{smooth:!0,stroke:[.04,.06]});Ze(p,m);let ee=p.build();u.group.add(m.build().group);let T=j(N(58),M(e,{head:`uniform vec4 uFire;`,body:`
      void makeDab(inout Dab d) {
        float id = float(gl_InstanceID);
        vec4 r = hash4(id * 5.3 + 1.0);
        float life = fract(r.x + uTime * (0.8 + 0.7 * r.y));
        vec3 P = uFire.xyz + vec3(-0.3 + (r.z - 0.5) * 0.12, -0.42 + life * 0.72, (r.w - 0.5) * 0.66 * (1.0 - life * 0.65));
        P.z += sin(uTime * 6.0 + r.y * 30.0) * 0.05 * life;
        d.pos = P;
        d.dir = vec3(0.0, 1.0, 0.35 * sin(uTime * 5.0 + r.z * 20.0));
        d.size = vec2(0.15, 0.36) * (1.0 - life * 0.72);
        d.c1 = mix(vec3(1.0, 0.82, 0.4), vec3(1.0, 0.3, 0.04), life) * (1.0 - life) * 0.55 * uFire.w;
        if (id > 39.5) {
          // sparks: they go up with the draught, and a few come out into the room
          life = fract(r.x + uTime * (0.22 + 0.2 * r.y));
          d.pos = uFire.xyz + vec3(-0.3 + life * 0.5 * r.z + 0.04 * sin(uTime * 3.0 + r.w * 40.0), -0.3 + life * (0.5 + 0.6 * r.w), (r.w - 0.5) * 0.5 + 0.06 * sin(uTime * 2.3 + r.z * 40.0));
          d.size = vec2(0.02, 0.035);
          d.c1 = vec3(1.0, 0.6, 0.2) * (1.0 - life) * 0.9;
        }
        d.c2 = d.c1 * 1.3;
        d.seed = id;
        d.lift = 0.0;
      }`,uniforms:{uImpasto:{value:.4}},minPx:[3,5],maxPx:[300,600],cells:[0,6],depthWrite:!1}),21);T.material.transparent=!0,T.material.blending=2,T.material.alphaToCoverage=!1;let te=r(-3.65,5.15,0),D=j(N(54),M(e,{head:P,body:`
      void makeDab(inout Dab d) {
        float id = float(gl_InstanceID);
        vec4 r = hash4(id * 3.1 + 9.0);
        float life = fract(r.x + uTime * (0.07 + 0.05 * r.y));
        vec3 P = vec3(${te.x.toFixed(2)}, ${te.y.toFixed(2)}, ${te.z.toFixed(2)});
        P.y += life * (5.0 + 3.0 * r.z);
        P.xz += uWind.xy * life * life * (7.0 + 5.0 * r.w) + vec2(sin(uTime * 0.6 + r.z * 20.0), cos(uTime * 0.5 + r.w * 20.0)) * 0.5 * life;
        d.alive = smoothstep(0.0, 0.12, life) * (1.0 - smoothstep(0.55, 1.0, life));
        d.pos = P;
        d.dir = normalize(vec3(uWind.x * life, 1.0, uWind.y * life));
        d.size = vec2(0.35, 0.7) * (0.6 + 2.6 * life);
        vec3 c = mix(vec3(0.24, 0.3, 0.36), vec3(0.14, 0.2, 0.27), r.y) * (0.7 + 0.5 * woodSunAt(P));
        c = mix(c, nightSky(normalize(P - cameraPosition)), smoothstep(0.3, 1.0, life) * 0.7);
        d.c1 = hazed(c, P);
        d.c2 = d.c1 * 1.2;
        d.seed = id;
        d.lift = 0.0;
      }`,minPx:[3,5],maxPx:[200,400],cells:[0,8]}),6),re=j(N(14),M(e,{head:P,body:`
      void makeDab(inout Dab d) {
        float id = float(gl_InstanceID);
        vec4 r = hash4(id * 7.7 + 4.0);
        vec4 w = uWarm[gl_InstanceID % 3];
        float out_ = sign(w.w);
        if ((cameraPosition.z - w.z) * out_ < 0.5) { d.alive = 0.0; return; } // only from in front of it
        d.pos = w.xyz + vec3((r.x - 0.5) * 0.8, (r.y - 0.5) * 0.7, 0.2 * out_);
        d.dir = normalize(vec3(r.z - 0.5, r.w - 0.5, 0.0) + vec3(0.0, 0.2, 0.0));
        // from far off it is one spark, and is kept bright enough to be found
        float far = clamp(distance(cameraPosition, w.xyz) / 60.0, 0.0, 4.0);
        d.size = vec2(0.5, 1.1) * (0.7 + 1.2 * r.z) * (1.0 + 0.35 * far);
        d.c1 = vec3(1.0, 0.6, 0.22) * 0.07 * (1.0 + 1.2 * far) * abs(w.w) * (0.85 + 0.15 * sin(uTime * 5.0 + r.x * 30.0));
        d.c2 = d.c1 * 1.3;
        d.seed = id;
        d.lift = 0.0;
      }`,uniforms:{uImpasto:{value:.2}},minPx:[5,8],maxPx:[300,600],cells:[0,6],depthWrite:!1}),22);re.material.transparent=!0,re.material.blending=2,re.material.alphaToCoverage=!1;let ie=e=>(e.material.transparent=!0,e.material.blending=2,e.material.alphaToCoverage=!1,e),ae=[];for(let e of[[-2.66,1.83,.7],[.6,1.04,.5],[-.72,1.19,-2.26],[.1,1.19,-2.26],[2.88,1.19,.38],[.9,1.985,.6]])for(let t=0;t<3;t++)ae.push(...r(...e).toArray(),c.rand()*1e3);let O=ie(j(N(ae.length/4,{aH:[new Float32Array(ae),4]}),M(e,{head:`in vec4 aH;`,body:`
      void makeDab(inout Dab d) {
        vec4 r = hash4(aH.w);
        d.pos = aH.xyz + (r.xyz - 0.5) * 0.05;
        d.dir = normalize(r.yzx - 0.5 + vec3(0.0, 0.3, 0.0));
        d.size = vec2(0.16, 0.26) * (0.7 + 0.8 * r.w);
        d.c1 = vec3(1.0, 0.62, 0.24) * 0.075 * (0.8 + 0.2 * sin(uTime * (5.0 + 6.0 * r.x) + r.y * 40.0));
        d.c2 = d.c1 * 1.3;
        d.seed = aH.w;
        d.lift = 0.0;
      }`,uniforms:{uImpasto:{value:.2}},minPx:[3,5],maxPx:[300,600],cells:[0,6],depthWrite:!1}),22)),k=r(-2.22,.42,.78),A=ie(j(N(9),M(e,{body:`
      void makeDab(inout Dab d) {
        float id = float(gl_InstanceID);
        vec4 r = hash4(id * 4.7 + 6.0);
        float life = fract(r.x + uTime * (0.16 + 0.1 * r.y));
        d.pos = vec3(${k.x.toFixed(3)}, ${k.y.toFixed(3)}, ${k.z.toFixed(3)}) + vec3(0.1 * life * (r.z - 0.3) + 0.03 * sin(uTime * 1.3 + r.w * 20.0), life * 0.7, 0.08 * life * (r.w - 0.5));
        d.dir = vec3(0.3 * sin(uTime + r.z * 9.0), 1.0, 0.0);
        d.size = vec2(0.05, 0.14) * (0.6 + 1.6 * life);
        d.c1 = vec3(0.6, 0.5, 0.42) * 0.09 * sin(life * 3.14159);
        d.c2 = d.c1 * 1.3;
        d.seed = id;
        d.lift = 0.0;
      }`,uniforms:{uImpasto:{value:.2}},minPx:[3,5],maxPx:[200,400],cells:[0,6],depthWrite:!1}),22)),oe=new t;oe.add(u.group,ee.group,T,D,re,O,A);let se=new s(new ne(6.6,3.3,5.6).translate(L.x,L.y+1.65,L.z),new d({side:2}));se.frustumCulled=!1;let ce=[[0,1.2,-2.5,3.2,1.2,.1],[-3.1,1.2,0,.1,1.2,2.6],[3.1,1.2,0,.1,1.2,2.6],[-.975,1.2,2.5,2.225,1.2,.1],[2.725,1.2,2.5,.475,1.2,.1],[-2.72,.7,0,.3,.7,1],[.9,.4,.6,.62,.4,.38],[1.95,.3,-1.86,1,.3,.5],[-1.4,.4,-1,.28,.4,.28],[-2.74,.8,1.75,.27,.8,.58],[.62,.25,-1.86,.26,.25,.46],[-3.65,1.2,0,.45,1.2,.5],[-2.6,.45,2.85,.55,.45,.25]].map(([e,t,n,r,i,a])=>({x:L.x+e,y:L.y+t,z:L.z+n,hx:r,hy:i,hz:a})),le=e=>Math.abs(e.x-L.x)<3&&Math.abs(e.z-L.z)<2.45;return{group:oe,caster:se,solid:ce,shell:u.group,counts:{outside:u.count,inside:ee.count},inside:le,threshold:e=>le(e)||Math.abs(e.x-L.x-1.75)<.9&&e.z-L.z>=2.45&&e.z-L.z<4.3,update(t){e.uFire.value.w=.92+.1*Math.sin(t*9)+.06*Math.sin(t*23+1)+.05*Math.sin(t*3.7)}}}var W=new URLSearchParams(location.search),G=W.has(`capture`),rt=!0,it=!1,at=ie({...O.block,onSet(){},onTrigger(){},onVisible(e){rt=e,it&&ln()}});at.progress(.03,`Laying the ground`);var ot={},st=performance.now(),ct=e=>{let t=performance.now();ot[e]=Math.round(t-st),st=t},K=new w({antialias:!1,powerPreference:`high-performance`});K.setPixelRatio(G?1:Math.min(devicePixelRatio,1.5)),K.setSize(innerWidth,innerHeight),K.autoClear=!1,K.outputColorSpace=c,document.getElementById(`view`).appendChild(K.domElement);var q=de();q.tBrush.value=pe(),q.uSunDir.value.copy(ye),q.uHaze.value.setRGB(.035,.12,.17),q.uHazeSun.value.setRGB(.06,.16,.2),q.uHazeGlow.value.setRGB(.03,.045,.05),q.uHazeDensity.value=46e-5,q.uShadeBias.value=4e-4,q.uBounce.value.setRGB(.015,.06,.07),q.uLampCol.value.setRGB(1,.6,.24),q.uGlazeMul.value.setRGB(.3,.38,.62),q.uGlazeAdd.value.setRGB(0,.008,.03),q.uGlow={value:new D(1,0,0)},q.uWarm={value:[new E,new E,new E]},q.uRoom={value:new E(0,0,-1,-1)},W.has(`impasto`)&&(q.uImpasto.value=+W.get(`impasto`));var lt=new a,J=new m(46,innerWidth/innerHeight,.3,16e3),ut=()=>{};function dt(){K.setSize(innerWidth,innerHeight),J.aspect=innerWidth/innerHeight,J.updateProjectionMatrix(),ut()}addEventListener(`resize`,dt),ct(`start`);var ft={CLOAK:[[.2,.42,.6],[.07,.17,.32],[.025,.06,.15],[.16,.3,.5]],HAT:[[.4,.46,.44],[.17,.2,.22],[.06,.075,.1],[.85,.72,.42]],SHIRT:[[.38,.45,.5],[.15,.2,.27],[.055,.08,.13],[.8,.72,.56]],TROUSERS:[[.26,.28,.3],[.12,.13,.17],[.05,.055,.09],[.45,.32,.2]],SKIN:[[.6,.53,.5],[.3,.25,.27],[.12,.1,.14],[.85,.62,.46]],BOOTS:[[.2,.18,.17],[.09,.08,.09],[.04,.035,.05],[.35,.22,.14]],HAIR:[[.18,.15,.14],[.09,.07,.08],[.04,.035,.05],[.3,.2,.13]],EYES:[[.1,.09,.09],[.06,.05,.06],[.03,.03,.04],[.15,.1,.08]]},pt=0,mt=(e,t)=>{pt=Math.max(pt,e),at.progress(pt,t)},ht=fe(q,e=>mt(.05+.55*e,`Fetching the wanderer`),ft),gt=()=>new Promise(e=>setTimeout(e,0));await Oe(e=>(mt(.03+.09*e,`Laying the ground`),gt()));var _t=je(q);ct(`land`),mt(.12,`Laying the snow`),await gt();var vt=Pe(q),yt=Ye(q);_t.shade.add(yt.caster);var bt=nt(q);_t.shade.add(bt.caster),ct(`snow`);var xt=Le(q),St=He(q),Ct=Ue(q),wt=Ke(q),Tt=Ge(q),Et=ge(K,q,_t.shade,{sun:ye,size:[4096,3072],box:[740,560],centre:[0,150,0],back:1600,near:700,far:2500});ct(`shade`),mt(.25,`Fetching the wanderer`),await gt(),lt.add(xt.group,St.group,_t.mesh,vt.group,yt.group,bt.group,Ct.mesh,Tt.object,Tt.glow,wt),await A.init();var Dt=new A.World({x:0,y:-9.81,z:0});{let e=_t.heightField();Dt.createCollider(A.ColliderDesc.heightfield(e.cells,e.cells,e.heights,{x:2*e.half,y:1,z:2*e.half}));for(let e of yt.colliders)Dt.createCollider(A.ColliderDesc.cylinder(4,e.r).setTranslation(e.x,e.y+4,e.z));for(let e of bt.solid)Dt.createCollider(A.ColliderDesc.cuboid(e.hx,e.hy,e.hz).setTranslation(e.x,e.y,e.z))}ct(`physics`);var Ot=await ht,{man:Y}=Ot;lt.add(Y.object,Ot.cloakMesh,Ot.dabs);var X=new oe(Y),kt=new D(Se.x,B(Se.x,Se.z),Se.z),Z=new ce({RAPIER:A,world:Dt,man:Y,animator:X,spawn:kt,yaw:Math.PI}),Q=new le(J);Q.yaw=Math.PI,Q.pitch=-.07,Q.lift=1.5,Q.sink=.7;var At=new se(K.domElement,{pads:!G&&!W.has(`nopad`)});Dt.step(),Ct.lay(I,Se.z+16,Se.z+.4),ct(`figure`);var jt=ve(K,q);ut=()=>jt.resize(),jt.uniforms.uCanvas.value=W.has(`canvas`)?+W.get(`canvas`):1,jt.uniforms.uShafts.value=0;function Mt(){let e=(W.get(`quality`)??window.patch?.quality??`high`)===`low`;K.setPixelRatio(G?1:Math.min(devicePixelRatio,e?1:1.5)),K.setSize(innerWidth,innerHeight),jt.resize();let t=xt.group.getObjectByName(`veil`);t&&(t.visible=!e),wt.geometry.instanceCount=e?900:2400}Mt(),window.patch?.addEventListener?.(`qualitychange`,Mt);var Nt={x:he.x,z:he.y},$=0;function Pt(e,t,n,r){let i=e*Nt.x+n*Nt.z,a=-e*Nt.z+n*Nt.x,o=l.clamp(.5+.8*k((i-$*4)/40,a/90)+.3*k((i-$*6.5)/11,a/17),0,1),s=.6+3.6*o*o;return r.set(Nt.x*s,.25*Math.sin($*2.3+e)*o,Nt.z*s)}function Ft(e,t,n){let r=B(e,t),i=Z.halfHeight();Z.body.setTranslation({x:e,y:r+Z.t.radius+i+.05,z:t},!0),Dt.propagateModifiedBodyPositionsToColliders(),Z.feet.set(e,r,t),Z.prevFeet.copy(Z.feet),Z.visualY=r,Z.vel.set(0,0,0),Z.speed=0,Z.mode=`move`,Z.grounded=!0,Z.yaw=Z.lastYaw=n,X.lock=null,X.lockOff=null,X.enter(X.locoState({strafe:!1}),.05)}var It=[[`upperarm_r`,`lowerarm_r`,new D(-.72,-.52,.42).normalize()],[`lowerarm_r`,`hand_r`,new D(-.42,.16,.86).normalize()]],Lt=new D,Rt=new D,zt=new p,Bt=new p,Vt=new p,Ht=new D,Ut=new D,Wt=new D,Gt=new D,Kt=new D,qt=new D,Jt=new D(0,1,0),Yt=(e,t)=>t.setFromMatrixPosition(Y.bones[e].matrixWorld),Xt=W.has(`hand`)?+W.get(`hand`):0;function Zt(){for(let[e,t,n]of It){let r=Y.bones[e];Lt.setFromMatrixPosition(Y.bones[t].matrixWorld).sub(Rt.setFromMatrixPosition(r.matrixWorld)).normalize(),Rt.copy(n).applyQuaternion(Y.object.quaternion),zt.setFromUnitVectors(Lt,Rt),r.parent.getWorldQuaternion(Bt),r.getWorldQuaternion(Vt),r.quaternion.copy(Bt.invert().multiply(zt.multiply(Vt))),r.updateMatrixWorld(!0)}let e=Y.bones.hand_r;Ut.copy(Yt(`hand_r`,Gt)).sub(Yt(`lowerarm_r`,Kt)).normalize(),Yt(`middle_01_r`,Gt).sub(Yt(`hand_r`,qt)),Yt(`index_01_r`,Kt).sub(Yt(`pinky_01_r`,qt)),Wt.crossVectors(Gt,Kt),Wt.addScaledVector(Ut,-Wt.dot(Ut)).normalize(),qt.copy(Jt).addScaledVector(Ut,-Jt.dot(Ut)).normalize(),X.rotateWorld(e,Ut,Math.atan2(Ut.dot(Gt.crossVectors(Wt,qt)),Wt.dot(qt))+Xt);for(let e of X.fingerPoses??[])e.bone.name.endsWith(`_r`)&&e.bone.quaternion.slerpQuaternions(e.flat,e.fist,e.thumb?.75:1);e.updateMatrixWorld(!0),Ht.set(0,0,0);for(let e of[`index_01_r`,`ring_01_r`,`index_02_r`,`ring_02_r`])Ht.add(Yt(e,Gt));Ht.multiplyScalar(.25)}var Qt=new S,$t=0,en=!1,tn=new D,nn=new D,rn=new D;addEventListener(`keydown`,e=>{e.code===`KeyV`&&(en=!en)});function an(e){e=Math.min(e,1/20),$+=e;let t=At.read(e),n=bt.inside(Z.feet);$t+=((en||bt.threshold(Z.feet)?1:0)-$t)*(1-Math.exp(-6*e));let r=$t*$t*(3-2*$t);bt.update($),Z.update(e,t,Q.yaw),(Z.feet.y<1.5||Math.max(Math.abs(Z.feet.x),Math.abs(Z.feet.z))>482)&&Ft(kt.x,kt.z,Math.PI);let i=Z.visualRoot(e);Y.object.position.copy(i),Y.object.rotation.set(0,Z.yaw,0),Y.object.updateMatrixWorld(!0);let a=Z.vel.clone().applyAxisAngle(new D(0,1,0),-Z.yaw);X.update(e,{speed:Z.mode===`move`?Z.speed:Math.hypot(a.x,a.z),moveAngle:Z.moveAngle,grounded:Z.grounded}),X.relaxHands(Z.speed),X.uprightTrunk(e,Z.speed,Z.grounded&&Z.mode!==`jump`&&Z.mode!==`air`?1:.3);let o=Z.mode===`move`||Z.mode===`idleExtra`?l.clamp(1-(Z.speed-1.5)/2,0,1):0;X.lookToward(e,J.getWorldDirection(new D),o),X.armClearance(e),Z.mode===`move`&&!Z.strafe?X.leanInto(e,Z.turnRate,Z.speed,Z.accelF):X.leanInto(e,0,0,0);let s=Z.grounded&&Z.mode!==`jump`&&Z.mode!==`air`;if(X.placeFeet(e,(e,t,n)=>Z.ground(e,t,n,1.4),i.y,+!!s),Y.object.updateMatrixWorld(!0),Zt(),Ot.updateCloak(e,Pt,B),Tt.update(e,Ht,Z.yaw),n||Ct.update(i,Z.yaw,Z.speed,s),Q.update(e,i,t.look,t.zoom,(e,t,n)=>{let r=Z.castRay(e,t,n);r!=null&&e.y+t.y*r-B(e.x+t.x*r,e.z+t.z*r)<.5&&(r=null);let i=yt.block(e,t,n);return i!=null&&(r==null||i<r)?i:r},(e,t)=>B(e,t)+.55),r>.002){let e=Math.cos(Q.pitch),t=Math.sin(Q.pitch);rn.set(Math.sin(Q.yaw)*e,-t,Math.cos(Q.yaw)*e),nn.set(i.x+Math.sin(Q.yaw)*.08,i.y+1.66,i.z+Math.cos(Q.yaw)*.08),J.getWorldDirection(tn).multiplyScalar(6).add(J.position),J.position.lerp(nn,r),J.lookAt(tn.lerp(nn.addScaledVector(rn,6),r))}Tt.object.visible=Tt.glow.visible=r<.5,J.fov=46+18*r,J.near=.3-.2*r,J.updateProjectionMatrix(),Y.object.visible=Ot.cloakMesh.visible=Ot.dabs.visible=r<.5,J.updateMatrixWorld(!0),K.getDrawingBufferSize(Qt),q.uTime.value=$,q.uPixel.value=2*Math.tan(l.degToRad(J.fov)/2)/Qt.y,q.uFocus.value.copy(i),q.uGlow.value.x=1+.2*Math.sin($*.11)+.1*Math.sin($*.37+1)+.07*Math.sin($*1.1+2),vt.follow(J.position.x,J.position.z),Et.update(lt,i),jt.render(lt,J)}window.lab={THREE:v,player:Z,follow:Q,camera:J,input:At,animator:X,figure:Ot,shared:q,frame:jt,renderer:K,timings:ot,counts:{...vt.counts,...yt.counts,...bt.counts},cabin:bt,heightAt:B,crestX:I,tracks:Ct,sky:xt,step(e=1/60,t=1){for(let n=0;n<t;n++)an(e)},setInput(e){At.override=e},teleport(e,t,n,r){Ft(e,t,Math.atan2(n-e,r-t)),Q.yaw=Z.yaw,Q.pivot.set(0,0,0),an(1/60)},view(e,t){Q.free=e?{position:new D(...e),target:new D(...t)}:null},wait(e){$+=e},first(e){en=e},trail(e,t){Ct.lay(I,e,t)}},mt(.68,`Mixing paint`);function on(){let e=K.getContext(),t=e.fenceSync(e.SYNC_GPU_COMMANDS_COMPLETE,0);return e.flush(),new Promise(n=>{let r=()=>{if(e.clientWaitSync(t,0,0)===e.TIMEOUT_EXPIRED)return void setTimeout(r,4);e.deleteSync(t),n()};r()})}G||(K.debug.checkShaderErrors=!1,await K.compileAsync(lt,J),ct(`shaders`),mt(.86,`Mixing paint`));for(let e=0;e<(G?1:5)&&(an(1/60),!G);e++)await on(),mt(.88+.025*e,`First strokes`),await gt();ct(`first frame`);var sn=!1,cn=0;function ln(){let e=rt&&!G;e!==sn&&(sn=e,cn=performance.now(),K.setAnimationLoop(e?()=>{let e=performance.now();an((e-cn)/1e3),cn=e}:null))}if(!G){let e=document.getElementById(`hint`);e.textContent=`Click to look · WASD move · Shift sprint · Space jump · V first person`,addEventListener(`keydown`,t=>{t.code===`KeyH`&&e.classList.toggle(`off`)}),setTimeout(()=>e.classList.add(`faded`),9e3)}dt(),it=!0,ln(),document.getElementById(`loading`)?.remove(),(W.has(`clean`)||G)&&document.getElementById(`hint`)?.remove(),at.ready(),window.lab.ready=!0,window.__block={ready:!0,block:at,timings:ot,set(){}};