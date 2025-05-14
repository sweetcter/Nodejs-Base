import { ResponseT } from '@/types/response';

export const customResponse = <T>({ data, success, message, status }: ResponseT<T>) => {
    return {
        success,
        message,
        status,
        data,
    };
};

export default customResponse;
