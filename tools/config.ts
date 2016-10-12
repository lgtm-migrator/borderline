/**
 * This barrel file provides the export for the configuration handler.
 */
import { BorderlineConfig } from './config/borderline.config';

const config: BorderlineConfig = new BorderlineConfig();
export = config;
