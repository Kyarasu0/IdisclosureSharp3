/// <reference path="./types/photon.d.ts" />

declare global {
  interface Window {
    Photon: typeof Photon;
  }
}

export {};
