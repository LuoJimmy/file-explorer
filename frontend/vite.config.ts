import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath, URL } from 'node:url'
import viteCompression from 'vite-plugin-compression'
// import viteImagemin from 'vite-plugin-imagemin'
import { visualizer } from 'rollup-plugin-visualizer'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const isAnalyze = mode === 'analyze'

  return {
    plugins: [
      vue(),
      vueJsx(),
      // Gzip 压缩
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz'
      }),
      // 图片压缩
      // viteImagemin({
      //   gifsicle: {
      //     optimizationLevel: 7,
      //     interlaced: false
      //   },
      //   optipng: {
      //     optimizationLevel: 7
      //   },
      //   mozjpeg: {
      //     quality: 80
      //   },
      //   pngquant: {
      //     quality: [0.8, 0.9],
      //     speed: 4
      //   },
      //   svgo: {
      //     plugins: [
      //       {
      //         name: 'removeViewBox'
      //       },
      //       {
      //         name: 'removeEmptyAttrs',
      //         active: false
      //       }
      //     ]
      //   }
      // }),
      // 构建分析
      isAnalyze && visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: 'dist/stats.html'
      }),
      Components({
        // 自动导入组件
        dirs: ['src/components'],
        // 组件有效扩展名
        extensions: ['vue'],
        // 配置文件生成位置
        dts: 'src/components.d.ts'
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      port: 8080,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3000',
          changeOrigin: true
        }
      }
    },
    build: {
      target: 'es2015',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'remix-icon': ['@remixicon/vue']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['@remixicon/vue']
    }
  }
})
