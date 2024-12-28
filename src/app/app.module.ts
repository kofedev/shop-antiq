import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductExplorerComponent } from './components/product/product-explorer/product-explorer.component';
import { HttpClientModule } from "@angular/common/http";
import { ProductSmallComponent } from './components/product/product-small/product-small.component';
import { ImageSmallComponent } from './components/product/image-small/image-small.component';
import { ImageByMainPipe } from './pipes/image-by-main.pipe';
import { ProductInfoComponent } from './components/product/product-info/product-info.component';
import { LanguageSelectorComponent } from './components/language/language-selector/language-selector.component';
import { ImageGroupComponent } from './components/product/image-group/image-group.component';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';
import { FormsModule } from "@angular/forms";
import { SearchProductComponent } from './components/searcher/search-product/search-product.component';
import { CartComponent } from './components/cart/cart/cart.component';
import { CartPageComponent } from './components/cart/cart-page/cart-page.component';
// import { CategoryItemComponent } from './components/category/category-item/category-item.component';
// import { CategoryExplorerComponent } from './components/category/category-explorer/category-explorer.component';
import { AboutComponent } from './components/common/about/about.component';
import { ContactsComponent } from './components/common/contacts/contacts.component';
import { ErrorComponent } from './components/common/error/error.component';
import { ShoppingComponent } from './components/common/shopping/shopping.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductExplorerComponent,
    ProductSmallComponent,
    ImageSmallComponent,
    ImageByMainPipe,
    ProductInfoComponent,
    LanguageSelectorComponent,
    ImageGroupComponent,
    SanitizeHtmlPipe,
    SearchProductComponent,
    CartComponent,
    CartPageComponent,
    // CategoryItemComponent,
    // CategoryExplorerComponent,
    AboutComponent,
    ContactsComponent,
    ErrorComponent,
    ShoppingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
