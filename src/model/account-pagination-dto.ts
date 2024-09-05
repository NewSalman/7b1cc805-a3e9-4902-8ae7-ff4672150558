import { AccountDTO } from "./account-dto";

export interface AccountPaginationDTO {
    page: number;
    pageCount: number;
    dataPerPage: number;
    result: Array<AccountDTO>;
    links: string;
}