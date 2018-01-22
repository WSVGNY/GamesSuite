import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';

import { AppComponent } from "./app.component";

import { RenderService } from "./jeu-course/render-service/render.service";
import { BasicService } from "./basic.service";
import { AppRoutingModule } from './app-routing/app-routing.module';
import { MotCroiseComponent } from './mot-croise/mot-croise.component';
import { EmptyGridService } from "./mot-croise/empty-grid.service";
import { AdminComponent } from './jeu-course/admin/admin.component';
import { JeuCourseComponent } from "./jeu-course/jeu-course.component";
import { PistesService } from './jeu-course/pistes-service/pistes.service';
@NgModule({
    declarations: [
        AppComponent,
        AdminComponent,
        JeuCourseComponent,
        MotCroiseComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [
        RenderService,
        BasicService,
        EmptyGridService,
        PistesService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
