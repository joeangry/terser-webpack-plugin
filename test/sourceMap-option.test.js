import path from 'path';

import { SourceMapDevToolPlugin } from 'webpack';

import TerserPlugin from '../src/index';

import {
  compile,
  getCompiler,
  getErrors,
  getWarnings,
  readsAssets,
} from './helpers';

expect.addSnapshotSerializer({
  test: (value) => {
    // For string that are valid JSON
    if (typeof value !== 'string') {
      return false;
    }

    try {
      return typeof JSON.parse(value) === 'object';
    } catch (e) {
      return false;
    }
  },
  print: (value) => JSON.stringify(JSON.parse(value), null, 2),
});

describe('sourceMap', () => {
  it('should match snapshot when the "devtool" option has the "false" value', async () => {
    const compiler = getCompiler({
      entry: path.resolve(__dirname, './fixtures/entry.js'),
      devtool: false,
    });

    new TerserPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(readsAssets(compiler, stats)).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should match snapshot when the "devtool" option has the "source-map" value', async () => {
    const compiler = getCompiler({
      entry: path.resolve(__dirname, './fixtures/entry.js'),
      devtool: 'source-map',
    });

    new TerserPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(readsAssets(compiler, stats)).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should match snapshot when the "devtool" option has the "inline-source-map" value', async () => {
    const compiler = getCompiler({
      entry: path.resolve(__dirname, './fixtures/entry.js'),
      devtool: 'inline-source-map',
    });

    new TerserPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(readsAssets(compiler, stats)).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should match snapshot when the "devtool" option has the "hidden-source-map" value', async () => {
    const compiler = getCompiler({
      entry: path.resolve(__dirname, './fixtures/entry.js'),
      devtool: 'hidden-source-map',
    });

    new TerserPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(readsAssets(compiler, stats)).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should match snapshot when the "devtool" option has the "nosources-source-map" value', async () => {
    const compiler = getCompiler({
      entry: path.resolve(__dirname, './fixtures/entry.js'),
      devtool: 'nosources-source-map',
    });

    new TerserPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(readsAssets(compiler, stats)).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should match snapshot when the "devtool" option has the "eval" value', async () => {
    const compiler = getCompiler({
      entry: path.resolve(__dirname, './fixtures/entry.js'),
      devtool: 'eval',
    });

    new TerserPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(readsAssets(compiler, stats)).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should match snapshot when the "devtool" option has the "cheap-source-map" value', async () => {
    const compiler = getCompiler({
      entry: path.resolve(__dirname, './fixtures/entry.js'),
      devtool: 'cheap-source-map',
    });

    new TerserPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(readsAssets(compiler, stats)).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should match snapshot for the `SourceMapDevToolPlugin` plugin (like `source-map`)', async () => {
    const compiler = getCompiler({
      entry: path.resolve(__dirname, './fixtures/entry.js'),
      devtool: false,
      plugins: [
        new SourceMapDevToolPlugin({
          filename: '[file].map[query]',
          module: true,
          columns: true,
        }),
      ],
    });

    new TerserPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(readsAssets(compiler, stats)).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should match snapshot for the `SourceMapDevToolPlugin` plugin (like `cheap-source-map`)', async () => {
    const compiler = getCompiler({
      entry: path.resolve(__dirname, './fixtures/entry.js'),
      devtool: false,
      plugins: [
        new SourceMapDevToolPlugin({
          filename: '[file].map[query]',
          module: false,
          columns: false,
        }),
      ],
    });

    new TerserPlugin().apply(compiler);

    const stats = await compile(compiler);

    expect(readsAssets(compiler, stats)).toMatchSnapshot('assets');
    expect(getErrors(stats)).toMatchSnapshot('errors');
    expect(getWarnings(stats)).toMatchSnapshot('warnings');
  });

  it('should match snapshot for multi compiler mode with source maps', async () => {
    const multiCompiler = getCompiler([
      {
        mode: 'production',
        devtool: 'eval',
        bail: true,
        cache: { type: 'memory' },
        entry: path.resolve(__dirname, './fixtures/entry.js'),
        output: {
          path: path.resolve(__dirname, './dist'),
          filename: '[name]-1.js',
          chunkFilename: '[id]-1.[name].js',
        },
        optimization: {
          minimize: false,
        },
        plugins: [new TerserPlugin()],
      },
      {
        mode: 'production',
        devtool: 'source-map',
        bail: true,
        cache: { type: 'memory' },
        entry: path.resolve(__dirname, './fixtures/entry.js'),
        output: {
          path: path.resolve(__dirname, './dist'),
          filename: '[name]-2.js',
          chunkFilename: '[id]-2.[name].js',
        },
        optimization: {
          minimize: false,
        },
        plugins: [new TerserPlugin()],
      },
      {
        mode: 'production',
        bail: true,
        cache: { type: 'memory' },
        devtool: false,
        entry: path.resolve(__dirname, './fixtures/entry.js'),
        output: {
          path: path.resolve(__dirname, './dist'),
          filename: '[name]-3.js',
          chunkFilename: '[id]-3.[name].js',
        },
        optimization: {
          minimize: false,
        },
        plugins: [
          new SourceMapDevToolPlugin({
            filename: '[file].map[query]',
            module: false,
            columns: false,
          }),
          new TerserPlugin(),
        ],
      },
      {
        mode: 'production',
        bail: true,
        cache: { type: 'memory' },
        devtool: false,
        entry: path.resolve(__dirname, './fixtures/entry.js'),
        output: {
          path: path.resolve(__dirname, './dist'),
          filename: '[name]-4.js',
          chunkFilename: '[id]-4.[name].js',
        },
        optimization: {
          minimize: false,
        },
        plugins: [
          new SourceMapDevToolPlugin({
            filename: '[file].map[query]',
            module: true,
            columns: true,
          }),
          new TerserPlugin(),
        ],
      },
    ]);

    const multiStats = await compile(multiCompiler);

    multiStats.stats.forEach((stats, index) => {
      expect(
        readsAssets(multiCompiler.compilers[index], stats)
      ).toMatchSnapshot('assets');
      expect(getErrors(stats)).toMatchSnapshot('errors');
      expect(getWarnings(stats)).toMatchSnapshot('warnings');
    });
  });
});
