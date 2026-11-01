// Types minimaux pour Flickity 3 (le paquet n'en fournit pas) : seulement ce que le site utilise.
declare module "flickity" {
  export interface FlickityOptions {
    accessibility?: boolean;
    adaptiveHeight?: boolean;
    autoPlay?: boolean | number;
    cellAlign?: "left" | "center" | "right";
    contain?: boolean;
    draggable?: boolean | string;
    dragThreshold?: number;
    freeScrollFriction?: number;
    friction?: number;
    pageDots?: boolean;
    pauseAutoPlayOnHover?: boolean;
    percentPosition?: boolean;
    prevNextButtons?: boolean;
    resize?: boolean;
    selectedAttraction?: number;
    setGallerySize?: boolean;
    wrapAround?: boolean;
  }

  export default class Flickity {
    constructor(element: Element | string, options?: FlickityOptions);
    destroy(): void;
    resize(): void;
    select(index: number, isWrapped?: boolean, isInstant?: boolean): void;
  }
}
