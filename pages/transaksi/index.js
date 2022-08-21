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

export default function Home() {
  const [dataTable, setDataTable] = useState([]);
  const authUser = useRecoilValueLoadable(authUserState);
  const getData = async () => {
    try {
      const response = await axios.get("/api/transaction");
      if (response) {
        setDataTable(response.data);
      }
    } catch (error) {}
  };


  const columns = [
    {
      name: "Nomor Transaksi",
      selector: (row) => row.no_ref,
      sortable: true,
    },
    {
      name: "Customer",
      selector: (row) => row.customer,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Pembayaran",
      selector: (row) => row.payment,
      sortable: true,
    },
    {
      name: "DP",
      selector: (row) => row.down_payment,
      sortable: true,
    },
    {
      name: "Diskon",
      selector: (row) => row.discount,
      sortable: true,
    },
    {
      name: "Jumlah Bayar",
      selector: (row) => row.total_payment,
      sortable: true,
    },
    {
      name: "Tanggal",
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => {
        // return row.created_at dd-mm-yy h:i
        return row.created_at.substring(0, 10);
      },
    },
    {
      name: "Action",
      selector: (row) => row.created_at,
      cell: (row) => {
        return (
          <Link href={`/invoice/${row.id}`}>
           <button
              className="bg-yellow-400 text-white active:bg-blue-600 text-sm px-2 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
            >
              Lihat Transaksi
            </button>
          </Link>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <Layout middleware="auth" title="Customer">
      <div className="px-32">
      <div className="p-3 shadow-md bg-white rounded mb-5">
          <div className="px-3 flex font-semibold items-center justify-between w-full">
            <h1>Daftar Transaksi</h1>
           <Link href="/kasir">
           <button
              className="bg-blue-500 text-white active:bg-blue-600 text-sm p-2 px-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
            >
              Transaksi Baru
            </button>
           </Link>
          </div>
        </div>
        <div className="bg-white shadow-md p-2 rounded">
          <DataTable columns={columns} data={dataTable} pagination />
        </div>
      </div>
    </Layout>
  );
}
