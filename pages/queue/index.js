import { useRecoilValueLoadable } from "recoil";
import Container from "../../components/Container";
import Layout from "../../components/Layout";
import DataTable from "react-data-table-component";
import { getQueue } from "../../store/queue";
import axios from "axios";
import { useEffect, useState } from "react";
import { getCustomer } from "../../store/customer";
import { getVehicle } from "../../store/vehicle";
import { getService } from "../../store/service";
import { getMechanic } from "../../store/mechanic";
import toaster from "toasted-notes";
import { authUserState } from "../../store/auth";

export default function Home() {
  const [contents, setContents] = useState([]);
  const data = useRecoilValueLoadable(getQueue);
  const [isLoading, setLoading] = useState(false);
  const authUser = useRecoilValueLoadable(authUserState);
  const [number, setNumber] = useState(0);

  const pad = (number, digits) => {
    return (
      Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number
    );
  };

  const getAntrian = async () => {
    try {
      const response = await axios.get("/api/queue");
      if (response) {
        setContents(response.data.data);
        setNumber(response.data.start_queue);
      }
    } catch (error) {}
  };

  const setStatus = async (dataId, status) => {
    if (authUser?.contents.user.username == "admin") {
      setLoading(true);
      try {
        const response = await axios.post("/api/status", {
          id: dataId,
          status: status,
        });
        if (response) {
          const updateData = contents.map((item) => {
            return item.id == dataId ? { ...item, status: status } : item;
          });
          setContents(updateData);
          setLoading(false);
          toaster.notify(response.data.message, {
            position: "bottom-right",
          });
        }
      } catch (error) {
        setLoading(false);
        toaster.notify(error.response.data.message, {
          position: "bottom-right",
        });
      }
    } else {
      toaster.notify("Mohon maaf fungsi ini di batasi untuk user tertentu", {
        position: "bottom-right",
      });
    }
  };

  const columns = [
    {
      name: "NOMOR ANTRIAN",
      selector: (row) => pad(row.number, 4),
      sortable: true,
    },
    {
      name: "CUSTOMER",
      selector: (row) => row.customer?.name,
      sortable: true,
    },
    {
      name: "MEKANIK",
      selector: (row) => row.mechanic?.name,
      sortable: true,
    },
    {
      name: "MOTOR",
      selector: (row) => row.vehicle?.name,
      sortable: true,
    },
    {
      name: "STATUS",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => {
        return (
          <div
            className={`${row.status === "completed" && "text-green-500"} ${
              row.status === "pending" && "text-red-500"
            } ${row.status === "process" && " text-yellow-400"}`}
          >
            {row.status === "pending" && "Dalam Antrian"}
            {row.status === "process" && "Proses Pengerjaan"}
            {row.status === "completed" && "Selesai"}
          </div>
        );
      },
    },
    {
      name: "TANGGAL",
      selector: (row) => row.service_date,
      sortable: true,
    },
    {
      name: "AKSI",
      cell: (row) => (
        <>
          {row.status === "pending" && (
            <button
              className="bg-yellow-300 hover:bg-yellow-400 text-xs p-2 px-3 rounded"
              id={row.id}
              onClick={() => {
                setStatus(row.id, "process");
              }}
            >
              Proses
            </button>
          )}
          {row.status === "process" && (
            <button
              className="bg-green-200 hover:bg-green-300 text-xs p-2 px-3 rounded"
              id={row.id}
              onClick={() => {
                setStatus(row.id, "completed");
              }}
            >
              Selesai
            </button>
          )}
          {row.status === "completed" && (
            <button className="bg-gray-300 text-xs p-2 px-3 rounded">
              Selesai
            </button>
          )}
        </>
      ),
    },
  ];

  const Modal = () => {
    const [showModal, setShowModal] = useState(false);
    const customer = useRecoilValueLoadable(getCustomer);
    const vehicle = useRecoilValueLoadable(getVehicle);
    const service = useRecoilValueLoadable(getService);
    const mechanic = useRecoilValueLoadable(getMechanic);
    const [btnLoading, setBtnLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [isDisabled, setDisabled] = useState(true);
    const [data, setData] = useState({
      customer_id: null,
      service_id: null,
      mechanic_id: null,
      vehicle_id: null,
      status: "pending",
      number: number,
    });

    //   const lastAntrian = antrian?.contents.filter((item)=>{
    //     return
    //   })
    const pad = (number, digits) => {
      return (
        Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number
      );
    };

    const compareDate = () => {
      const lastAntrianDate = new Date(
        contents[contents?.length - 1]?.created_at
      );
      const thisDate = new Date();
      const lastDay =
        lastAntrianDate.getMonth() + "-" + lastAntrianDate.getDate();
      const thisDay = thisDate.getMonth() + "-" + thisDate.getDate();
      if (thisDay == lastDay) {
        const newData = { ...data };
        newData["number"] = pad(contents[contents?.length - 1]?.number + 1, 4);
        setData(newData);
        setNumber(contents[contents?.length - 1]?.number + 1, 4);
      } else {
        const newData = { ...data };
        newData["number"] = 1;
        setData(newData);
        setNumber(1);
      }
    };

    const handleSave = async () => {
      setBtnLoading(true);
      if (authUser?.contents.user.username == "admin") {
        try {
          const response = await axios.post("/api/queue", data);
          if (response) {
            getAntrian();
            setBtnLoading(false);
            toaster.notify("Antrian berhasil di buat", {
              position: "bottom-right",
            });
          }
        } catch (r) {
          console.log(r.response.data.errors);
          setErrors(r.response.data.errors);
          toaster.notify("Data tidak boleh kosong", {
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

    useEffect(() => {
      setTimeout(() => {
        setDisabled(false);
      }, 3000);
    }, []);

    const handleChange = (e) => {
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
        {isDisabled ? (
          <button
            className="bg-gray-500 flex text-white active:bg-blue-600 text-sm p-2 px-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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
                strokeWidth={10}
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
            <span className="ml-1">Buat Antrian</span>
          </button>
        ) : (
          <button
            className="bg-blue-500 text-white active:bg-blue-600 text-sm p-2 px-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => setShowModal(true)}
          >
            Buat Antrian
          </button>
        )}
        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto w-2/5">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-lg font-semibold">Buat Antrian</h3>
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
                            Nomor Antrian
                          </label>
                          <input
                            type="text"
                            name="number"
                            onChange={handleChange}
                            className="mt-2 bg-gray-200 border-gray-300 shadow-md focus:ring-gray-300 focus:border-white"
                            placeholder="Text"
                            disabled
                            value={pad(number, 4)}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label htmlFor="" className="text-sm">
                            Customer
                          </label>
                          <select
                            onChange={handleChange}
                            name="customer_id"
                            className="mt-2 border-gray-300 shadow-md focus:ring-gray-300 focus:border-white"
                            id=""
                          >
                            <option>Pilih Customer</option>
                            {customer.contents.map((item) => {
                              return (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                          <div className="text-xs text-red-500 mt-2">
                            {errors && errors.customer_id && errors.customer_id}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <label htmlFor="" className="text-sm">
                            Motor
                          </label>
                          <select
                            onChange={handleChange}
                            name="vehicle_id"
                            className="mt-2 border-gray-300 shadow-md focus:ring-gray-300 focus:border-white"
                            id=""
                          >
                            <option>Pilih Motor</option>
                            {vehicle?.contents?.map((item) => {
                              return (
                                <option key={item.id} value={item.id}>
                                  {item.name + " " + item.year}
                                </option>
                              );
                            })}
                          </select>
                          <div className="text-xs text-red-500 mt-2">
                            {errors && errors.vehicle_id && errors.vehicle_id}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <label htmlFor="" className="text-sm">
                            Jenis Service
                          </label>
                          <select
                            onChange={handleChange}
                            name="service_id"
                            className="mt-2 border-gray-300 shadow-md focus:ring-gray-300 focus:border-white"
                            id=""
                          >
                            <option>Pilih Jenis Service</option>
                            {service?.contents?.map((item) => {
                              return (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                          <div className="text-xs text-red-500 mt-2">
                            {errors && errors.service_id && errors.service_id}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <label htmlFor="" className="text-sm">
                            Mekanik
                          </label>
                          <select
                            onChange={handleChange}
                            name="mechanic_id"
                            className="mt-2 border-gray-300 shadow-md focus:ring-gray-300 focus:border-white"
                            id=""
                          >
                            <option>Pilih Mekanik</option>
                            {mechanic?.contents?.map((item) => {
                              return (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                          <div className="text-xs text-red-500 mt-2">
                            {errors && errors.mechanic_id && errors.mechanic_id}
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

  useEffect(() => {
    getAntrian();
  }, []);

  const Loader = () => {
    return (
      <>
        <div className="min-h-screen fixed top-0 w-full left-0 flex items-center justify-center flex-col">
          <div className="animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              style={{
                margin: "auto",
                background: "rgb(255, 255, 255)",
                display: "block",
                shapeRendering: "auto",
              }}
              width="70px"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid"
            >
              <rect x="17.5" y={30} width={15} height={40} fill="#ff0011">
                <animate
                  attributeName="y"
                  repeatCount="indefinite"
                  dur="1s"
                  calcMode="spline"
                  keyTimes="0;0.5;1"
                  values="18;30;30"
                  keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                  begin="-0.2s"
                />
                <animate
                  attributeName="height"
                  repeatCount="indefinite"
                  dur="1s"
                  calcMode="spline"
                  keyTimes="0;0.5;1"
                  values="64;40;40"
                  keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                  begin="-0.2s"
                />
              </rect>
              <rect x="42.5" y={30} width={15} height={40} fill="#ff0000">
                <animate
                  attributeName="y"
                  repeatCount="indefinite"
                  dur="1s"
                  calcMode="spline"
                  keyTimes="0;0.5;1"
                  values="20.999999999999996;30;30"
                  keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                  begin="-0.1s"
                />
                <animate
                  attributeName="height"
                  repeatCount="indefinite"
                  dur="1s"
                  calcMode="spline"
                  keyTimes="0;0.5;1"
                  values="58.00000000000001;40;40"
                  keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                  begin="-0.1s"
                />
              </rect>
              <rect x="67.5" y={30} width={15} height={40} fill="#ff0000">
                <animate
                  attributeName="y"
                  repeatCount="indefinite"
                  dur="1s"
                  calcMode="spline"
                  keyTimes="0;0.5;1"
                  values="20.999999999999996;30;30"
                  keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                />
                <animate
                  attributeName="height"
                  repeatCount="indefinite"
                  dur="1s"
                  calcMode="spline"
                  keyTimes="0;0.5;1"
                  values="58.00000000000001;40;40"
                  keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
                />
              </rect>
            </svg>
            <div className="text-red-500 -mt-3">Memproses</div>
          </div>
        </div>
      </>
    );
  };

  return (
    <Layout middleware="auth" title="Kendaraan">
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="p-3 shadow-md bg-white rounded mb-5">
              <div className="px-3 flex font-semibold items-center justify-between w-full">
                <h1>Daftar Antrian</h1>
                <Modal />
              </div>
            </div>
            <div className="bg-white shadow-md p-2 rounded">
              {contents && (
                <DataTable columns={columns} data={contents} pagination />
              )}
            </div>
          </>
        )}
      </Container>
    </Layout>
  );
}
