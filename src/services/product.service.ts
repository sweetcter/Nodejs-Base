import { ProductStatus } from '@/constants/enum';
import { BadRequestError, NotFoundError } from '@/error/customError';
import APIQuery from '@/helpers/apiQuery';
import customResponse from '@/helpers/response';
import Discount from '@/models/Discount';
import Product from '@/models/Product';
import ProductVariant from '@/models/ProductVariant';
import { IFormat } from '@/types/format';
import { IVariantItem } from '@/types/variant';
import { removeFile, uploadMutipleFile, uploadSingleFile } from '@/utils/cloudinaryUploads';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldName: string]: Express.Multer.File | Express.Multer.File[] };
    const nameToLowerCase = req.body.name.toLowerCase();
    const body = { ...req.body, name: nameToLowerCase };
    const thumbnail = files.thumbnail as Express.Multer.File[];

    const foundedProduct = await Product.findOne({ name: nameToLowerCase });

    if (foundedProduct) {
        throw new BadRequestError('Sản phẩm đã tồn tại');
    }

    if (thumbnail && thumbnail.length > 0) {
        const upload = await uploadSingleFile(thumbnail[0] as Express.Multer.File);

        if (upload) {
            Object.assign(body, { thumbnail: upload.downloadURL, thumbnailRef: upload.urlRef });
        }
    }

    if (files.library) {
        const library = await uploadMutipleFile(files.library as Express.Multer.File[]);

        if (library) {
            Object.assign(body, {
                library: library.map((image) => ({ imageUrl: image.downloadURL, imageRef: image.urlRef })),
            });
        }
    }

    const product = new Product(body);

    await product.save();

    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: null,
            message: ReasonPhrases.CREATED,
            status: StatusCodes.CREATED,
        }),
    );
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldName: string]: Express.Multer.File | Express.Multer.File[] };
    const thumbnail = files.thumbnail as Express.Multer.File[];
    const removeImages = req.body.removeImages;
    const foundedProduct = await Product.findById(req.body.productId);

    if (!foundedProduct) {
        throw new NotFoundError('Không tìm thấy sản phẩm');
    }

    const currentImages = foundedProduct.library?.filter((image) => !removeImages.includes(image.imageRef)) || [];

    if (thumbnail && thumbnail.length > 0) {
        const upload = await uploadSingleFile(thumbnail[0] as Express.Multer.File);

        if (upload) {
            await removeFile(upload.urlRef);
            Object.assign(req.body, { thumbnail: upload.downloadURL, thumbnailRef: upload.urlRef });
        }
    }

    if (files.library) {
        const library = await uploadMutipleFile(files.library as Express.Multer.File[]);

        if (library) {
            const newLibrary = [
                ...currentImages,
                ...library.map((image) => ({ imageUrl: image.downloadURL, imageRef: image.urlRef })),
            ];

            Object.assign(req.body, {
                library: newLibrary,
            });

            await Promise.all(removeImages.map((imageRef: string) => removeFile(imageRef)));
        }
    }

    const product = await Product.updateOne({ _id: req.body.productId }, { $set: req.body });

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: product,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
        }),
    );
};

export const createProductVariant = async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };
    const variants = JSON.parse(req.body.variants);
    const { productId } = req.body;
    const variantImageMap = new Map();

    const productVariants = await Product.findById(productId).populate<{ variantFormats: IFormat[] }>({
        path: 'variantFormats',
    });

    if (!productVariants) {
        throw new NotFoundError('Không tìm thấy sản phẩm');
    }

    const variantsFormatId = variants.map((variant: IVariantItem) => variant.formatId);
    const checkVariantFormatExist = productVariants.variantFormats.some((variantFormat) =>
        variantsFormatId.includes(variantFormat._id),
    );

    if (checkVariantFormatExist) {
        throw new BadRequestError('Biến thể không được trùng định dạng');
    }

    if (files.variantImages) {
        const variantsImages = await uploadMutipleFile(files.variantImages as Express.Multer.File[]);
        if (variantsImages) {
            for (const image of variantsImages) {
                variantImageMap.set(image.originName, image);
            }

            for (const variant of variants) {
                if (variantImageMap.has(variant.imageRef)) {
                    const image = variantImageMap.get(variant.imageRef);
                    variant.image = image.downloadURL;
                    variant.imageUrlRef = image.urlRef;
                }
            }
        }
    }

    const insertVariant = await ProductVariant.insertMany(variants);

    const variantIds = insertVariant.map((variant) => variant._id);
    const uniqueFormatIds = [...new Set(insertVariant.map((variant) => variant.formatId))];

    const products = await Product.findByIdAndUpdate(
        productId,
        {
            $push: {
                variants: { $each: variantIds },
                variantFormats: { $each: uniqueFormatIds },
            },
        },
        { new: true },
    );

    if (!products) {
        throw new NotFoundError('Không tìm thấy sản phẩm');
    }

    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: null,
            message: ReasonPhrases.CREATED,
            status: StatusCodes.CREATED,
        }),
    );
};

export const updateProductVariant = async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };
    const variants = JSON.parse(req.body.variants || '[]');
    const oldVariantImages = JSON.parse(req.body.oldVariantImages || '[]');
    const removeVariants = JSON.parse(req.body.removeVariants || '[]');
    const { productId } = req.body;
    const variantImageMap = new Map();

    const productVariants = await Product.findById(productId).populate<{ variantFormats: IFormat[] }>({
        path: 'variantFormats',
    });

    if (!productVariants) {
        throw new NotFoundError('Không tìm thấy sản phẩm');
    }
    const variantsFormatId = variants.map((variant: IVariantItem) => variant.formatId);
    const checkVariantFormatExist = productVariants.variantFormats.some((variantFormat) =>
        variantsFormatId.includes(variantFormat._id),
    );

    if (checkVariantFormatExist) {
        throw new BadRequestError('Biến thể không được trùng định dạng');
    }
    // return res.status(200).json({
    //     message: 'OK',
    // });

    if (files.variantImages) {
        const variantsImages = await uploadMutipleFile(files.variantImages as Express.Multer.File[]);

        if (variantsImages) {
            for (const image of variantsImages) {
                variantImageMap.set(image.originName, image);
            }

            for (const variant of variants) {
                if (variant.imageRef && variantImageMap.has(variant.imageRef)) {
                    const image = variantImageMap.get(variant.imageRef);
                    variant.image = image.downloadURL;
                    variant.imageUrlRef = image.urlRef;
                    image.isUsed = true;
                }
            }
        }
        await Promise.all([
            ...oldVariantImages.map((imageRef: string) => removeFile(imageRef)),
            ...variantsImages.filter((image) => !image.isUsed).map((image) => removeFile(image.urlRef)),
        ]);
    }

    const variantToUpdate = variants.filter((variant: IVariantItem) => variant._id);
    const variantToCreate = variants.filter((variant: IVariantItem) => !variant._id);

    await Promise.all(
        variantToUpdate.map((variant: IVariantItem) => {
            const { _id, ...rest } = variant;
            return ProductVariant.updateOne({ _id }, { $set: rest });
        }),
    );

    const newVariants = variantToCreate.length > 0 ? await ProductVariant.insertMany(variantToCreate) : [];
    const newVariantsIds = newVariants.map((variant) => variant._id);

    if (removeVariants && removeVariants.length > 0) {
        await Promise.all(removeVariants.map((variantId: string) => ProductVariant.deleteOne({ _id: variantId })));

        await Product.updateOne({ _id: productId }, { $pull: { variants: { $in: removeVariants } } });
    }

    if (newVariantsIds && newVariantsIds.length > 0) {
        await Product.updateOne({ _id: productId }, { $addToSet: { variants: { $each: newVariantsIds } } });
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
        }),
    );
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    const query = { isAvailable: true, ...req.query };

    const feature = new APIQuery(
        Product.find()
            .select('-thumbnailRef')
            .populate([
                {
                    path: 'variants',
                    select: '-imageUrlRef',
                    populate: {
                        path: 'formatId',
                        select: '-createdAt -updatedAt',
                    },
                },
                {
                    path: 'categoryId',
                    select: '-createdAt -updatedAt',
                },
                {
                    path: 'vendorId',
                    select: '-createdAt -updatedAt',
                },
            ]),
        query,
    );

    feature.filter().sort().limitFields().search().paginate();

    const [data, totalDocs] = await Promise.all([feature.query, feature.count()]);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                products: data,
                totalDocs,
            },
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
        }),
    );
};

export const getVariantsByProduct = async (req: Request, res: Response, next: NextFunction) => {
    const variants = await Product.find({ _id: req.params.productId }).select('variants').populate({
        path: 'variants',
    });

    if (!variants) {
        throw new NotFoundError('Không tìm thấy biến thể của sản phẩm');
    }
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: variants,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
        }),
    );
};

export const getRelatedProducts = async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId, productId } = req.body;

    const products = await Product.find({ categoryId, _id: { $ne: productId } })
        .sort({ sold: -1 })
        .limit(10);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: products,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
        }),
    );
};

export const getBestSeller = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find().sort({ sold: 'desc' }).limit(10);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: products,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
        }),
    );
};

export const getFeaturedProducts = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find({ status: ProductStatus.FEATURED }).sort({ reviewCount: 'desc' }).limit(10);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: products,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
        }),
    );
};

export const getNewProducts = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find({ status: ProductStatus.NEW }).limit(10);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: products,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
        }),
    );
};

export const getDetailProduct = async (req: Request, res: Response, next: NextFunction) => {
    // const discount = await Discount.find();

    // console.log(discount);
    console.log('Registered models:', mongoose.modelNames());
    const product = await Product.findById(req.params.id).populate([
        {
            path: 'variants',
            populate: [
                {
                    path: 'formatId',
                    select: '-createdAt -updatedAt',
                },
                {
                    path: 'discountId',
                    select: '-createdAt -updatedAt',
                },
            ],
        },
        {
            path: 'categoryId',
            select: '-createdAt -updatedAt',
        },
        {
            path: 'vendorId',
            select: '-createdAt -updatedAt',
        },
    ]);

    if (!product) {
        throw new NotFoundError('Không tìm thấy sản phẩm');
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: product,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
        }),
    );
};

export const hiddenProduct = async (req: Request, res: Response, next: NextFunction) => {
    const foundedProduct = await Product.findOneAndUpdate(
        { _id: req.params.id, isAvailable: true },
        { isAvailable: false },
    );

    if (!foundedProduct) {
        throw new NotFoundError('Sản phẩm không tồn tại');
    }

    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: null,
            message: ReasonPhrases.CREATED,
            status: StatusCodes.CREATED,
        }),
    );
};
