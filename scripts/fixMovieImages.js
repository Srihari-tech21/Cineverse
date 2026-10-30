// ES Module entry wrapper for fixMovieImages
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('./fixMovieImages.cjs');
