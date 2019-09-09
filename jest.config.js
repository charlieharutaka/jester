module.exports = {
  reporters: ['<rootDir>/dist/jester-reporter.js'],
  testMatch: ["<rootDir>tests/**/*.[jt]s?(x)", "<rootDir>tests/*.[jt]s?(x)", "<rootDir>/**/?(*.)+(spec|test).[jt]s?(x)"],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
}
