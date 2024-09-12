import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Uguisu",
    // biome-ignore lint/style/useNamingConvention: 外部仕様のため
    short_name: "Uguisu",
    description: "A WYSIWYG editor",
    // biome-ignore lint/style/useNamingConvention: 外部仕様のため
    start_url: "/",
    display: "standalone",
    lang: "ja",
    // biome-ignore lint/style/useNamingConvention: 外部仕様のため
    theme_color: "#00bf63",
    // biome-ignore lint/style/useNamingConvention: 外部仕様のため
    background_color: "#ffffff",
    icons: [
      {
        src: "./android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
