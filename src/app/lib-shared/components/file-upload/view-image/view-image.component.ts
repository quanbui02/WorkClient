import {
    Component,
    OnInit,
    forwardRef,
    Input,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { VsFileUploadService } from '../services/file-upload.service';
import { ModuleConfigService } from '../../../services/module-config.service';
import { FileUpload } from 'primeng/primeng';
import { environment } from '../../../../../environments/environment';
import { ComponentBase } from '../../../classes/base/component-base';

@Component({
    selector: 'vs-view-image',
    templateUrl: './view-image.component.html',
    styleUrls: ['./view-image.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VsViewImageComponent extends ComponentBase implements OnInit {
    @Input() file = '';
    @Input() width = 80;
    @Input() height = 80;
    @Input() class = '';
    @Input() size = 'avatar';
    @Input() defaultNoImageUrl = 'assets/images/no_image.jpg';
    @ViewChild(FileUpload) fileControl: FileUpload;
    rawFileName = '';
    apiUrl = '';
    uploading = false;

    // constructor(
    // ) {
    // }

    ngOnInit() { }

    getImageUrl() {
        if (this.file) {
            if (this.file.indexOf('=') > 0) {
                return this.file;
            } else {
                if (this.size === 'avatar' || this.size === 'a') {
                    return this.getImageAvatar(this.file);
                } else if (this.size === 'medium' || this.size === 'm') {
                    return this.getImageMedium(this.file);
                } else if (this.size === 'large' || this.size === 'l') {
                    return this.getImageLarge(this.file);
                } else if (this.size === 'original' || this.size === 'o') {
                    return this.getImageOriginal(this.file);
                }
            }
        } else {
            return this.defaultNoImageUrl;
        }
    }

    onError(ev) {
        ev.srcElement.src = this.defaultNoImageUrl;
    }
}
