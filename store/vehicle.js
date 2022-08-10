import axios from "axios";
import { atom, selector } from "recoil";

export const getVehicle = selector({
  key: "getVehicle",
  get: async () => {
    try {
      const { data } = await axios.get("/api/vehicle");
      return data.data;
    } catch (error) {
      console.log(error.message);
    }
  },
});
