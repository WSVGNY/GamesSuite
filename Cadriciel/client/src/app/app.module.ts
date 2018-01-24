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
import { EditorComponent } from './jeu-course/editor/editor.component';
import { EditorRenderService }from "./jeu-course/editor-render-service/editor-render.service";
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
        AppRoutingModule,
        FormsModule
    ],
    providers: [
        RenderService,
        BasicService,
        EmptyGridService,
        PistesService,
        EditorRenderService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
