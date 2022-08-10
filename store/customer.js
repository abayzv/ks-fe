import axios from "axios";
import { atom, selector } from "recoil";

export const getCustomer = selector({
  key: "getCustomer",
  get: async () => {
    try {
      const { data } = await axios.get("/api/customer");
      return data.data;
    } catch (error) {
      console.log(error.message);
    }
  },
});
