module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/projects/'],
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
  setupFiles: ['./__testSetup__/index.js'],
};
