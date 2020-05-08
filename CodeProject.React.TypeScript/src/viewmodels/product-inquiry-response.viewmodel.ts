
import { ResponseModel } from "./response.model";
import { ProductViewModel } from "./product.viewmodel";

export class ProductInquiryViewModelResponse extends ResponseModel  {

    constructor() {
        super();
        this.entity = new Array<ProductViewModel>();
    }

    public entity: Array<ProductViewModel>;

}
