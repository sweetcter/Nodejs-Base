import config from '@/config/env.config';
import { Token } from '@/constants/token';
import customResponse from '@/helpers/response';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { tokenService } from '.';
import { generateAuthTokens } from './token.service';

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    const foundedToken = await tokenService.verifyToken(token, config.jwt.jwtRefreshTokenKey, Token.REFRESH);

    const user = {
        userId: req.userId,
        role: req.role,
    };

    const { accessToken, refreshToken } = generateAuthTokens(user);

    foundedToken.token = refreshToken;

    await foundedToken.save();

    res.cookie('jwt', refreshToken, {
        maxAge: config.cookie.maxAge,
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: 'lax',
    });

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: accessToken,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
        }),
    );
};
