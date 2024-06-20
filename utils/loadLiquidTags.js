const mongoose = require('mongoose');
const { Tag, Hash, evalToken } = require('liquidjs');

class IncludeTag extends Tag {
    constructor(tagToken, remainTokens, liquid) {
        super(tagToken, remainTokens, liquid);
        this.hash = new Hash(tagToken.args);
        this.models = liquid.models; // Attacher les modèles
    }

    * render(ctx) {
        const hash = yield this.hash.render(ctx);

        const modelName = hash['model'] ? hash['model'].toLowerCase() : undefined; // Convertir en minuscule
        const findOne = hash['findOne'];
        const item = hash['item'];
        const storageKey = hash['key']; // Clé de stockage définie par le développeur
        let data;

        if (!modelName) {
            console.error(`Model name is undefined.`);
            return '';
        }

        const Model = this.models[modelName];
        if (!Model) {
            console.error(`Model ${modelName} not found.`);
            return '';
        }

        if (!storageKey) {
            console.error(`Storage key must be provided.`);
            return '';
        }

        try {
            const Model = this.models[modelName];
            if (findOne && item) {
                const query = {};
                query[findOne] = item;
                data = yield Model.find(query).lean(); // Utiliser findOne avec lean pour obtenir un objet JavaScript simple
            } else {
                data = yield Model.find().lean(); // Utiliser find avec lean pour obtenir tous les résultats
            }
            ctx.environments[storageKey] = data
        } catch (error) {
            console.error(`Error fetching data for model ${modelName}:`, error);
            ctx.environments[storageKey] = [];
        }

        return '';
    }
}

module.exports = function (engine, models) {
    engine.models = models; // Attacher les modèles au moteur Liquid
    engine.registerTag('load', IncludeTag);
};
