import { TestBed } from '@angular/core/testing';

import { RestApiService } from './rest-api.service';
import { NbLayoutModule, NbThemeModule, NbToastrModule } from '@nebular/theme';
import { HttpClientModule } from '@angular/common/http';

describe('RestApiService', () => {
    let service: RestApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                NbToastrModule.forRoot(),
                NbThemeModule.forRoot(),
                NbLayoutModule,
            ],
        });
        service = TestBed.inject(RestApiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
