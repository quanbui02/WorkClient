export const environment = {
    production: true,
    hmr: false,
    appMetadata: {
        appDomain: {
            title: 'DAPFOOD.COM',
            owner: 'DAPFOOD.COM',
            logo: 'assets/images/logo-dapfood-x-w.png',
        }
    },
    apiDomain: {
        gateway: 'https://devapi.dapfood.com',
        authenticationEndpoint: 'https://devaccount.dapfood.com',
        authorizationEndpoint: 'https://devapi.dapfood.com/authorization.api',
        fileEndpoint: 'https://devapi.dapfood.com/file.api',
        notificationEndpoint: 'https://devnotification.dapfood.com',
        dapWorkEndPoint: 'http://localhost:32007',
        dapFoodEndPoint: 'http://localhost:31008',
        dapEInvoiceEndPoint: 'http://localhost:32009',
        logEndPoint: 'https://devapi.dapfood.com/log',
    },
    clientDomain: {
        appDomain: 'https://dapfood.com',
        qthtDomain: 'https://admin.dapfood.com',
        friendDomain: 'https://dev.dapfood.net',
        idPhanhe: 3,
    },
    authenticationSettings: {
        clientId: 'dapfood',
        issuer: 'https://account.dapfood.com'
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