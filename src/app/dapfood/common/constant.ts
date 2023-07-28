// Trạng thái phê duyệt
export enum EnumStatus {
    Pending = 0,
    Active = 1,
    Cancel = 2,
    Reject = 3
}

// Loại giao dịch
export enum DealType {
    Thuong = 1,
    HoanLai = 2,
    NapDiem = 3,
    RutDiem = 4,
    HoanDiemRut = 5,
    CongDiemDonHangDN = 6,
    TruDiemLenDonTrucTiep = 7,
    DongBang = 8,
}

// Trạng thái giao dịch 
export enum StatementStatus {
    ChuaXuLy = 0,
    ThanhCong = 1,
    DangXuLy = 2,
    Huy = 3,
    Loi = 4,
}

//Trạng thái đăng ký
export enum ProductRegStatus {
    ChoDuyet = 0,
    DaDuyet = 1,
    Huy = 2,
    TuChoi = 3,
}
// Trạng thái giao dịch 
export enum PointStatus {
    ChuaXuLy = 0,
    DangXuLy = 1,
    Huy = 2,
    KTDuyetThanhCong = 3,
    KTDuyetThatBai = 4,
    AdminDuyetThanhCong = 5,
    AdminDuyetThatBai = 6,
    Loi = 7,
    ThanhCong = 8
}

// // Chốt đơn hoặc hủy đơn
// export enum ActionsOrderType {
//     ConfirmedOrder = 1,     // Chốt đơn
//     CancelOrder = 2,  // Hủy đơn
//     CreateLogisticsOrder = 20,   // Đăng đơn
//     CancelLogisticsOrder = 4,   // Hủy đăng đơn
//     ChangeContactCode = 5,  // Đổi mã vận đơn
//     SyncLogisticStatus = 6,  // Cập nhật trạng thái giao hàng mới
//     CancelContactForBusinesses = 7  // Hủy chốt đơn
// }

export enum EnumOrderStatus {
    DaXacNhan = 1,
    DangChuanBiHang = 2,
    HoanGiaoHang = 3,
    DaChuanBiHangXong = 20,
    DaLayHang = 21,
    KhongLayDuocHang = 22,
    DangGiaoHang = 30,
    DaGiaoHang = 31,
    KhongGiaoDuoc = 33,
    YeuCauGiaoLai = 34,
    DangHoan = 40,
    DaHoan = 41,
    HuyDon = 999,
    ChuaXacNhan = 1000
}

export enum PromotionType {
    TongTien = 1,
    SanPham = 2,
    Code = 3,
    GiamTrucTiepTrenDonHang = 4,
}
