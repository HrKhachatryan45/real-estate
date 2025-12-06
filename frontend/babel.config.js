module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',            // @ points to project root
            '@assets': './assets', // optional: @assets points to assets folder
            '@components': './components',
            '@screens': './screens',
          },
        },
      ]
    ],
  };
};
 