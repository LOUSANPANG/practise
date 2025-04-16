import antfu from '@antfu/eslint-config'
import pluginQuery from '@tanstack/eslint-plugin-query'
import reactCompiler from 'eslint-plugin-react-compiler'

export default antfu(
  {
    plugins: {
      'react-compiler': reactCompiler,
      '@tanstack/query': pluginQuery,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
      '@tanstack/query/exhaustive-deps': 'error',
    },
  }
)
