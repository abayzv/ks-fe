import Layout from "../../components/Layout";
import Card from "../../components/Card";
import Link from "next/link";
import { Input, Label, Button, Error } from "../../components/Form";
import { useState } from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { authCheckState } from "../../store/auth";
import { useRouter } from "next/router";
import toaster from "toasted-notes";
import { now } from "moment-timezone";
export default function Login() {
  const [errors, setErrors] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const setAuth = useSetRecoilState(authCheckState);
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("api/login", form);
      toaster.notify(response.data.message, {
        position: "bottom-right",
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          user: response.data.data,
          expiry: Date.now() + 1 * 1000 * 60 * 60 * 24,
        })
      );
      router.replace("/dashboard");
    } catch (r) {
      toaster.notify(r.response.data.message, {
        position: "bottom-right",
      });
      setErrors(r.response.data.errors);
      setLoading(false);
    }
    setLoading(false);
  };
  return (
    <Layout middleware="guest" title="Login">
      <div className="mx-auto max-w-screen-sm px-4">
        <Card
          header={
            <>
              <h1 className="text-gray-800 text-xl font-semibold">Masuk</h1>
              <p className="text-sm text-gray-500">
                Silahkan masukan email dan password untuk melanjutkan
              </p>
            </>
          }
        >
          <form onSubmit={submitHandler}>
            <div className="mb-5">
              <Label htmlFor="email">Email</Label>
              <Input
                value={form.email}
                onChange={(e) =>
                  setForm((form) => ({ ...form, email: e.target.value }))
                }
                type="email"
                name="email"
                id="email"
              />
              {errors && errors.email && <Error message={errors.email} />}
            </div>
            <div className="mb-5">
              <Label htmlFor="password">password</Label>
              <Input
                value={form.password}
                onChange={(e) =>
                  setForm((form) => ({ ...form, password: e.target.value }))
                }
                type="password"
                name="password"
                id="password"
              />
              {errors && errors.password && <Error message={errors.password} />}
            </div>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  value={form.remember}
                  onChange={(e) =>
                    setForm((form) => ({ ...form, remember: e.target.value }))
                  }
                  type="checkbox"
                  name="remeber"
                  id="remember"
                  className="form-checkbox shadow-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200 rounded"
                />
                <label htmlFor="remember" className="ml-2">
                  Remember
                </label>
              </div>
              {/* <Link href="/forgot-password">
                <a className="text-blue-500 hover:underline">Forgot Password</a>
              </Link> */}
            </div>
            {isLoading ? (
              <Button color="bg-gray-500" disabled>
                Silahkan Tunggu
              </Button>
            ) : (
              <Button color="bg-gray-900">Masuk</Button>
            )}
          </form>
        </Card>
      </div>
    </Layout>
  );
}
