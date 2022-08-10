import { useRecoilValueLoadable } from "recoil";
import Container from "../../components/Container";
import Layout from "../../components/Layout";
import DataTable from "react-data-table-component";
import { getMechanic } from "../../store/mechanic";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [mechanic, setMechanic] = useState([]);

  const getMechanic = async () => {
    try {
      const response = await axios.get("/api/mechanic");
      if (response) {
        setMechanic(response.data.data);
      }
    } catch (error) {}
  };

  const isReady = (id) => {
    const curentMecha = mechanic?.filter((item) => {
      const result = item.id == id && item;
      return result.data;
    });
    let numberOfProcess = 0;
    const ready = curentMecha?.filter((item2) => {
      const process = item2.data.map((item3) => {
        if (item3.status == "process") {
          numberOfProcess = numberOfProcess + 1;
        }
      });
    });
    if (numberOfProcess > 0) {
      return false;
    } else {
      return true;
    }
  };

  const totalServis = (id) => {
    const curentMecha = mechanic?.filter((item) => {
      const result = item.id == id && item;
      return result.data;
    });
    let numberOfCompleted = 0;
    const ready = curentMecha?.filter((item2) => {
      const process = item2.data.map((item3) => {
        if (item3.status == "completed") {
          numberOfCompleted = numberOfCompleted + 1;
        }
      });
    });
    return numberOfCompleted;
  };

  useEffect(() => {
    getMechanic();
  }, []);

  return (
    <Layout middleware="auth" title="Kendaraan">
      <Container>
        <div className="p-3 shadow-md bg-white rounded mb-5">
          <div className="px-3 flex font-semibold items-center justify-between w-full">
            <h1>Daftar Mechanic</h1>
            <button className="text-sm bg-blue-400 hover:bg-blue-200 p-2 px-2 text-white rounded">
              Tambah Mechanic
            </button>
          </div>
        </div>
        <div className="flex flex-wrap ">
          {mechanic.length > 0 ? (
            mechanic.map((item) => {
              return (
                <div key={item.id} className="w-1/4 p-1">
                  <div className="bg-white shadow-md p-2 rounded relative">
                    <img
                      className="w-full h-40 object-cover"
                      src={`${item.imageUrl}`}
                    />
                    <div
                      className={`absolute top-0 right-0 text-white rounded text-sm ${
                        isReady(item.id) == true ? "bg-green-500" : "bg-red-500"
                      } p-1 px-2`}
                    >
                      {isReady(item.id) == true ? "Ready" : "Working"}
                    </div>
                    <div className="bg-red-200 p-1 px-2">
                      Nama : {item.name}
                    </div>
                    <div className="bg-gray-200 p-1 px-2">
                      Nomor HP : {item.phone}
                    </div>
                    <div className="bg-green-200 p-1 px-2">
                      Total Servis : {totalServis(item.id)}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <>
              <div className="w-1/4 p-1">
                <div className="bg-white p-2 rounded relative">
                  <div className="animate-pulse">
                    <div className="w-full h-44 bg-gray-300 rounded"></div>
                    <div className="bg-gray-300 rounded w-5/6 h-3 mt-1"></div>
                    <div className="bg-gray-300 rounded w-3/6 h-3 mt-1 mb-5"></div>
                  </div>
                </div>
              </div>
              <div className="w-1/4 p-1">
                <div className="bg-white p-2 rounded relative">
                  <div className="animate-pulse">
                    <div className="w-full h-44 bg-gray-300 rounded"></div>
                    <div className="bg-gray-300 rounded w-5/6 h-3 mt-1"></div>
                    <div className="bg-gray-300 rounded w-3/6 h-3 mt-1 mb-5"></div>
                  </div>
                </div>
              </div>
              <div className="w-1/4 p-1">
                <div className="bg-white p-2 rounded relative">
                  <div className="animate-pulse">
                    <div className="w-full h-44 bg-gray-300 rounded"></div>
                    <div className="bg-gray-300 rounded w-5/6 h-3 mt-1"></div>
                    <div className="bg-gray-300 rounded w-3/6 h-3 mt-1 mb-5"></div>
                  </div>
                </div>
              </div>
              <div className="w-1/4 p-1">
                <div className="bg-white p-2 rounded relative">
                  <div className="animate-pulse">
                    <div className="w-full h-44 bg-gray-300 rounded"></div>
                    <div className="bg-gray-300 rounded w-5/6 h-3 mt-1"></div>
                    <div className="bg-gray-300 rounded w-3/6 h-3 mt-1 mb-5"></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Container>
    </Layout>
  );
}
