const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist',
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'inline-source-map',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },

      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true, // webpack@2.x and newer\
            },
          },
        ],
      },
      {
        test: /.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true,
              configFile: __dirname + '/tsconfig.json',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin([
      {
        from: 'src/index.html',
        to: 'index.html',
        toType: 'file',
      },
    ]),
  ],
};
