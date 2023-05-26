module.exports = {
  verbose: true,
  collectCoverage: true,
  coverageProvider: 'v8',
  projects: [
    '<rootDir>/.jest/auth.config.js',
    '<rootDir>/.jest/rtorrent.config.js',
    '<rootDir>/.jest/qbittorrent.config.js',
    '<rootDir>/.jest/transmission.config.js',
  ],
};
