import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../services/firebase";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    addCustomer: builder.mutation({
      async queryFn({
        values,
        date,
        selectedCityName,
        selectedDistrict,
        selectedTown,
        kvkkChecked,
        bankAgreementChecked,
      }) {
        const data = {
          tcKimlikNo: values.tcKimlikNo,
          kimlikSeriNo: values.kimlikSeriNo,
          dogumTarihi: date.toLocaleDateString(),
          cepTel: values.cepTelefonu,
          city: selectedCityName,
          district: selectedDistrict,
          town: selectedTown,
          kvkkChecked: kvkkChecked,
          bankAgreementChecked: bankAgreementChecked,
        };
        const docRef = await addDoc(collection(db, "customers"), data);
        return { data: docRef.id };
      },
    }),
  }),
});

export const { useAddCustomerMutation } = customerApi;
