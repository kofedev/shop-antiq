import { Injectable } from '@angular/core';
import Dexie from "dexie";
import {CartData} from "../model/cart-data";

@Injectable({
  providedIn: 'root'
})
export class LocalDatabaseService extends Dexie  {

  myTable!: Dexie.Table<CartData, number>;

  constructor() {

    super('CartBase');
    // Define the schema
    this.version(1).stores({
      myTable: '++id, cart',
    });

    // Set the reference to the table
    this.myTable = this.table('myTable');
  }

  addData(data: CartData): Promise<number> {
    return this.myTable.add(data);
  }

  addCartDataById(id: number, cartData: CartData): Promise<number> {
    return this.myTable.put({ ...cartData, id });
  }

  getAllData(): Promise<CartData[]> {
    return this.myTable.toArray();
  }

  getCartDataById(id: number): Promise<CartData | undefined> {
    return this.myTable.get(id) as Promise<CartData | undefined>;
  }

}
