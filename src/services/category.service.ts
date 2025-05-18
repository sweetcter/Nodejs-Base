import { BadRequestError, NotFoundError } from '@/error/customError';
import APIQuery from '@/helpers/apiQuery';
import customResponse from '@/helpers/response';
import Category from '@/models/Category';
import { removeFile, uploadSingleFile } from '@/utils/cloudinaryUploads';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import _ from 'lodash';

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file as Express.Multer.File;

    const categoryFounded = await Category.findOne({ name: req.body.name });

    if (categoryFounded) {
        throw new BadRequestError('Tên của danh mục đã tồn tại');
    }

    const category = new Category(req.body);

    if (file) {
        const upload = await uploadSingleFile(file);

        if (upload) {
            Object.assign(category, { image: upload.downloadURL, imageUrlRef: upload.urlRef });
            await category.save();
        } else {
            throw new BadRequestError('Thêm sản phẩm thất bại!');
        }
    } else {
        await category.save();
    }

    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: null,
            message: ReasonPhrases.CREATED,
            status: StatusCodes.CREATED,
        }),
    );
};

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    const query = { isDeleted: false, ...req.query };
    const limit = req.params.limit ? req.params.limit : 10;
    const feature = new APIQuery(Category.find().lean(), query);

    feature.filter().search().sort().limitFields().paginate();

    const [data, totalDocs] = await Promise.all([feature.query, feature.count()]);
    const totalPage = Math.ceil(totalDocs / Number(limit));

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                categories: data,
                limit,
                totalDocs,
                totalPage,
            },
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
        }),
    );
};

export const getDetailCategory = async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findById(req.params.id).lean();

    if (!category) {
        throw new NotFoundError(`Không tìm thấy danh mục với id ${req.params.id}`);
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: category,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
        }),
    );
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file as Express.Multer.File;
    const foundedCategory = await Category.findById(req.params.id);

    if (!foundedCategory) {
        throw new NotFoundError(`Không tìm thấy danh mục với id ${req.params.id}`);
    }

    if (_.isMatch(foundedCategory, req.body)) {
        return res.status(StatusCodes.NO_CONTENT).json(
            customResponse({
                data: foundedCategory,
                message: ReasonPhrases.NO_CONTENT,
                status: StatusCodes.NO_CONTENT,
            }),
        );
    }

    Object.assign(foundedCategory, req.body);

    if (file) {
        const upload = await uploadSingleFile(file);

        if (upload) {
            removeFile(foundedCategory?.imageUrlRef as string);
            foundedCategory.image = upload.downloadURL;
            foundedCategory.imageUrlRef = upload.urlRef;
        }
    }

    await foundedCategory.save();

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: foundedCategory,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
        }),
    );
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findByIdAndUpdate(req.params.id, {
        isDeleted: true,
    });

    if (!category) {
        throw new NotFoundError(`Không tìm thấy danh mục với id ${req.params.id}`);
    }

    return res.status(StatusCodes.NO_CONTENT).json(
        customResponse({
            data: null,
            message: ReasonPhrases.NO_CONTENT,
            status: StatusCodes.NO_CONTENT,
        }),
    );
};
