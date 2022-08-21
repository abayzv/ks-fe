import { useRecoilValueLoadable } from "recoil";
import Container from "../../components/Container";
import Layout from "../../components/Layout";
import { getCustomer } from "../../store/customer";
import DataTable from "react-data-table-component";
import axios from "axios";
import { useEffect, useState } from "react";
import toaster from "toasted-notes";
import { authUserState } from "../../store/auth";

export default function Home() {
  const [dataTable, setDataTable] = useState([]);
  const authUser = useRecoilValueLoadable(authUserState);
  const getData = async () => {
    try {
      const response = await axios.get("/api/kaostory");
      if (response) {
        setDataTable(response.data.product);
      }
    } catch (error) {}
  };

  const Modal = () => {
    const [showModal, setShowModal] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [isDisabled, setDisabled] = useState(true);
    const [colorSelect, setColorSelect] = useState("");
    const [data, setData] = useState({
      category : null,
      type : null,
      grade : null,
      size : null,
      color : null,
      stock : null,
      price : null,
    });

    const handleSave = async () => {
      setBtnLoading(true);
      if (authUser?.contents.user.username == "admin") {
        try {
          const response = await axios.post("/api/products", data);
          if (response) {
            getData();
            setBtnLoading(false);
            toaster.notify(response.data.message, {
              position: "bottom-right",
            });
          }
        } catch (r) {
          setErrors(r.response.data.errors);
          toaster.notify(r.response.data.message, {
            position: "bottom-right",
          });
          setBtnLoading(false);
        }
      } else {
        toaster.notify("Mohon maaf fungsi ini di batasi untuk user tertentu", {
          position: "bottom-right",
        });
        setBtnLoading(false);
      }
    };

    const handleChange = (e) => {
      const newData = { ...data };
      Object.keys(data).map((key) => {
        if (e.target.name === key) {
          newData[e.target.name] = e.target.value;
          setData(newData);
        }

        if(e.target.name === "color"){
          setColorSelect(e.target.value);
        }
      });
    };
    const handleChange2 = (e) => {
      const newData = { ...data };
      Object.keys(data).map((key) => {
        if (e.target.name === key) {
          newData[e.target.name] = e.target.value;
          setData(newData);
        }
      });
    };

    return (
      <>
        <button
          className="bg-blue-500 text-white active:bg-blue-600 text-sm p-2 px-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => setShowModal(true)}
        >
          Tambah Produk
        </button>
        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto w-2/5">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-lg font-semibold">Tambah Produk</h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <p className="my-4 text-slate-500 text-lg leading-relaxed">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label htmlFor="" className="text-sm">
                            Nama
                          </label>
                          <input
                            type="text"
                            name="category"
                            onChange={handleChange}
                            className="mt-2 border-gray-300 shadow-md focus:ring-gray-300 focus:border-white"
                            placeholder="Masukan nama produk"
                          />
                          <div className="text-xs text-red-500 mt-2">
                            {errors && errors.category && errors.category}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <label htmlFor="" className="text-sm">
                            Lengan
                          </label>
                          {/* create select */}
                          <select onChange={handleChange} name="type" className="mt-2 border-gray-300 shadow-md focus:ring-gray-300 focus:border-white">
                          <option>Pilih Tipe Lengan</option>
                          <option value="Panjang">Panjang</option>
                          <option value="Pendek">Pendek</option>
                          </select>
                          <div className="text-xs text-red-500 mt-2">
                            {errors && errors.type && errors.type}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <label htmlFor="" className="text-sm">
                            Kualitas
                          </label>
                          {/* create select */}
                          <select onChange={handleChange} name="grade" className="mt-2 border-gray-300 shadow-md focus:ring-gray-300 focus:border-white">
                          <option>Pilih Kualitas</option>
                          <option value="Standard">Standard</option>
                          <option value="Premium">Premium</option>
                          </select>
                          <div className="text-xs text-red-500 mt-2">
                            {errors && errors.grade && errors.grade}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <label htmlFor="" className="text-sm">
                            Ukuran
                          </label>
                          <select onChange={handleChange} name="size" className="mt-2 border-gray-300 shadow-md focus:ring-gray-300 focus:border-white">
                          <option>Pilih Ukuran</option>
                          <option value="XS">XS</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="XXL">XXL</option>
                          <option value="XXXL">XXXL</option>
                          </select>
                          <div className="text-xs text-red-500 mt-2">
                            {errors && errors.size && errors.size}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <label htmlFor="" className="text-sm">
                            Warna
                          </label>
                          {colorSelect == "Isi Sendiri" ? (<><input
                            type="text"
                            name="color"
                            onChange={handleChange2}
                            className="mt-2 border-gray-300 shadow-md focus:ring-gray-300 focus:border-white"
                            placeholder="Masukan warna"
                          /></>) : (<>
                            <select onChange={handleChange} name="color" className="mt-2 border-gray-300 shadow-md focus:ring-gray-300 focus:border-white">
                          <option>Pilih Warna</option>
                          <option value="Isi Sendiri">Isi Sendiri</option>
                          <option value="Hitam">Hitam</option>
                          <option value="Putih">Putih</option>
                          <option value="Navy">Navy</option>
                          <option value="Hijau">Hijau</option>
                          <option value="Forest Green">Forest Green</option>
                          <option value="Sky Blue">Sky Blue</option>
                          <option value="Merah Cabai">Merah Cabai</option>
                          </select></>)}
                          <div className="text-xs text-red-500 mt-2">
                            {errors && errors.color && errors.color}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <label htmlFor="" className="text-sm">
                            Stock
                          </label>
                          <input
                            type="number"
                            name="stock"
                            onChange={handleChange}
                            className="mt-2 border-gray-300 shadow-md focus:ring-gray-300 focus:border-white"
                            placeholder="Jumlah Stock"
                          />
                          <div className="text-xs text-red-500 mt-2">
                            {errors && errors.stock && errors.stock}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <label htmlFor="" className="text-sm">
                            Harga
                          </label>
                          <input
                            type="number"
                            name="price"
                            onChange={handleChange}
                            className="mt-2 border-gray-300 shadow-md focus:ring-gray-300 focus:border-white"
                            placeholder="Harga"
                          />
                          <div className="text-xs text-red-500 mt-2">
                            {errors && errors.price && errors.price}
                          </div>
                        </div>
                      </div>
                    </p>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="bg-red-500 font-bold hover:bg-red-400 text-white rounded p-2 px-5"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Batal
                    </button>
                    {btnLoading ? (
                      <button
                        className="bg-gray-500 flex font-bold text-white rounded p-2 px-5 ml-2"
                        type="button"
                        disabled
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          style={{
                            margin: "auto",
                            background: "none",
                            display: "block",
                            shapeRendering: "auto",
                          }}
                          width="20px"
                          height="20px"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="xMidYMid"
                        >
                          <circle
                            cx={50}
                            cy={50}
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth={13}
                            r={35}
                            strokeDasharray="164.93361431346415 56.97787143782138"
                          >
                            <animateTransform
                              attributeName="transform"
                              type="rotate"
                              repeatCount="indefinite"
                              dur="1s"
                              values="0 50 50;360 50 50"
                              keyTimes="0;1"
                            />
                          </circle>
                        </svg>
                        <span className="ml-1">Simpan</span>
                      </button>
                    ) : (
                      <button
                        className="bg-blue-600 flex hover:bg-blue-400 font-bold text-white rounded p-2 px-5 ml-2"
                        type="button"
                        onClick={handleSave}
                      >
                        <span className="ml-1">Simpan</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>
    );
  };

  const DeleteModal = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

    const handleDelete = async () => {
      setBtnLoading(true);
      if (authUser?.contents.user.username == "admin") {
        try {
          const response = await axios.delete(`/api/customer/${props.id}`);
          if (response) {
            getCustomer();
            setBtnLoading(false);
            toaster.notify(response.data.message, {
              position: "bottom-right",
            });
          }
        } catch (r) {
          setBtnLoading(false);
        }
      } else {
        toaster.notify("Mohon maaf fungsi ini di batasi untuk user tertentu", {
          position: "bottom-right",
        });
        setBtnLoading(false);
      }
    };

    return (
      <>
        <button
          className="bg-red-500 text-white active:bg-blue-600 text-xs p-2 px-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => setShowModal(true)}
        >
          Hapus
        </button>
        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto w-2/5">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-lg font-semibold">Hapus Data</h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    <p className="my-4 text-slate-500 text-lg leading-relaxed">
                      Apakah kamu yakin ingin menghapus data ini?
                    </p>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="bg-red-500 font-bold hover:bg-red-400 text-white rounded p-2 px-5"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Batal
                    </button>
                    {btnLoading ? (
                      <button
                        className="bg-gray-500 flex font-bold text-white rounded p-2 px-5 ml-2"
                        type="button"
                        disabled
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          style={{
                            margin: "auto",
                            background: "none",
                            display: "block",
                            shapeRendering: "auto",
                          }}
                          width="20px"
                          height="20px"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="xMidYMid"
                        >
                          <circle
                            cx={50}
                            cy={50}
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth={13}
                            r={35}
                            strokeDasharray="164.93361431346415 56.97787143782138"
                          >
                            <animateTransform
                              attributeName="transform"
                              type="rotate"
                              repeatCount="indefinite"
                              dur="1s"
                              values="0 50 50;360 50 50"
                              keyTimes="0;1"
                            />
                          </circle>
                        </svg>
                        <span className="ml-1">Hapus</span>
                      </button>
                    ) : (
                      <button
                        className="bg-red-500 flex hover:bg-red-400 font-bold text-white rounded p-2 px-5 ml-2"
                        type="button"
                        onClick={handleDelete}
                      >
                        <span className="ml-1">Hapus</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>
    );
  };

  const columns = [
    {
      name: "Nama",
      selector: (row) => row.product.category,
      sortable: true,
    },
    {
      name: "Ukuran",
      selector: (row) => row.product.size,
      sortable: true,
    },
    {
      name: "Kualitas",
      selector: (row) => row.product.grade,
      sortable: true,
    },
    {
      name: "Stock",
      selector: (row) => row.product.stock - row.total,
      sortable: true,
    },
    {
      name: "Penjualan",
      selector: (row) => row.total,
      sortable: true,
    }
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <Layout middleware="auth" title="Customer">
      <Container>
        <div className="p-3 shadow-md bg-white rounded mb-5">
          <div className="px-3 flex font-semibold items-center justify-between w-full">
            <h1>Daftar Produk</h1>
            <Modal />
          </div>
        </div>
        <div className="bg-white shadow-md p-2 rounded">
          <DataTable columns={columns} data={dataTable} />
        </div>
      </Container>
    </Layout>
  );
}
