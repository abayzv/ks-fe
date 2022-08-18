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
  const [allProduct, setAllProduct] = useState([
    {
      id: 1,
      nama: "Kaos Dewasa",
      kategori: "Kaos Dewasa",
      panjang_pendek: "Pendek",
      kualitas: "Premium",
      ukuran: "XL",
      warna: "Hitam",
      harga: "35000",
      stock_awal: "30",
      stock_tersedia: 27,
      penjualan: 3,
    },
    {
      id: 2,
      nama: "Kaos Raglan",
      kategori: "Kaos Raglan",
      panjang_pendek: "Pendek",
      kualitas: "Standard",
      ukuran: "L",
      warna: "Putih Navy",
      harga: "40000",
      stock_awal: "30",
      stock_tersedia: 29,
      penjualan: 1,
    },
    {
      id: 3,
      nama: "Kaos Polo",
      kategori: "Kaos Polo",
      panjang_pendek: "Pendek",
      kualitas: "Standard",
      ukuran: "M",
      warna: "Hitam",
      harga: "45000",
      stock_awal: "30",
      stock_tersedia: 30,
      penjualan: 0,
    },
    {
      id: 4,
      nama: "Crewneck",
      kategori: "Crewneck",
      panjang_pendek: "Pendek",
      kualitas: "Standard",
      ukuran: "XL",
      warna: "Hitam",
      harga: "90000",
      stock_awal: "30",
      stock_tersedia: 29,
      penjualan: 1,
    },
    {
      id: 5,
      nama: "Hoodie",
      kategori: "Hoodie",
      panjang_pendek: "Pendek",
      kualitas: "Standard",
      ukuran: "XL",
      warna: "Hitam",
      harga: "95000",
      stock_awal: "30",
      stock_tersedia: 30,
      penjualan: 0,
    },
  ]);
  const [sablonType, setSablonType] = useState([]);
  const [selectedSablonId, setSelectedSablonId] = useState(1);
  const [cart, setCart] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [isDP, setIsDP] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [errors, setErrors] = useState([]);
  const [data, setData] = useState({
    nama: "",
    hp: "",
    alamat: "",
    discount: 0,
    bayar: 0,
    metode_pembayaran: "Cash",
    dp: 0,
  });

  const getDataSablon = async () => {
    const response = await axios.get("/api/sablons");
    setSablonType(response.data);
  }

  const handleSubmit = async () => {
    try {
      // console.log(data)
      const response = await axios.post(`/api/transaction`, data);
      console.log(response)
      toaster.notify("Transaksi berhasil", {
        position: "bottom-right",
        duration: 3000,
      });
      setData({
        nama: "",
        hp: "",
        alamat: "",
        discount: 0,
        bayar: 0,
        metode_pembayaran: "",
        dp: 0,
      });
      setCart([]);
    } catch (r) {
      setErrors(r.response.data.errors);
      toaster.notify("Data yang kamu masukan belum benar, silahkan coba lagi", {
        position: "bottom-right",
        duration: 3000,
      });
      console.log("error")
    }
  }

  const changePayment = (e) => {
    if (e.target.value != "DP") {
      setIsDP(false);
      // change DP to 0
      setData({ ...data, metode_pembayaran: e.target.value, dp: 0 });
    } else {
      setIsDP(true);
      setData({ ...data, metode_pembayaran: e.target.value, bayar: 0 });
    }
  };

  const addDiscount = () => {
    // add discount to data
    setData({ ...data, discount: discount });
  };

  const handleInput = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const Modal = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [isDisabled, setDisabled] = useState(true);
    const [productData, setProductData] = useState({
      id: "",
      nama: "",
      kategori: "",
      panjang_pendek: "",
      kualitas: "",
      ukuran: "",
      warna: "",
      harga: "",
      sablon_type: "",
    });

    const getProductFromId = (id) => {
      const product = allProduct.find((item) => item.id === id);
      // add jumlah to product
      product.jumlah = 1;
      product.sablon_type = 1;
      product.note = "";
      setProductData(product);
    };

    const handleSave = async () => {
      // console.log(productData);
      const newCart = [...cart, productData];
      setCart(newCart);
      setData({
        ...data,
        cart: newCart,
      });
      setShowModal(false);
    };

    const handleChangeSablonType = (e) => {
      // set selected sablon id to productData
      const sablonId = e.target.value;
      const newProductData = { ...productData };
      newProductData.sablon_type = sablonId;
      setProductData(newProductData);
    };

    useEffect(() => {
      getProductFromId(props.id);
    }, []);

    return (
      <>
        <button
          className="bg-red-500 text-white active:bg-blue-600 text-sm px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => setShowModal(true)}
        >
          +
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
                            disabled
                            type="text"
                            name="category"
                            className="mt-2 bg-gray-100 border-gray-300 shadow-md focus:ring-gray-300 focus:border-white"
                            placeholder="Masukan nama produk"
                            value={productData.nama}
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
                          <select
                            disabled
                            name="type"
                            className="mt-2 bg-gray-100 shadow-md focus:ring-gray-300 focus:border-white"
                            value={productData.panjang_pendek}
                          >
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
                          <select
                            disabled
                            value={productData.kualitas}
                            name="grade"
                            className="mt-2 bg-gray-100 border-gray-300 shadow-md focus:ring-gray-300 focus:border-white"
                          >
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
                          <select
                            disabled
                            value={productData.ukuran}
                            name="size"
                            className="mt-2 bg-gray-100 border-gray-300 shadow-md focus:ring-gray-300 focus:border-white"
                          >
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
                          <input
                            disabled
                            type="text"
                            name="category"
                            className="mt-2 bg-gray-100 border-gray-300 shadow-md focus:ring-gray-300 focus:border-white"
                            placeholder="Masukan nama produk"
                            value={productData.warna}
                          />
                          <div className="text-xs text-red-500 mt-2">
                            {errors && errors.color && errors.color}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <label htmlFor="" className="text-sm">
                            Sablon
                          </label>
                          <select
                            onChange={handleChangeSablonType}
                            id="countries"
                            className="mt-2  border-blue-300 shadow-md focus:ring-gray-300 focus:border-white"
                          >
                            {sablonType.map((sablon) => {
                              return (
                                <option value={sablon.id}>{sablon.name}</option>
                              );
                            })}
                          </select>
                          <div className="text-xs text-red-500 mt-2">
                            {errors && errors.color && errors.color}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <label htmlFor="" className="text-sm">
                            Jumlah
                          </label>
                          <input
                            value={productData.jumlah}
                            onChange={(e) => {
                              setProductData({
                                ...productData,
                                jumlah: e.target.value,
                              });
                            }}
                            type="number"
                            name="category"
                            className="mt-2  border-blue-300 shadow-md focus:ring-gray-300 focus:border-white"
                            placeholder="Masukan nama produk"
                          />
                          <div className="text-xs text-red-500 mt-2">
                            {errors && errors.color && errors.color}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <label htmlFor="" className="text-sm">
                            Keterangan
                          </label>
                          <input
                            value={productData.note}
                            onChange={(e) => {
                              setProductData({
                                ...productData,
                                note: e.target.value,
                              });
                            }}
                            type="text"
                            name="category"
                            className="mt-2  border-blue-300 shadow-md focus:ring-gray-300 focus:border-white"
                            placeholder="Masukan keterangan"
                          />
                          <div className="text-xs text-red-500 mt-2">
                            {errors && errors.color && errors.color}
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

  const deleteCart = (index) => {
    const newCart = cart.filter((item, i) => i !== index);
    setCart(newCart);
    setData({
      ...data,
      cart: newCart,
    });
  };

  // get sablontype price by id
  const getSablonPrice = (id) => {
    return sablonType?.find((sablon) => sablon?.id == id)?.price;
  };

  // add product to cart
  const addToCart = (id) => {
    const newCart = [...cart];
    const newAllProduct = [...allProduct];
    const newProduct = newAllProduct.find((product) => product.id === id);

    // add sablonTypeId to product
    newProduct.sablonTypeId = selectedSablonId;
    newCart.push(newProduct);
    setCart(newCart);

    // push cart to data state
    setData({
      ...data,
      cart: newCart,
    });
  };

  // handle select sablon
  const handleSelectSablon = (e) => {
    setSelectedSablonId(e.target.value);
  };

  const searchProduct = (e) => {
    // search product from allProduct
    const search = e.target.value;
    const result = allProduct
      .filter((product) => {
        return product.nama.toLowerCase().includes(search.toLowerCase());
      })
      .map((product) => {
        return {
          id: product.id,
          nama: product.nama,
          kategori: product.kategori,
          panjang_pendek: product.panjang_pendek,
          kualitas: product.kualitas,
          ukuran: product.ukuran,
          warna: product.warna,
          harga: product.harga,
        };
      });
    console.log(result);
    if (e.target.value === "") {
      setSearchResult([]);
    } else {
      setSearchResult(result);
    }
    console.log(searchResult);
    return result;
  };

  const authUser = useRecoilValueLoadable(authUserState);
  const getData = async () => {
    try {
      const response = await axios.get("/api/sablons");
      if (response) {
        console.log(response.data);
        setDataTable(response.data);
      }
    } catch (error) {}
  };

  const getPrice = (harga_produk, harga_sablon, jumlah) => {
    const total = 0;
    total +=
      (parseInt(harga_produk) + parseInt(getSablonPrice(harga_sablon))) *
      jumlah;
    return total;
  };

  // get Total Price from cart
  const getTotalPrice = () => {
    let total = 0;
    cart.map((product) => {
      total += getPrice(product.harga, product.sablon_type, product.jumlah);
    });
    return total;
  };

  const columns = [
    {
      name: "Nama",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Kategori",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Harga",
      selector: (row) => row.price,
      sortable: true,
    },
  ];

  useEffect(() => {
    getData();
    getDataSablon()
  }, []);

  return (
    <Layout middleware="auth" title="Customer">
      <div className="px-32">
        <div className="flex justify-between w-full h-72">
          <div className="w-3/4 m-2">
            <div className="p-6 w-full bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
              >
                Search
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
                  onChange={searchProduct}
                  id="default-search"
                  className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Cari Produk . . ."
                  required
                />
                <button
                  type="submit"
                  className="text-white absolute right-2.5 bottom-2.5 bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Cari
                </button>
              </div>

              <div class="overflow-x-auto relative">
                <table class="w-full text-sm text-left mt-3 text-gray-500 dark:text-gray-400">
                  {/* <caption class="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800"></caption> */}
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" class="py-3 px-6">
                        Nama
                      </th>
                      <th scope="col" class="py-3 px-6">
                        Kualitas
                      </th>
                      <th scope="col" class="py-3 px-6">
                        Ukuran
                      </th>
                      <th scope="col" class="py-3 px-6">
                        Warna
                      </th>
                      <th scope="col" class="py-3 px-6">
                        Lengan
                      </th>
                      <th scope="col" class="py-3 px-6">
                        Harga
                      </th>
                      <th scope="col" class="py-3 px-6">
                        <span class="sr-only">Action</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResult.length > 0 ? (
                      <>
                        {searchResult.map((product) => {
                          return (
                            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                              <th
                                scope="row"
                                class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                              >
                                {product.nama}
                              </th>
                              <td class="py-4 px-6">{product.kualitas}</td>
                              <td class="py-4 px-6">{product.ukuran}</td>
                              <td class="py-4 px-6">{product.warna}</td>
                              <td class="py-4 px-6">
                                {product.panjang_pendek}
                              </td>
                              <td class="py-4 px-6">{product.harga}</td>
                              <td class="py-4 px-6">
                                <Modal id={product.id} />
                              </td>
                            </tr>
                          );
                        })}
                      </>
                    ) : (
                      <tr>
                        <td colspan="6" className="text-center p-5">
                          Produk tidak ditemukan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-6 w-full mt-3 bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="overflow-x-auto relative mt-3">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="py-3 px-6 rounded-l-lg">
                        Nama Produk
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Jumlah
                      </th>
                      <th scope="col" className="py-3 px-6 rounded-r-lg">
                        Sablon
                      </th>
                      <th scope="col" className="py-3 px-6 rounded-r-lg">
                        Harga
                      </th>
                      <th scope="col" className="py-3 px-6 rounded-r-lg">
                        Total
                      </th>
                      <th scope="col" className="py-3 px-6 rounded-r-lg">
                        Keterangan
                      </th>
                      <th scope="col" className="py-3 px-6 rounded-r-lg"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.cart?.length > 0 && (
                      <>
                        {data.cart.map((product, index) => {
                          return (
                            <>
                              <tr
                                key={index}
                                className="bg-white dark:bg-gray-800"
                              >
                                <th
                                  scope="row"
                                  className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                >
                                  {product.nama +
                                    " " +
                                    product.kualitas +
                                    " " +
                                    product.ukuran +
                                    " " +
                                    product.warna +
                                    " " +
                                    product.panjang_pendek}
                                </th>
                                <td className="py-4 px-6">{product.jumlah}</td>
                                <td className="py-4 px-6">
                                  <select
                                    disabled
                                    value={product.sablon_type}
                                    id="countries"
                                    className="bg-gray-50 border mr-5 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  >
                                    {sablonType.map((sablon) => {
                                      return (
                                        <option value={sablon.id}>
                                          {sablon.name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </td>
                                <td className="py-4 px-6">
                                  Rp.{" "}
                                  {(
                                    parseInt(product.harga) +
                                    parseInt(
                                      getSablonPrice(product.sablon_type)
                                    )
                                  ).toLocaleString()}
                                </td>
                                <td className="py-4 px-6">
                                  Rp.{" "}
                                  {getPrice(
                                    product.harga,
                                    product.sablon_type,
                                    product.jumlah
                                  ).toLocaleString()}
                                </td>
                                <td className="py-4 px-6">{product.note}</td>
                                <td className="flex py-4 px-6">
                                  <button
                                    type="button"
                                    className="text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:ring-blue-300 font-small rounded-md text-sm py-2 px-3 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      deleteCart(index);
                                    }}
                                    type="button"
                                    className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-blue-300 font-small rounded-md text-sm py-2 px-3 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                  >
                                    Hapus
                                  </button>
                                </td>
                              </tr>
                            </>
                          );
                        })}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex bg-gray-100 p-2 items-center justify-end">
                <input
                  onChange={(e) => {
                    setDiscount(e.target.value);
                  }}
                  type="text"
                  name="discount"
                  placeholder="Diskon"
                  className="block p-2.5 w-1/4 mr-2 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <button
                  onClick={addDiscount}
                  type="button"
                  className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Tambah diskon
                </button>
              </div>
            </div>
          </div>
          <div className="w-1/4 m-2">
            <div class="p-6 w-full mb-3 bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="mb-2 items-center justify-between">
                <div className="flex items-center">
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Nama
                  </label>
                  <div className="text-xs text-red-500 ml-2">
                    {errors && errors.nama && errors.nama}
                  </div>
                </div>
                <input
                  onChange={handleInput}
                  type="text"
                  name="nama"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Masukan nama"
                  required
                  value={data.nama}
                />
              </div>
              <div className="mb-2 items-center justify-between">
                <div className="flex items-center">
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Nomor HP
                  </label>
                  <div className="text-xs text-red-500 ml-2">
                    {errors && errors.hp && errors.hp}
                  </div>
                </div>
                <input
                  onChange={handleInput}
                  value={data.hp}
                  type="text"
                  name="hp"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Masukan nomor HP"
                  required
                />
              </div>
              <div className="items-center justify-between">
                <div className="flex items-center">
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Alamat
                  </label>
                  <div className="text-xs text-red-500 ml-2">
                    {errors && errors.alamat && errors.alamat}
                  </div>
                </div>
                <input
                  value={data.alamat}
                  type="text"
                  name="alamat"
                  onChange={handleInput}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Masukan alamat   "
                  required
                />
              </div>
            </div>
            <div class="p-6 w-full bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="flex justify-between w-full mb-3">
                <div className="w-1/2 font-semibold">Total</div>
                <div className="w-1/2 text-right text-xl font-bold text-red-500">
                  Rp.{" "}
                  {(
                    getTotalPrice() -
                    parseInt(data.discount) -
                    parseInt(data.dp)
                  ).toLocaleString()}
                </div>
              </div>
              <hr />
              <div className="flex justify-between w-full mb-3 mt-3">
                <div className="w-1/2 font-semibold">Sub Total :</div>
                <div className="w-1/2 text-right font-semibold text-gray-500">
                  Rp. {getTotalPrice().toLocaleString()}
                </div>
              </div>
              <div className="flex justify-between w-full mb-3 mt-3">
                <div className="w-1/2 font-semibold">Discount :</div>
                <div className="w-1/2 text-right font-semibold text-gray-500">
                  Rp. {parseInt(data.discount).toLocaleString()}
                </div>
              </div>
              <div className="flex justify-between w-full mb-3 mt-3">
                <div className="w-1/2 font-semibold">DP :</div>
                <div className="w-1/2 text-right font-semibold text-gray-500">
                  Rp. {parseInt(data.dp).toLocaleString()}
                </div>
              </div>
              <div className="flex justify-between w-full mb-3 mt-3">
                <div className="w-1/2 font-semibold">Kembalian :</div>
                <div className="w-1/2 text-right text-xl font-bold text-red-500">
                  Rp.{" "}
                  {parseInt(data.bayar) -
                    (getTotalPrice() -
                      parseInt(data.discount) -
                      parseInt(data.dp))}
                </div>
              </div>
              <hr />
              <div className="justify-between w-full mb-3 mt-3">
                <select
                  onChange={changePayment}
                  name="metode_pembayaran"
                  className="bg-gray-50 border mr-5 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option selected value="Cash">Cash</option>
                  <option value="DP">DP</option>
                  <option value="Shopee">Shopee</option>
                  <option value="Tokopedia">Tokopedia</option>
                </select>
                <div className="text-xs text-red-500 mb-3 ml-2 mt-1">
                  {errors &&
                    errors.metode_pembayaran &&
                    errors.metode_pembayaran}
                </div>
                {!isDP ? (
                  <>
                    <input
                      type="number"
                      name="bayar"
                      value={data.bayar}
                      onChange={handleInput}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Jumlah bayar"
                      required
                    />
                  </>
                ) : (
                  <>
                    <input
                      type="number"
                      name="dp"
                      value={data.dp}
                      onChange={handleInput}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Jumlah bayar"
                      required
                    />
                  </>
                )}
              </div>
              <hr />
              <button
                type="button"
                className="text-white w-full mt-5 bg-red-600 hover:bg-red   -700 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                RESET
              </button>
              <button
                onClick={handleSubmit}
                type="button"
                className="text-white w-full bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                BAYAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
