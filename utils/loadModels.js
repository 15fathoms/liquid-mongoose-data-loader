const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

module.exports = function loadModels(modelsPath) {
    const models = {};
    fs.readdirSync(modelsPath).forEach(file => {
        if (file.endsWith('.js')) {
            const model = require(path.join(modelsPath, file));
            models[model.modelName.toLowerCase()] = model; // Utiliser le nom en minuscule
        }
    });
    return models;
};