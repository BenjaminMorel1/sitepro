import{A as e,C as t,D as n,E as r,G as i,I as a,L as o,S as s,X as c,Y as l,_ as u,c as d,d as f,et as p,j as m,k as h,l as g,m as _,nt as v,t as y,tt as b,y as x}from"./man-C3WYLH7W.js";var S=19,C=14,w=.088,T=1/120,E=class{constructor(e){this.bones=e,this.cols=S,this.rows=C,this.p=new Float32Array(798),this.prev=new Float32Array(798),this.normals=new Float32Array(798),this.pins=new Float32Array(57),this.pinsBefore=new Float32Array(57),this.hat=null,this.hatInverse=new a,this.started=!1,this.time=0,this.left=0;let t=new Float32Array(798);for(let e=0;e<C;e++)for(let n=0;n<S;n++){let r=this.angle(n),i=1+.06*e;t.set([Math.sin(r)*.225*i,-e*w*.93,-Math.cos(r)*.16*i],(n+e*S)*3)}let n=[],r=(e,r,i)=>{let a=Math.hypot(t[e*3]-t[r*3],t[e*3+1]-t[r*3+1],t[e*3+2]-t[r*3+2]);n.push(e,r,a,i)};for(let e=0;e<C;e++)for(let t=0;t<S;t++){let n=t+e*S;t+1<S&&r(n,n+1,1),e+1<C&&r(n,n+S,1),t+1<S&&e+1<C&&(r(n,n+S+1,.6),r(n+1,n+S,.6)),t+2<S&&r(n,n+2,.25),e+2<C&&r(n,n+38,.25)}this.links=new Float32Array(n),this.sticks=[[`pelvis`,`spine_03`,.165],[`spine_03`,`neck_01`,.15],[`upperarm_l`,`upperarm_r`,.115],[`upperarm_l`,`lowerarm_l`,.075],[`lowerarm_l`,`hand_l`,.06],[`upperarm_r`,`lowerarm_r`,.075],[`lowerarm_r`,`hand_r`,.06],[`thigh_l`,`calf_l`,.105],[`calf_l`,`foot_l`,.075],[`thigh_r`,`calf_r`,.105],[`calf_r`,`foot_r`,.075],[`pelvis`,`pelvis`,.19]],this.ends=new Float32Array(this.sticks.length*6),this.endsBefore=new Float32Array(this.sticks.length*6),this.a=new b,this.b=new b,this.c=new b,this.X=new b,this.Y=new b,this.Z=new b,this.C=new b}angle(e){return(e/18*2-1)*2.45}readBody(){let e=this.bones,{a:t,b:n,X:r,Y:i,Z:a,C:o}=this;this.pinsBefore.set(this.pins),this.endsBefore.set(this.ends),this.hat&&this.hatInverse.copy(this.hat.matrixWorld).invert(),e.upperarm_l.getWorldPosition(t),e.upperarm_r.getWorldPosition(n),r.subVectors(t,n);let s=r.length()/2;r.normalize(),o.addVectors(t,n).multiplyScalar(.5),e.neck_01.getWorldPosition(t),e.spine_02.getWorldPosition(n),i.subVectors(t,n).normalize(),a.crossVectors(r,i).normalize(),i.crossVectors(a,r),o.addScaledVector(i,.075).addScaledVector(a,-.01);for(let e=0;e<S;e++){let t=this.angle(e),n=-.05*Math.max(0,Math.abs(t)-1.5);this.pins[e*3]=o.x+r.x*Math.sin(t)*(s+.04)-a.x*Math.cos(t)*.15+i.x*n,this.pins[e*3+1]=o.y+r.y*Math.sin(t)*(s+.04)-a.y*Math.cos(t)*.15+i.y*n,this.pins[e*3+2]=o.z+r.z*Math.sin(t)*(s+.04)-a.z*Math.cos(t)*.15+i.z*n}this.sticks.forEach(([r,i],a)=>{e[r].getWorldPosition(t),e[i].getWorldPosition(n),this.ends.set([t.x,t.y,t.z,n.x,n.y,n.z],a*6)})}start(){this.readBody();let{X:e,Y:t,Z:n}=this;for(let t=0;t<C;t++)for(let r=0;r<S;r++){let i=(r+t*S)*3,a=this.angle(r),o=.015*t;this.p[i]=this.pins[r*3]+(e.x*Math.sin(a)-n.x*Math.cos(a))*o,this.p[i+1]=this.pins[r*3+1]-t*w*.93,this.p[i+2]=this.pins[r*3+2]+(e.z*Math.sin(a)-n.z*Math.cos(a))*o}this.prev.set(this.p),this.pinsBefore.set(this.pins),this.endsBefore.set(this.ends),this.started=!0}update(e,t,n){if(!this.started)return this.start();if(this.readBody(),Math.hypot(this.pins[0]-this.pinsBefore[0],this.pins[1]-this.pinsBefore[1],this.pins[2]-this.pinsBefore[2])>2)return this.started=!1,this.start();this.left+=Math.min(e,.05);let r=Math.min(6,Math.floor(this.left/T));if(r<=0)return;this.left-=r*T;let{p:i,prev:a,normals:o,links:s,pins:c,pinsBefore:l,ends:u,endsBefore:d}=this,f=this.c;for(let e=0;e<r;e++){let u=(e+1)/r;this.time+=T,this.computeNormals();for(let e=1;e<C;e++)for(let n=0;n<S;n++){let r=(n+e*S)*3,s=(i[r]-a[r])*.992,c=(i[r+1]-a[r+1])*.992,l=(i[r+2]-a[r+2])*.992;t(i[r],i[r+1],i[r+2],f);let u=f.x-s/T,d=f.y-c/T,p=f.z-l/T,m=o[r],h=o[r+1],g=o[r+2],_=Math.hypot(u,d,p),v=Math.sin(this.time*11-e*.85+n*.7)*.45*_*(e/C),y=m*v+u*1.45,b=-9.8+h*v+d*.5,x=g*v+p*1.45;a[r]=i[r],a[r+1]=i[r+1],a[r+2]=i[r+2],i[r]+=s+y*T*T,i[r+1]+=c+b*T*T,i[r+2]+=l+x*T*T}for(let e=0;e<57;e++)i[e]=l[e]+(c[e]-l[e])*u;for(let e=0;e<7;e++){for(let e=0;e<s.length;e+=4){let t=s[e]*3,n=s[e+1]*3,r=s[e+2],a=s[e+3],o=i[n]-i[t],c=i[n+1]-i[t+1],l=i[n+2]-i[t+2],u=Math.hypot(o,c,l)||1e-6,d=(u-r)/u*(u>r?a:a*.12),f=t<57,p=n<57;if(f&&p)continue;let m=f?0:p?1:.5,h=p?0:f?1:.5;i[t]+=o*d*m,i[t+1]+=c*d*m,i[t+2]+=l*d*m,i[n]-=o*d*h,i[n+1]-=c*d*h,i[n+2]-=l*d*h}e%2==0&&this.collide(u,n)}this.collide(u,n)}this.computeNormals()}collide(e,t){let{p:n,ends:r,endsBefore:i,sticks:a}=this;for(let o=57;o<n.length;o+=3){for(let t=0;t<a.length;t++){let s=t*6,c=a[t][2]+.022,l=i[s]+(r[s]-i[s])*e,u=i[s+1]+(r[s+1]-i[s+1])*e,d=i[s+2]+(r[s+2]-i[s+2])*e,f=i[s+3]+(r[s+3]-i[s+3])*e,p=i[s+4]+(r[s+4]-i[s+4])*e,m=i[s+5]+(r[s+5]-i[s+5])*e,h=f-l,g=p-u,_=m-d,v=h*h+g*g+_*_,y=v>1e-8?Math.max(0,Math.min(1,((n[o]-l)*h+(n[o+1]-u)*g+(n[o+2]-d)*_)/v)):0,b=n[o]-l-h*y,x=n[o+1]-u-g*y,S=n[o+2]-d-_*y,C=b*b+x*x+S*S;if(C<c*c&&C>1e-10){let e=Math.sqrt(C),t=(c-e)/e;n[o]+=b*t,n[o+1]+=x*t,n[o+2]+=S*t}}if(this.hat){let e=this.hatInverse.elements,t=this.hat.matrixWorld.elements,r=n[o],i=n[o+1],a=n[o+2],s=e[0]*r+e[4]*i+e[8]*a+e[12],c=e[1]*r+e[5]*i+e[9]*a+e[13],l=e[2]*r+e[6]*i+e[10]*a+e[14],u=Math.hypot(s,l);if(u<.43){let e=(u<.125?0:-(u-.125)*.42)-.05;if(c>e&&c<e+.35){let r=e-c;n[o]+=t[4]*r,n[o+1]+=t[5]*r,n[o+2]+=t[6]*r}}}let s=t(n[o],n[o+2])+.04;n[o+1]<s&&(n[o+1]=s)}}computeNormals(){let{p:e,normals:t}=this;for(let n=0;n<C;n++)for(let r=0;r<S;r++){let i=(r+n*S)*3,a=(Math.max(r-1,0)+n*S)*3,o=(Math.min(r+1,18)+n*S)*3,s=(r+Math.max(n-1,0)*S)*3,c=(r+Math.min(n+1,13)*S)*3,l=e[o]-e[a],u=e[o+1]-e[a+1],d=e[o+2]-e[a+2],f=e[c]-e[s],p=e[c+1]-e[s+1],m=e[c+2]-e[s+2],h=u*m-d*p,g=d*f-l*m,_=l*p-u*f,v=Math.hypot(h,g,_)||1;t[i]=h/v,t[i+1]=g/v,t[i+2]=_/v}}},D=new b(-.44,.5,-.75).normalize(),O=new p(.8,.6).normalize(),k=1025,A=(e,t,n,r)=>{let i=new _(new Uint8Array([e,t,n,r]),1,1);return i.needsUpdate=!0,i};function j(t=256,n=7){let r=n>>>0,a=()=>(r=Math.imul(r,1664525)+1013904223>>>0)/4294967296,o=new Uint8Array(t*t*4);for(let e=0;e<4;e++){let n=new Float32Array(t*t);for(let[e,r]of[[8,1],[16,.5],[32,.25],[64,.125]]){let i=new Float32Array(e*e);for(let e=0;e<i.length;e++)i[e]=a();for(let a=0;a<t;a++)for(let o=0;o<t;o++){let s=o/t*e,c=a/t*e,l=Math.floor(s),u=Math.floor(c),d=s-l,f=c-u;d=d*d*(3-2*d),f=f*f*(3-2*f);let p=i[l%e+u%e*e],m=i[(l+1)%e+u%e*e],h=i[l%e+(u+1)%e*e],g=i[(l+1)%e+(u+1)%e*e];n[o+a*t]+=r*(p+(m-p)*d+(h-p)*f+(p-m-h+g)*d*f)}}let r=1/0,i=-1/0;for(let e of n)r=Math.min(r,e),i=Math.max(i,e);for(let t=0;t<n.length;t++)o[t*4+e]=Math.round((n[t]-r)/(i-r)*255)}let s=new _(o,t,t);return s.wrapS=s.wrapT=i,s.minFilter=m,s.magFilter=e,s.generateMipmaps=!0,s.needsUpdate=!0,s}function M(){return{uTime:{value:0},uPixel:{value:.001},uSunDir:{value:D.clone()},uWind:{value:new b(O.x,O.y,1)},uExtent:{value:256},tHeight:{value:A(0,0,0,0)},tLand:{value:A(0,0,128,0)},tNoise:{value:j()},tBrush:{value:A(255,255,128,255)},tTreeShade:{value:null},uTreeShadeMat:{value:new a},tFigShade:{value:null},uFigShadeMat:{value:new a},uHaze:{value:new f(.6,.6,.67)},uHazeSun:{value:new f(1,.89,.62)},uHazeDensity:{value:.0105},uHazeGlow:{value:new f(.1,.08,.02)},uShadeBias:{value:9e-4},uBounce:{value:new f(.1,.045,0)},uLamp:{value:new v(0,0,0,0)},uLampCol:{value:new f(1,.62,.25)},uGlazeMul:{value:new f(.5,.38,.46)},uGlazeAdd:{value:new f(.03,.02,.06)},uImpasto:{value:1},uFocus:{value:new b}}}var N=`
precision highp float;
precision highp sampler2DShadow;
#define TAU 6.28318530718
uniform float uTime;
uniform float uPixel;
uniform vec3 uSunDir;
uniform vec3 uWind;
uniform float uExtent;
uniform sampler2D tHeight;
uniform sampler2D tLand;
uniform sampler2D tNoise;
uniform sampler2D tBrush;
uniform sampler2DShadow tTreeShade;
uniform mat4 uTreeShadeMat;
uniform sampler2DShadow tFigShade;
uniform mat4 uFigShadeMat;
uniform vec3 uHaze;
uniform vec3 uHazeSun;
uniform float uHazeDensity;
uniform vec3 uHazeGlow;
uniform float uShadeBias;
uniform vec3 uBounce;
uniform vec4 uLamp;
uniform vec3 uLampCol;
uniform vec3 uGlazeMul;
uniform vec3 uGlazeAdd;
uniform float uImpasto;
uniform vec3 uFocus;

vec4 hash4(vec2 p, float salt) {
  vec4 q = fract(vec4(p.xyxy) * vec4(0.1031, 0.1030, 0.0973, 0.1099) + salt * 0.0713);
  q += dot(q, q.wzxy + 33.33);
  return fract((q.xxyz + q.yzzw) * q.zywx);
}
vec4 hash4(float n) {
  vec4 q = fract(vec4(n) * vec4(0.1031, 0.1030, 0.0973, 0.1099));
  q += dot(q, q.wzxy + 33.33);
  return fract((q.xxyz + q.yzzw) * q.zywx);
}

vec2 landUv(vec2 xz) { return (xz + uExtent) / (2.0 * uExtent) * (1024.0 / 1025.0) + 0.5 / 1025.0; }
float heightAt(vec2 xz) { return texture(tHeight, landUv(xz)).r; }
vec3 normalAt(vec2 xz) {
  const float e = 0.75;
  float hx = heightAt(xz + vec2(e, 0.0)) - heightAt(xz - vec2(e, 0.0));
  float hz = heightAt(xz + vec2(0.0, e)) - heightAt(xz - vec2(0.0, e));
  return normalize(vec3(-hx, 2.0 * e, -hz));
}

// Wind: bands crossing the wood with the wind, stretched along their fronts, with finer squalls inside.
float gustAt(vec2 xz) {
  vec2 w = uWind.xy;
  vec2 q = vec2(dot(xz, w), dot(xz, vec2(-w.y, w.x)));
  float a = texture(tNoise, vec2(q.x - uTime * 4.0, q.y * 0.45) / 95.0).r;
  float b = texture(tNoise, vec2(q.x - uTime * 6.5, q.y * 0.6) / 23.0 + 0.37).g;
  return clamp(smoothstep(0.36, 0.74, a) * 0.8 + (b - 0.5) * 0.6, 0.0, 1.0) * uWind.z;
}

// 1 in the sun, 0 in the wood's shade. That shade never moves, so a dab can take it whole.
float woodSunAt(vec3 world) {
  vec4 t = uTreeShadeMat * vec4(world, 1.0);
  float lit = smoothstep(0.56, 0.62, texture(tNoise, world.xz / 29.0).r); // beyond the picture of the shade: patches
  if (t.x > 0.0 && t.x < 1.0 && t.y > 0.0 && t.y < 1.0 && t.z < 1.0) lit = texture(tTreeShade, vec3(t.xy, t.z - uShadeBias));
  return lit;
}
// The wanderer's own shadow moves all the time (he breathes, his cloak blows), so it is read soft: a few looks
// round the spot, which turns its edge into a gradual thing instead of a line that dabs flick across.
float figSunSoft(vec3 f) {
  if (f.x <= 0.0 || f.x >= 1.0 || f.y <= 0.0 || f.y >= 1.0 || f.z >= 1.0) return 1.0;
  float z = f.z - 0.004;
  const float e = 0.013;
  float s = texture(tFigShade, vec3(f.xy, z)) * 0.28;
  s += texture(tFigShade, vec3(f.xy + vec2(e, e * 0.4), z)) * 0.18;
  s += texture(tFigShade, vec3(f.xy + vec2(-e * 0.4, e), z)) * 0.18;
  s += texture(tFigShade, vec3(f.xy + vec2(-e, -e * 0.4), z)) * 0.18;
  s += texture(tFigShade, vec3(f.xy + vec2(e * 0.4, -e), z)) * 0.18;
  return s;
}
float figSunAt(vec3 world) { return figSunSoft((uFigShadeMat * vec4(world, 1.0)).xyz); }
float sunAt(vec3 world) { return min(woodSunAt(world), figSunAt(world)); }

// The painter's three mixes. x is how lit the spot is; r moves the edges about so that one zone breaks into
// the next dab by dab.
vec3 paint3(vec3 cl, vec3 cm, vec3 cs, float x, float r) {
  x += (r - 0.5) * 0.2;
  vec3 c = mix(cs, cm, smoothstep(0.24, 0.36, x));
  return mix(c, cl, smoothstep(0.56, 0.7, x));
}

// Broken colour: every dab is mixed a little differently on the palette (value, hue, strength).
vec3 jitter(vec3 c, vec3 r, float amount) {
  float a = (r.y - 0.5) * 0.9 * amount;
  vec3 k = vec3(0.57735);
  c = c * cos(a) + cross(k, c) * sin(a) + k * dot(k, c) * (1.0 - cos(a));
  float g = dot(c, vec3(0.3, 0.59, 0.11));
  c = mix(vec3(g), c, 1.0 + (r.z - 0.5) * 0.7 * amount);
  return max(c * (1.0 + (r.x - 0.5) * 0.5 * amount), 0.0);
}

// Mist: it lies low among the trunks, takes the sun's colour toward the sun and a grey violet away from it, and
// is what puts distance between one row of trees and the next.
vec3 airColour(vec3 v) {
  float sunward = max(dot(v, uSunDir), 0.0);
  vec3 air = mix(uHaze, uHazeSun, sunward * sunward);
  return air + uHazeGlow * pow(sunward, 12.0);
}

// A light carried through the picture, a lantern: how much of it falls on a spot that faces n. Add
// (the thing's own colour) * uLampCol * lampAt. It is nothing while uLamp.w is 0.
float lampAt(vec3 world, vec3 n) {
  vec3 to = uLamp.xyz - world;
  float d2 = dot(to, to);
  float face = clamp(dot(n, to) * inversesqrt(d2 + 1e-4) * 0.7 + 0.4, 0.0, 1.0);
  return uLamp.w * face / (1.0 + d2 * 0.2);
}
float mistBetween(vec3 world) {
  vec3 d = world - cameraPosition;
  float dist = length(d);
  float sunward = max(dot(d / dist, uSunDir), 0.0);
  float up = clamp((0.5 * (world.y + cameraPosition.y) - uFocus.y - 2.0) / 22.0, 0.0, 1.0);
  return 1.0 - exp(-dist * uHazeDensity * mix(1.2, 0.4, up) * (1.0 + 0.7 * sunward * sunward));
}
vec3 hazed(vec3 c, vec3 world) {
  return mix(c, airColour(normalize(world - cameraPosition)), mistBetween(world));
}
`,P=128,F=256,I=e=>{let t=Math.sin(e*127.1+311.7)*43758.5453;return t-Math.floor(t)},L=e=>e*e*(3-2*e),R=(e,t)=>{let n=Math.floor(e),r=L(e-n);return I(n+t*57.3)*(1-r)+I(n+1+t*57.3)*r},z=(e,t,n)=>{let r=Math.floor(e),i=Math.floor(t),a=L(e-r),o=L(t-i),s=(e,t)=>I(e*1.31+t*91.7+n*13.9);return(s(r,i)*(1-a)+s(r+1,i)*a)*(1-o)+(s(r,i+1)*(1-a)+s(r+1,i+1)*a)*o},B=(e,t,n)=>L(Math.min(1,Math.max(0,(n-e)/(t-e))));function V(e,t,n,r){let i=e-(r===2?n%2?.34:-.34:(I(n*3.1)-.5)*.12)*(4*(t-.5)*(t-.5)-.5),a=(R(t*5,n+3)-.5)*.1,o=Math.abs(i+a),s,c,l;if(r===1){let e=Math.hypot(i/.66,(t-.5)/.44),r=1+(R(Math.atan2(t-.5,i)*2.2+9,n)-.5)*.34;s=.66,c=0,l=1;let a=(1-B(r-.16,r,e))*(R(i*11,n+11)>B(.55,1,e)*.9*.8?1:.25);return[a*(.4+.22*R(i*13+R(t*3,n)*1.5,n+31)*R(i*9,n+5)+.3*B(.45,.95,e)+.12*z(i*4,t*6,n)),a,z(i*3.2,t*1.3,n+20)]}s=.6*(.8+.2*Math.sin(Math.PI*Math.min(1,t*1.15)))*(1+(R(t*7,n+1)-.5)*.1),c=.05+.05*R(i*5,n+2),l=.95-.3*R(i*4.5+2,n+4)-.06*R(i*19,n+6);let u=1-B(s-.07,s,o),d=B(c,c+.035,t),f=1-B(l-.02,l+.015,t),p=B(l-.2,l,t),m=R(i*13,n+8)*.7+R(i*31,n+9)*.3,h=+(1-B(p*.55-.08,p*.55,m)<.5),g=u*d*f*h,_=R(i*12+R(t*2.5,n+12)*1.2,n+33)*.7+R(i*29,n+34)*.3,v=1-.55*B(.1,.9,t),y=B(s-.3,s-.06,o),b=g*(.3+.22*_*(.5+.5*R(i*11,n+13))+.3*y+.25*v*(1-B(c,c+.25,t))+.1*z(i*3,t*7,n+14));return[Math.min(1,b),g,z(i*3.4,t*1.1,n+20)]}function H(){let t=F*2,n=new Uint8Array(512*t*4),r=[0,0,0,2,1,1,0,2];for(let e=0;e<8;e++){let t=e%4,i=Math.floor(e/4);for(let a=0;a<F;a++)for(let o=0;o<P;o++){let s=(o+.5)/P*2-1,c=(a+.5)/F,l=.9,[u,d,f]=Math.abs(s)>l||c<.04||c>.96?[0,0,.5]:V(s/l,(c-.04)/.92,e*7+1,r[e]),p=(t*P+o+(i*F+a)*512)*4;n[p]=Math.round(u*255),n[p+1]=Math.round(d*255),n[p+2]=Math.round(f*255),n[p+3]=255}}let i=new _(n,512,t);return i.minFilter=m,i.magFilter=e,i.generateMipmaps=!0,i.anisotropy=4,i.needsUpdate=!0,i}var U=(e,t)=>`
${N}
uniform vec2 uMinPx;
uniform vec2 uMaxPx;
uniform vec2 uCells; // first cell of the brush sheet and how many to choose from
out vec2 vUv;
out vec3 vC1;
out vec3 vC2;
out vec4 vAxis;
out vec4 vGlaze;
struct Dab {
  vec3 pos;    // where it is pinned
  vec3 dir;    // the way the stroke runs, in the world
  vec2 size;   // across and along, metres
  vec3 c1;     // its colour
  vec3 c2;     // the colour streaked into it
  float seed;
  float alive; // 0 gone .. 1 whole (it grows in)
  float lift;  // how far it stands off its surface toward the eye, in its own sizes
  float base;  // 1: pinned by its foot instead of its middle
  float spin;  // a turn on the canvas, radians
  float turnabout; // 1: laid with either end first
  float cell;  // which mark of the brush sheet, or -1 to let it choose
  float lie;   // 1: lies flat on its surface (nrm) instead of facing the eye
  vec3 nrm;    // the surface it lies on
  float height; // how far above the surface it is laid, metres: higher is on top
  float glaze; // 1: the wanderer's shadow passes over it as a glaze, pixel by pixel
};
${e}
void makeDab(inout Dab d);
${t}
void main() {
  Dab d;
  d.pos = vec3(0.0); d.dir = vec3(0.0, 1.0, 0.0); d.size = vec2(0.1, 0.2);
  d.c1 = vec3(0.5); d.c2 = vec3(0.5); d.seed = float(gl_InstanceID); d.alive = 1.0; d.lift = 0.6; d.base = 0.0; d.spin = 0.0; d.turnabout = 0.0; d.cell = -1.0;
  d.lie = 0.0; d.nrm = vec3(0.0, 1.0, 0.0); d.height = 0.0; d.glaze = 0.0;
  makeDab(d);
  vec4 r = hash4(d.seed * 1.37 + 5.1);
  vec2 across, along;
  vec4 vc;
  vGlaze = vec4(0.0);
  if (d.lie > 0.5) {
    vec3 Nn = normalize(d.nrm);
    vec3 A = d.dir - Nn * dot(d.dir, Nn);
    A = dot(A, A) > 1e-8 ? normalize(A) : normalize(cross(Nn, vec3(1.0, 0.0, 0.0)));
    vec3 B = cross(Nn, A);
    vec3 P = d.pos + Nn * d.height;
    vc = viewMatrix * vec4(P, 1.0);
    float dist = -vc.z;
    if (d.alive < 0.004 || dist < 0.1) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
    vec2 half_ = d.size * 0.5 * d.alive;
    vec3 world = P + A * position.y * half_.y + B * position.x * half_.x;
    if (d.glaze > 0.5) vGlaze = vec4((uFigShadeMat * vec4(world, 1.0)).xyz, 1.0);
    vec3 a = mat3(viewMatrix) * A * half_.y;
    vec3 b = mat3(viewMatrix) * B * half_.x;
    // on the canvas the patch is a slanted box; if its thin way is under the least size, stand it up to that
    float la = length(a.xy), lb = length(b.xy);
    float thin = abs(a.x * b.y - a.y * b.x) / max(max(la, lb), 1e-6);
    float need = uMinPx.x * 0.5 * dist * uPixel * d.alive;
    if (thin < need) {
      if (la > lb) {
        vec2 perp = vec2(-a.y, a.x) / max(la, 1e-6);
        b.xy += perp * (dot(b.xy, perp) < 0.0 ? -1.0 : 1.0) * (need - thin);
      } else {
        vec2 perp = vec2(-b.y, b.x) / max(lb, 1e-6);
        a.xy += perp * (dot(a.xy, perp) < 0.0 ? -1.0 : 1.0) * (need - thin);
      }
    }
    vc.xyz += a * position.y + b * position.x;
    along = normalize(a.xy + 1e-6);
    across = normalize(b.xy + 1e-6);
  } else {
    vc = viewMatrix * vec4(d.pos, 1.0);
    float dist = -vc.z;
    if (d.alive < 0.004 || dist < 0.1) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
    vec3 vd = mat3(viewMatrix) * normalize(d.dir);
    float flatness = length(vd.xy);
    float a0 = r.x * TAU;
    along = flatness > 1e-4 ? vd.xy / flatness : vec2(0.0, 1.0);
    // a stroke that points at the eye has no direction on the canvas: give it its own
    along = normalize(mix(vec2(cos(a0), sin(a0)), along, smoothstep(0.08, 0.4, flatness)));
    float cs = cos(d.spin), sn = sin(d.spin);
    along = vec2(along.x * cs - along.y * sn, along.x * sn + along.y * cs);
    across = vec2(along.y, -along.x);
    float px = dist * uPixel;
    vec2 half_ = clamp(d.size, uMinPx * px, uMaxPx * px) * 0.5 * d.alive;
    float lift = d.lift * max(half_.x, half_.y) * (0.6 + 0.8 * r.y);
    vc.xyz *= 1.0 - min(lift / dist, 0.3);
    float t = mix(position.y, position.y + 1.0, d.base);
    vc.xy += across * position.x * half_.x + along * t * half_.y;
  }
  gl_Position = projectionMatrix * vc;
  float cell = d.cell >= 0.0 ? d.cell : uCells.x + floor(r.z * uCells.y * 0.999);
  float flip = r.w > 0.5 ? -1.0 : 1.0;
  float end_ = d.turnabout > 0.5 && fract(r.x * 7.13) > 0.5 ? -1.0 : 1.0;
  vec2 q = vec2(position.x * flip, position.y * end_) * 0.5 + 0.5;
  vUv = (vec2(mod(cell, 4.0), floor(cell / 4.0)) + q) / vec2(4.0, 2.0);
  vC1 = d.c1;
  vC2 = d.c2;
  vAxis = vec4(across * flip, along * end_);
}
`,W=`
${N}
in vec2 vUv;
in vec3 vC1;
in vec3 vC2;
in vec4 vAxis;
in vec4 vGlaze;
layout(location = 0) out vec4 outC;
void main() {
  vec4 t = texture(tBrush, vUv);
  if (t.g < 0.3) discard;
  vec2 e = vec2(1.5 / 512.0, 0.0);
  float hu = texture(tBrush, vUv + e.xy).r - texture(tBrush, vUv - e.xy).r;
  float hv = texture(tBrush, vUv + e.yx).r - texture(tBrush, vUv - e.yx).r;
  // the paint stands up off the canvas and the room's light, from the upper left, rakes across it
  vec2 g = vAxis.xy * hu + vAxis.zw * hv;
  float rake = 0.5 * g.x - 0.7 * g.y;
  vec3 col = mix(vC1, vC2, smoothstep(0.52, 0.78, t.b));
  if (vGlaze.w > 0.5) {
    // the wanderer's shadow: a soft plum glaze that slides over the paint and follows its streaks a little
    float lit = figSunSoft(vGlaze.xyz + vec3((t.b - 0.5) * 0.012, (t.r - 0.5) * 0.012, 0.0));
    col = mix(col * uGlazeMul + uGlazeAdd, col, lit);
  }
  col *= mix(0.95, 1.04, t.r);
  col *= 1.0 + rake * 1.25 * uImpasto;
  col += vec3(1.0, 0.97, 0.9) * pow(max(rake, 0.0), 2.0) * 1.2 * uImpasto;
  outC = vec4(col, smoothstep(0.3, 0.62, t.g));
}
`;function G(e,{head:t=``,body:n,uniforms:r={},minPx:i=[5,9],maxPx:a=[400,700],cells:o=[0,8],depthTest:c=!0,depthWrite:u=!0}={}){return new l({glslVersion:s,vertexShader:U(t,n),fragmentShader:W,uniforms:{...e,uMinPx:{value:new p(...i)},uMaxPx:{value:new p(...a)},uCells:{value:new p(...o)},...r},side:2,alphaToCoverage:!0,depthTest:c,depthWrite:u})}function K(e,t={},i=!1){let a=new n;a.setAttribute(`position`,new x([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),a.setIndex([0,1,2,0,2,3]);for(let[e,[n,o]]of Object.entries(t)){let t=new r(n,o);i&&t.setUsage(u),a.setAttribute(e,t)}return a.instanceCount=e,a.boundingSphere=new c(new b,1e6),a}function q(e,t,n=0){let r=new o(e,t);return r.frustumCulled=!1,r.matrixAutoUpdate=!1,r.renderOrder=n,r}function ee(e,t,n){let i=9151,a=()=>(i=Math.imul(i,1664525)+1013904223>>>0)/4294967296,o=[],s=new b,c=new b,l=new b;for(let e of n){let t=e.mesh.geometry,n=t.attributes.position,r=t.attributes.normal,i=t.index,u=i?i.count/3:n.count/3,d=(e,t)=>i?i.getX(e*3+t):e*3+t,f=new Float32Array(u),p=0;for(let e=0;e<u;e++)s.fromBufferAttribute(n,d(e,0)),c.fromBufferAttribute(n,d(e,1)),l.fromBufferAttribute(n,d(e,2)),p+=c.sub(s).cross(l.sub(s)).length(),f[e]=p;for(let t=0,i=0;t<e.count&&i<e.count*40;i++){let i=a()*p,s=0,c=u-1;for(;s<c;){let e=s+c>>1;f[e]<i?s=e+1:c=e}let l=d(s,Math.floor(a()*3)),m=new b().fromBufferAttribute(n,l),h=new b().fromBufferAttribute(r,l);if(e.accept&&!e.accept(m))continue;let g=e.style(m,h);o.push({mesh:e.mesh,v:l,p:m,n:h,d:g.dir.clone().normalize(),pal:g.pal,size:g.size,seed:a()*1e3}),t++}}let u=o.length,d=new Float32Array(u*3),f=new Float32Array(u*3),p=new Float32Array(u*3),m=new Float32Array(u*4);o.forEach((e,t)=>m.set([e.seed,e.size[0],e.size[1],e.pal],t*4));let h=K(u,{aPos:[d,3],aDir:[f,3],aNrm:[p,3]},!0);h.setAttribute(`aData`,new r(m,4));let g=e=>t.map(t=>`vec3(${t[e].map(e=>e.toFixed(3))})`).join(`, `),_=t.length;return{mesh:q(h,G(e,{head:`
      in vec3 aPos; in vec3 aDir; in vec3 aNrm; in vec4 aData;
      const vec3 FIG_L[${_}] = vec3[${_}](${g(0)});
      const vec3 FIG_M[${_}] = vec3[${_}](${g(1)});
      const vec3 FIG_S[${_}] = vec3[${_}](${g(2)});
      const vec3 FIG_A[${_}] = vec3[${_}](${t.map(e=>`vec3(${(e[3]??e[0]).map(e=>e.toFixed(3))})`).join(`, `)});`,body:`
      void makeDab(inout Dab d) {
        vec3 Nn = normalize(aNrm);
        // on the far side of him: not ours to paint
        if (dot(Nn, normalize(cameraPosition - aPos)) < -0.05) { d.alive = 0.0; return; }
        vec4 r = hash4(aData.x);
        int k = int(aData.w + 0.5);
        float lit = sunAt(aPos + Nn * 0.08) * clamp(dot(Nn, uSunDir) * 0.85 + 0.42, 0.0, 1.0);
        vec3 c = paint3(FIG_L[k], FIG_M[k], FIG_S[k], lit, r.x);
        // warm light thrown up by the leaves on the ground, cool light from the sky into the shade
        c += uBounce * max(-Nn.y, 0.0) * (1.0 - lit);
        c = mix(c, c * vec3(0.86, 0.92, 1.18), (1.0 - lit) * max(Nn.y, 0.0) * 0.6);
        c = jitter(c, r.yzw, 0.45);
        c += FIG_A[k] * uLampCol * lampAt(aPos, Nn);
        d.pos = aPos;
        d.dir = aDir;
        d.size = aData.yz * (0.8 + 0.45 * r.y);
        d.c1 = hazed(c, aPos);
        d.c2 = hazed(jitter(c * 1.22, r.wxy, 0.5), aPos);
        d.seed = aData.x;
        d.lift = 0.3;
        d.turnabout = 1.0;
      }`,minPx:[2.5,4],maxPx:[200,400],cells:[0,6]}),5),count:u,update(){for(let e=0;e<u;e++){let t=o[e],n=t.mesh,r=e*3;s.copy(t.p),n.isSkinnedMesh&&n.applyBoneTransform(t.v,s),s.applyMatrix4(n.matrixWorld),c.copy(t.p).addScaledVector(t.n,.03),n.isSkinnedMesh&&n.applyBoneTransform(t.v,c),c.applyMatrix4(n.matrixWorld),l.copy(t.p).addScaledVector(t.d,.03),n.isSkinnedMesh&&n.applyBoneTransform(t.v,l),l.applyMatrix4(n.matrixWorld),d[r]=s.x,d[r+1]=s.y,d[r+2]=s.z,p[r]=c.x-s.x,p[r+1]=c.y-s.y,p[r+2]=c.z-s.z,f[r]=l.x-s.x,f[r+1]=l.y-s.y,f[r+2]=l.z-s.z}for(let e of[`aPos`,`aDir`,`aNrm`])h.attributes[e].needsUpdate=!0}}}var J=`
${N}
uniform vec3 uL; uniform vec3 uM; uniform vec3 uS;
uniform vec3 uL2; uniform vec3 uM2; uniform vec3 uS2;
uniform vec3 uOwn; uniform vec3 uOwn2;
uniform float uSplit;
uniform float uGrain;
in vec3 vWorld; in vec3 vN; in vec3 vBind;
layout(location = 0) out vec4 outC;
void main() {
  vec3 Nn = normalize(vN);
  if (!gl_FrontFacing) Nn = -Nn;
  float n = texture(tNoise, vBind.xy * uGrain + vBind.z * 1.7).r;
  float m = texture(tNoise, vBind.yx * uGrain * 0.31 + 0.4).g;
  float lit = sunAt(vWorld + Nn * 0.08) * clamp(dot(Nn, uSunDir) * 0.85 + 0.42, 0.0, 1.0);
  bool lower = vBind.y < uSplit + (n - 0.5) * 0.05;
  vec3 c = lower ? paint3(uL2, uM2, uS2, lit, n) : paint3(uL, uM, uS, lit, n);
  // light thrown up by the ground (warm, off the leaves), cool light from the sky into the shade
  c += uBounce * max(-Nn.y, 0.0) * (1.0 - lit);
  c = mix(c, c * vec3(0.86, 0.92, 1.18), (1.0 - lit) * max(Nn.y, 0.0) * 0.6);
  c *= 0.88 + 0.24 * m;
  if (!gl_FrontFacing) c *= 0.62;
  c += (lower ? uOwn2 : uOwn) * uLampCol * lampAt(vWorld, Nn);
  outC = vec4(hazed(c, vWorld), 1.0);
}
`;function Y(e,[t,n,r,i=t],{skinned:a=!1,lower:o=null,split:c=-10,grain:u=2.2}={}){let d=e=>({value:new f(...e)}),[p,m,h,g=p]=o??[t,n,r,i];return new l({glslVersion:s,side:2,uniforms:{...e,uL:d(t),uM:d(n),uS:d(r),uL2:d(p),uM2:d(m),uS2:d(h),uOwn:d(i),uOwn2:d(g),uSplit:{value:c},uGrain:{value:u}},vertexShader:a?`
      #include <common>
      #include <skinning_pars_vertex>
      out vec3 vWorld; out vec3 vN; out vec3 vBind;
      void main() {
        #include <beginnormal_vertex>
        #include <skinbase_vertex>
        #include <skinnormal_vertex>
        #include <begin_vertex>
        #include <skinning_vertex>
        vec4 w = modelMatrix * vec4(transformed, 1.0);
        vWorld = w.xyz;
        vN = normalize(mat3(modelMatrix) * objectNormal);
        vBind = position;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`:`
      out vec3 vWorld; out vec3 vN; out vec3 vBind;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vWorld = w.xyz;
        vN = normalize(mat3(modelMatrix) * normal);
        vBind = vec3(uv * 0.6, 0.0);
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:J})}var X={CLOAK:[[.24,.5,.74],[.11,.27,.52],[.07,.11,.3]],HAT:[[1,.88,.52],[.8,.62,.32],[.45,.34,.27]],SHIRT:[[.97,.88,.68],[.64,.54,.45],[.29,.25,.32]],TROUSERS:[[.6,.42,.27],[.36,.25,.2],[.18,.13,.18]],SKIN:[[1,.78,.58],[.76,.51,.39],[.4,.26,.28]],BOOTS:[[.48,.3,.18],[.25,.16,.13],[.12,.08,.12]],HAIR:[[.42,.28,.18],[.2,.14,.12],[.09,.07,.09]],EYES:[[.2,.15,.14],[.12,.09,.1],[.06,.05,.07]]};async function Z(e,n,r={}){let{CLOAK:i,HAT:a,SHIRT:s,TROUSERS:c,SKIN:l,BOOTS:f,HAIR:m,EYES:_}={...X,...r},v=e=>`vec3(${e[3]??e[0]})`,x=await y({base:`./figure/`,onProgress:n});for(let t of x.meshes){let n=t.name+` `+(t.material?.name??``);/eyebrow|eyelash/.test(n)?t.visible=!1:(t.material=/casualsuit/.test(n)?Y(e,s,{skinned:!0,lower:c,split:.98,grain:2.6}):/shoes/.test(n)?Y(e,f,{skinned:!0}):/short01/.test(n)?Y(e,m,{skinned:!0}):/high-poly/.test(n)?Y(e,_,{skinned:!0}):Y(e,l,{skinned:!0}),t.layers.enable(1),t.frustumCulled=!1)}let S=new t;x.object.updateMatrixWorld(!0);let C=[[0,.15],[.05,.143],[.095,.11],[.118,.05],[.125,0],[.21,-.035],[.3,-.075],[.37,-.105]].map(([e,t])=>new p(e,t)),w=new o(new h(C,22),Y(e,a,{grain:3}));w.position.set(0,1.805,-.012),w.rotation.x=-.1,w.layers.enable(1),x.object.add(w),w.updateMatrixWorld(!0),x.bones.Head.attach(w);{let t=new Float32Array(1380),n=new Float32Array(1380),r=new Float32Array(1380);for(let e=0;e<460;e++){let i=e*2.399963%(Math.PI*2),a=e%3!=0,o=a?.15+.2*(e*.618%1):.03+.085*(e*.618%1),s=a?-(o-.125)*.42:.15-o*.6;t.set([Math.cos(i)*o,s+.006,Math.sin(i)*o],e*3),n.set([-Math.sin(i),0,Math.cos(i)],e*3),r.set(a?[Math.cos(i)*.45,1,Math.sin(i)*.45]:[Math.cos(i)*.7,.7,Math.sin(i)*.7],e*3)}let i=q(K(460,{aPos:[t,3],aDir:[n,3],aNrm:[r,3]}),G(e,{head:`in vec3 aPos; in vec3 aDir; in vec3 aNrm; uniform mat4 uHat;`,body:`
        void makeDab(inout Dab d) {
          vec4 r = hash4(float(gl_InstanceID) * 3.7 + 1.0);
          vec3 P = (uHat * vec4(aPos, 1.0)).xyz;
          vec3 Nn = normalize(mat3(uHat) * aNrm);
          float lit = sunAt(P + Nn * 0.1) * clamp(dot(Nn, uSunDir) * 0.85 + 0.42, 0.0, 1.0);
          vec3 c = jitter(paint3(vec3(${a[0]}), vec3(${a[1]}), vec3(${a[2]}), lit, r.x), r.yzw, 0.4);
          c += ${v(a)} * uLampCol * lampAt(P, Nn);
          d.pos = P; d.dir = mat3(uHat) * aDir;
          d.size = vec2(0.065, 0.15) * (0.8 + 0.5 * r.y);
          d.turnabout = 1.0;
          d.c1 = hazed(c, P); d.c2 = hazed(c * 1.25, P);
          d.seed = float(gl_InstanceID); d.lift = 0.4;
        }`,uniforms:{uHat:{value:w.matrixWorld}},minPx:[3,6],maxPx:[200,400],cells:[0,4]}),5);S.add(i)}let T=new E(x.bones);T.hat=w;let{cols:D,rows:O}=T,k=new g;k.setAttribute(`position`,new d(T.p,3).setUsage(u)),k.setAttribute(`normal`,new d(T.normals,3).setUsage(u));let A=new Float32Array(D*O*2),j=[];for(let e=0;e<O;e++)for(let t=0;t<D;t++)if(A.set([t/(D-1)*2.2,e/(O-1)*1.6],(t+e*D)*2),t+1<D&&e+1<O){let n=t+e*D;j.push(n,n+D,n+1,n+1,n+D,n+D+1)}k.setAttribute(`uv`,new d(A,2)),k.setIndex(j);let M=new o(k,Y(e,i,{grain:1.4}));M.frustumCulled=!1,M.layers.enable(1);let N=(D-1)*(O-1),P=new Float32Array(N*3),F=new Float32Array(N*3),I=new Float32Array(N*3),L=K(N,{aPos:[P,3],aDir:[F,3],aNrm:[I,3]},!0),R=q(L,G(e,{head:`in vec3 aPos; in vec3 aDir; in vec3 aNrm;`,body:`
      void makeDab(inout Dab d) {
        vec4 r = hash4(float(gl_InstanceID) * 1.9 + 7.0);
        vec3 Nn = normalize(aNrm);
        if (dot(Nn, cameraPosition - aPos) < 0.0) Nn = -Nn;
        float lit = sunAt(aPos + Nn * 0.1) * clamp(dot(Nn, uSunDir) * 0.85 + 0.42, 0.0, 1.0);
        vec3 c = paint3(vec3(${i[0]}), vec3(${i[1]}), vec3(${i[2]}), lit, r.x);
        c += uBounce * max(-Nn.y, 0.0) * (1.0 - lit);
        c = jitter(c, r.yzw, 0.35);
        c += ${v(i)} * uLampCol * lampAt(aPos, Nn);
        d.pos = aPos; d.dir = aDir;
        d.size = vec2(0.105, 0.19) * (0.8 + 0.4 * r.y);
        d.turnabout = 1.0;
        d.c1 = hazed(c, aPos); d.c2 = hazed(c * 1.3 + vec3(0.0, 0.02, 0.04), aPos);
        d.seed = float(gl_InstanceID); d.lift = 0.2;
      }`,minPx:[3,7],maxPx:[200,500],cells:[0,4]}),5);S.add(R);let z=e=>x.meshes.find(t=>e.test(t.name)),B=new b(0,1,0),V=new b(1,0,0),H=new b(0,0,1),U=[],W=z(/casualsuit/),J=z(/generic/),Z=z(/shoes/),Q=z(/short01/);W&&U.push({mesh:W,count:520,style:e=>({pal:+(e.y<.98),size:[.055,.12],dir:Math.abs(e.x)>.2&&e.y>1.3?V:B})}),J&&U.push({mesh:J,count:230,accept:e=>e.y>1.52||Math.abs(e.x)>.37,style:(e,t)=>Math.abs(e.x)>.37?{pal:2,size:Math.abs(e.x)>.78?[.022,.04]:[.034,.08],dir:V}:{pal:2,size:[.028,.05],dir:new b().crossVectors(B,t).add(new b(0,.3,0))}}),Z&&U.push({mesh:Z,count:70,style:()=>({pal:3,size:[.045,.085],dir:H})}),Q&&U.push({mesh:Q,count:50,style:()=>({pal:4,size:[.035,.07],dir:B})});let $=ee(e,[s,c,l,f,m],U);S.add($.mesh);function te(e,t,n){T.update(e,t,n),$.update();let r=T.p,i=T.normals,a=0,o=(e,t,n,r,i,o,s,c,l)=>{P[a]=e,P[a+1]=t,P[a+2]=n,F[a]=r,F[a+1]=i,F[a+2]=o,I[a]=s,I[a+1]=c,I[a+2]=l,a+=3};for(let e=0;e<O-1;e++)for(let t=0;t<D-1;t++){let n=(t+e*D)*3,a=n+3,s=n+D*3,c=s+3;o((r[n]+r[a]+r[s]+r[c])/4,(r[n+1]+r[a+1]+r[s+1]+r[c+1])/4,(r[n+2]+r[a+2]+r[s+2]+r[c+2])/4,r[s]-r[n],r[s+1]-r[n+1],r[s+2]-r[n+2],i[n],i[n+1],i[n+2])}for(let e of[`aPos`,`aDir`,`aNrm`])L.attributes[e].needsUpdate=!0;k.attributes.position.needsUpdate=!0,k.attributes.normal.needsUpdate=!0}return{man:x,hat:w,cloak:T,cloakMesh:M,dabs:S,updateCloak:te}}export{q as a,k as c,M as d,E as f,G as i,D as l,Z as n,H as o,K as r,N as s,X as t,O as u};