import * as Joi from 'joi';

// El Joi validation lo que hace es crear la variable de entorno si no la encuentra
// en el archivo .env
export const JoiValidationSchema = Joi.object({
    MONGODB: Joi.required(),
    PORT: Joi.number().default(3000),
    DEFAULT_LIMIT: Joi.number().default(650),
})