import antfu from '@antfu/eslint-config'
import reactCompiler from 'eslint-plugin-react-compiler'

export default antfu({
  plugins: {
    'react-compiler': reactCompiler,
  },
  rules: {
    'react-compiler/react-compiler': 'error',
  },
})
