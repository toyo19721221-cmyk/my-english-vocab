import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // 範囲を広げて確実に読み込ませます
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;