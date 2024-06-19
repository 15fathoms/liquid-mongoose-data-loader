const loadModels = require('./utils/loadModels');
const loadLiquidTags = require('./utils/loadLiquidTags');

function dataLoader(engine, options) { 
  if (!options.modelsPath) {
    throw new Error('modelsPath option is required');
  }

  const models = loadModels(options.modelsPath);
  console.log('Loaded models:', models);

  loadLiquidTags(engine, models);
}

module.exports = dataLoader;
