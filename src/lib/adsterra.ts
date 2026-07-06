// Adsterra ad configuration for streamersize.com.
// All ad units are served from the same Adsterra delivery domain.
// Swap the keys/URLs here to rotate ad units — components read from this file.

export const ADSTERRA_DOMAIN = "https://disintegratehesitate.com";

export interface AdsterraBannerConfig {
  key: string;
  width: number;
  height: number;
}

// Display banners (iframe format). invoke.js lives at `${ADSTERRA_DOMAIN}/${key}/invoke.js`.
export const ADSTERRA_BANNER_468: AdsterraBannerConfig = {
  key: "9af8ff9d8ccd95c3570917eceaefe730",
  width: 468,
  height: 60,
};

export const ADSTERRA_BANNER_320: AdsterraBannerConfig = {
  key: "76a29c51fd664d8470cd15eca69adaff",
  width: 320,
  height: 50,
};

// Native Banner — an async script populates `#container-<containerId>`.
// invoke.js lives at `${ADSTERRA_DOMAIN}/${containerId}/invoke.js`.
export const ADSTERRA_NATIVE = {
  containerId: "0c4770880772b5a3ef78a5c7e4b19144",
};

// Direct link (Smartlink) — used as a sponsored hyperlink/button.
export const ADSTERRA_SMARTLINK =
  "https://disintegratehesitate.com/durwkaba?key=15970895e5bd4a63a89d9c00921f8d82";

// Popunder — a single global script, loaded once in the root layout.
export const ADSTERRA_POPUNDER_SRC =
  "https://disintegratehesitate.com/9d/cd/1b/9dcd1b7a5b74f3da731a95842a1e880a.js";
