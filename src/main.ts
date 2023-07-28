import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { hmrBootstrap } from './hmr';


if (environment.production) {
    try {
        // document.write(`<script type="text/javascript" src="${documentServer}/web-apps/apps/api/documents/api.js"></script>`);
    } catch (e) {
        console.error('cannot load document server');
    }

    enableProdMode();
}


const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);


if (environment.hmr) {
    if (module['hot']) {
        hmrBootstrap(module, bootstrap);
    } else {
        console.error('Ammm.. HMR is not enabled for webpack');
    }
} else {
    bootstrap().catch(err => console.log(err));
}
