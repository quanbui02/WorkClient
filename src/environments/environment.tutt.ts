export const environment = {
   production: true,
   hmr: false,
   appMetadata: {
      appDomain: {
         title: 'dapfood.net',
         owner: 'dapfood.net',
         logo: 'assets/images/logo-dapfood-x-w.png',
      }
   },
   apiDomain: {
      gateway: 'https://devapi.dapfood.net',
      authenticationEndpoint: 'https://devaccount.dapfood.net',
      authorizationEndpoint: 'https://devapi.dapfood.net/authorization.api',
      fileEndpoint: 'https://devapi.dapfood.net/file.api',
      notificationEndpoint: 'https://devnotification.dapfood.net',
      dapFoodEndPoint: 'https://devapi.dapfood.net/dapfood.api',
      dapWorkEndPoint: 'http://localhost:32007',
      dapEInvoiceEndPoint: 'https://devapi.dapfood.net/dapeinvoice',
      linkEndPoint: 'https://devapi.dapfood.net/weblink',
      logEndPoint: 'https://devapi.dapfood.net/log'
   },
   clientDomain: {
      appDomain: 'https://dev.dapfood.net',
      qthtDomain: 'https://devadmin.dapfood.net',
      friendDomain: 'https://dev.dapfood.net',
      idPhanhe: 3,
   },
   authenticationSettings: {
      clientId: 'dapfood',
      issuer: 'https://devaccount.dapfood.net'
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
      apiKey: 'AIzaSyAT7El0qT5wMtbjX91UpPIZrtyVd6hnwAo',
      authDomain: 'dapfood-90ada.firebaseapp.com',
      databaseURL: 'https://devdapfood-90ada.firebaseio.com',
      projectId: 'dapfood-90ada',
      storageBucket: 'dapfood-90ada.appspot.com',
      messagingSenderId: '729900142463',
      appId: '1:729900142463:web:bb8698bb2011fad3fb944a',
      measurementId: 'G-1M9VDRK7ZM'
   }
}