import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      // ts-jest configuration
      tsconfig: 'tsconfig.test.json',
    },
  },
}
export default config
