
export class ResponseModel {

    constructor() {
        this.returnStatus = false;
        this.returnMessage = new Array<string>();
        this.errors = new Array<any>();
        this.totalPages = 0;
        this.totalRows = 0;
        this.pageSize = 0;
        this.isAuthenicated = false;
        this.sortExpression = "";
        this.sortDirection = "";
        this.currentPageNumber = 0;
    }

    public returnStatus: Boolean;
    public returnMessage: string[];
    public errors: any[];
    public totalPages: number;
    public totalRows: number;
    public pageSize: number;
    public isAuthenicated: Boolean;
    public sortExpression: string;
    public sortDirection: string;
    public currentPageNumber: number;
}

