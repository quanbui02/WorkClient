import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/primeng';
import { SecondPageEditBase } from '../../../../lib-shared/classes/base/second-page-edit-base';
import { ShopProductsService } from '../../../services/shopProducts.service';
import { ProductService } from '../../../services/products.service';

@Component({
  selector: 'app-shop-products-edit',
  templateUrl: './shop-products-edit.component.html',
  styleUrls: ['./shop-products-edit.component.scss']
})
export class ShopProductsEditComponent extends SecondPageEditBase implements OnInit {
  isLoading = false;
  status_options: any[];
  selectedProduct = [];
  selectedItems = [];
  cols = [];
  limit = 100;
  total = 0;
  page = 1;
  results: any;
  key: string;
  modelEdit: any = {
    id: 0,
  };

  constructor(
    protected _injector: Injector,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _ProductService: ProductService,
    private _shopProductsService: ShopProductsService,
  ) {
    super(null, _injector);
    this.formGroup = new FormGroup({
      quantityMin: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])),
      quantity: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])),
      key: new FormControl(''),
    });
    this.cols = [
      {
        field: 'code',
        header: 'Mã',
        visible: true,
        align: 'center',
        width: '10%',
        sort: true,
      },
      {
        field: 'name',
        header: 'Tên sản phẩm',
        visible: true,
        width: '50%',
        sort: true
      },
      {
        field: 'quantity',
        header: 'Số lượng',
        visible: true,
        width: '50%',
        sort: true
      },
      {
        field: 'quantityMin',
        header: 'Số lượng cảnh báo',
        visible: true,
        width: '50%',
        sort: true
      },
    ];
  }

  async ngOnInit() {
    this.modelEdit.id = this.config.data.id;
    if (this.modelEdit.id > 0) {
      await this.loadInfo(this.modelEdit.id);
    }
  }

  async loadInfo(id) {
    this.isLoading = true;
    await this._shopProductsService.getDetail(id).then(rs => {
      if (rs.status) {
        this.modelEdit = rs.data;
      }
    });
    this.isLoading = false;
  }

  async autoComplete(event) {
    const query = event.query;
    let ids = '';
    if (this.selectedProduct != null) {
      ids = this.selectedProduct.map((obj) => obj.id).toString();
    }
    await this._ProductService.Autocomplete(
      query,
      (this.page - 1) * this.limit,
      this.limit
    ).then(rs => {
      if (rs.status) {
        this.results = rs.data;
        this.total = rs.totalRecord;
      }
    });
  }

  closeAndSelected() {
    this.isShow = false;
    this.isLoading = false;
    this.ref.close(null);
  }

  async onSave() {
    await this.Actions();
  }

  onSelect(event) {
    if (this.selectedProduct.findIndex(rs => rs.id === event.id) < 0) {
      event.quantity = 1;
      event.quantityMin = 1;
      event.idProduct = event.id;
      this.selectedProduct.push(event);
      this.key = null;
    } else {
      this._notifierService.showError('Sản phẩm này đã được chọn');
    }
  }

  onUpdateProduct(event, rowIndex) {
    this.selectedProduct[rowIndex] = event;
  }

  onRemove(index: number): void {
    this.selectedProduct.splice(index, 1);
  }

  async Actions() {
    if (this.modelEdit.id <= 0 && this.selectedProduct && this.selectedProduct.length > 0) {
      this._notifierService.showConfirm(`Bạn muốn cập nhật sản phẩm kho ?`, 'Xác nhận').then(rs => {
        this.isLoading = true;
        this._shopProductsService.PostList(this.selectedProduct).then(re => {
          if (re.status) {
            this._notifierService.showSuccess("Cập nhật sản phẩm thành công");
            this.ref.close(re.data);
          } else {
            this._notifierService.showError("Lỗi, không thể cập nhật sản phẩm");
          }
          this.isLoading = false;
        });

      }).catch(err => {
        this._notifierService.showDeleteDataError();
      });
    }

    if (this.modelEdit.id > 0 && this.modelEdit.quantityMin != null && this.modelEdit.quantityMin != '' && !isNaN(Number(this.modelEdit.quantityMin))) {
      this._notifierService.showConfirm(`Bạn muốn cập nhật sản phẩm kho ?`, 'Xác nhận').then(rs => {
        this.isLoading = true;
        this._shopProductsService.post(this.modelEdit).then(re => {
          if (re.status) {
            this._notifierService.showSuccess("Cập nhật sản phẩm thành công");
            this.ref.close(re.data);
          } else {
            this._notifierService.showError("Lỗi, không thể cập nhật sản phẩm");
          }
          this.isLoading = false;
        });
      }).catch(err => {
        this._notifierService.showDeleteDataError();
      });
    }
  }
}
