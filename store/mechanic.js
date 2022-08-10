import axios from "axios";
import { atom, selector } from "recoil";

export const getMechanic = selector({
  key: "getMechanic",
  get: async () => {
    try {
      const { data } = await axios.get("/api/mechanic");
      return data.data;
    } catch (error) {
      console.log(error.message);
    }
  },
});
