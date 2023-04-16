import { configureStore } from "@reduxjs/toolkit";
import { adresApi } from "../apis/adresApi";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { customerApi } from "../apis/customerApi";

export const store = configureStore({
  reducer: {
    [adresApi.reducerPath]: adresApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(adresApi.middleware)
      .concat(customerApi.middleware),
});

setupListeners(store.dispatch);
