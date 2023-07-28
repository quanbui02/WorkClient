import { Injectable, Injector } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import * as JWT from 'jwt-decode';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { shareReplay, retry, catchError, map } from 'rxjs/operators';
import { ResponseResult, ResponsePagination } from '../models/response-result';
import { environment } from '../../../environments/environment';
import { VsAuthenService } from '../auth/authen.service';
import { User } from '../models/user';
import { BaseService } from './base.service';
import { VsCommonService } from './vs-common.service';

@Injectable()
export class UserService extends BaseService {
    readonly USER_INFO_KEY = 'user_info';
    readonly authenticationEndpoint = `${environment.apiDomain.authenticationEndpoint}/users`;
    readonly authorizationEndpoint = `${environment.apiDomain.authorizationEndpoint}/users`;
    readonly RETRY_COUNT: number = 0;
    readonly REPLAY_COUNT: number = 10;

    public tokenReceived = new Observable<any>();

    constructor(
        http: HttpClient,
        injector: Injector,
        private _oauthService: OAuthService,
        private _commonService: VsCommonService,

    ) {
        super(http, injector, `${environment.apiDomain.dapFoodEndPoint}/Users`);
    }

    cachedUserInfo: User;

    promises = [];
    isReady = false;

    returnPromises(): void {
        while (this.promises.length > 0) {
            const pr = this.promises.pop();
            const accessToken = this._oauthService.getAccessToken();
            const decoded: any = JWT(accessToken);
            this.getCurrentUser();
        }
        this.isReady = true;
    }

    handleError(error: any, injector: Injector) {
        // console.error('Có lỗi xảy ra', error);
        if (error.status === 401) {
            const authenService = injector.get(VsAuthenService);
            authenService.logout();
        } else {
        }
        return Promise.reject(error);
    }

    changePassword(item: any): Promise<ResponseResult> {
        const apiUrl = `${this.authenticationEndpoint}/ChangePassword`;
        return this.defaultPost(apiUrl, item);
    }

    Create(obj: any) {
        const queryString = `${this.authenticationEndpoint}/Create`;
        return this.defaultPost(queryString, obj);
    }

    Update(obj: any) {
        const queryString = `${this.authenticationEndpoint}/Update`;
        return this.defaultPost(queryString, obj);
    }

    CreateCB(obj: any) {
        const queryString = `${this.authenticationEndpoint}/CreateCB`;
        return this.defaultPost(queryString, obj);
    }

    UpdateCB(obj: any) {
        const queryString = `${this.authenticationEndpoint}/UpdateCB`;
        return this.defaultPost(queryString, obj);
    }

    getUsersByIdClient(id: any): Promise<ResponseResult> {
        const url = `${this.serviceUri}/getUsersByIdClient?idClient=${id}`;
        return this.defaultGet(url);
    }

    getUsersByIdShop(id: any): Promise<ResponseResult> {
        const url = `${this.serviceUri}/getUsersByIdShop?idShop=${id}`;
        return this.defaultGet(url);
    }

    UpdateGeneral(obj: any) {
        const queryString = `${this.serviceUri}/UpdateGeneral`;
        return this.defaultPost(queryString, obj);
    }
    UpdateOmicall(obj: any) {
        const queryString = `${this.serviceUri}/UpdateOmicall`;
        return this.defaultPost(queryString, obj);
    }
    UpdateBank(obj: any, code: string) {
        const queryString = `${this.serviceUri}/UpdateBank?code=${code}`;
        return this.defaultPost(queryString, obj);
    }
    UpdateCode(obj: any) {
        const queryString = `${this.serviceUri}/UpdateCode`;
        return this.defaultPost(queryString, obj);
    }
    UpdateCmt(obj: any) {
        const queryString = `${this.serviceUri}/UpdateCmt`;
        return this.defaultPost(queryString, obj);
    }

    GetsListKOL(key: string) {
        const url = `${this.serviceUri}/GetsListKOL?key=${key}`;
        return this.defaultGet(url);
    }

    getCaptchaUrl(): string {
        return `${this.authenticationEndpoint}/captcha?${Date.now()}&logSession=${sessionStorage.getItem('log_session_key')}`;
    }

    getBasicUserInfo(): User {
        const crrUser = new User();
        const accessToken = this._oauthService.getAccessToken();
        if (accessToken) {
            const claims: any = JWT(accessToken);

            if (claims) {
                crrUser.displayName = claims.displayname;
                crrUser.email = claims.email;
                // crrUser.fullName = claims.firstname.concat(' ', claims.lastname);
                crrUser.issuperuser = claims.issuperuser.toLowerCase() === 'true';
                crrUser.permissions = claims.permissions;
                crrUser.roleassign = claims.roleassign;
                crrUser.scope = claims.scope;
                crrUser.userId = claims.sub;
                crrUser.userName = claims.username;
                crrUser.avatar = claims.avatar;
                crrUser.roleassign = claims.roleassign; //list roles
            }
        }
        return crrUser;
    }

    async getCurrentUser(): Promise<User> {

        // Lấy thông tin từ cache nếu có
        if (localStorage.getItem(this.USER_INFO_KEY)) {
            try {
                return JSON.parse(localStorage.getItem(this.USER_INFO_KEY));
            } catch (e) { }
        }

        const crrUser = new User();
        const accessToken = this._oauthService.getAccessToken();
        if (accessToken) {
            const claims: any = JWT(accessToken);
            if (claims) {
                crrUser.displayName = claims.displayname;
                crrUser.email = claims.email;
                // crrUser.fullName = claims.firstname.concat(' ', claims.lastname);
                crrUser.issuperuser = claims.issuperuser.toLowerCase() === 'true';
                crrUser.permissions = claims.permissions;
                crrUser.scope = claims.scope;
                crrUser.userId = claims.sub;
                crrUser.idClient = claims.idClient;
                crrUser.idShop = claims.idShop;
                crrUser.idPortal = claims.idPortal;
                crrUser.userName = claims.username;
                crrUser.avatar = claims.avatar; //this._commonService.getFileUrl(claims.avatar);
                crrUser.roleassign = claims.roleassign; //list roles

                await this.getCurrent().then(rs => {
                    if (rs.status) {
                        crrUser.email = rs.data.email;
                        crrUser.avatar = rs.data.avatar;
                        crrUser.id = rs.data.id;
                        crrUser.idClient = rs.data.idClient;
                        crrUser.idShop = rs.data.idShop;
                        crrUser.name = rs.data.name;
                        crrUser.phone = rs.data.phone;
                        crrUser.idProvince = rs.data.idProvince;
                        crrUser.idDistrict = rs.data.idDistrict;
                        crrUser.idWard = rs.data.idWard;
                        crrUser.address = rs.data.address;
                        crrUser.isDeleted = rs.data.isDeleted;
                        crrUser.idBank = rs.data.idBank;
                        crrUser.bankFullName = rs.data.bankFullName;
                        crrUser.bankNumber = rs.data.bankNumber;
                        crrUser.bankCardNumber = rs.data.bankCardNumber;
                        crrUser.bankBranch = rs.data.bankBranch;
                        crrUser.idBankNavigation = rs.data.idBankNavigation;
                        crrUser.isOmiCall = rs.data.isOmiCall;
                        crrUser.omiCallSipUser = rs.data.omiCallSipUser;
                        crrUser.omiCallSecretKey = rs.data.omiCallSecretKey;
                        crrUser.omiCallDomain = rs.data.omiCallDomain;
                        localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(crrUser));
                    }
                });
            }
        }

        return crrUser;
    }
    PickSupportCTV(userId: number) {
        const queryString = `${this.serviceUri}/PickSupportCTV?userId=${userId}`;
        return this.defaultGet(queryString);
    }
    RemoveSupportCTV(userId: number) {
        const queryString = `${this.serviceUri}/RemoveSupportCTV?userId=${userId}`;
        return this.defaultGet(queryString);
    }
    PickKol(userId: number) {
        const queryString = `${this.serviceUri}/PickKol?userId=${userId}`;
        return this.defaultGet(queryString);
    }
    RemovePickKol(userId: number) {
        const queryString = `${this.serviceUri}/RemovePickKol?userId=${userId}`;
        return this.defaultGet(queryString);
    }
    RemoveSupportCTVForAdmin(userId: number) {
        const queryString = `${this.serviceUri}/RemoveSupportCTVForAdmin?userId=${userId}`;
        return this.defaultGet(queryString);
    }
    onSetLogout(userId: number, approve: boolean) {
        const queryString = `${this.serviceUri}/SetLogout?userId=${userId}&approve=${approve}`;
        return this.defaultGet(queryString);
    }
    Approved(userId: number, approve: boolean) {
        const queryString = `${this.serviceUri}/Approved`;
        const item: any = { userId: userId, approve: approve };
        return this.defaultPost(queryString, item);
    }
    ApprovedCmt(userId: number, approve: boolean) {
        const queryString = `${this.serviceUri}/ApprovedCmt`;
        const item: any = { userId: userId, approve: approve };
        return this.defaultPost(queryString, item);
    }
    AdminClient(userId: number, approve: boolean) {
        const queryString = `${this.serviceUri}/AdminClient`;
        const item: any = { userId: userId, approve: approve };
        return this.defaultPost(queryString, item);
    }
    GetByListId(listId: string) {
        const queryString = `${this.serviceUri}/GetByListId?listId=${listId}`;
        return this.defaultGet(queryString);
    }
    AutoComplete(key: string, offset?: number, limit?: number) {
        const queryString = `${this.serviceUri}/AutoComplete?key=${key}&offset=${offset}&limit=${limit}`;
        return this.defaultGet(queryString);
    }
    SearchNotInClient(key: string, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}/SearchNotInClient?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }
    SearchInClient(key: string, idClient: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}/SearchInClient?key=${key}&idClient=${idClient}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    gets(key: string, status: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false, isApproved: number = -1, idClient: number = -1) {
        const queryString = `${this.serviceUri}?key=${key}&status=${status}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}&isApproved=${isApproved}&idClient=${idClient}`;
        return this.defaultGet(queryString);
    }

    GetsInvited(key: string, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}/GetsInvited?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    GetsInvitedKOL(key: string, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}/GetsInvitedKOL?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    GetsInvitedKOLById(userId: number, key: string, fromDate: Date, toDate: Date, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        let fDate;
        let tDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        if (toDate) {
            tDate = toDate.toISOString();
        }

        const queryString = `${this.serviceUri}/GetsInvitedKOLById?userId=${userId}&key=${key}&fromDate=${fDate}&toDate=${tDate}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    GetsForSupport(key: string, idSupport: number, status: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}/GetsForSupport?key=${key}&idSupport=${idSupport}&status=${status}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    GetsForSupportCSKH(key: string, fromDate: Date, toDate: Date, idSupport: number, idProvince: number, status: number, isKol: number, idRef: number, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        let fDate;
        let tDate;
        if (fromDate) {
            fDate = fromDate.toISOString();
        }
        if (toDate) {
            tDate = toDate.toISOString();
        }

        const queryString = `${this.serviceUri}/GetsForSupportCSKH?key=${key}&fromDate=${fDate}&toDate=${tDate}&idSupport=${idSupport}&idProvince=${idProvince}&status=${status}&isKol=${isKol}&isKol=${isKol}&idRef=${idRef}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    GetByRoleName(RoleCode: string, offset?: number, limit?: number) {
        const queryString = `${this.authorizationEndpoint}/GetByRoleName?RoleCode=${RoleCode}&offset=${offset}&limit=${limit}`;
        return this.defaultGet(queryString);
    }
    managerment(term: string, pageIndex: number, pageSize: number, isActive: number, roleId: number, isDisable: number, isSuperUser: number) {
        const queryString = `${this.authorizationEndpoint}/managerment?term=${term}&pageIndex=${pageIndex}&pageSize=${pageSize}&isActive=${isActive}&roleId=${roleId}&isDisable=${isDisable}&isSuperUser=${isSuperUser}`;
        return this.defaultGet(queryString);
    }
    SearchNotInGroup(key: string, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}/SearchNotInGroup?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    getCurrent() {
        return this.defaultGet(`${this.serviceUri}/getCurrent`);
    }

    GetByUserId(userId: number) {
        return this.defaultGet(`${this.serviceUri}/GetByUserId?userId=${userId}`);
    }

    GetListTn(key: string, offset?: number, limit?: number, sortField?: string, isAsc: boolean = false) {
        const queryString = `${this.serviceUri}/GetListTn?key=${key}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    GetByDomain(key: string, domainStatus: number, offset?: number, limit?: number, sortField: string = '', isAsc: Number = 0) {
        const queryString = `${this.serviceUri}/GetByDomain?key=${key}&domainStatus=${domainStatus}&offset=${offset}&limit=${limit}&sortField=${sortField}&isAsc=${isAsc}`;
        return this.defaultGet(queryString);
    }

    LoadConfig() {
        return this.defaultGet(`${this.serviceUri}/LoadConfig`);
    }

    UpdateIsLogout() {
        return this.defaultGet(`${this.serviceUri}/UpdateIsLogout`);
    }

    GetListUserSip() {
        const queryString = `${this.serviceUri}/GetListUserSip`;
        return this.defaultGet(queryString);
    }
    GetListUserInstructor() {
        const queryString = `${this.serviceUri}/GetListUserInstructor`;
        return this.defaultGet(queryString);
    }

}
