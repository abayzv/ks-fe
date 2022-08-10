import axios from "axios";
import { atom, selector } from "recoil";

export const getQueue = selector({
  key: "getQueue",
  get: async () => {
    try {
      const { data } = await axios.get("/api/queue");
      return data.data;
    } catch (error) {
      console.log(error.message);
    }
  },
});
