import { ResponseT } from '@/types/response';

export const customResponse = <T>({ data, message, status }: ResponseT<T>) => {
    console.log(data, message, status);
    return {
        message,
        status,
        data,
    };
};

export default customResponse;
