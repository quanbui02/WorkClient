import { LessonsService } from './../dao-tao/services/lessons.service';
import { PathologiesEditComponent } from './Pathologies/Pathologies-edit/Pathologies-edit.component';
import { PathologyCategoriesComponent } from './PathologyCategories/PathologyCategories.component';
import { PathologiesCategoryService } from './services/PathologiesCategory.service';
import { PathologiesComponent } from './Pathologies/Pathologies.component';
import { PathologiesService } from './services/Pathologies.service';
import { OrderDetailRatingComponent } from './order-details/order-detail-rating/order-detail-rating.component';
import { CskhCtvDetailComponent } from './group/cskh-ctv/cskh-ctv-detail/cskh-ctv-detail.component';
import { NewsCategoriesService } from './services/news-categories.service';
import { NewsCategoryComponent } from './news-category/news-category.component';
import { TagsEditComponent } from './tags/tags-edit/tags-edit.component';
import { TagsComponent } from './tags/tags.component';
import { TagsService } from './services/tags.service';
import { CustomerInfoComponent } from './cskh/customer-info/customer-info.component';
import { OrderDetailsEditComponent } from './order-details/order-details-edit/order-details-edit.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { NewsService } from './services/news.service';
import { NewsEditComponent } from './news/news-edit/news-edit.component';
import { NewsComponent } from './news/news.component';
import { ChatsService } from './services/Chats.service';
import { CskhComponent } from './cskh/cskh.component';
import { OmiCallLogsService } from './services/OmiCallLogs.service';
import { OmicallLogComponent } from './omicallLog/omicallLog.component';
import { FeedbackEditComponent } from './feedback/feedback-edit/feedback-edit.component';
import { FeedbacksService } from './services/feedback.service';
import { FeedbackComponent } from './feedback/feedback.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import {
    AutoCompleteModule,
    CalendarModule,
    CheckboxModule,
    ConfirmDialogModule,
    EditorModule,
    FileUploadModule,
    InputSwitchModule,
    InputTextareaModule,
    InputTextModule,
    ListboxModule,
    MenuModule,
    MultiSelectModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    RadioButtonModule,
    SplitButtonModule,
    TabViewModule,
    TreeTableModule,
    TreeModule,
    AccordionModule,
    FieldsetModule,
    SelectButtonModule,
    DialogService,
    RatingModule,
    ContextMenuModule,
    ProgressSpinnerModule,
} from 'primeng/primeng';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { FormioModule } from 'angular-formio';
import { DapFoodRoutes } from './dapfood.routing';
import { ProductService } from './services/products.service';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ClientComponent } from './client/client.component';
import { ClientEditComponent } from './client/edit/client-edit.component';
import { PartnerClientsService } from './services/partnerclients.service';
import { SourceService } from './services/sources.service';
import { OrdersService } from './services/orders.service';
import { ProductDangKyComponent } from './ctv/dang-ky/product-dang-ky.component';
import { ClipboardModule } from 'ngx-clipboard';
import { OrdersComponent } from './ctv/orders/orders.component';
import { OrderEditComponent } from './ctv/orders/order-edit/order-edit.component';
import { ClientsService } from './services/clients.service';
import { ProvincesService } from './services/provinces.service';
import { DistrictsService } from './services/districts.service';
import { WardsService } from './services/wards.service';
import { ProductComponent } from './doanh-nghiep/product/product.component';
import { ProductEditComponent } from './doanh-nghiep/product/edit/product-edit.component';
import { ContentService } from './services/contents.service';
import { VsSharedModule } from '../lib-shared/lib-shared.module';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { ProductRegService } from './services/productregs.service';
import { AutosizeModule } from 'ngx-autosize';
import { PhanTramPipe } from '../lib-shared/pipes/phan-tram.pipe';
import { CategoriesService } from './services/categories.service';
import { DealTypesService } from './services/dealtypes.service';
import { PS_COMPONENT_CONFIG } from '../config/vs-component.config';
import { SignalRService } from '../lib-shared/services/signalr.service';
import { StatementsService } from './services/statements.service';
import { StatusService } from './services/status.service';
import { OrderHistoryComponent } from './ctv/orders/order-history/order-history.component';
import { OrderStatusService } from './services/orderstatus.service';
import { OrderClientComponent } from './doanh-nghiep/order-client/order-client.component';
import { PointsService } from './services/points.service';
import { BannerComponent } from './banner/banner.component';
import { BannerEditComponent } from './banner/banner-edit/banner-edit.component';
import { BannersService } from './services/banners.service';
import { BannercategoriesService } from './services/bannercategories.service';
import { FaqComponent } from './faq/faq.component';
import { FaqEditComponent } from './faq/faq-edit/faq-edit.component';
import { FaqsService } from './services/faqs.service';
import { GroupsService } from './services/groups.service';
import { GroupRegsService } from './services/groupregs.service';
import { GroupComponent } from './group/group/group.component';
import { GroupEditComponent } from './group/group-edit/group-edit.component';
import { GroupDangKyComponent } from './group/dang-ky/group-dang-ky.component';
import { GroupPheDuyetComponent } from './group/phe-duyet/group-phe-duyet.component';
import { MyGroupComponent } from './group/my-group/my-group.component';
import { OrderLeaderComponent } from './ctv/order-leader/order-leader.component';
import { GroupMoiThanhVienComponent } from './group/moi-thanh-vien/group-moi-thanh-vien.component';
import { LogSmsService } from './services/logsms.service';
import { ContentEditComponent } from './doanh-nghiep/product/content/content-edit.component';
import { ContentViewComponent } from './doanh-nghiep/product/content/content-view.component';
import { ReportService } from '../bao-cao/report.service';
import { BrandEditComponent } from './brand/brand-edit/brand-edit.component';
import { BrandComponent } from './brand/brand.component';
import { BrandsService } from './services/brands.service';
import { CountriesService } from './services/countries.service';
import { PromotionsService } from './services/promotions.service';
import { PromotionsComponent } from './promotion/promotion.component';
import { PromotionsEditComponent } from './promotion/promotion-edit/promotion-edit.component';
import { PromotionProductsService } from './services/promotionproducts.service';
import { FlashSaleTimesService } from './services/flashsaletimes.service';
import { ChoosePromotionComponent } from './ctv/orders/choose-promotion/choose-promotion.component';
import { DynamicDialogComponent, DynamicDialogModule } from 'primeng/components/dynamicdialog/dynamicdialog';
import { ProductViewComponent } from './doanh-nghiep/product/view/product-view.component';
import { CategoryComponent } from './category/category.component';
import { CategoryEditComponent } from './category/category-edit/category-edit.component';
import { ChooseGiftComponent } from './ctv/orders/choose-gift/choose-gift.component';
import { OrderGiftsService } from './services/ordergift.service';
import { NotificationsService } from './services/notifications.service';
import { NotificationComponent } from './notification/notification.component';
import { NotificationEditComponent } from './notification/notification-edit/notification-edit.component';
import { GiftsService } from './services/vouchers.service';
import { GiftComponent } from './gift/gift.component';
import { GiftEditComponent } from './gift/gift-edit/gift-edit.component';
import { GroupTagComponent } from './group/tag/group-tag.component';
import { OrderRatingComponent } from './ctv/orders/order-rating/order-rating.component';
import { GioiThieuIndexComponent } from './ctv/gioi-thieu/gioi-thieu-index.component';
import { LogSmsIndexComponent } from './logsms/logsms-index.component';
import { CtvPromotionsService } from './services/ctvpromotions.service';
import { ThemeComponent } from './theme/theme.component';
import { ThemeEditComponent } from './theme/theme-edit/theme-edit.component';
import { ThemesService } from './services/themes.service';
import { SuppliersService } from './services/suppliers.service';
import { SupplierEditComponent } from './supplier/supplier-edit/supplier-edit.component';
import { SupplierComponent } from './supplier/supplier.component';
import { LevelComponent } from './level/level.component';
import { LevelEditComponent } from './level/level-edit/level-edit.component';
import { LevelsService } from './services/levels.service';
import { PopupsEditComponent } from './popups/popups-edit/popups-edit.component';
import { PopupsComponent } from './popups/popups.component';
import { PopupsService } from './services/popups.service';
import { GetinfoComponent } from './client/getinfo/getinfo.component';
import { ConnectPartnerComponent } from './client/connect-partner/connect-partner.component';
import { ConfigCodComponent } from './client/config-cod/config-cod.component';
import { DomainsService } from './services/domains.service';
import { OrderClientEditComponent } from './doanh-nghiep/order-client/order-client-edit/order-client-edit.component';
import { SendSmsComponent } from './send-sms/send-sms.component';
import { FeedsComponent } from './feeds/feeds.component';
import { FeedsService } from './services/feeds.service';
import { FeedsEditComponent } from './feeds/feeds-edit/feeds-edit.component';
import { MetaAppsService } from './services/metaapps.service';
import { PortalsService } from './services/portals.service';
import { AdminApproveProductComponent } from './doanh-nghiep/product-approve/product-approve.component';
import { AdminApproveProductRateComponent } from './doanh-nghiep/product-approve/admin-approve-product-rate/admin-approve-product-rate.component';
import { AdminApproveCommentComponent } from './doanh-nghiep/product-approve/admin-approve-comment/admin-approve-comment.component';
import { AdminProductEditComponent } from './doanh-nghiep/product-approve/admin-product-edit/admin-product-edit.component';
import { StatementHistoriesComponent } from './statements/statements-histories/statements-histories.component';
import { PointAdminComponent } from './statements/point-admin/point-admin.component';
import { PointPersonalComponent } from './statements/point-personal/point-personal.component';
import { RutDiemCaNhanEditComponent } from './statements/point-personal/point-withdraw-edit/point-withdraw-edit.component';
import { StatementHistoriesAdminComponent } from './statements/statements-histories-admin/statements-histories-admin.component';
import { PointPersonalEditComponent } from './statements/point-personal/point-personal-edit/point-personal-edit.component';
import { PointErrorEditComponent } from './statements/point-admin/point-error-edit/point-error-edit.component';
import { PointDepositAdminEditComponent } from './statements/point-admin/point-deposit-admin-edit/point-deposit-admin-edit.component';
import { PointDepositPersonalEditComponent } from './statements/point-personal/point-deposit-edit/point-deposit-edit.component';
import { OrderAdminComponent } from './admin/order-admin/order-admin.component';
import { OrderAdminEditComponent } from './admin/order-admin/order-admin-edit/order-admin-edit.component';
import { ListFavoritesComponent } from './ctv/list-favorites/list-favorites.component';
import { OrderStatusUpdateComponent } from './doanh-nghiep/order-client/order-status-update/order-status-update.component';
import { ShipConfigsService } from './services/ShipConfigs.service';
import { ActionsService } from './services/actions.service';
import { OrderActionsService } from './services/orderactions.service';
import { OrderActionsUpdateComponent } from './doanh-nghiep/order-client/order-actions-update/order-actions-update.component';
import { AhamoveService } from './services/ahamove.service';
import { OrdersMultiActionComponent } from './doanh-nghiep/order-client/orders-multi-action/orders-multi-action.component'
import { OrdersMultiShipComponent } from './doanh-nghiep/order-client/orders-multi-ship/orders-multi-ship.component'
// import { GMapModule } from 'primeng/primeng';
import { CSKHCTVComponent } from './group/cskh-ctv/cskh-ctv.component'
import { OrdersDetailShipComponent } from './doanh-nghiep/order-client/orders-detail-ship/orders-detail-ship.component'
import { MapComponent } from './doanh-nghiep/order-client/map/map.component'
import { DiaChiComponent } from './ctv/dia-chi/dia-chi.component';
import { DiaChiEditComponent } from './ctv/dia-chi/dia-chi-edit/dia-chi-edit.component';
import { UserAddressUserService } from './services/useraddressUser.service';
import { UsersClientComponent } from './client/users-client/users-client.component';
import { AppRolesService } from '../services/approles.service';
import { ShopsService } from './services/shops.service';
import { ShopsComponent } from './shops/shops.component';
import { UsersShopComponent } from './shops/users-shop/users-shop.component';
import { ShopsEditComponent } from './shops/edit/shops-edit.component';
import { OrderShopClientComponent } from './shops-client/order-clients/order-shop-client.component'
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { ShopProductsComponent } from './shops-client/shop-products/shop-products.component'
import { ShopProductsService } from './services/shopProducts.service';
import { ShopHistoriesComponent } from './shops-client/shop-products/shop-histories/shop-histories.component';
import { ShopProductsEditComponent } from './shops-client/shop-products/shop-products-edit/shop-products-edit.component';
import { ShopInOutsComponent } from './shops-client/shop-in-outs/shop-in-outs.component';
import { ShopInOutsEditComponent } from './shops-client/shop-in-outs/shop-in-outs-edit/shop-in-outs-edit.component';
import { ShopInOutsService } from './services/shopInOuts.service';
import { FoodsService } from './services/foods.service';
import { FoodsComponent } from './foods/foods.component';
import { FoodsEditComponent } from './foods/foods-edit/foods-edit.component';
import { PromotionUsersService } from './services/promotionUsers.service';
import { PromotionUserProductsService } from './services/promotionUserProducts.service';
import { PromotionUsersComponent } from './promotionUser/promotionUser.component';
import { PromotionUsersEditComponent } from './promotionUser/promotionUser-edit/promotionUser-edit.component';
import { FoodCategoriesService } from './services/foodcategories.service';
import { FoodCategoryComponent } from './foodcategory/foodcategory.component';
import { FoodCategoryEditComponent } from './foodcategory/foodcategory-edit/foodcategory-edit.component';
import { PromotionUserUserUsedComponent } from './promotionUser/promotionUser-UserUsed/promotionUser-UserUsed.component';
import { PromotionUserUsedComponent } from './promotion/promotion-UserUsed/promotion-UserUsed.component';
import { DataViewModule } from 'primeng/dataview';
import { FeedbackCategoriesService } from './services/feedbackCategories.service';
import { FeedbackStatusService } from './services/feedbackStatus.service';
import { ChatTopicsService } from './services/ChatTopics.service';
import { OrderDetailsService } from './services/orderdetails.service';
import { PromotionUserGiftcodeComponent } from './promotionUser/promotionUser-Giftcode/promotionUser-Giftcode.component';
import { VnInvoiceService } from './services/vninvoices.service';
import { OrderInvoiceComponent } from './order-invoice/order-invoice.component';
import { CreateInvoiceComponent } from './order-invoice/create/create-invoice.component';
import { CompanysService } from './services/companys.service';
import { InvoiceTemplatesService } from './services/invoicetemplates.service';
import { EInvoicesService } from './services/einvoices.service';
import { InvoiceComponent } from './invoice/invoice.component';
import { OrdersMessageService } from './services/ordersMessage.service';
import { OrdersMessageComponent } from './ordersMessage/ordersMessage.component';
import { OrdersMessageEditComponent } from './ordersMessage/ordersMessage-edit/ordersMessage-edit.component';
import { PromotionUsersGiftProductsService } from './services/promotionUsersGiftProducts.service';
import { CompanysComponent } from './Company/companys.component';
import { ProductCategoriesService } from './services/ProductCategories.service';
import { PromotionUserAccumulationComponent } from './promotionUser/promotionUser-accumulation/promotionUser-accumulation.component';

export function getVsComponentConfigProvider() {
    return PS_COMPONENT_CONFIG;
}
@NgModule({
    imports: [
        DapFoodRoutes,
        TranslateModule,
        CommonModule,
        DialogModule,
        ButtonModule,
        PanelModule,
        RatingModule,
        ConfirmDialogModule,
        CheckboxModule,
        ToastModule,
        SplitButtonModule,
        TableModule,
        FieldsetModule,
        TooltipModule,
        ReactiveFormsModule,
        FormsModule,
        FormioModule,
        InputSwitchModule,
        CalendarModule,
        DropdownModule,
        InputTextModule,
        SelectButtonModule,
        DynamicDialogModule,
        InputTextareaModule,
        EditorModule,
        RadioButtonModule,
        FileUploadModule,
        ListboxModule,
        ContextMenuModule,
        TabViewModule,
        PaginatorModule,
        TreeModule,
        MultiSelectModule,
        ProgressSpinnerModule,
        OverlayPanelModule,
        MenuModule,
        AutosizeModule,
        AutoCompleteModule,
        NgxMaskModule.forRoot({
            showMaskTyped: true,
        }),
        AccordionModule,
        TreeTableModule,
        ClipboardModule,
        VsSharedModule.forRoot(getVsComponentConfigProvider),
        // GMapModule,
        AngularDualListBoxModule,
        DataViewModule,
    ],
    entryComponents: [
        ChoosePromotionComponent,
        ChooseGiftComponent,
        OrderStatusUpdateComponent,
        OrderActionsUpdateComponent,
        ShopProductsEditComponent,
        CustomerInfoComponent,
        TagsEditComponent,
        CskhCtvDetailComponent,
    ],
    providers: [
        ProductService,
        ClientsService,
        PartnerClientsService,
        SourceService,
        OrdersService,
        OrderDetailsService,
        StatusService,
        ProductRegService,
        ProvincesService,
        DistrictsService,
        WardsService,
        ContentService,
        CategoriesService,
        // ProductCategoriesService,
        DealTypesService,
        SignalRService,
        OrderStatusService,
        BannersService,
        BannercategoriesService,
        StatementsService,
        FaqsService,
        GroupsService,
        GroupRegsService,
        PointsService,
        LogSmsService,
        ReportService,
        BrandsService,
        CountriesService,
        PromotionsService,
        PromotionProductsService,
        FlashSaleTimesService,
        DialogService,
        OrderGiftsService,
        GiftsService,
        CtvPromotionsService,
        NotificationsService,
        ThemesService,
        SuppliersService,
        LevelsService,
        PopupsService,
        DomainsService,
        FeedsService,
        ShipConfigsService,
        MetaAppsService,
        PortalsService,
        ActionsService,
        OrderActionsService,
        AhamoveService,
        UserAddressUserService,
        AppRolesService,
        ShopsService,
        ShopProductsService,
        ShopInOutsService,
        FoodsService,
        PromotionUsersService,
        PromotionUserProductsService,
        FoodCategoriesService,
        FeedbacksService,
        FeedbackCategoriesService,
        FeedbackStatusService,
        OmiCallLogsService,
        ChatsService,
        ChatTopicsService,
        NewsService,
        VnInvoiceService,
        CompanysService,
        InvoiceTemplatesService,
        EInvoicesService,
        TagsService,
        NewsCategoriesService,
        OrdersMessageService,
        PromotionUsersGiftProductsService,
        PathologiesService,
        PathologiesCategoryService,
        LessonsService,
    ],
    declarations: [
        DashBoardComponent,
        ProductComponent,
        ProductEditComponent,
        ProductViewComponent,
        ProductDangKyComponent,
        ClientComponent,
        PhanTramPipe,
        ClientEditComponent,
        OrdersComponent,
        OrderEditComponent,
        OrderAdminComponent,
        OrderClientComponent,
        OrderInvoiceComponent,
        InvoiceComponent,
        OrderAdminEditComponent,
        ContentEditComponent,
        ContentViewComponent,
        StatementHistoriesComponent,
        OrderHistoryComponent,
        PointAdminComponent,
        PointPersonalComponent,
        PointErrorEditComponent,
        RutDiemCaNhanEditComponent,
        PointDepositAdminEditComponent,
        BannerComponent,
        BannerEditComponent,
        FaqComponent,
        FaqEditComponent,
        PointDepositPersonalEditComponent,
        AdminApproveProductComponent,
        StatementHistoriesAdminComponent,
        GroupComponent,
        GroupEditComponent,
        GroupDangKyComponent,
        OrderLeaderComponent,
        GroupPheDuyetComponent,
        GroupMoiThanhVienComponent,
        MyGroupComponent,
        AdminApproveProductRateComponent,
        PointPersonalEditComponent,
        BrandComponent,
        BrandEditComponent,
        PromotionsComponent,
        PromotionsEditComponent,
        ThemeComponent,
        ThemeEditComponent,
        LevelComponent,
        LevelEditComponent,
        SupplierComponent,
        SupplierEditComponent,
        ChoosePromotionComponent,
        CategoryComponent,
        CategoryEditComponent,
        ChooseGiftComponent,
        NotificationComponent,
        NotificationEditComponent,
        GiftComponent,
        GiftEditComponent,
        GroupTagComponent,
        OrderRatingComponent,
        GioiThieuIndexComponent,
        LogSmsIndexComponent,
        PopupsComponent,
        PopupsEditComponent,
        GetinfoComponent,
        ConnectPartnerComponent,
        ConfigCodComponent,
        AdminApproveCommentComponent,
        OrderClientEditComponent,
        SendSmsComponent,
        AdminProductEditComponent,
        FeedsComponent,
        FeedsEditComponent,
        ListFavoritesComponent,
        OrderStatusUpdateComponent,
        OrderActionsUpdateComponent,
        OrdersMultiActionComponent,
        OrdersMultiShipComponent,
        CSKHCTVComponent,
        OrdersDetailShipComponent,
        MapComponent,
        DiaChiComponent,
        DiaChiEditComponent,
        UsersClientComponent,
        ShopsComponent,
        UsersShopComponent,
        ShopsEditComponent,
        OrderShopClientComponent,
        ShopProductsComponent,
        ShopHistoriesComponent,
        ShopProductsEditComponent,
        ShopInOutsComponent,
        ShopInOutsEditComponent,
        FoodsComponent,
        FoodsEditComponent,
        PromotionUsersComponent,
        PromotionUsersEditComponent,
        FoodCategoryComponent,
        FoodCategoryEditComponent,
        PromotionUserUserUsedComponent,
        FeedbackComponent,
        FeedbackEditComponent,
        PromotionUserUsedComponent,
        OmicallLogComponent,
        CskhComponent,
        NewsComponent,
        NewsEditComponent,
        OrderDetailsComponent,
        PromotionUserGiftcodeComponent,
        PromotionUserAccumulationComponent,
        CreateInvoiceComponent,
        OrderDetailsEditComponent,
        CustomerInfoComponent,
        TagsComponent,
        TagsEditComponent,
        NewsCategoryComponent,
        CskhCtvDetailComponent,
        OrdersMessageComponent,
        OrdersMessageEditComponent,
        CompanysComponent,
        OrderDetailRatingComponent,
        PathologiesComponent,
        PathologyCategoriesComponent,
        PathologiesEditComponent,
    ]
})
export class DapFoodModule { }
