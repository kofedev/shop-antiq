import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductExplorerComponent } from "./components/product/product-explorer/product-explorer.component";
import {ProductInfoComponent} from "./components/product/product-info/product-info.component";
import {CartPageComponent} from "./components/cart/cart-page/cart-page.component";
import {AboutComponent} from "./components/common/about/about.component";
import {ContactsComponent} from "./components/common/contacts/contacts.component";
import {ErrorComponent} from "./components/common/error/error.component";
import {ShoppingComponent} from "./components/common/shopping/shopping.component";

const routes: Routes = [
  {path: '', component: ProductExplorerComponent},
  {path: 'product/explore/:querystring', component: ProductExplorerComponent},
  {path: 'product/explore', component: ProductExplorerComponent},
  {path: 'product/:productId', component: ProductInfoComponent},
  {path: 'cart', component: CartPageComponent},
  {path: 'about', component: AboutComponent},
  {path: 'shopping', component: ShoppingComponent},
  {path: 'contact', component: ContactsComponent},
  {path: '**', component: ErrorComponent},
  {path: 'error', component: ErrorComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
