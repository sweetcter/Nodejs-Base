import mongoose from 'mongoose';
import slugify from 'slugify';

const slugMiddleware = (sourceField: string, targetField: string, unique = false) => {
    return function (schema: mongoose.Schema) {
        schema.pre('save', async function (next) {
            if (!this[targetField] && this[sourceField]) {
                let slug = '';
                if (unique === true) {
                    slug = slugify(`${this[sourceField]}-${this._id}`, { lower: true, strict: true, locale: 'vi' });
                } else {
                    slug = slugify(`${this[sourceField]}`, { lower: true, strict: true, locale: 'vi' });
                }
                this[targetField] = slug;
            }
            next();
        });
    };
};

export default slugMiddleware;
