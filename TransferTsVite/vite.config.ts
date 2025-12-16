import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import svgr from "vite-plugin-svgr";
export default defineConfig({
  plugins: [
    tailwindcss(),
      svgr({
          svgrOptions: {
              icon: true,
              // This will transform your SVG to a React component
              exportType: "named",
              namedExport: "ReactComponent",
          },
      }),
  ],
})