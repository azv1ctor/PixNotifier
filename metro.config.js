const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

const {
  resolver: { sourceExts, assetExts },
} = defaultConfig;

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    extraNodeModules: {
      crypto: require.resolve('react-native-crypto'),
      util: require.resolve('util'),
      events: require.resolve('events'),
      net: require.resolve('react-native-tcp-socket'),
      tls: require.resolve('react-native-tcp-socket'),
      buffer: require.resolve('buffer')
    }
  },
};

module.exports = mergeConfig(defaultConfig, config);
