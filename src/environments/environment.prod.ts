export const environment = {
    production: true,
    hmr: false,
    appMetadata: {
        appDomain: {
            title: 'handb.vn',
            owner: 'handb.vn',
            logo: 'assets/images/logo-dapfood-x-w.png',
        }
    },
    apiDomain: {
        gateway: 'https://api.handb.vn',
        authenticationEndpoint: 'https://account.handb.vn',
        authorizationEndpoint: 'https://api.handb.vn/authorization.api',
        fileEndpoint: 'https://api.handb.vn/file.api',
        notificationEndpoint: 'https://notification.handb.vn',
        dapFoodEndPoint: 'https://api.handb.vn/dapfood.api',
        dapWorkEndPoint: 'https://api.handb.vn/work.api',
        dapEInvoiceEndPoint: 'https://api.handb.vn/dapeinvoice',
        logEndPoint: 'https://api.handb.vn/log'
    },
    clientDomain: {
        appDomain: 'https://app.handb.vn',
        qthtDomain: 'https://admin.handb.vn',
        friendDomain: 'https://dev.dapfood.net',
        idPhanhe: 3,
    },
    authenticationSettings: {
        clientId: 'dapfood',
        issuer: 'https://account.handb.vn'
    },
    systemLogSetting: {
        enabled: false
    },
    signalr: {
        clientKey: 'dapfood',
        endpoint: '',
        linkDownloadClientApp: ''
    },
    signalrConfig: {
        hub: {
            notification: 'NotificationHub'
        },
        action: {
            notificationCreated: '',
            viewUpdated: ''
        }
    },
    firebaseConfig: {
        apiKey: 'AIzaSyBSkn5jUqD0N4PiiDEhsWyfPIws6TyNUho',
        authDomain: 'dapfood-firebase.firebaseapp.com',
        databaseURL: 'https://dapfood-firebase.firebaseio.com',
        projectId: 'dapfood-firebase',
        storageBucket: 'dapfood-firebase.appspot.com',
        messagingSenderId: '1088787441716',
        appId: '1:1088787441716:web:329c0dfd4356195f98c261',
        measurementId: 'G-RVEWV87V1P'
    }
}