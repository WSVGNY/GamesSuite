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
import { JeuCourseComponent } from "./jeu-course/jeu-course.component";

@NgModule({
    declarations: [
        AppComponent,
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
        EmptyGridService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
