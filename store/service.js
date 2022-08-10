import axios from "axios";
import { atom, selector } from "recoil";

export const getService = selector({
  key: "getService",
  get: async () => {
    try {
      const { data } = await axios.get("/api/service");
      return data.data;
    } catch (error) {
      console.log(error.message);
    }
  },
});
