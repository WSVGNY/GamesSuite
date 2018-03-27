import { TestBed, inject } from '@angular/core/testing';

import { CameraManagerService } from './camera-manager.service';
import { KeyboardEventHandlerService } from '../event-handlers/keyboard-event-handler.service';

describe('CameraManagerService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CameraManagerService, KeyboardEventHandlerService]
        });
    });

    it('should be created', inject([CameraManagerService], (service: CameraManagerService) => {
        expect(service).toBeTruthy();
    }));
});
