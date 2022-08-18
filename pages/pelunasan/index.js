import { useRecoilValueLoadable } from "recoil";
import Container from "../../components/Container";
import Layout from "../../components/Layout";
import { getCustomer } from "../../store/customer";
import DataTable from "react-data-table-component";
import axios from "axios";
import { useEffect, useState } from "react";
import toaster from "toasted-notes";
import { authUserState } from "../../store/auth";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { id } = router.query;
  const authUser = useRecoilValueLoadable(authUserState);
  const [data, setData] = useState([]);
  const [dataInvoice, setDataInvoice] = useState({
    no_ref: "",
    bayar: "",
  });
  const getData = async () => {
    try {
      const response = await axios.get(`/api/invoice/INV-13082022-1`);
      if (response) {
        setData(response.data.data);
        toaster.notify(response.data.message, {
          position: "bottom-right",
          duration: 3000,
        });
      }
    } catch (error) {}
  };

  // int to rupiah
  const toRupiah = (angka) => {
    return parseInt(angka).toLocaleString();
  };

  // sum sub_total of all product
  const sumSubtotal = (product) => {
    let sum = 0;
    product?.forEach((item) => {
      sum += item.sub_total;
    });
    return sum;
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Layout middleware="auth" title="Customer">
      <Container>
        <div className="bg-white shadow-md p-2 rounded">
          <div className="p-3">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
            >
              Cari Invoice
            </label>
            <div className="relative">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Masukan nomor invoice..."
                required
              />
              <button
                type="submit"
                className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Cari
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md mt-3 p-2 rounded">
          <div className="p-9 border-b border-gray-200">
            <div className="space-y-6">
              <div className="flex justify-between items-top">
                <div className="space-y-4">
                  <div>
                    <img
                      className="h-10 object-cover mb-4"
                      src="/assets/images/logo.png"
                    />
                    <p className="font-bold text-lg"> Tagihan Pembayaran </p>
                    <p> KAOSTORY </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-400">
                      {" "}
                      Tagihan kepada{" "}
                    </p>
                    <p> {data.customer} </p>
                    <p> {data.alamat}</p>
                    <p> {data.hp} </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="font-medium text-sm text-gray-400">
                      {" "}
                      Tanggal Tagihan{" "}
                    </p>
                    <p> {data.tanggal} </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-400">
                      {" "}
                      DP Terbayar{" "}
                    </p>
                    <p> Rp. {toRupiah(data.dp)} </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-400">
                      {" "}
                      Total Tagihan{" "}
                    </p>
                    <p>
                      {" "}
                      Rp.{" "}
                      {toRupiah(
                        sumSubtotal(data.product) - parseInt(data.diskon)
                      )}{" "}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-400">
                      {" "}
                      Kekurangan{" "}
                    </p>
                    <p className="text-red-500 font-bold">
                      {" "}
                      Rp.{" "}
                      {toRupiah(
                        data.dp -
                          sumSubtotal(data.product) -
                          parseInt(data.diskon)
                      )}{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-9 border-b border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-black text-lg">
                    {" "}
                    Status Pembayaran{" "}
                  </p>
                </div>
                {data.status == "Lunas" ? (
                  <>
                    <p className="font-bold text-green-500 text-lg">
                      {" "}
                      {data.status}{" "}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-red-500 text-lg">
                      {" "}
                      {data.status}{" "}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="p-9 border-gray-200">
            <p className="font-medium text-sm mb-3 text-black">
              {" "}
              Masukan nominal pelunasan{" "}
            </p>
            <div className="flex">
              <input
                type="number"
                id="small-input"
                className="block p-2 w-full mr-2 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <button
                type="button"
                className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-small rounded-md text-sm py-2 px-3 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                BAYAR
              </button>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}
