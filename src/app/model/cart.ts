import {CartCell} from "./cart-cell";

export interface Cart {
  // cart data
  cartCells: CartCell[];
  total?: number; // summary cost
  // customer's personal data
  name: string;
  phone: string;
  email: string;
  isInterestLetterSent: boolean;
  lastVisit: Date;
  // system data
  createdDate: Date;
  message: string;
  searches?: string[]
  // current language
  languageId?: number;
  languageCode?: string;
  letterMessage?: string;
}
