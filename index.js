const loadModels = require('./utils/loadModels');
const loadLiquidTags = require('./utils/loadLiquidTags');

module.exports = function (engine, options) {
    // Check for required options
    if (!options.modelsPath) {
        throw new Error('modelsPath option is required');
    }

    // Load all models
    const models = loadModels(options.modelsPath);
    console.log(models);

    // Load custom Liquid tags
    loadLiquidTags(engine, models);
};

// 
