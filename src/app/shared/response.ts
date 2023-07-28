export class Meta {
    totalRecord = 0;
    currentPage = 0;
    totalPage = 0;
    pageSize = 20;
}

export class ResponsePagination<T> {
    metadata: Meta;
    data: T;
}

export class Response<T> {
    data: T;
    message: string;
    code: number;
    status: boolean;
    totalRecord: number;
}
