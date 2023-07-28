import { PathologyCategoriesComponent } from './PathologyCategories/PathologyCategories.component';
import { PathologiesComponent } from './Pathologies/Pathologies.component';
import { NewsCategoryComponent } from './news-category/news-category.component';
import { TagsComponent } from './tags/tags.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { NewsComponent } from './news/news.component';
import { CskhComponent } from './cskh/cskh.component';
import { OmicallLogComponent } from './omicallLog/omicallLog.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { ProductDangKyComponent } from './ctv/dang-ky/product-dang-ky.component';
import { OrdersComponent } from './ctv/orders/orders.component';
import { ProductComponent } from './doanh-nghiep/product/product.component';
import { GuardService } from '../lib-shared/auth/guard.service';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { OrderClientComponent } from './doanh-nghiep/order-client/order-client.component';
import { BannerComponent } from './banner/banner.component';
import { FaqComponent } from './faq/faq.component';
import { GroupComponent } from './group/group/group.component';
import { MyGroupComponent } from './group/my-group/my-group.component';
import { GroupDangKyComponent } from './group/dang-ky/group-dang-ky.component';
import { GroupPheDuyetComponent } from './group/phe-duyet/group-phe-duyet.component';
import { OrderLeaderComponent } from './ctv/order-leader/order-leader.component';
import { BrandComponent } from './brand/brand.component';
import { PromotionsComponent } from './promotion/promotion.component';
import { CategoryComponent } from './category/category.component';
import { NotificationComponent } from './notification/notification.component';
import { GiftComponent } from './gift/gift.component';
import { GroupTagComponent } from './group/tag/group-tag.component';
import { GioiThieuIndexComponent } from './ctv/gioi-thieu/gioi-thieu-index.component';
import { LogSmsIndexComponent } from './logsms/logsms-index.component';
import { ThemeComponent } from './theme/theme.component';
import { SupplierComponent } from './supplier/supplier.component';
import { LevelComponent } from './level/level.component';
import { PopupsComponent } from './popups/popups.component';
import { GetinfoComponent } from './client/getinfo/getinfo.component';
import { ConnectPartnerComponent } from './client/connect-partner/connect-partner.component';
import { ConfigCodComponent } from './client/config-cod/config-cod.component';
import { SendSmsComponent } from './send-sms/send-sms.component';
import { FeedsComponent } from './feeds/feeds.component';
import { AdminApproveProductComponent } from './doanh-nghiep/product-approve/product-approve.component';
import { StatementHistoriesComponent } from './statements/statements-histories/statements-histories.component';
import { StatementHistoriesAdminComponent } from './statements/statements-histories-admin/statements-histories-admin.component';
import { PointPersonalComponent } from './statements/point-personal/point-personal.component';
import { PointAdminComponent } from './statements/point-admin/point-admin.component';
import { OrderAdminComponent } from './admin/order-admin/order-admin.component';
import { ListFavoritesComponent } from './ctv/list-favorites/list-favorites.component';
import { CSKHCTVComponent } from './group/cskh-ctv/cskh-ctv.component';
import { DiaChiComponent } from './ctv/dia-chi/dia-chi.component';
import { ShopsComponent } from './shops/shops.component';
import { OrderShopClientComponent } from './shops-client/order-clients/order-shop-client.component'
import { ShopProductsComponent } from './shops-client/shop-products/shop-products.component'
import { ShopInOutsComponent } from './shops-client/shop-in-outs/shop-in-outs.component';
import { FoodsComponent } from './foods/foods.component';
import { PromotionUsersComponent } from './promotionUser/promotionUser.component';
import { FoodCategoryComponent } from './foodcategory/foodcategory.component';
import { OrderInvoiceComponent } from './order-invoice/order-invoice.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { OrdersMessageComponent } from './ordersMessage/ordersMessage.component';
import { CompanysComponent } from './Company/companys.component';
const routes: Routes = [
    {
        path: '',
        component: DashBoardComponent
    },
    {
        path: 'list-products',
        canActivate: [GuardService],
        data: {
            // permissionRequired: {
            //     'dapfood.api': { productsController: 64 }
            // },
            heading: 'Danh sách sản phẩm'
        },
        component: ProductDangKyComponent
    },
    {
        path: 'favorits',
        canActivate: [GuardService],
        data: {
            permissionRequired: {
                'dapfood.api': { productRegsController: 128 }
            },
            heading: 'Sản phẩm của tôi'
        },
        component: ListFavoritesComponent
    },
    {
        path: 'orders',
        canActivate: [GuardService],
        data: {
            permissionRequired: {
                'dapfood.api': { ordersController: 2 }
            },
            heading: 'Quản lý đơn hàng'
        },
        component: OrdersComponent
    },
    {
        path: 'orders-clients',
        data: {
            permissionRequired: {
                'dapfood.api': { ordersController: 256 }
            },
            heading: 'Quản lý đơn hàng của doanh nghiệp'
        },
        component: OrderClientComponent
    },
    {
        path: 'order-leader',
        component: OrderLeaderComponent
    },
    {
        path: 'orders-admin',
        component: OrderAdminComponent
    },
    {
        path: 'orders-admin/:idc/:idctv/:fdate/:tdate',
        component: OrderAdminComponent
    },
    {
        path: 'banner',
        canActivate: [GuardService],
        data: {
            permissionRequired: {
                'dapfood.api': { bannersController: 8 }
            },
            heading: 'Quản lý banner'
        },
        component: BannerComponent
    },
    {
        path: 'category',
        canActivate: [GuardService],
        data: {
            permissionRequired: {
                'dapfood.api': { categoriesController: 8 }
            },
            heading: 'Quản lý danh mục'
        },
        component: CategoryComponent
    },
    {
        path: 'faq',
        canActivate: [GuardService],
        data: {
            permissionRequired: {
                'dapfood.api': { faqsController: 8 }
            },
            heading: 'Quản lý hướng dẫn'
        },
        component: FaqComponent
    },
    {
        path: 'brand',
        canActivate: [GuardService],
        data: {
            permissionRequired: {
                'dapfood.api': { brandsController: 8 }
            },
            heading: 'Quản lý thương hiệu'
        },
        component: BrandComponent
    },
    {
        path: 'promotions',
        canActivate: [GuardService],
        data: {
            permissionRequired: {
                'dapfood.api': { promotionsController: 8 }
            },
            heading: 'Quản lý chương trình thưởng'
        },
        component: PromotionsComponent
    },
    {
        path: 'gifts',
        component: GiftComponent
    },
    {
        path: 'themes',
        component: ThemeComponent
    },
    {
        path: 'levels',
        canActivate: [GuardService],
        data: {
            permissionRequired: {
                'dapfood.api': { levelsController: 2 }
            },
            heading: 'Level CTV'
        },
        component: LevelComponent
    },
    {
        path: 'suppliers',
        canActivate: [GuardService],
        data: {
            permissionRequired: {
                'dapfood.api': { suppliersController: 2 }
            },
            heading: 'Nhà cung cấp'
        },
        component: SupplierComponent
    },
    {
        path: 'popups',
        canActivate: [GuardService],
        data: {
            permissionRequired: {
                'dapfood.api': { popupsController: 2 }
            },
            heading: 'Quản lý thông báo'
        },
        component: PopupsComponent
    },
    {
        path: 'products',
        canActivate: [GuardService],
        data: {
            permissionRequired: {
                'dapfood.api': { productsController: 2 }
            },
            heading: 'Thiết lập sản phẩm'
        },
        component: ProductComponent
    },
    {
        path: 'phe-duyet-san-pham',
        canActivate: [GuardService],
        // data: {
        //     permissionRequired: {
        //         'dapfood.api': { productsController: 4096 }
        //     },
        //     heading: 'Phê duyệt sản phẩm'
        // },
        component: AdminApproveProductComponent
    },
    {
        path: 'quan-tri-doanh-nghiep',
        canActivate: [GuardService],
        data: {
            permissionRequired: {
                'dapfood.api': { clientsController: 2 }
            },
            heading: 'Quản lý client'
        },
        component: ClientComponent
    },
    {
        path: 'client/getinfo',
        canActivate: [GuardService],
        data: {
            permissionRequired: {
                'dapfood.api': { ordersController: 256 }
            },
            heading: 'Thiết lập địa chỉ nhận hàng'
        },
        component: GetinfoComponent
    },
    {
        path: 'send-sms',
        canActivate: [GuardService],
        data: {
            permissionRequired: {
                'dapfood.api': { logSmsController: 2 }
            },
            heading: 'Gửi sms'
        },
        component: SendSmsComponent
    },
    {
        path: 'client/connect-partner',
        canActivate: [GuardService],
        data: {
            permissionRequired: {
                'dapfood.api': { ordersController: 256 }
            },
            heading: 'Kết nối giao hàng'
        },
        component: ConnectPartnerComponent
    },
    {
        path: 'client/config-cod',
        canActivate: [GuardService],
        data: {
            permissionRequired: {
                'dapfood.api': { ordersController: 256 }
            },
            heading: 'Thiết lập phí vận chuyện'
        },
        component: ConfigCodComponent
    },
    {
        path: 'statements-histories',
        component: StatementHistoriesComponent
    },
    {
        path: 'statements-histories-admin',
        component: StatementHistoriesAdminComponent
    },
    {
        path: 'statements-histories-admin/:userid/:fdate/:tdate/:status',
        component: StatementHistoriesAdminComponent
    },
    {
        path: 'point',
        component: PointPersonalComponent
    },
    {
        path: 'point-admin',
        canActivate: [GuardService],
        // data: {
        //     permissionRequired: {
        //         'dapfood.api': { pointsController: 2048 }
        //     },
        //     heading: 'Quản lý xu thưởng'
        // },
        component: PointAdminComponent
    },
    {
        path: 'gioi-thieu',
        canActivate: [GuardService],
        // data: {
        //     // permissionRequired: {
        //     //     'dapfood.api': { groupsController: 8 }
        //     // },
        //     heading: 'Danh sách người được giới thiệu'
        // },
        component: GioiThieuIndexComponent
    },
    {
        path: 'group',
        canActivate: [GuardService],
        // data: {
        //     permissionRequired: {
        //         'dapfood.api': { groupsController: 8 }
        //     },
        //     heading: 'Quản lý nhóm'
        // },
        component: GroupComponent
    },
    {
        path: 'logsms',
        canActivate: [GuardService],
        component: LogSmsIndexComponent
    },
    {
        path: 'group-tag',
        canActivate: [GuardService],
        // data: {
        //     permissionRequired: {
        //         'dapfood.api': { groupsController: 8 }
        //     },
        //     heading: 'Danh sách hỗ trợ'
        // },
        component: GroupTagComponent
    },
    {
        path: 'notification',
        canActivate: [GuardService],
        // data: {
        //     permissionRequired: {
        //         'dapfood.api': { notificationsController: 8 }
        //     },
        //     heading: 'Quản lý thông báo'
        // },
        component: NotificationComponent
    },
    {
        path: 'my-group',
        canActivate: [GuardService],
        // data: {
        //     permissionRequired: {
        //         'dapfood.api': { ctvpromotionsController: 0 }
        //     },
        //     heading: 'Nhóm của tôi'
        // },
        component: MyGroupComponent
    },
    {
        path: 'dang-ky-group',
        canActivate: [GuardService],
        // data: {
        //     permissionRequired: {
        //         'dapfood.api': { groupRegsController: 128 }
        //     },
        //     heading: 'Đăng ký nhóm'
        // },
        component: GroupDangKyComponent
    },
    {
        path: 'phe-duyet-group',
        // canActivate: [GuardService],
        // data: {
        //     permissionRequired: {
        //         'dapfood.api': { groupRegsController: 256 }
        //     },
        //     heading: 'Phê duyệt đăng ký nhóm'
        // },
        component: GroupPheDuyetComponent
    },
    {
        path: 'feeds',
        component: FeedsComponent
    },
    {
        path: 'cskh-ctv',
        canActivate: [GuardService],
        // data: {
        //     permissionRequired: {
        //         'dapfood.api': { usersController: 131072 }
        //     },
        //     heading: 'Chăm sóc khách hàng'
        // },
        component: CSKHCTVComponent
    },
    {
        path: 'dia-chi',
        canActivate: [GuardService],
        component: DiaChiComponent
    },
    {
        path: 'shop-admin',
        canActivate: [GuardService],
        component: ShopsComponent
    },
    {
        path: 'orders-shop',
        canActivate: [GuardService],
        component: OrderShopClientComponent
    },
    {
        path: 'shop-products',
        canActivate: [GuardService],
        component: ShopProductsComponent
    },
    {
        path: 'shop-in-outs',
        canActivate: [GuardService],
        component: ShopInOutsComponent
    },
    {
        path: 'app-companys',
        canActivate: [GuardService],
        component: CompanysComponent
    },
    {
        path: 'foods',
        canActivate: [GuardService],
        component: FoodsComponent
    },
    {
        path: 'promotion-users',
        canActivate: [GuardService],
        component: PromotionUsersComponent
    },
    {
        path: 'food-category',
        canActivate: [GuardService],
        component: FoodCategoryComponent
    },
    {
        path: 'feedback',
        canActivate: [GuardService],
        component: FeedbackComponent
    },
    {
        path: 'omicall-log',
        canActivate: [GuardService],
        component: OmicallLogComponent
    },
    {
        path: 'invoice',
        canActivate: [GuardService],
        component: InvoiceComponent
    },
    {
        path: 'orders-invoices',
        canActivate: [GuardService],
        component: OrderInvoiceComponent
    },
    {
        path: 'chat',
        canActivate: [GuardService],
        component: CskhComponent
    },
    {
        path: 'chat/:id',
        canActivate: [GuardService],
        component: CskhComponent
    },
    {
        path: 'news',
        canActivate: [GuardService],
        component: NewsComponent
    },
    {
        path: 'order-rating',
        canActivate: [GuardService],
        component: OrderDetailsComponent
    },
    {
        path: 'tags',
        canActivate: [GuardService],
        component: TagsComponent
    },
    {
        path: 'news-category',
        canActivate: [GuardService],
        component: NewsCategoryComponent
    },
    {
        path: 'orders-message',
        canActivate: [GuardService],
        component: OrdersMessageComponent
    },
    {
        path: 'pathologies',
        canActivate: [GuardService],
        component: PathologiesComponent
    },
    {
        path: 'pathology-category',
        canActivate: [GuardService],
        component: PathologyCategoriesComponent
    },

];

export const DapFoodRoutes = RouterModule.forChild(routes);
