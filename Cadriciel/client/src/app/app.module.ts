import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";

import { RenderService } from "./jeu-course/render-service/render.service";
import { BasicService } from "./basic.service";
import { AppRoutingModule } from './app-routing/app-routing.module';
import { MotCroiseComponent } from './mot-croise/mot-croise.component';
import { AdminComponent } from './jeu-course/admin/admin.component';
import { JeuCourseComponent } from "./jeu-course/jeu-course.component";
import { PistesService } from './jeu-course/pistes-service/pistes.service';
import { EditorComponent } from './jeu-course/editor/editor.component';
@NgModule({
    declarations: [
        AppComponent,
        AdminComponent,
        JeuCourseComponent,
        MotCroiseComponent,
        EditorComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule
    ],
    providers: [
        RenderService,
        BasicService,
        PistesService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
