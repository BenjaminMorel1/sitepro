import{A as e,C as t,H as n,I as r,J as i,L as a,M as o,O as s,P as c,R as l,S as u,T as d,V as f,W as p,Y as m,Z as h,a as g,b as _,et as v,i as y,l as b,m as x,tt as S,y as ee}from"./man-C3WYLH7W.js";import{i as te,n as ne,r as C,t as w}from"./noise-B7r2aWeR.js";import{a as T,i as re,n as ie,r as ae,t as E}from"./camera-BQwrb13s.js";import{a as oe,c as se,d as ce,i as D,n as le,o as ue,r as O,s as k,u as A}from"./figure-5IQIrrs-.js";import{n as de,r as fe,t as pe}from"./finish-D6-JnQMz.js";var j=[[2,96],[0,80],[-7,56],[3,32],[10,6],[3,-20],[-5,-44],[4,-68],[10,-90]],M={x:0,z:78},N={x:11,z:-96,r:21},P=[];{let e=e=>j[Math.max(0,Math.min(j.length-1,e))];for(let t=0;t<j.length-1;t++){let n=e(t-1),r=e(t),i=e(t+1),a=e(t+2);for(let e=0;e<24;e++){let t=e/24,o=t*t,s=o*t,c=(e,n,r,i)=>.5*(2*n+(-e+r)*t+(2*e-5*n+4*r-i)*o+(-e+3*n-3*r+i)*s);P.push([c(n[0],r[0],i[0],a[0]),c(n[1],r[1],i[1],a[1])])}}P.push(j[j.length-1])}var me=P;function he(e,t){let n=1/0;for(let r=0;r<P.length-1;r++){let[i,a]=P[r],[o,s]=P[r+1],c=o-i,l=s-a,u=Math.max(0,Math.min(1,((e-i)*c+(t-a)*l)/(c*c+l*l))),d=Math.hypot(e-i-c*u,t-a-l*u);d<n&&(n=d)}return n}var ge=(e,t)=>{let n=Math.hypot(e-N.x,t-N.z)+w(e*.11,t*.11)*3.5;return 1-Math.min(1,Math.max(0,(n-N.r*.72)/(N.r*.5)))},_e=(e,t,n)=>{let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)};function ve(e,t,n){let r=2.8*w(e/74+3.1,t/74-1.7)+1.2*w(e/26,t/26)+.3*w(e/8.3,t/8.3);return r+=5.5*_e(70,-110,t),r-=.28*Math.exp(-(n*n)/3.2),r}var F=se,I=new Float32Array(F*F),ye=new Uint8Array(F*F*4);async function be(e){for(let t=0;t<F;t++){e&&t%24==0&&await e(t/F);for(let e=0;e<F;e++){let n=-256+e/(F-1)*2*256,r=-256+t/(F-1)*2*256,i=Math.abs(n)<60&&r>-130&&r<110?he(n,r):99;I[e+t*F]=ve(n,r,i);let a=(e+t*F)*4,o=w(n*.9,r*.9)*.35+w(n*.23,r*.23)*.5;ye[a]=Math.round(255*(1-_e(.75,1.9,i+o))),ye[a+1]=Math.round(255*ge(n,r)),ye[a+2]=Math.round(255*Math.min(1,Math.max(0,.5+.6*w(n/17+9,r/17)+.3*w(n/5,r/5+4)))),ye[a+3]=255}}}function L(e,t){let n=Math.min(F-1.001,Math.max(0,(e+256)/512*(F-1))),r=Math.min(F-1.001,Math.max(0,(t+256)/512*(F-1))),i=Math.floor(n),a=Math.floor(r),o=n-i,s=r-a,c=I[i+a*F],l=I[i+1+a*F],u=I[i+(a+1)*F],d=I[i+1+(a+1)*F];return(c+(l-c)*o)*(1-s)+(u+(d-u)*o)*s}function xe(t){let r=new x(I,F,F,p,_);r.minFilter=r.magFilter=e,r.needsUpdate=!0;let i=new x(ye,F,F);i.minFilter=i.magFilter=e,i.needsUpdate=!0,t.tHeight.value=r,t.tLand.value=i;let o=new n(512,512,512,512);o.rotateX(-Math.PI/2);let s=o.attributes.position;for(let e=0;e<s.count;e++)s.setY(e,L(s.getX(e),s.getZ(e))-.04);let c=new m({glslVersion:u,uniforms:t,vertexShader:`
      ${k}
      out vec3 vWorld;
      void main() { vWorld = position; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }`,fragmentShader:`
      ${k}
      in vec3 vWorld;
      layout(location = 0) out vec4 outC;
      void main() {
        vec4 m = texture(tLand, landUv(vWorld.xz));
        // laid in broadly first: warm where the sun falls, plum where it doesn't
        // asked square by ragged square, so that what shows between the dabs is itself in touches
        vec2 sq = floor(vWorld.xz / 0.32 + (texture(tNoise, vWorld.xz / 2.3).rg - 0.5) * 1.8) * 0.32;
        float lit = step(0.5, woodSunAt(vec3(sq.x, vWorld.y + 0.2, sq.y)));
        vec3 c = mix(vec3(0.3, 0.16, 0.16), vec3(0.72, 0.44, 0.14), lit);
        c = mix(c, mix(vec3(0.21, 0.17, 0.2), vec3(0.6, 0.47, 0.33), lit), m.r);
        c *= 0.78 + 0.3 * texture(tNoise, vWorld.xz / 9.0).r;
        outC = vec4(hazed(c, vWorld), 1.0);
      }`}),l=new a(o,c);l.frustumCulled=!1;function d(e=384,t=192){let n=new Float32Array((e+1)*(e+1));for(let r=0;r<=e;r++)for(let i=0;i<=e;i++)n[i+r*(e+1)]=L(-t+r/e*2*t,-t+i/e*2*t);return{heights:n,cells:e,half:t}}return{mesh:l,heightField:d}}var Se=`
const vec3 LIT_L[6] = vec3[6](vec3(0.97, 0.71, 0.2), vec3(0.94, 0.5, 0.13), vec3(0.8, 0.25, 0.11), vec3(0.64, 0.45, 0.28), vec3(0.56, 0.62, 0.2), vec3(0.74, 0.58, 0.42));
const vec3 LIT_M[6] = vec3[6](vec3(0.74, 0.47, 0.15), vec3(0.7, 0.33, 0.11), vec3(0.58, 0.18, 0.11), vec3(0.45, 0.3, 0.21), vec3(0.34, 0.42, 0.15), vec3(0.5, 0.38, 0.3));
const vec3 LIT_S[6] = vec3[6](vec3(0.43, 0.25, 0.2), vec3(0.4, 0.19, 0.18), vec3(0.33, 0.12, 0.17), vec3(0.25, 0.18, 0.22), vec3(0.16, 0.25, 0.2), vec3(0.27, 0.22, 0.27));
// r is this dab's own chance; v drifts slowly over the ground, so leaves of a kind lie together
int litterKind(float r, float v, float moss, float way) {
  if (r < way * 0.62) return 5;
  if (fract(r * 7.31) < moss * 0.1) return 4;
  return v < 0.42 ? 0 : v < 0.7 ? 1 : v < 0.84 ? 2 : 3;
}
vec3 litter(int k, float lit, float r) { return paint3(LIT_L[k], LIT_M[k], LIT_S[k], lit, r); }
`,Ce=`
void makeDab(inout Dab d) {
  vec2 cell; float sub;
  if (!ringCell(0.0, true, cell, sub)) { d.alive = 0.0; return; }
  vec4 r = hash4(cell, sub * 3.0 + 1.0);
  vec4 q = hash4(cell + 31.7, sub + 11.0);
  vec2 xz = (cell + r.xy) * uCell0;
  float lod;
  d.alive = ringGrow(distance(xz, cameraPosition.xz), lod);
  if (d.alive <= 0.0) return;
  vec3 P = vec3(xz.x, heightAt(xz), xz.y);
  vec3 Nn = normalAt(xz);
  vec4 m = texture(tLand, landUv(xz));
  float lit = woodSunAt(P + vec3(0.0, 0.2, 0.0)) * clamp(dot(Nn, uSunDir) * 2.4, 0.0, 1.0);
  float patch_ = texture(tNoise, xz / 13.0).r * 1.9 + texture(tNoise, xz / 3.7).g * 0.5;
  int kind = litterKind(q.x, fract(patch_ + (q.z - 0.5) * 0.3), m.b, m.r);
  vec3 c1 = litter(kind, lit, q.y);
  int other = litterKind(q.z, fract(patch_ + 0.2 + (q.w - 0.5) * 0.5), m.b, m.r * 0.5);
  vec3 c2 = litter(other, lit, q.w);
  // the open ground of the clearing is grass gone to gold
  vec3 gl = paint3(vec3(0.95, 0.8, 0.36), vec3(0.62, 0.52, 0.2), vec3(0.2, 0.2, 0.2), lit, q.y);
  float grassy = step(r.z, m.g * 0.8);
  c1 = mix(c1, gl, grassy);
  // here and there a wet leaf in the shade gives back the sky
  if (lit < 0.2 && q.w > 0.93) c1 = mix(vec3(0.34, 0.36, 0.52), vec3(0.2, 0.17, 0.26), q.z);
  c1 = jitter(c1, r.wzy, 0.5);
  c2 = jitter(c2, q.wzy, 0.5);
  // leaves lie any way round, though those that fell together lie much alike
  float a = (texture(tNoise, xz / 6.3).a * 1.2 + q.y * 0.8) * TAU;
  d.dir = vec3(cos(a), 0.0, sin(a));
  d.pos = P;
  d.size = uCell0 * vec2(1.05 + 0.5 * r.z, 1.7 + 0.9 * r.w) * lod;
  d.c1 = hazed(c1, P);
  d.c2 = hazed(c2, P);
  d.seed = dot(cell, vec2(1.0, 57.0)) + sub * 0.37;
  d.turnabout = 1.0;
  d.lie = 1.0;
  d.nrm = Nn;
  d.height = (0.03 + 0.07 * q.z) * pow(lod, 0.35);
  d.glaze = 1.0;
}
`,we=`
void makeDab(inout Dab d) {
  vec2 cell; float sub;
  if (!ringCell(40.0, false, cell, sub)) { d.alive = 0.0; return; }
  vec4 r = hash4(cell, 40.0);
  vec4 q = hash4(cell + 17.3, 51.0);
  vec4 f = hash4(cell + sub * 7.7 + 3.1, sub * 13.0 + 3.0);
  vec2 foot = (cell + r.xy) * uCell0;
  float lod;
  d.alive = ringGrow(distance(foot, cameraPosition.xz), lod);
  if (d.alive <= 0.0) return;
  vec4 m = texture(tLand, landUv(foot));
  // it grows in drifts, keeps off the way, and fills the clearing
  float drift = smoothstep(0.46, 0.7, texture(tNoise, foot / 37.0).a);
  float chance = max(0.05 + 0.8 * drift, m.g) * (1.0 - m.r);
  if (q.x > chance) { d.alive = 0.0; return; }
  float grass = step(q.z, max(m.g * 1.1, 0.22));           // a tuft of grass rather than a fern
  float kind = fract(q.y * 3.7 + floor(texture(tNoise, foot / 14.0).r * 3.0) * 0.33);
  float big = min(pow(lod, 0.6), 2.2);
  float a = (sub + f.x) / 6.0 * TAU + r.z * TAU;
  vec2 fan = vec2(cos(a), sin(a));
  vec2 xz = foot + fan * mix(0.1, 0.03, grass) * big;
  vec3 P = vec3(xz.x, heightAt(xz), xz.y);
  float gust = gustAt(xz);
  float lit = sunAt(P + vec3(0.0, 0.3, 0.0));
  vec3 c;
  if (grass > 0.5) c = paint3(vec3(1.0, 0.88, 0.46), vec3(0.76, 0.6, 0.24), vec3(0.3, 0.27, 0.2), lit, f.w);
  else if (kind < 0.45) c = paint3(vec3(0.98, 0.58, 0.16), vec3(0.68, 0.36, 0.13), vec3(0.34, 0.18, 0.16), lit, f.w);   // bracken turned rust
  else if (kind < 0.75) c = paint3(vec3(1.0, 0.82, 0.26), vec3(0.72, 0.54, 0.15), vec3(0.34, 0.26, 0.16), lit, f.w);    // fern gone yellow
  else c = paint3(vec3(0.66, 0.74, 0.25), vec3(0.34, 0.45, 0.16), vec3(0.13, 0.23, 0.17), lit, f.w);                     // still green
  c = jitter(c, f.zwx, 0.55);
  float sway = sin(uTime * (1.6 + f.z) + f.w * 40.0) * (0.04 + 0.1 * gust);
  vec2 lean = fan * mix(0.9 + 1.3 * f.y, 0.12 + 0.4 * f.y, grass) + uWind.xy * (0.08 + 0.6 * gust + sway);
  d.dir = normalize(vec3(lean.x, 1.0, lean.y));
  d.pos = P - vec3(0.0, 0.02, 0.0);
  float tall = mix(0.45, 0.85, f.z) * mix(1.0, 1.3, m.g) * mix(0.72, 1.0, grass);
  // a frond is a broad curved stroke that arches over; a blade of grass a thin straight one
  d.size = vec2(mix(0.17, 0.04, grass) * big * (0.8 + 0.5 * f.x), tall);
  d.cell = grass > 0.5 ? floor(f.y * 2.99) : (f.x > 0.5 ? 3.0 : 7.0);
  d.c1 = hazed(c, P);
  d.c2 = hazed(jitter(c * 1.2, f.xzy, 0.8), P);
  d.seed = dot(cell, vec2(1.0, 57.0)) + sub * 0.37 + 0.5;
  d.base = 1.0;
  d.lift = 0.25;
}
`;function Te(e){let n=fe(e,{head:Se,body:Ce,per:3,n:192,cell0:.14,levels:6,minPx:[5,9],maxPx:[4e3,4e3],cells:[0,8]}),r=fe(e,{head:Se,body:we,per:6,n:96,cell0:.42,levels:4,minPx:[2.5,12],maxPx:[60,420],cells:[0,4]}),i=new t;return i.add(n.group,r.group),{group:i,follow(e,t){n.follow(e,t),r.follow(e,t)}}}var Ee=0,R=1,z=2,De=3,Oe=`
const vec3 BARK_L[4] = vec3[4](vec3(0.88, 0.6, 0.33), vec3(1.0, 0.94, 0.74), vec3(0.84, 0.6, 0.34), vec3(0.86, 0.62, 0.4));
const vec3 BARK_M[4] = vec3[4](vec3(0.37, 0.3, 0.31), vec3(0.76, 0.71, 0.68), vec3(0.3, 0.22, 0.2), vec3(0.33, 0.25, 0.25));
const vec3 BARK_S[4] = vec3[4](vec3(0.15, 0.12, 0.19), vec3(0.4, 0.4, 0.53), vec3(0.12, 0.09, 0.14), vec3(0.14, 0.1, 0.16));
vec3 bark(int k, vec3 P, vec3 Nn, float r, float foot) {
  // a trunk is lit as a round thing by a low sun, and from below by the bright leaves on the ground
  float lit = sunAt(P + Nn * 0.35) * clamp(dot(Nn, uSunDir) * 1.2 + 0.25, 0.0, 1.0);
  vec3 c = paint3(BARK_L[k], BARK_M[k], BARK_S[k], lit, r);
  c += vec3(0.1, 0.045, 0.0) * (1.0 - lit) * exp(-foot * 0.45);
  return c;
}
`,ke=`
const vec3 LEAF_L[5] = vec3[5](vec3(1.0, 0.8, 0.2), vec3(1.0, 0.57, 0.12), vec3(0.94, 0.26, 0.09), vec3(0.86, 0.82, 0.24), vec3(1.0, 0.9, 0.36));
const vec3 LEAF_M[5] = vec3[5](vec3(0.76, 0.49, 0.11), vec3(0.72, 0.33, 0.09), vec3(0.61, 0.15, 0.08), vec3(0.52, 0.52, 0.14), vec3(0.82, 0.62, 0.17));
const vec3 LEAF_S[5] = vec3[5](vec3(0.46, 0.25, 0.1), vec3(0.42, 0.17, 0.09), vec3(0.34, 0.09, 0.11), vec3(0.24, 0.29, 0.13), vec3(0.5, 0.33, 0.13));
`;function Ae(e,t,n,r,i,a){let o=e.position.length/3,s=new S,c=new S,l=new S,u=new S,d=new S(1,0,.3).normalize();for(let o=0;o<t.length;o++){s.copy(t[Math.min(o+1,t.length-1)]).sub(t[Math.max(o-1,0)]).normalize(),c.copy(d).addScaledVector(s,-d.dot(s)).normalize(),d=c.clone(),l.crossVectors(s,c);for(let s=0;s<r;s++){let d=s/r*Math.PI*2,f=Math.cos(d),p=Math.sin(d);u.copy(t[o]).addScaledVector(c,f*n[o]).addScaledVector(l,p*n[o]),e.position.push(u.x,u.y,u.z),e.normal.push(c.x*f+l.x*p,c.y*f+l.y*p,c.z*f+l.z*p),e.data.push(i,a,t[o].y-t[0].y)}}for(let n=0;n<t.length-1;n++)for(let t=0;t<r;t++){let i=o+n*r+t,a=o+n*r+(t+1)%r;e.index.push(i,a,i+r,a,a+r,i+r)}}function je(){let e=ne(4471),t=[],n=(n,r,i,a,o=1)=>{let s=(i===R?.13+e()*.08:i===z?.75+e()*.3:.26+e()*e()*.42)*o,c=i===R?15+e()*6:i===z?19+e()*4:21+e()*8+s*5,l=i===R?4:i===De?e()<.75?2:1:i===z?e()<.5?3:0:[0,0,0,0,0,1,1,1,1,2,3,3][Math.floor(e()*12)];t.push({x:n,z:r,y:L(n,r),type:i,tier:a,r:s,h:c,family:l,seed:e()*1e3,lean:[(e()-.5)*.09,(e()-.5)*.09]})},r=7.2;for(let t=-40;t<=40;t++)for(let i=-40;i<=40;i++){let a=(i+.15+e()*.7)*r,o=(t+.15+e()*.7)*r-8,s=Math.hypot(Math.max(0,Math.abs(a)-10),Math.max(0,Math.abs(o+8)-100));if(s>185||e()>.84||(s<60?he(a,o):99)<2.7||ge(a,o)>.25)continue;let c=w(a/46+5,o/46-3),l=w(a/31-7,o/31+2);n(a,o,c>.42?R:l>.5?De:e()<.04?z:Ee,s<40?0:s<92?1:2)}let i={x:N.x+3,z:N.z-2};t.push({...i,y:L(i.x,i.z),type:z,tier:0,r:1.25,h:23,family:0,seed:77,lean:[.03,-.02],hero:!0});for(let[e,t,r]of[[M.x-5.5,M.z-13,1.9],[M.x+6.2,M.z-19,1.6]])n(e,t,Ee,0,r);return t}function Me(e){let n=je(),o=ne(99173),f={position:[],normal:[],data:[],index:[]},p=[],h=[],g=[],_=[],v=new S;for(let e of n){let t=e.tier===0,n=e.tier===1,r=e.h*(e.type===R?.95:.8),i=t?9:n?5:3,a=[],s=[];for(let t=0;t<i;t++){let n=t/(i-1),o=n*n*.4+n*.6,c=Math.sin(n*2.4+e.seed)*.25*(e.type===R?1.6:1);a.push(new S(e.x+e.lean[0]*o*r+c*e.lean[1]*8,e.y-.3+o*(r+.3),e.z+e.lean[1]*o*r-c*e.lean[0]*8)),s.push(e.r*(1-.6*o)*(1+.5*Math.exp(-(o*r)/(.35+e.r*.6))))}Ae(f,a,s,t?9:n?7:5,e.type,e.seed);let l=(t,n)=>{let r=0;for(;r<i-2&&a[r+1].y-e.y<t;)r++;let o=c.clamp((t-(a[r].y-e.y))/(a[r+1].y-a[r].y),0,1);return n.lerpVectors(a[r],a[r+1],o),s[r]+(s[r+1]-s[r])*o};t&&he(e.x,e.z)<60&&_.push({x:e.x,z:e.z,y:e.y,r:e.r*1.15});let u=new S(e.x+e.lean[0]*r,e.y+e.h*(e.hero?.66:.8),e.z+e.lean[1]*r),d=e.hero?11.5:e.type===z?7.5:e.type===R?2.6+o():4+o()*1.8+e.r*2,m=[];if(t){let t=e.hero?9:e.type===R?4:5+Math.floor(o()*3);for(let n=0;n<t;n++){let i=n/t*Math.PI*2+o()*1.2,a=r*(e.hero?.2+n/t*.5:.48+n/t*.45),s=new S,c=l(a,s),u=e.hero?.9+o()*.5:e.type===R?.35:.45+o()*.45,h=d/Math.sin(u)*(.7+o()*.4)*(1-n/t*.35),g=new S(Math.cos(i),0,Math.sin(i)),_=s.clone().addScaledVector(g,h*Math.sin(u)).add(new S(0,h*Math.cos(u),0)),y=s.clone().lerp(_,.45).add(new S(0,-h*.1,0)).addScaledVector(g,h*.12),b=[],x=[];for(let t=0;t<=5;t++){let n=t/5,r=1-n;b.push(new S().addScaledVector(s,r*r).addScaledVector(y,2*r*n).addScaledVector(_,n*n)),x.push(Math.max(.035,c*(e.hero?.62:.5)*(1-.82*n)))}Ae(f,b,x,6,e.type,e.seed+n);for(let t=0;t<(e.hero?12:6);t++){let t=.15+o()*.8,n=Math.min(4,Math.floor(t*5)),r=b[n+1].clone().sub(b[n]).normalize(),i=b[n].clone().lerp(b[n+1],t*5-n),a=o()<.55;a&&(r.add(v.set(o()-.5,o()*.6,o()-.5).multiplyScalar(1.5)).normalize(),i.addScaledVector(r,.8)),p.push(i.x,i.y,i.z,r.x,r.y,r.z,-r.z,.3,r.x,o()*1e3,a?.09:x[n]*2.4,e.type,a?1.7+o()*1.5:1.6)}for(let t of e.hero?[.5,.68,.86,1.02]:[.7,1]){let n=1-t,r=new S().addScaledVector(s,n*n).addScaledVector(y,2*n*t).addScaledVector(_,t*t);r.add(v.set(o()-.5,o()*.9,o()-.5).multiplyScalar(1.6)),m.push([r.x,r.y,r.z,(e.hero?2.3:1.25)+o()*1+e.r*.6])}}for(let t=0;t<(e.hero?8:3);t++)m.push([u.x+(o()-.5)*d*.9,e.y+e.h*(e.hero?.92:.96)+(o()-.5)*3,u.z+(o()-.5)*d*.9,1.5+o()*(e.hero?1.6:.9)])}else{let t=n?7:4;for(let r=0;r<t;r++){let t=o()*Math.PI*2,r=Math.sqrt(o())*d;m.push([u.x+Math.cos(t)*r,u.y+(o()-.45)*e.h*.3,u.z+Math.sin(t)*r,(n?2.3:3.4)+o()*1.2])}}let y=t?e.hero?150:54:n?20:11,b=t?e.hero?.2:.27:.4;for(let[t,n,r,i]of m){g.push(t,n,r,i);let a=v.set(t-u.x,n-u.y,r-u.z).normalize().clone();for(let s=0;s<y;s++){let s=new S(o()-.5,o()-.5,o()-.5).normalize().addScaledVector(a,.5).add(new S(0,.15,0)).normalize(),c=i*(.72+o()*.4),l=t+s.x*c,d=n+s.y*c,f=r+s.z*c,p=s.multiplyScalar(.6).addScaledVector(v.set(l-u.x,d-u.y,f-u.z).normalize(),.55).normalize(),m=o()<.14?Math.floor(o()*4):e.family;h.push(l,d,f,p.x,p.y,p.z,o()*1e3,i*b*(1+o()*.6),m,0)}for(let a=0;a<2;a++)h.push(t+(o()-.5)*i*.5,n-i*.15*a,r+(o()-.5)*i*.5,0,-1,0,o()*1e3,i*1.25,e.family,1)}let x=t?Math.round(110+e.r*150):n?36:0,ee=Math.min(r,t?14:18);for(let t=0;t<x;t++){let t=o()**1.3*ee,r=o()*Math.PI*2,i=new S,a=l(t,i),s=Math.cos(r),c=Math.sin(r),u=Math.min(.5,a*(e.type===R?1.5:.75))*(n?1.5:1);p.push(i.x+s*a,i.y,i.z+c*a,e.lean[0],1,e.lean[1],s,0,c,o()*1e3,u,e.type,(e.type===R?Math.min(.5,a*2.3):1+o()*1.5)*(n?1.6:1))}}for(let e=0;e<620;e++){let e=(o()-.5)*150,t=-125+o()*235,n=he(e,t);if(n<2.3||n>62||ge(e,t)>.6)continue;let r=L(e,t),i=1.1+o()*o()*3.4,a=o()<.4?3:o()<.6?0:o()<.5?1:2,s=3+Math.floor(o()*4);for(let n=0;n<s;n++){let n=e+(o()-.5)*i*.9,s=r+i*(.45+o()*.6),c=t+(o()-.5)*i*.9,l=.38+o()*.5;for(let e=0;e<12;e++){let e=new S(o()-.5,o()-.3,o()-.5).normalize();h.push(n+e.x*l,s+e.y*l,c+e.z*l,e.x,e.y,e.z,o()*1e3,.22+o()*.2,o()<.2?Math.floor(o()*4):a,0)}let u=v.set(n-e,s-r,c-t).normalize();p.push(e+u.x*i*.3,r+i*.3,t+u.z*i*.3,u.x,u.y,u.z,u.z,0,-u.x,o()*1e3,.05,De,i*.75)}}let y=new b;y.setAttribute(`position`,new ee(f.position,3)),y.setAttribute(`normal`,new ee(f.normal,3)),y.setAttribute(`aData`,new ee(f.data,3)),y.setIndex(f.index);let x=new m({glslVersion:u,uniforms:e,vertexShader:`
      ${k}
      in vec3 aData;
      out vec3 vWorld; out vec3 vN; out vec3 vData;
      void main() { vWorld = position; vN = normal; vData = aData; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }`,fragmentShader:`
      ${k}
      ${Oe}
      in vec3 vWorld; in vec3 vN; in vec3 vData;
      layout(location = 0) out vec4 outC;
      void main() {
        vec3 Nn = normalize(vN);
        float grain = texture(tNoise, vec2(atan(Nn.z, Nn.x) * 1.3 + vData.y, vWorld.y * 0.07)).r;
        vec3 c = bark(int(vData.x + 0.5), vWorld, Nn, grain, vData.z) * (0.72 + 0.3 * grain);
        outC = vec4(hazed(c, vWorld), 1.0);
      }`}),te=new a(y,x);te.frustumCulled=!1;let C=p.length/13,w=new Float32Array(C*3),T=new Float32Array(C*3),re=new Float32Array(C*3),ie=new Float32Array(C*4);for(let e=0;e<C;e++){for(let t=0;t<3;t++)w[e*3+t]=p[e*13+t],T[e*3+t]=p[e*13+3+t],re[e*3+t]=p[e*13+6+t];for(let t=0;t<4;t++)ie[e*4+t]=p[e*13+9+t]}let ae=oe(O(C,{aPos:[w,3],aDir:[T,3],aNrm:[re,3],aData:[ie,4]}),D(e,{head:Oe+`in vec3 aPos; in vec3 aDir; in vec3 aNrm; in vec4 aData;`,body:`
      void makeDab(inout Dab d) {
        vec4 r = hash4(aData.x);
        int k = int(aData.z + 0.5);
        vec3 Nn = normalize(aNrm);
        float foot = aPos.y - heightAt(aPos.xz);
        vec3 c = bark(k, aPos, Nn, r.x, foot);
        d.dir = aDir;
        // a birch is banded across; here and there one of its black scars
        if (k == 1) { d.dir = cross(aDir, Nn); if (r.y < 0.16) c = vec3(0.13, 0.11, 0.15); }
        // moss on the cold side, low down
        if (k != 1 && foot < 2.2 && r.z < 0.3 * (1.0 - foot / 2.2) + 0.1 * max(-dot(Nn, uSunDir), 0.0)) c = mix(c, vec3(0.34, 0.4, 0.14) * (0.5 + 0.9 * sunAt(aPos + Nn * 0.3)), 0.8);
        // lichen, and the cold light of the sky on the shaded side
        if (r.w < 0.1) c = mix(c, vec3(0.56, 0.58, 0.4) * (0.45 + 0.6 * dot(c, vec3(0.6))), 0.7);
        else if (r.w > 0.9 && dot(Nn, uSunDir) < 0.0) c = mix(c, vec3(0.3, 0.33, 0.48), 0.6);
        c = jitter(c, r.yzw, 0.7);
        d.turnabout = 1.0;
        d.pos = aPos;
        d.size = vec2(aData.y, aData.w);
        d.c1 = hazed(c, aPos);
        d.c2 = hazed(jitter(c * 1.2 + vec3(0.02, 0.02, 0.05), r.wxy, 0.6), aPos);
        d.seed = aData.x;
        d.lift = 0.5;
      }`,minPx:[3,10],maxPx:[120,500],cells:[0,4]}),3),E=h.length/10,se=new Float32Array(E*3),ce=new Float32Array(E*3),le=new Float32Array(E*4);for(let e=0;e<E;e++){for(let t=0;t<3;t++)se[e*3+t]=h[e*10+t],ce[e*3+t]=h[e*10+3+t];for(let t=0;t<4;t++)le[e*4+t]=h[e*10+6+t]}let ue=oe(O(E,{aPos:[se,3],aNrm:[ce,3],aData:[le,4]}),D(e,{head:ke+`in vec3 aPos; in vec3 aNrm; in vec4 aData;`,body:`
      void makeDab(inout Dab d) {
        vec4 r = hash4(aData.x);
        vec4 q = hash4(aData.x + 271.3);
        vec3 toEye = cameraPosition - aPos;
        float dist = length(toEye);
        // far crowns are fewer, larger touches
        float keep = mix(1.0, 0.3, smoothstep(35.0, 130.0, dist));
        // (they leave and come back by growing, never at a stroke)
        d.alive = aData.w > 0.5 ? 1.0 : smoothstep(0.0, 1.0, (keep - q.w) / 0.12);
        if (d.alive <= 0.0) return;
        float gust = gustAt(aPos.xz);
        vec3 P = aPos;
        float high = clamp((P.y - heightAt(P.xz)) / 20.0, 0.1, 1.0);
        P.xz += uWind.xy * (gust * 0.5 + sin(uTime * (1.1 + r.x) + r.y * 30.0) * (0.05 + 0.16 * gust)) * high;
        P.y += sin(uTime * (1.7 + r.z) + r.w * 30.0) * (0.03 + 0.1 * gust) * high;
        vec3 Nn = aNrm;
        vec3 view = -toEye / dist;
        int k = int(aData.z + 0.5);
        vec3 c;
        if (aData.w > 0.5) {
          c = mix(LEAF_S[k] * 0.6, vec3(0.12, 0.1, 0.17), 0.3);
        } else {
          // a crown is never wholly dark: light comes down through all the leaves above it
          float sun = mix(0.5, 1.0, sunAt(P + Nn * 0.9));
          // a leaf with the sun behind it is a lamp: the light comes through it
          float through = pow(max(dot(view, uSunDir), 0.0), 2.0);
          float x = sun * clamp(0.55 + 0.45 * dot(Nn, uSunDir) + 0.6 * through, 0.0, 1.0);
          x *= mix(0.6, 1.0, smoothstep(-0.7, 0.1, Nn.y));
          c = paint3(LEAF_L[k], LEAF_M[k], LEAF_S[k], x, r.x);
          c = mix(c, vec3(0.2, 0.16, 0.25), (1.0 - smoothstep(0.1, 0.4, x)) * 0.14);
          // turned in a gust, the pale back of the leaf
          if (q.x < gust * 0.3) c = mix(c, vec3(1.0, 0.92, 0.6), 0.4 * sun);
        }
        c = jitter(c, r.yzw, aData.w > 0.5 ? 0.3 : 0.55);
        float turn = (q.y - 0.5) * 2.0 + sin(uTime * 3.0 + r.w * 50.0) * 0.5 * gust;
        vec3 round_ = cross(Nn, view);
        d.dir = dot(round_, round_) > 1e-4 ? normalize(round_) : vec3(0.0, 1.0, 0.0);
        d.spin = turn;
        d.pos = P;
        float s = aData.y / sqrt(aData.w > 0.5 ? 1.0 : keep);
        d.size = vec2(s, s * (aData.w > 0.5 ? 1.2 : 1.5 + 0.5 * q.z));
        d.c1 = hazed(c, P);
        d.c2 = hazed(jitter(c * 1.16, q.zxy, 0.7), P);
        d.seed = aData.x;
        d.lift = aData.w > 0.5 ? -0.2 : 0.5;
        d.turnabout = 1.0;
      }`,minPx:[5,8],maxPx:[64,100],cells:[4,2]}),4),A=new i,de=new l({side:2});A.add(new a(y,de));let fe=new s(new d(1,1),de,g.length/4),pe=new r;for(let e=0;e<g.length/4;e++){let t=g[e*4+3]*.36;pe.makeScale(t,t*.8,t).setPosition(g[e*4],g[e*4+1],g[e*4+2]),fe.setMatrixAt(e,pe)}fe.frustumCulled=!1,A.add(fe);let j=new t;return j.add(te,ae,ue),{group:j,shade:A,colliders:_,trees:n,counts:{trees:n.length,bark:C,leaves:E}}}var Ne=`
vec3 skyColour(vec3 v) {
  float sunward = max(dot(v, uSunDir), 0.0);
  vec3 low = airColour(v);
  vec3 high = mix(vec3(0.56, 0.68, 0.84), vec3(0.8, 0.84, 0.82), sunward * sunward);
  vec3 c = mix(low, high, smoothstep(0.0, 0.75, v.y));
  c = mix(c, vec3(1.0, 0.95, 0.78), pow(sunward, 24.0) * 0.9);
  return c;
}
`;function Pe(e){let n=new t,r=new a(new h(900,24,16),new m({glslVersion:u,uniforms:e,side:1,depthTest:!1,depthWrite:!1,vertexShader:`
      ${k}
      out vec3 vDir;
      void main() { vDir = position; gl_Position = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.0); }`,fragmentShader:`
      ${k}
      ${Ne}
      in vec3 vDir;
      layout(location = 0) out vec4 outC;
      void main() { outC = vec4(skyColour(normalize(vDir)) * 0.97, 1.0); }`}));r.frustumCulled=!1,r.renderOrder=-10,n.add(r);let i=2600,o=ne(515),s=new Float32Array(i*4);for(let e=0;e<i;e++){let t=o()*Math.PI*2,n=-.08+o()**1.4*1.08,r=Math.sqrt(Math.max(0,1-n*n));s.set([Math.cos(t)*r,n,Math.sin(t)*r,o()*1e3],e*4)}let c=oe(O(i,{aDir:[s,4]}),D(e,{head:Ne+`in vec4 aDir;`,body:`
      void makeDab(inout Dab d) {
        vec4 r = hash4(aDir.w);
        vec3 v = normalize(aDir.xyz);
        d.pos = cameraPosition + v * 800.0;
        // strokes lie level, tipping a little, and swing round the sun
        vec3 level = normalize(cross(vec3(0.0, 1.0, 0.0), v));
        vec3 ring = normalize(cross(uSunDir, v) + 1e-4);
        d.dir = normalize(mix(level, ring, 0.45) + vec3(0.0, (r.x - 0.5) * 0.5, 0.0));
        d.size = vec2(46.0 + 40.0 * r.y, 150.0 + 130.0 * r.z);
        vec3 c = skyColour(v);
        d.c1 = jitter(c, r.yzw, 0.22);
        d.c2 = jitter(c * 1.05, r.wxy, 0.3);
        d.seed = aDir.w;
        d.lift = 0.0;
      }`,minPx:[10,20],maxPx:[900,1800],cells:[0,8],depthTest:!1,depthWrite:!1}),-9);return n.add(c),{group:n}}function Fe(e,t=2400){return{mesh:oe(O(t),D(e,{body:`
      const vec3 BOX = vec3(64.0, 26.0, 64.0);
      void makeDab(inout Dab d) {
        float id = float(gl_InstanceID);
        vec4 r = hash4(id * 1.13 + 3.0);
        vec4 q = hash4(id * 2.71 + 19.0);
        float fall = 0.9 + 1.3 * r.w;
        vec3 p = r.xyz * BOX;
        p.y -= uTime * fall;
        p.xz += uWind.xy * uTime * (0.6 + 1.6 * q.x) + vec2(sin(uTime * (0.7 + q.y) + q.z * 20.0), cos(uTime * (0.9 + q.w) + q.x * 20.0)) * 0.6;
        vec3 origin = vec3(cameraPosition.x, uFocus.y + 11.0, cameraPosition.z);
        p = mod(p - origin + BOX * 0.5, BOX) - BOX * 0.5 + origin;
        float ground = heightAt(p.xz);
        float gust = gustAt(p.xz);
        // most hang on until a gust; all vanish into the carpet
        d.alive = smoothstep(q.z * 0.75 - 0.08, q.z * 0.75 + 0.05, gust + 0.2) * smoothstep(ground, ground + 0.5, p.y) * (1.0 - smoothstep(BOX.x * 0.38, BOX.x * 0.5, distance(p.xz, cameraPosition.xz)));
        if (d.alive <= 0.0) return;
        float sun = sunAt(p);
        float turnOver = sin(uTime * (2.0 + 3.0 * q.y) + q.w * 30.0);
        vec3 c = q.x < 0.5 ? vec3(1.0, 0.76, 0.2) : q.x < 0.8 ? vec3(0.98, 0.5, 0.12) : vec3(0.86, 0.22, 0.1);
        c = mix(c * vec3(0.36, 0.3, 0.36), c, sun * (0.72 + 0.28 * turnOver));
        d.pos = p;
        d.dir = normalize(vec3(sin(uTime * 1.3 + q.z * 9.0), turnOver, cos(uTime * 1.7 + q.x * 9.0)));
        d.size = vec2(0.085, 0.13) * (0.7 + 0.7 * r.x) * (0.55 + 0.45 * abs(turnOver));
        d.c1 = hazed(jitter(c, r.zxy, 0.4), p);
        d.c2 = d.c1 * 1.12;
        d.seed = id;
        d.lift = 0.0;
      }`,minPx:[2.5,3.5],maxPx:[24,36],cells:[4,2]}),6)}}function Ie(e,t=260){let n=new Float32Array(t*3),r=new Float32Array(t*4),i=new Float32Array(t*3);for(let e=0;e<t;e++)r[e*4]=Math.random()*1e3;let a=O(t,{aPos:[n,3],aData:[r,4]},!0),o=oe(a,D(e,{head:`in vec3 aPos; in vec4 aData;`,body:`
      void makeDab(inout Dab d) {
        d.alive = smoothstep(0.0, 0.25, aData.y);
        if (d.alive <= 0.0) return;
        vec4 r = hash4(aData.x);
        float sun = sunAt(aPos + vec3(0.0, 0.1, 0.0));
        float turnOver = sin(uTime * (5.0 + 6.0 * r.y) + r.w * 30.0) * aData.z;
        vec3 c = r.x < 0.5 ? vec3(1.0, 0.76, 0.2) : r.x < 0.8 ? vec3(0.98, 0.5, 0.12) : vec3(0.86, 0.22, 0.1);
        c = mix(c * vec3(0.42, 0.3, 0.34), c, sun * (0.75 + 0.25 * turnOver));
        d.pos = aPos;
        d.dir = normalize(vec3(sin(uTime * 4.0 * aData.z + r.z * 9.0), 0.4 + turnOver, cos(uTime * 3.0 * aData.z + r.x * 9.0)));
        d.size = vec2(0.09, 0.14) * (0.7 + 0.6 * r.z) * (0.6 + 0.4 * abs(turnOver));
        d.c1 = hazed(jitter(c, r.zxy, 0.4), aPos);
        d.c2 = d.c1 * 1.12;
        d.seed = aData.x;
        d.lift = 0.0;
      }`,minPx:[2.5,3.5],maxPx:[30,44],cells:[4,2]}),6),s=0,c=0;return{mesh:o,update(e,o,l,u,d,f){for(c+=d&&u>2.4?e*u*5.5:0;c>=1;){--c;let e=s;s=(s+1)%t;let a=(Math.random()-.5)*2;n[e*3]=o.x-l.x*.25-l.z*a*.28,n[e*3+1]=o.y+.05,n[e*3+2]=o.z-l.z*.25+l.x*a*.28;let d=1+Math.random()*2.4,f=-.4+Math.random()*1.6;i[e*3]=l.x*(u*.45-f)-l.z*a*1.7,i[e*3+1]=d,i[e*3+2]=l.z*(u*.45-f)+l.x*a*1.7,r[e*4+1]=1,r[e*4+2]=1}for(let a=0;a<t;a++){if(r[a*4+1]<=0)continue;let t=a*3,o=Math.exp(-2.2*e);i[t]*=o,i[t+2]*=o,i[t+1]=Math.max(i[t+1]-6.5*e,-1.3),i[t]+=Math.sin(r[a*4]+n[t+1]*9)*e*2,n[t]+=i[t]*e,n[t+1]+=i[t+1]*e,n[t+2]+=i[t+2]*e;let s=f(n[t],n[t+2])+.04;n[t+1]<=s?(n[t+1]=s,i[t]=i[t+2]=0,r[a*4+2]=0,r[a*4+1]-=e*1.6):r[a*4+1]-=e*.35}a.attributes.aPos.needsUpdate=!0,a.attributes.aData.needsUpdate=!0}}}var B=new URLSearchParams(location.search),V=B.has(`capture`),Le=()=>(B.get(`quality`)??window.patch?.quality??`high`)===`low`,Re=!0,ze=!1,Be=te({...C.block,onSet(){},onTrigger(){},onVisible(e){Re=e,ze&&mt()}});Be.progress(.03,`Laying the ground`);var Ve={},He=performance.now(),H=e=>{let t=performance.now();Ve[e]=Math.round(t-He),He=t},U=new y({antialias:!1,powerPreference:`high-performance`});U.setPixelRatio(V?1:Math.min(devicePixelRatio,1.5)),U.setSize(innerWidth,innerHeight),U.autoClear=!1,U.outputColorSpace=o,document.getElementById(`view`).appendChild(U.domElement);var W=ce();W.tBrush.value=ue(),B.has(`impasto`)&&(W.uImpasto.value=+B.get(`impasto`));var Ue=new i,G=new f(46,innerWidth/innerHeight,.2,2e3),We=()=>{};function Ge(){U.setSize(innerWidth,innerHeight),G.aspect=innerWidth/innerHeight,G.updateProjectionMatrix(),We()}addEventListener(`resize`,Ge),H(`start`);var Ke=0,K=(e,t)=>{Ke=Math.max(Ke,e),Be.progress(Ke,t)},qe=le(W,e=>K(.05+.55*e,`Fetching the wanderer`)),Je=()=>new Promise(e=>setTimeout(e,0));await be(e=>(K(.03+.07*e,`Laying the ground`),Je()));var Ye=xe(W);H(`land`),K(.1,`Growing the wood`),await Je();var Xe=Me(W);H(`forest`);var Ze=Te(W),Qe=Pe(W),$e=Fe(W,2400),et=de(U,W,Xe.shade);H(`shade`),K(.25,`Fetching the wanderer`),await Je();var tt=Ie(W);Ue.add(Qe.group,Ye.mesh,Xe.group,Ze.group,$e.mesh,tt.mesh),await T.init();var q=new T.World({x:0,y:-9.81,z:0});{let e=Ye.heightField();q.createCollider(T.ColliderDesc.heightfield(e.cells,e.cells,e.heights,{x:2*e.half,y:1,z:2*e.half}));for(let e of Xe.colliders)q.createCollider(T.ColliderDesc.cylinder(5,e.r).setTranslation(e.x,e.y+4.5,e.z))}H(`physics`);var nt=await qe,{man:J}=nt;Ue.add(J.object,nt.cloakMesh,nt.dabs);var Y=new re(J),X=new S(M.x,L(M.x,M.z),M.z),Z=new ae({RAPIER:T,world:q,man:J,animator:Y,spawn:X,yaw:Math.PI}),Q=new E(G);Q.yaw=Math.PI;var rt=new ie(U.domElement,{pads:!V&&!B.has(`nopad`)});q.step(),H(`figure`);var it=pe(U,W);We=()=>it.resize(),it.uniforms.uCanvas.value=B.has(`canvas`)?+B.get(`canvas`):1;function at(){let e=Le();it.uniforms.uShafts.value=B.has(`shafts`)?+B.get(`shafts`):+!e,$e.mesh.geometry.instanceCount=e?900:2400}at(),window.patch?.addEventListener?.(`qualitychange`,at);var $={x:A.x,z:A.y},ot=0;function st(e,t,n,r){let i=e*$.x+n*$.z,a=-e*$.z+n*$.x,o=c.clamp(.5+.8*w((i-ot*4)/40,a/90)+.3*w((i-ot*6.5)/11,a/17),0,1),s=.4+3.2*o*o;return r.set($.x*s,.25*Math.sin(ot*2.3+e)*o,$.z*s)}function ct(){let e=Z.halfHeight();Z.body.setTranslation({x:X.x,y:X.y+Z.t.radius+e+.05,z:X.z},!0),q.propagateModifiedBodyPositionsToColliders(),Z.vel.set(0,0,0),Z.speed=0,Z.mode=`move`,Z.feet.copy(X),Z.prevFeet.copy(X),Z.visualY=X.y,Z.grounded=!0,Y.lock=null,Y.lockOff=null,Y.enter(Y.locoState({strafe:!1}),.1)}var lt=new v;function ut(e){e=Math.min(e,1/20),ot+=e;let t=rt.read(e);Z.update(e,t,Q.yaw),(Z.feet.y<L(Z.feet.x,Z.feet.z)-6||he(Z.feet.x,Z.feet.z)>78)&&ct();let n=Z.visualRoot(e);J.object.position.copy(n),J.object.rotation.set(0,Z.yaw,0),J.object.updateMatrixWorld(!0);let r=Z.vel.clone().applyAxisAngle(new S(0,1,0),-Z.yaw);Y.update(e,{speed:Z.mode===`move`?Z.speed:Math.hypot(r.x,r.z),moveAngle:Z.moveAngle,grounded:Z.grounded}),Y.relaxHands(Z.speed),Y.uprightTrunk(e,Z.speed,Z.grounded&&Z.mode!==`jump`&&Z.mode!==`air`?1:.3);let i=Z.mode===`move`||Z.mode===`idleExtra`?c.clamp(1-(Z.speed-1.5)/2,0,1):0;Y.lookToward(e,G.getWorldDirection(new S),i),Y.armClearance(e),Z.mode===`move`&&!Z.strafe?Y.leanInto(e,Z.turnRate,Z.speed,Z.accelF):Y.leanInto(e,0,0,0);let a=Z.grounded&&Z.mode!==`jump`&&Z.mode!==`air`;Y.placeFeet(e,(e,t,n)=>Z.ground(e,t,n,1.4),n.y,+!!a),J.object.updateMatrixWorld(!0),nt.updateCloak(e,st,L),tt.update(e,n,{x:Math.sin(Z.yaw),z:Math.cos(Z.yaw)},Z.speed,a,L),Q.update(e,n,t.look,t.zoom,(e,t,n)=>Z.castRay(e,t,n),L),G.updateMatrixWorld(!0),U.getDrawingBufferSize(lt),W.uTime.value=ot,W.uPixel.value=2*Math.tan(c.degToRad(G.fov)/2)/lt.y,W.uFocus.value.copy(n),Ze.follow(G.position.x,G.position.z),et.update(Ue,n),it.render(Ue,G)}window.lab={THREE:g,player:Z,follow:Q,camera:G,input:rt,animator:Y,figure:nt,shared:W,frame:it,renderer:U,timings:Ve,counts:Xe.counts,heightAt:L,respawn:ct,way:me,step(e=1/60,t=1){for(let n=0;n<t;n++)ut(e)},setInput(e){rt.override=e},teleport(e,t,n,r){let i=L(e,t),a=Z.halfHeight();Z.body.setTranslation({x:e,y:i+Z.t.radius+a+.05,z:t},!0),q.propagateModifiedBodyPositionsToColliders(),Z.feet.set(e,i,t),Z.prevFeet.copy(Z.feet),Z.visualY=i,Z.vel.set(0,0,0),Z.speed=0,Z.mode=`move`,Z.grounded=!0,Z.yaw=Z.lastYaw=Math.atan2(n-e,r-t),Q.yaw=Z.yaw,Q.pivot.set(0,0,0),Y.lock=null,Y.lockOff=null,Y.enter(Y.locoState({strafe:!1}),.05),ut(1/60)},view(e,t){Q.free=e?{position:new S(...e),target:new S(...t)}:null}},K(.68,`Mixing paint`);function dt(){let e=U.getContext(),t=e.fenceSync(e.SYNC_GPU_COMMANDS_COMPLETE,0);return e.flush(),new Promise(n=>{let r=()=>{if(e.clientWaitSync(t,0,0)===e.TIMEOUT_EXPIRED)return void setTimeout(r,4);e.deleteSync(t),n()};r()})}V||(U.debug.checkShaderErrors=!1,await U.compileAsync(Ue,G),H(`shaders`),K(.86,`Mixing paint`));for(let e=0;e<(V?1:5)&&(ut(1/60),!V);e++)await dt(),K(.88+.025*e,`First strokes`),await Je();H(`first frame`);var ft=!1,pt=0;function mt(){let e=Re&&!V;e!==ft&&(ft=e,pt=performance.now(),U.setAnimationLoop(e?()=>{let e=performance.now();ut((e-pt)/1e3),pt=e}:null))}if(!V){let e=document.getElementById(`hint`);addEventListener(`keydown`,t=>{t.code===`KeyH`&&e.classList.toggle(`off`)}),setTimeout(()=>e.classList.add(`faded`),9e3)}Ge(),ze=!0,mt(),document.getElementById(`loading`)?.remove(),(B.has(`clean`)||V)&&document.getElementById(`hint`)?.remove(),Be.ready(),window.lab.ready=!0,window.__block={ready:!0,block:Be,timings:Ve,set(){}};