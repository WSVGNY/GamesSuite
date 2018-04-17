import { TestBed, inject } from "@angular/core/testing";

import { StateFactoryService } from "./state-factory.service";
import { ServiceLoaderService } from "../../service-loader/service-loader.service";

describe("StateFactoryService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [StateFactoryService, ServiceLoaderService]
        });
    });

    it("should be created", inject([StateFactoryService], (service: StateFactoryService) => {
        expect(service).toBeTruthy();
    }));
});
