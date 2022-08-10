import axios from "axios";
import { atom, selector } from "recoil";

export const authCheckState = atom({
  key: "authCheckState",
  default: false,
});

export const authUserState = atom({
  key: "authUserState",
  default: [],
});

// export const authUserState = selector({
//     key: 'authUserState',
//     get: async ({ get }) => {
//         get(authCheckState);
//         try {
//             const { data } = await axios.get('/api/me');
//             return data.data;
//         } catch (error) {
//             console.log(error.message);
//         }
//     }
// });
