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
  const getData = async () => {
    try {
      const response = await axios.get(`/api/transaction/${id}`);
      if (response) {
        setData(response.data.data);
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
    setTimeout(() => {
      window.print();
      // back page
      router.back();
    }, 2000);
  }, []);

  return (
    <>
      <div className="p-9 border-b border-gray-200">
        <div className="space-y-6">
          <img
            className="h-10 object-cover mb-4"
            src="/assets/images/logo.png"
          />
          <div className="flex justify-between items-top">
            <div className="space-y-4">
              <div>
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
                  Nomor Referensi{" "}
                </p>
                <p> {data.no_ref} </p>
              </div>
              <div>
                <p className="font-medium text-sm text-gray-400">
                  {" "}
                  Tanggal Tagihan{" "}
                </p>
                <p> {data.tanggal} </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-9 border-b border-gray-200">
        <p className="font-medium text-sm text-gray-400"> Note </p>
        <p className="text-sm">
          {" "}
          Terimakasih sudah berbelanja di kaostory, silahkan cek tagihan kamu
          sebelum meninggalkan outlet.{" "}
        </p>
      </div>
      <table className="w-full divide-y divide-gray-200 text-sm">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-9 py-4 text-left font-semibold text-gray-400"
            >
              {" "}
              Produk{" "}
            </th>
            <th
              scope="col"
              className="py-3 text-left font-semibold text-gray-400"
            ></th>
            <th
              scope="col"
              className="py-3 text-left font-semibold text-gray-400"
            >
              {" "}
              Jumlah{" "}
            </th>
            <th
              scope="col"
              className="py-3 text-left font-semibold text-gray-400"
            >
              {" "}
              Harga{" "}
            </th>
            <th
              scope="col"
              className="py-3 text-left font-semibold text-gray-400"
            />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.product?.map((item, index) => (
            <tr key={index}>
              <td className="px-9 py-5 whitespace-nowrap space-x-1 flex items-center">
                <div>
                  <p> {item.nama} </p>
                  <p className="text-sm text-gray-400"> {item.sablon} </p>
                </div>
              </td>
              <td className="whitespace-nowrap text-gray-600 truncate" />
              <td>x{item.quantity}</td>
              <td className="whitespace-nowrap text-gray-600 truncate">
                {" "}
                Rp. {parseInt(item.sub_total).toLocaleString()}{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-9 border-b border-t border-gray-200">
        <div className="space-y-3">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm"> Subtotal </p>
            </div>
            <p className="text-gray-500 text-sm">
              {" "}
              Rp. {sumSubtotal(data.product).toLocaleString()}{" "}
            </p>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm"> Diskon </p>
            </div>
            <p className="text-gray-500 text-sm">
              {" "}
              Rp. {parseInt(data.diskon).toLocaleString()}{" "}
            </p>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm"> Dp </p>
            </div>
            <p className="text-gray-500 text-sm">
              {" "}
              Rp. {parseInt(data.dp).toLocaleString()}{" "}
            </p>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm"> Total </p>
            </div>
            <p className="text-gray-500 text-sm">
              {" "}
              Rp. {toRupiah(
                sumSubtotal(data.product) - parseInt(data.diskon)
              )}{" "}
            </p>
          </div>
        </div>
      </div>
      <div className="p-9 border-gray-200">
        <div className="space-y-3">
          <div className="flex justify-between">
            <div>
              <p className="font-bold text-black text-lg">
                {" "}
                Status Pembayaran{" "}
              </p>
            </div>
            <p className="font-bold text-black text-lg"> {data.status} </p>
          </div>
        </div>
      </div>
    </>
  );
}
