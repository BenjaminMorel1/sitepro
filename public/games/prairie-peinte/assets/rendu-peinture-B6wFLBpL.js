import{A as e,C as t,H as n,I as r,J as i,L as a,M as o,O as s,P as ee,R as c,S as l,W as te,Y as u,Z as d,b as f,d as p,et as m,i as h,m as g,tt as ne}from"./man-C3WYLH7W.js";import{a as _,d as v,i as y,n as b,o as re,r as x,s as S}from"./figure-5IQIrrs-.js";import{n as C,r as w,t as ie}from"./finish-D6-JnQMz.js";import{a as T,c as E,l as D,n as O,s as k}from"./monde-CdlAoqs9.js";import{a as A,i as j,n as M,r as N,t as P}from"./volumes-Csg-MmZ6.js";async function F({conteneur:F,monde:I}){let L=new h({antialias:!1,powerPreference:`high-performance`});L.setPixelRatio(Math.min(devicePixelRatio,1.5)),L.setSize(innerWidth,innerHeight),L.autoClear=!1,L.outputColorSpace=o,F.appendChild(L.domElement);let R=new ne(...D.soleil).normalize(),z=v();z.tBrush.value=re(),z.uSunDir.value.copy(R),z.uHaze.value.setRGB(...k.cielBas),z.uHazeSun.value.setRGB(...k.cielSoleil),z.uHazeDensity.value=D.brume,z.uImpasto.value=D.epaisseur,z.uGlazeMul.value.setRGB(.52,.5,.62),z.uGlazeAdd.value.setRGB(.02,.03,.07),z.uBounce.value.setRGB(.05,.08,0);{let t=new g(I.hauteurs,O,O,te,f);t.minFilter=t.magFilter=e,t.needsUpdate=!0;let n=new g(I.carte,O,O);n.minFilter=n.magFilter=e,n.needsUpdate=!0,z.tHeight.value=t,z.tLand.value=n}let B=new i,V=e=>`vec3(${e.map(e=>e.toFixed(3)).join(`, `)})`,H=(e,t)=>`const vec3 ${e}_L = ${V(t[0])}; const vec3 ${e}_M = ${V(t[1])}; const vec3 ${e}_S = ${V(t[2])};`,U=P.length,W=(e,t)=>`const vec3 ${e}[${U}] = vec3[${U}](${P.map(e=>V(E[e][t])).join(`, `)});`,G=`
    ${H(`HERBE`,E.herbe)} ${H(`SECHE`,E.herbeSeche)} ${H(`TERRE`,E.terre)}
    const vec3 FLEUR_A = ${V(k.fleurs[0])}; const vec3 FLEUR_B = ${V(k.fleurs[1])}; const vec3 FLEUR_C = ${V(k.fleurs[2])};
    const vec3 SOUS_COUCHE = ${V(k.sousCouche)};
    const vec3 CIEL_HAUT = ${V(k.cielHaut)};
    ${W(`MAT_L`,0)} ${W(`MAT_M`,1)} ${W(`MAT_S`,2)}
  `;{let e=new n(512,512,384,384);e.rotateX(-Math.PI/2);let t=e.attributes.position;for(let e=0;e<t.count;e++)t.setY(e,I.hauteurEn(t.getX(e),t.getZ(e))-.04);let r=new a(e,new u({glslVersion:l,uniforms:z,vertexShader:`
        ${S}
        out vec3 vMonde;
        void main() { vMonde = position; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }`,fragmentShader:`
        ${S}
        ${G}
        in vec3 vMonde;
        layout(location = 0) out vec4 outC;
        void main() {
          // demandé par petits carrés irréguliers, pour que même le fond soit fait de touches
          vec2 carre = floor(vMonde.xz / 0.35 + (texture(tNoise, vMonde.xz / 2.3).rg - 0.5) * 1.8) * 0.35;
          float soleil = step(0.5, woodSunAt(vec3(carre.x, vMonde.y + 0.2, carre.y)));
          vec3 c = mix(SOUS_COUCHE, SOUS_COUCHE * 2.1 + vec3(0.06, 0.05, 0.0), soleil);
          c = mix(c, mix(TERRE_S, TERRE_M, soleil), texture(tLand, landUv(vMonde.xz)).r);
          outC = vec4(hazed(c * (0.8 + 0.3 * texture(tNoise, vMonde.xz / 9.0).r), vMonde), 1.0);
        }`}));r.frustumCulled=!1,B.add(r)}let K=w(z,{head:G,body:`
  void makeDab(inout Dab d) {
    vec2 cell; float sub;
    if (!ringCell(0.0, true, cell, sub)) { d.alive = 0.0; return; }     // quel petit carré de sol suis-je ?
    vec4 r = hash4(cell, sub * 3.0 + 1.0);                                // quatre nombres au hasard, toujours les mêmes ici
    vec4 q = hash4(cell + 31.7, sub + 11.0);
    vec2 xz = (cell + r.xy) * uCell0;
    float lod;
    d.alive = ringGrow(distance(xz, cameraPosition.xz), lod);             // au loin : moins de touches, plus grandes
    if (d.alive <= 0.0) return;
    vec3 P = vec3(xz.x, heightAt(xz), xz.y);
    vec3 Nn = normalAt(xz);
    vec4 m = texture(tLand, landUv(xz));                                  // la carte : chemin, herbe sèche, fleurs
    float lit = woodSunAt(P + vec3(0.0, 0.2, 0.0)) * clamp(dot(Nn, uSunDir) * 1.9, 0.0, 1.0);
    float seche = smoothstep(0.6, 0.95, m.g + (q.x - 0.5) * 0.5);
    vec3 c1 = mix(paint3(HERBE_L, HERBE_M, HERBE_S, lit, q.y), paint3(SECHE_L, SECHE_M, SECHE_S, lit, q.y), seche);
    vec3 c2 = mix(paint3(HERBE_L, HERBE_M, HERBE_S, lit, q.w), paint3(SECHE_L, SECHE_M, SECHE_S, lit, q.w), 1.0 - seche);
    float chemin = step(q.z, m.r * 1.15);
    c1 = mix(c1, paint3(TERRE_L, TERRE_M, TERRE_S, lit, q.y), chemin);
    c2 = mix(c2, paint3(TERRE_L, TERRE_M, TERRE_S, lit, q.w) * 1.08, chemin);
    float a = (texture(tNoise, xz / 9.0).a * 1.1 + q.y * 0.5) * TAU;      // les voisines se couchent à peu près dans le même sens
    d.dir = vec3(cos(a), 0.0, sin(a));
    d.pos = P;
    d.size = uCell0 * vec2(1.1 + 0.5 * r.z, 1.9 + 0.9 * r.w) * lod;
    d.c1 = hazed(jitter(c1, r.wzy, 0.45), P);                             // jitter : chaque touche est mélangée un peu autrement
    d.c2 = hazed(jitter(c2, q.wzy, 0.45), P);                             // hazed : la brume des lointains
    d.seed = dot(cell, vec2(1.0, 57.0)) + sub * 0.37;
    d.turnabout = 1.0;
    d.lie = 1.0;                                                          // couchée à plat sur le sol
    d.nrm = Nn;
    d.height = (0.03 + 0.07 * q.z) * pow(lod, 0.35);
    d.glaze = 1.0;                                                        // l'ombre du personnage glisse dessus
  }`,per:3,n:192,cell0:.14,levels:6,minPx:[5,9],maxPx:[4e3,4e3],cells:[0,8]}),q=w(z,{head:G,body:`
  void makeDab(inout Dab d) {
    vec2 cell; float sub;
    if (!ringCell(40.0, false, cell, sub)) { d.alive = 0.0; return; }
    vec4 r = hash4(cell, 40.0);
    vec4 q = hash4(cell + 17.3, 51.0);
    vec4 f = hash4(cell + sub * 7.7 + 3.1, sub * 13.0 + 3.0);            // propre à chaque brin de la touffe
    vec2 pied = (cell + r.xy) * uCell0;
    float lod;
    d.alive = ringGrow(distance(pied, cameraPosition.xz), lod);
    if (d.alive <= 0.0) return;
    vec4 m = texture(tLand, landUv(pied));
    if (q.x > (0.75 - 0.3 * m.g) * (1.0 - m.r)) { d.alive = 0.0; return; } // pas de touffe sur le chemin
    float fleur = step(1.0 - 0.5 * m.b, q.z) * step(4.5, sub);            // dans les coins fleuris, le dernier brin est une fleur
    float grand = min(pow(lod, 0.6), 2.2);
    float a = (sub + f.x) / 6.0 * TAU + r.z * TAU;
    vec2 eventail = vec2(cos(a), sin(a));
    vec2 xz = pied + eventail * 0.05 * grand;
    vec3 P = vec3(xz.x, heightAt(xz), xz.y);
    float rafale = gustAt(xz);
    float lit = sunAt(P + vec3(0.0, 0.3, 0.0));
    vec3 c = mix(paint3(HERBE_L, HERBE_M, HERBE_S, lit, f.w), paint3(SECHE_L, SECHE_M, SECHE_S, lit, f.w), step(0.8, m.g + (f.y - 0.5) * 0.6));
    float balance = sin(uTime * (1.6 + f.z) + f.w * 40.0) * (0.04 + 0.1 * rafale);
    vec2 penche = eventail * (0.15 + 0.45 * f.y) + uWind.xy * (0.1 + 0.6 * rafale + balance);
    d.dir = normalize(vec3(penche.x, 1.0, penche.y));
    d.pos = P - vec3(0.0, 0.02, 0.0);
    d.size = vec2(0.045 * grand * (0.8 + 0.5 * f.x), mix(0.35, 0.75, f.z));
    d.cell = floor(f.y * 2.99);
    if (fleur > 0.5) {
      c = (q.y < 0.4 ? FLEUR_A : q.y < 0.75 ? FLEUR_B : FLEUR_C) * mix(0.55, 1.0, lit);
      d.pos.y += mix(0.3, 0.6, f.z);
      d.size = vec2(0.11, 0.12) * grand;
      d.cell = 4.0 + floor(f.y * 3.99);
      d.base = 0.0;
    } else d.base = 1.0;                                                  // tenue par le pied, comme un brin d'herbe
    c = jitter(c, f.zwx, 0.5);
    d.c1 = hazed(c, P);
    d.c2 = hazed(jitter(c * 1.2, f.xzy, 0.7), P);
    d.seed = dot(cell, vec2(1.0, 57.0)) + sub * 0.37 + 0.5;
    d.lift = 0.25;
  }`,per:6,n:96,cell0:.42,levels:4,minPx:[2.5,12],maxPx:[60,420],cells:[0,8]});B.add(K.group,q.group);let J=(e=[0,0,0])=>new u({glslVersion:l,uniforms:{...z,uCouleur:{value:new p(...e)}},vertexShader:`
      ${S}
      uniform vec3 uCouleur;
      out vec3 vMonde; out vec3 vTeinte;
      void main() {
        #ifdef USE_INSTANCING
          vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
        #else
          vec4 w = modelMatrix * vec4(position, 1.0);
        #endif
        #ifdef USE_INSTANCING_COLOR
          vTeinte = instanceColor;
        #else
          vTeinte = uCouleur;
        #endif
        vMonde = w.xyz; gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:`
      ${S}
      in vec3 vMonde; in vec3 vTeinte;
      layout(location = 0) out vec4 outC;
      void main() { outC = vec4(hazed(vTeinte, vMonde), 1.0); }`}),Y=e=>e.lumineux?E[e.matiere][1]:E[e.matiere][2].map(e=>e*.85);function X(e,t=new r,n=77){let i=A(e,T(n)),a=x(i.nombre,{aPos:[i.pos,3],aNrm:[i.nrm,3],aDir:[i.dir,3],aTaille:[i.taille,3],aInfo:[i.info,4]});return _(a,y(z,{head:G+`in vec3 aPos; in vec3 aNrm; in vec3 aDir; in vec3 aTaille; in vec4 aInfo; uniform mat4 uPlace;`,body:`
        void makeDab(inout Dab d) {
          vec4 r = hash4(aInfo.x);
          vec3 P = (uPlace * vec4(aPos, 1.0)).xyz;
          vec3 Nn = normalize(mat3(uPlace) * aNrm);
          if (aInfo.z > 0.5) {                                             // le feuillage remue, plus fort dans les rafales
            float rafale = gustAt(P.xz);
            P += vec3(uWind.x, 0.25, uWind.y) * sin(uTime * (1.3 + r.x * 1.4) + r.y * 40.0) * (0.03 + 0.14 * rafale);
          }
          // éclairée si la surface regarde le soleil et si rien ne lui fait d'ombre ; le dessus prend toujours un peu de ciel
          float lit = sunAt(P + Nn * (0.12 + aTaille.y * 0.55)) * smoothstep(-0.3, 0.55, dot(Nn, uSunDir)) + 0.14 * max(Nn.y, 0.0);
          lit = max(lit, 0.16 + 0.24 * r.w);                                // à l'ombre, le ciel éclaire encore : ombre et demi-teinte se mêlent
          int k = int(aInfo.y + 0.5);                                       // le numéro de la matière
          vec3 c = paint3(MAT_L[k], MAT_M[k], MAT_S[k], lit, r.z);
          if (aInfo.w > 0.5) c = mix(MAT_M[k], MAT_L[k] * 1.1, 0.5 + 0.5 * sin(uTime * 3.0 + r.x * TAU));   // lumineux : scintille, ignore l'ombre
          d.pos = P;
          d.dir = mat3(uPlace) * aDir;
          d.size = aTaille.xy;
          d.cell = aTaille.z;                                               // l'empreinte de pinceau de cette matière
          d.c1 = hazed(jitter(c, r.yzw, 0.45), P);
          d.c2 = hazed(jitter(c * 1.2, r.wxy, 0.55), P);
          d.seed = aInfo.x;
        }`,uniforms:{uPlace:{value:t}},minPx:[3,6],maxPx:[300,600]}),1)}let Z=new i;{let e=new r,t=new p;for(let[n,r]of Object.entries(j(I.volumes))){if(!r.length)continue;let i=new s(M(n),J(),r.length),a=new s(M(n),new c,r.length);r.forEach((n,r)=>{i.setMatrixAt(r,N(n,n.vent?.2:.04,e)),i.setColorAt(r,t.setRGB(...Y(n))),a.setMatrixAt(r,N(n,n.vent?.1:0,e))}),i.frustumCulled=a.frustumCulled=!1,B.add(i),Z.add(a)}B.add(X(I.volumes))}{let e=G+`
      vec3 couleurDuCiel(vec3 v) {
        float versSoleil = max(dot(v, uSunDir), 0.0);
        vec3 c = mix(airColour(v), mix(CIEL_HAUT, CIEL_HAUT * 1.1 + 0.1, versSoleil * versSoleil), smoothstep(0.0, 0.7, v.y));
        float nuage = smoothstep(0.52, 0.72, texture(tNoise, v.xz / (v.y + 0.35) * 0.16 + 0.3).b) * smoothstep(0.03, 0.3, v.y);
        c = mix(c, mix(vec3(0.97, 0.95, 0.9), vec3(0.76, 0.78, 0.86), smoothstep(0.6, 0.2, v.y) * 0.6), nuage * 0.85);
        return mix(c, vec3(1.0, 0.96, 0.8), pow(versSoleil, 26.0) * 0.9);
      }`,t=new a(new d(900,24,16),new u({glslVersion:l,uniforms:z,side:1,depthTest:!1,depthWrite:!1,vertexShader:`
        ${S}
        out vec3 vDir;
        void main() { vDir = position; gl_Position = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.0); }`,fragmentShader:`
        ${S}
        ${e}
        in vec3 vDir;
        layout(location = 0) out vec4 outC;
        void main() { outC = vec4(couleurDuCiel(normalize(vDir)) * 0.97, 1.0); }`}));t.frustumCulled=!1,t.renderOrder=-10;let n=2600,r=T(515),i=new Float32Array(n*4);for(let e=0;e<n;e++){let t=r()*Math.PI*2,n=-.08+r()**1.4*1.08,a=Math.sqrt(Math.max(0,1-n*n));i.set([Math.cos(t)*a,n,Math.sin(t)*a,r()*1e3],e*4)}let o=_(x(n,{aDir:[i,4]}),y(z,{head:e+`in vec4 aDir;`,body:`
        void makeDab(inout Dab d) {
          vec4 r = hash4(aDir.w);
          vec3 v = normalize(aDir.xyz);
          d.pos = cameraPosition + v * 800.0;
          d.dir = normalize(normalize(cross(vec3(0.0, 1.0, 0.0), v)) + vec3(0.0, (r.x - 0.5) * 0.5, 0.0));   // les touches du ciel sont couchées
          d.size = vec2(46.0 + 40.0 * r.y, 150.0 + 130.0 * r.z);
          vec3 c = couleurDuCiel(v);
          d.c1 = jitter(c, r.yzw, 0.2);
          d.c2 = jitter(c * 1.05, r.wxy, 0.28);
          d.seed = aDir.w;
          d.lift = 0.0;
        }`,minPx:[10,20],maxPx:[900,1800],cells:[0,8],depthTest:!1,depthWrite:!1}),-9);B.add(t,o)}let ae=C(L,z,Z,{sun:R,size:[4096,4096],box:[215,215],centre:[0,6,0],back:400,near:10,far:900}),Q=ie(L,z);Q.uniforms.uShafts.value=D.rayons,Q.uniforms.uCanvas.value=D.toile;let $=new m,oe=1e3;return{nom:`peinture`,renderer:L,scene:B,async creerPersonnage(e){let t=await b(z,e);return B.add(t.man.object,t.cloakMesh,t.dabs),{man:t.man,apres(e,n,r){t.updateCloak(e,n,r)},montrer(e){t.man.object.visible=t.cloakMesh.visible=t.dabs.visible=e}}},creerActeur(e){let n=new t;for(let t of e){let e=new a(M(t.type),J(Y(t)));N(t,.12,e.matrix),e.matrixAutoUpdate=!1,n.add(e)}let r=X(e,n.matrixWorld,oe++);return B.add(n,r),{placer(e,t,r,i=0,a=0){n.position.set(e,t,r),n.rotation.set(a,i,0,`YXZ`),n.updateMatrixWorld(!0)},montrer(e){n.visible=r.visible=e}}},image(e,t,n,r){L.getDrawingBufferSize($),z.uTime.value=t,z.uPixel.value=2*Math.tan(ee.degToRad(n.fov)/2)/$.y,z.uFocus.value.copy(r),K.follow(n.position.x,n.position.z),q.follow(n.position.x,n.position.z),ae.update(B,r),Q.render(B,n)},redimensionner(){L.setSize(innerWidth,innerHeight),Q.resize()}}}export{F as creerRendu};