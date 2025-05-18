import { BadRequestError, NotFoundError } from '@/error/customError';
import APIQuery from '@/helpers/apiQuery';
import customResponse from '@/helpers/response';
import Vendor from '@/models/Vendor';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createVendor = async (req: Request, res: Response, next: NextFunction) => {
    const vendorFounded = await Vendor.findOne({ name: req.body.name });

    if (vendorFounded) {
        throw new BadRequestError('Tên của nhà cung cấp đã tồn tại');
    }

    const newVendor = new Vendor(req.body);

    await newVendor.save();

    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: newVendor,
            message: ReasonPhrases.CREATED,
            status: StatusCodes.CREATED,
        }),
    );
};

export const getAllVendors = async (req: Request, res: Response, next: NextFunction) => {
    const limit = req.params.limit ? req.params.limit : 10;
    const feature = new APIQuery(Vendor.find().lean(), req.query);

    feature.filter().search().sort().limitFields().paginate();

    const [data, totalDocs] = await Promise.all([feature.query, feature.count()]);
    const totalPage = Math.ceil(totalDocs / Number(limit));

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                vendors: data,
                limit,
                totalDocs,
                totalPage,
            },
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
        }),
    );
};

export const getDetailVendor = async (req: Request, res: Response, next: NextFunction) => {
    const vendor = await Vendor.findById(req.params.id).lean();

    if (!vendor) {
        throw new NotFoundError(`Không tìm thấy nhà cung cấp với id ${req.params.id}`);
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: vendor,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
        }),
    );
};

export const updateVendor = async (req: Request, res: Response, next: NextFunction) => {
    const founded = await Vendor.findById(req.params.id, req.body);

    if (!founded) {
        throw new NotFoundError(`Không tìm thấy nhà cung cấp với id ${req.params.id}`);
    }

    if (founded.name === req.body.name) {
        return res.status(StatusCodes.NO_CONTENT).json(
            customResponse({
                data: null,
                message: ReasonPhrases.NO_CONTENT,
                status: StatusCodes.NO_CONTENT,
            }),
        );
    }

    founded.name = req.body.name;
    await founded.save();

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: founded,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
        }),
    );
};
