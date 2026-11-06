import { createContext, useContext, useState } from "react";
import Navbar from "../components/Navbar";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useLanguage } from "../i18n/LanguageContext";
import data from "../data/biographie-assets.json";

/* ------------------------------------------------------------------ */
/* page "animation" : film d'animation biographique généré par IA.     */
/* Tout est généré depuis src/data/biographie-assets.json :            */
/*  - ajouter une scène = ajouter des éléments avec une nouvelle       */
/*    "categorie" commençant par "scene_" (et "ordre" pour l'ordre) ;  */
/*  - les essais vont dans une catégorie qui finit par "_essais".      */
/* Fichiers : public/media/biographie/<fichier_suggere>, les images    */
/* en .webp (le .png du JSON est remplacé automatiquement), les        */
/* vidéos en .mp4 avec une affiche <nom>-poster.webp à côté.           */
/* Un fichier manquant affiche un cadre coloré avec le titre.          */
/* Direction artistique : nuit bleue, lumière chaude du lampadaire.    */
/* ------------------------------------------------------------------ */

type Asset = {
  id: string;
  type: "image" | "video";
  categorie: string;
  titre: string;
  description: string;
  fichier_suggere: string;
  statut: string;
  age?: number;
  ordre?: number;
  couleur?: string;
  variante?: string;
  /* image servant d'affiche à la vidéo dont l'id est donné */
  poster_de?: string;
  /* autres versions de la même image, ex. { cheveux_noirs: { fichier: "variante-cheveux-noirs/..." } } */
  variantes?: Record<string, { fichier: string; elevenlabs_generation_id?: string }>;
};

const ALL_ASSETS = (data as { assets: Asset[] }).assets;

const NIGHT = "#0F1420";
const WARM = "#F5B964";

/* titres des scènes connues ; une nouvelle scène prend un titre tiré de sa catégorie */
const SCENE_TITLES: Record<string, { fr: string; en: string }> = {
  scene_derniere_lumiere: { fr: "La dernière lumière", en: "The last light" },
  scene_bouquet: { fr: "Le bouquet", en: "The bouquet" },
  scene_paris: { fr: "Paris, le soir", en: "Paris, in the evening" },
};

/* ambiance propre à une scène (sinon : nuit + lumière chaude du lampadaire) */
const SCENE_MOODS: Record<string, { accent: string; band: string; glow: string }> = {
  /* coucher de soleil : orange doré -> rose -> bleu nuit */
  scene_paris: {
    accent: "#F5A25D",
    band: "linear-gradient(90deg, #F5A25D, #E9798F, #2B3A67)",
    glow: "linear-gradient(180deg, rgba(245,162,93,0.10), rgba(233,121,143,0.07) 45%, rgba(43,58,103,0.18))",
  },
};

const STRINGS = {
  fr: {
    pageTitle: "Animée | Benjamin Morel",
    kicker: "Film d'animation · en cours de création",
    title: "Animée",
    subtitle:
      "Une biographie animée en 3D, de la naissance à 20 ans. Aucune vraie photo : chaque image et chaque plan ont été générés par IA.",
    pitchLabel: "L'idée",
    pitch:
      "Plusieurs versions de lui vivent dans sa tête : huit voix intérieures, chacune avec sa couleur et sa personnalité. Elles apparaissent autour de lui dans les moments clés de sa vie — le doute, les choix, la colère.",
    characterLabel: "Le personnage",
    characterText:
      "La planche de référence à 16 ans : quatre vues et trois expressions. Toutes les autres images partent de celle-ci pour que le personnage reste le même d'un plan à l'autre.",
    agesLabel: "De 1 à 20 ans",
    agesHint: "fais défiler →",
    age: (n: number) => (n <= 1 ? `${n} an` : `${n} ans`),
    voicesLabel: "Les voix intérieures",
    voicesText: "Huit versions de lui, une couleur chacune.",
    variant: "variante",
    scenesLabel: "Les scènes",
    makingLabel: "Making-of",
    makingText: "Le même plan généré par plusieurs modèles d'IA, pour comparer avant de choisir.",
    inProgress: "en cours",
    shot: "plan",
    stillsLabel: "Images · storyboard",
    clipsLabel: "Vidéos · animation",
    credits:
      "Images et vidéos générées avec IA sur ElevenLabs (GPT Image, Kling, Veo, MiniMax, Gemini). Projet personnel en cours.",
  },
  en: {
    pageTitle: "Animée | Benjamin Morel",
    kicker: "Animated film · work in progress",
    title: "Animée",
    subtitle:
      "An animated 3D biography, from birth to age 20. No real photos: every image and every shot was generated with AI.",
    pitchLabel: "The idea",
    pitch:
      "Several versions of him live inside his head: eight inner voices, each with its own colour and personality. They appear around him at the key moments of his life — doubt, choices, anger.",
    characterLabel: "The character",
    characterText:
      "The reference sheet at 16: four views and three expressions. Every other image starts from this one so the character stays the same from shot to shot.",
    agesLabel: "From 1 to 20",
    agesHint: "scroll →",
    age: (n: number) => (n <= 1 ? `${n} year old` : `${n} years old`),
    voicesLabel: "The inner voices",
    voicesText: "Eight versions of him, one colour each.",
    variant: "variant",
    scenesLabel: "The scenes",
    makingLabel: "Making-of",
    makingText: "The same shot generated by several AI models, to compare before choosing.",
    inProgress: "in progress",
    shot: "shot",
    stillsLabel: "Images · storyboard",
    clipsLabel: "Videos · animation",
    credits:
      "Images and videos generated with AI on ElevenLabs (GPT Image, Kling, Veo, MiniMax, Gemini). Personal project in progress.",
  },
} as const;

/* chemins des fichiers dans public/ */
const BASE = `${import.meta.env.BASE_URL}media/biographie/`;
/* variante affichée par la page (ex. "cheveux_noirs") : une image qui en a une version l'utilise */
const VariantContext = createContext<string | undefined>(undefined);
const fileOf = (a: Asset, variant?: string) => (variant && a.variantes?.[variant]?.fichier) || a.fichier_suggere;
const src = (a: Asset, variant?: string) => {
  const f = fileOf(a, variant);
  return BASE + (a.type === "image" ? f.replace(/\.png$/i, ".webp") : f);
};
const poster = (a: Asset) => {
  const still = ALL_ASSETS.find((x) => x.poster_de === a.id && x.type === "image");
  return still ? src(still) : BASE + a.fichier_suggere.replace(/\.mp4$/i, "-poster.webp");
};

const byOrder = (a: Asset, b: Asset) => (a.ordre ?? 99) - (b.ordre ?? 99);
const isScene = (c: string) => c.startsWith("scene_") && !c.endsWith("_essais");
const sceneTitle = (c: string, lang: "fr" | "en") => {
  const known = SCENE_TITLES[c];
  if (known) return known[lang];
  const words = c.replace(/^scene_/, "").replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
};
/* "Le Rebelle (tenue normale, variante 1)" -> "Le Rebelle" ; "Bouquet – Plan A : ..." -> "Plan A : ..." */
const shortTitle = (t: string) => t.replace(/\s*\(.*\)\s*$/, "").replace(/^[^–]*–\s*/, "");
/* "Bouquet – plan unique (MiniMax H3)" -> "MiniMax H3" */
const modelName = (t: string) => t.match(/\(([^)]+)\)\s*$/)?.[1] ?? t;

/* ------------------------------------------------------------------ */

const Badge = ({ label }: { label: string }) => (
  <span
    className="rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] backdrop-blur"
    style={{ background: "rgba(15,20,32,0.75)", color: WARM, border: `1px solid ${WARM}55` }}
  >
    {label}
  </span>
);

/* image 16:9 avec cadre de remplacement si le fichier manque */
const Still = ({ asset, color, className = "" }: { asset: Asset; color?: string; className?: string }) => {
  const [missing, setMissing] = useState(false);
  const variant = useContext(VariantContext);
  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-xl bg-white/5 ${className}`}>
      {missing ? (
        <div
          className="flex h-full w-full items-center justify-center p-4 text-center text-sm text-white/70"
          style={{ background: `linear-gradient(135deg, ${color ?? "#1c2436"}55, ${NIGHT})` }}
        >
          {asset.titre}
        </div>
      ) : (
        <img
          src={src(asset, variant)}
          alt={asset.description}
          loading="lazy"
          decoding="async"
          onError={() => setMissing(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
};

const Clip = ({ asset }: { asset: Asset }) => {
  const [missing, setMissing] = useState(false);
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      {missing ? (
        <div className="flex h-full w-full items-center justify-center p-4 text-center text-sm text-white/70">{asset.titre}</div>
      ) : (
        <video
          controls
          playsInline
          preload="metadata"
          poster={poster(asset)}
          onError={() => setMissing(true)}
          className="h-full w-full object-cover"
          aria-label={asset.description}
        >
          <source src={src(asset)} type="video/mp4" onError={() => setMissing(true)} />
        </video>
      )}
    </div>
  );
};

/* séparation images / vidéos dans une scène (animation 2.1) */
const KindIcon = ({ kind }: { kind: "image" | "video" }) =>
  kind === "image" ? (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m4 17 5-5 4 4 3-3 4 4" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z" />
    </svg>
  );

const MediaHeading = ({ kind, label, count }: { kind: "image" | "video"; label: string; count: number }) => (
  <div className="mb-5 flex items-center gap-3" style={{ color: WARM }}>
    <span className="flex h-8 w-8 items-center justify-center rounded-full border" style={{ borderColor: `${WARM}66` }}>
      <KindIcon kind={kind} />
    </span>
    <p className="text-xs font-medium uppercase tracking-[0.25em]">{label}</p>
    <span className="text-xs tabular-nums text-white/40">{count}</span>
  </div>
);

const SectionTitle = ({ label, text }: { label: string; text?: string }) => (
  <div className="mb-8 max-w-2xl">
    <h2 className="hero-title text-4xl md:text-6xl font-medium text-white">{label}</h2>
    {text && <p className="mt-4 text-sm md:text-base leading-relaxed text-white/60">{text}</p>}
  </div>
);

/* ------------------------------------------------------------------ */

/* versions de la page : "full" = tout le film (animation 1.1),
   "paris" = seulement la scène « Paris, le soir » (animation 2),
   "paris-full" = l'ouverture de animation 2 + tout le film (animation 2.1) */
type Version = "full" | "paris" | "paris-full";

type VersionText = Record<"fr" | "en", Partial<Record<"pageTitle" | "kicker" | "title" | "subtitle" | "pitchLabel" | "pitch", string>>>;

/* textes de l'ouverture « Paris, le soir » (animation 2 et 2.1) */
const PARIS_TEXT: VersionText = {
  fr: {
    pageTitle: "Paris, le soir | Benjamin Morel",
    kicker: "Animée · nouvelle scène",
    title: "Paris, le soir",
    subtitle: "Une scène du film d'animation, générée par IA : un soir d'automne à Paris, du coucher de soleil à l'heure bleue.",
    pitchLabel: "La scène",
    pitch:
      "En fin de journée, il arrive au Trocadéro face à la tour Eiffel, marche le long de la Seine, puis la caméra plonge dans son œil où la tour se reflète. La scène se termine au Champ-de-Mars à la tombée de la nuit, où il est enfin apaisé.",
  },
  en: {
    pageTitle: "Paris, in the evening | Benjamin Morel",
    kicker: "Animée · new scene",
    title: "Paris, in the evening",
    subtitle: "A scene from the animated film, generated with AI: an autumn evening in Paris, from sunset to the blue hour.",
    pitchLabel: "The scene",
    pitch:
      "At the end of the day he reaches the Trocadéro facing the Eiffel Tower, walks along the Seine, then the camera dives into his eye where the tower is reflected. The scene ends on the Champ-de-Mars at nightfall, where he is finally at peace.",
  },
};

/* variant : version des images à afficher ; tout ce qui n'a pas cette version est masqué,
   sauf les scènes tournées directement dans cette variante (variantScenes) */
const VERSIONS: Record<
  Version,
  {
    only?: string[];
    heroScene?: string;
    variant?: string;
    variantScenes?: string[];
    /* true : scènes présentées comme dans animation 1 (sans ambiance propre) */
    plainScenes?: boolean;
    text?: VersionText;
  }
> = {
  full: {},
  paris: { only: ["scene_paris"], heroScene: "scene_paris", text: PARIS_TEXT },
  /* ouverture d'animation 1 (« Animée », film en cours de création) sur l'image de Paris ;
     onglet et résumé de la scène Paris ; scènes présentées comme dans animation 1 */
  "paris-full": {
    heroScene: "scene_paris",
    variant: "cheveux_noirs",
    variantScenes: ["scene_paris"],
    plainScenes: true,
    text: {
      fr: {
        pageTitle: PARIS_TEXT.fr.pageTitle,
        subtitle: PARIS_TEXT.fr.subtitle,
        pitchLabel: PARIS_TEXT.fr.pitchLabel,
        pitch: PARIS_TEXT.fr.pitch,
      },
      en: {
        pageTitle: PARIS_TEXT.en.pageTitle,
        subtitle: PARIS_TEXT.en.subtitle,
        pitchLabel: PARIS_TEXT.en.pitchLabel,
        pitch: PARIS_TEXT.en.pitch,
      },
    },
  },
};

const Film = ({ version = "full" }: { version?: Version }) => {
  const { lang } = useLanguage();
  const v = VERSIONS[version];
  const s = { ...STRINGS[lang], ...v.text?.[lang] };
  useDocumentTitle(s.pageTitle);
  const ASSETS = ALL_ASSETS.filter(
    (a) =>
      (!v.only || v.only.includes(a.categorie)) &&
      (!v.variant || a.variantes?.[v.variant] || v.variantScenes?.includes(a.categorie))
  );
  const pending = (a: Asset) => !a.statut.startsWith("valide");

  const reference = ASSETS.find((a) => a.categorie === "personnage_principal");
  const hero = ASSETS.filter(
    (a) => isScene(a.categorie) && a.type === "image" && (!v.heroScene || a.categorie === v.heroScene)
  ).sort(byOrder)[0];
  const ages = ASSETS.filter((a) => a.categorie === "ages").sort((a, b) => (a.age ?? 0) - (b.age ?? 0));

  /* voix : les variantes d'une même voix (ex. voix-rebelle-1 / -2) sont regroupées sur une carte */
  const voiceAssets = ASSETS.filter((a) => a.categorie === "voix_interieures" && a.couleur);
  const voiceGroups = voiceAssets.reduce<Record<string, Asset[]>>((acc, a) => {
    const key = a.id.replace(/-\d+$/, "");
    (acc[key] ??= []).push(a);
    return acc;
  }, {});
  const groupShots = ASSETS.filter((a) => a.categorie === "voix_interieures" && !a.couleur);

  const sceneKeys = [...new Set(ASSETS.map((a) => a.categorie).filter(isScene))];
  const trials = ASSETS.filter((a) => a.categorie.endsWith("_essais"));

  return (
    <VariantContext.Provider value={v.variant}>
    <div className="min-h-screen w-full text-white" style={{ background: NIGHT }}>
      <Navbar />

      {/* ouverture : premier plan de la première scène, plein écran */}
      <section className="relative flex min-h-screen items-end overflow-hidden">
        {hero && (
          <img
            src={src(hero, v.variant)}
            alt={hero.description}
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
          />
        )}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to top, ${NIGHT} 5%, ${NIGHT}cc 35%, transparent 75%)` }}
        />
        <div className="relative z-10 w-full px-6 md:px-16 pb-20 md:pb-28">
          <p className="text-xs uppercase tracking-[0.3em]" style={{ color: WARM }}>
            {s.kicker}
          </p>
          <h1 className="hero-title mt-4 text-[22vw] md:text-[12vw] font-medium leading-none text-white">{s.title}</h1>
          <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-white/75">{s.subtitle}</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-6 md:px-16">
        {/* l'idée */}
        <section className="py-20 md:py-28 grid gap-10 md:grid-cols-[1fr_2fr]">
          <p className="text-xs uppercase tracking-[0.3em] pt-3" style={{ color: WARM }}>
            {s.pitchLabel}
          </p>
          <p className="font-display text-3xl md:text-5xl font-light leading-[1.2] text-white/90">{s.pitch}</p>
        </section>

        {/* le personnage */}
        {reference && (
          <section className="py-16">
            <SectionTitle label={s.characterLabel} text={s.characterText} />
            <div className="relative">
              <Still asset={reference} className="rounded-2xl" />
              {pending(reference) && (
                <div className="absolute left-4 top-4">
                  <Badge label={s.inProgress} />
                </div>
              )}
            </div>
            <p className="mt-4 max-w-2xl text-sm text-white/50">{reference.description}</p>
          </section>
        )}

        {/* frise des âges */}
        {ages.length > 0 && (
          <section className="py-16">
            <div className="flex items-end justify-between gap-4">
              <SectionTitle label={s.agesLabel} />
              <p className="mb-8 hidden md:block text-xs uppercase tracking-[0.2em] text-white/40">{s.agesHint}</p>
            </div>
            <div className="-mx-6 md:-mx-16 overflow-x-auto pb-6 [scrollbar-width:thin]">
              <ol className="flex gap-5 px-6 md:px-16 w-max">
                {ages.map((a) => (
                  <li key={a.id} className="w-[78vw] sm:w-[420px] shrink-0">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full" style={{ background: WARM }} />
                      <span className="text-sm font-medium tabular-nums" style={{ color: WARM }}>
                        {a.age !== undefined ? s.age(a.age) : a.titre}
                      </span>
                      <span className="h-px flex-1 bg-white/10" />
                    </div>
                    <Still asset={a} />
                    <p className="mt-3 text-sm text-white/60">{a.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* voix intérieures */}
        {voiceAssets.length > 0 && (
          <section className="py-16">
            <SectionTitle label={s.voicesLabel} text={s.voicesText} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(voiceGroups).map(([key, variants]) => (
                <VoiceCard key={key} variants={variants} variantLabel={s.variant} pendingLabel={s.inProgress} />
              ))}
            </div>
            {groupShots.length > 0 && (
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {groupShots.map((a) => (
                  <figure key={a.id}>
                    <Still asset={a} />
                    <figcaption className="mt-3 text-sm text-white/50">{a.titre}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </section>
        )}

        {/* scènes : storyboard (images dans l'ordre) puis les plans vidéo */}
        {sceneKeys.length > 0 && (
          <section className="py-16">
            <SectionTitle label={s.scenesLabel} />
            <div className="flex flex-col gap-24">
              {sceneKeys.map((key, i) => {
                const items = ASSETS.filter((a) => a.categorie === key);
                const stills = items.filter((a) => a.type === "image").sort(byOrder);
                const clips = items.filter((a) => a.type === "video").sort(byOrder);
                const mood = v.plainScenes ? undefined : SCENE_MOODS[key];
                return (
                  <article
                    key={key}
                    className={mood ? "-mx-4 md:-mx-8 rounded-3xl px-4 md:px-8 pb-10" : undefined}
                    style={mood ? { background: mood.glow } : undefined}
                  >
                    {mood && <div className="h-1 w-full rounded-full" style={{ background: mood.band }} />}
                    <div className={`mb-6 flex items-baseline gap-4 pt-6 ${mood ? "" : "border-t border-white/10"}`}>
                      <span className="text-sm tabular-nums" style={{ color: mood?.accent ?? WARM }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-3xl md:text-4xl font-light text-white">{sceneTitle(key, lang)}</h3>
                    </div>

                    {stills.length > 0 && v.plainScenes && (
                      <MediaHeading kind="image" label={s.stillsLabel} count={stills.length} />
                    )}
                    {stills.length > 0 && (
                      <div className="grid gap-5 sm:grid-cols-2">
                        {stills.map((a) => (
                          <figure key={a.id}>
                            <div className="relative">
                              <Still asset={a} />
                              {pending(a) && (
                                <div className="absolute left-3 top-3">
                                  <Badge label={s.inProgress} />
                                </div>
                              )}
                            </div>
                            <figcaption className="mt-3">
                              <p className="text-sm font-medium text-white">{shortTitle(a.titre)}</p>
                              <p className="mt-1 text-sm text-white/55">{a.description}</p>
                            </figcaption>
                          </figure>
                        ))}
                      </div>
                    )}

                    {clips.length > 0 && v.plainScenes && (
                      <div className={stills.length ? "mt-16 border-t border-white/10 pt-10" : ""}>
                        <MediaHeading kind="video" label={s.clipsLabel} count={clips.length} />
                      </div>
                    )}
                    {clips.length > 0 && (
                      <div
                        className={`grid gap-5 ${clips.length > 1 ? "md:grid-cols-2" : ""} ${
                          stills.length && !v.plainScenes ? "mt-10" : ""
                        }`}
                      >
                        {clips.map((a) => (
                          <figure key={a.id}>
                            <div className="relative">
                              <Clip asset={a} />
                              {pending(a) && (
                                <div className="pointer-events-none absolute left-3 top-3">
                                  <Badge label={s.inProgress} />
                                </div>
                              )}
                            </div>
                            <figcaption className="mt-3">
                              <p className="text-sm font-medium text-white">{shortTitle(a.titre)}</p>
                              <p className="mt-1 text-sm text-white/55">{a.description}</p>
                            </figcaption>
                          </figure>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* making-of : essais sur plusieurs modèles */}
        {trials.length > 0 && (
          <section className="py-16">
            <SectionTitle label={s.makingLabel} text={s.makingText} />
            <div className="grid gap-6 md:grid-cols-3">
              {trials.map((a) => (
                <figure key={a.id}>
                  <Clip asset={a} />
                  <figcaption className="mt-3">
                    <p className="text-sm font-medium" style={{ color: WARM }}>
                      {modelName(a.titre)}
                    </p>
                    <p className="mt-1 text-sm text-white/55">{a.description}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <p className="border-t border-white/10 py-12 text-xs leading-relaxed text-white/40">{s.credits}</p>
      </div>
    </div>
    </VariantContext.Provider>
  );
};

/* carte d'une voix : bordure et lueur de sa couleur au survol, boutons si plusieurs variantes */
const VoiceCard = ({ variants, variantLabel, pendingLabel }: { variants: Asset[]; variantLabel: string; pendingLabel: string }) => {
  const [index, setIndex] = useState(0);
  const a = variants[index];
  const color = a.couleur ?? WARM;
  return (
    <div
      className="group rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition-all duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0"
      style={{ ["--voice" as string]: color }}
    >
      <div className="relative transition-shadow duration-300 rounded-xl group-hover:shadow-[0_0_40px_-8px_var(--voice)]">
        <Still asset={a} color={color} />
        {!a.statut.startsWith("valide") && (
          <div className="absolute left-2 top-2">
            <Badge label={pendingLabel} />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2 px-1">
        <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: color }} />
        <p className="text-sm font-medium text-white">{shortTitle(a.titre)}</p>
        {variants.length > 1 && (
          <div className="ml-auto flex gap-1">
            {variants.map((v, i) => (
              <button
                key={v.id}
                onClick={() => setIndex(i)}
                aria-label={`${variantLabel} ${i + 1}`}
                aria-pressed={i === index}
                className={`h-6 w-6 rounded-full text-[11px] transition-colors ${
                  i === index ? "text-[#0F1420]" : "border border-white/20 text-white/60 hover:text-white"
                }`}
                style={i === index ? { background: color } : undefined}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="mt-2 px-1 pb-1 text-xs leading-relaxed text-white/55">{a.description}</p>
      {/* liseré de la couleur de la voix, visible au survol */}
      <div
        className="mt-2 h-0.5 w-0 rounded-full transition-all duration-300 group-hover:w-full"
        style={{ background: color }}
      />
    </div>
  );
};

export default Film;
