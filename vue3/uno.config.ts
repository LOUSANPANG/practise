// uno.config.ts
import { defineConfig } from 'unocss'
import {
  presetUno,
  presetIcons,
  presetWebFonts,
} from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'

export default defineConfig({
  presets: [
    presetUno(),
    
    presetIcons({
      extraProperties: {
        'vertical-align': 'middle',
        'display': 'inline-block'
      },
      collections: {
        'my-svg': FileSystemIconLoader('./src/assets/svg', svg => svg.replace(/#fff/, 'currentColor'))
      }
    }),

    presetWebFonts({
      provider: 'google',
      fonts: {
        Monofett: 'Monofett',
      }
    }),

  ]
})