import path from 'path';

const root = 'client';
const tmp = 'dist';
const dist = 'dist';

export function resolveToApp(glob) {
  glob = glob || '';
  return path.join(root, 'app', glob);
}

export function resolveToComponents(glob) {
  glob = glob || '';
  return path.join(root, 'app/components', glob);
}

export function resolveToViewModels(glob) {
  glob = glob || '';
  return path.join(root, 'app/view_models', glob);
}

export const paths = {
  root,
  tmp,
  dist,
  baseDir: [
    root,
    tmp,
  ],
  config: './constants.json',
  js: resolveToApp('**/*!(.spec.js).js'),
  styl: resolveToApp('**/*.styl'),
  scss: resolveToApp('**/*.scss'),
  assets: path.join(root, 'assets/**'),
  fonts: path.join(root, 'fonts/**'),
  index: path.join(root, 'index.jade'),
  template: [
    resolveToApp('**/*.jade'),
    path.join(root, 'index.html'),
  ],
  entry: path.join(root, 'app/app.js'),
  output: root,
  blankComponent: path.join(__dirname, 'generator', 'component/**/*.**'),
  blankViewModel: path.join(__dirname, 'generator', 'viewModel/**/*.**'),
};
