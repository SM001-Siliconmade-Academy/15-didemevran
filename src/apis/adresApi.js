import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const adresApi = createApi({
    reducerPath: "adresApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://api.kadircolak.com/Konum/JSON/API/" }),
    endpoints: (builder) => ({
        getAllCities: builder.query({
            query: () => "ShowAllCity",
        }),
        getDistrictsbyPlate: builder.query({
            query: (plate) => `ShowDistrict?plate=${plate}`,
        }),
        getTownsbyPlateAndDistrict: builder.query({
            query: ({ plate, district }) => `ShowTown?plate=${plate}&district=${district}`,
        })
    }),
});

export const { useGetAllCitiesQuery, useGetDistrictsbyPlateQuery, useGetTownsbyPlateAndDistrictQuery } = adresApi;