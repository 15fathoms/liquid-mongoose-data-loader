const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

function loadModels(modelsPath) {
    const models = {};
    fs.readdirSync(modelsPath).forEach(file => {
      const extname = path.extname(file);
      const modelName = path.basename(file, extname); // Get the model name without extension
  
      // Vérifier l'extension du fichier
      if (extname !== '.js' && extname !== '.ts') {
        console.warn(`Skipping unsupported file type: ${file}`);
        return;
      }
  
      const modelPath = path.join(modelsPath, file);
  
      // Vérifier si le fichier est vide
      const fileStat = fs.statSync(modelPath);
      if (fileStat.size === 0) {
        console.warn(`Skipping empty model file: ${file}`);
        return;
      }
  
      // Charger le module et vérifier s'il exporte quelque chose
      const model = require(modelPath);
      if (model && model.modelName) {
        models[modelName.toLowerCase()] = model;
      } else {
        console.warn(`Skipping invalid model file (no module.exports): ${file}`);
      }
    });
    return models;
  }
  
  module.exports = loadModels;