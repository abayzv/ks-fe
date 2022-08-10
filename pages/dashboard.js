import Container from "../components/Container";
import Layout from "../components/Layout";
import { BiDollar, BiReceipt, BiTimer, BiUser } from "react-icons/bi";
import { BsTools, BsReceipt, BsBox } from "react-icons/bs";
import CardWidget from "../components/CardWidget";
import dynamic from "next/dynamic";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Dashboard() {
  const [dataAdmin, setDataAdmin] = useState([]);
  const [topCategory, setTopCategory] = useState("Product");

  const getDataAdmin = async () => {
    try {
      const response = await axios.get("/api/admin");
      if (response) {
        setDataAdmin(response.data);
      }
    } catch (error) {}
  };

  const addChartDataToSeries = () => {
    const data = [];
    for (let i = 0; i <= 30; i++) {
      dataAdmin?.chart?.map((item) => {
        if (!data[i]) {
          if (i == item.date) {
            // return item.views;
            data[i] = item.views;
          } else {
            data[i] = 0;
          }
        }
      });
    }
    return data;
  };

  const isReady = (id) => {
    const curentMecha = dataAdmin?.mechanic?.filter((item) => {
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

  const mechanicReady = () => {
    let ready = 0;
    dataAdmin?.mechanic?.map((item) => {
      if (isReady(item.id)) {
        ready = ready + 1;
      }
    });

    return ready;
  };

  const chartData = {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: addChartDataToSeries().map((item, key) => {
          return key;
        }),
      },
    },
    series: [
      {
        name: "series-1",
        data: addChartDataToSeries().map((item, key) => {
          return item;
        }),
      },
    ],
  };


  // return data admin category to array
  const getLabel = (data = []) => {
    const category = [];
    data.map((item) => {
      return category.push(item.name);
    })
    return category;
  }

  const getSeries = (data = []) => {
    const total = [];
    data.map((item) => {
      return total.push(item.total);
    })
    return total;
  }

  const chartProduk = {
    options: {
      labels: getLabel(dataAdmin?.category)
    },
    series: getSeries(dataAdmin?.category),
  }

  const chartColors = {
    options: {
      labels: getLabel(dataAdmin?.color)
    },
    series: getSeries(dataAdmin?.color),
  }

  const chartGrade = {
    options: {
      labels: getLabel(dataAdmin?.grade)
    },
    series: getSeries(dataAdmin?.grade),
  }

  const chartSablon = {
    options: {
      labels: getLabel(dataAdmin?.sablon)
    },
    series: getSeries(dataAdmin?.sablon),
  }

  // handle select top category
  const handleSelectTopCategory = (e) => {
    setTopCategory(e.target.value);
  }

  useEffect(() => {
    getDataAdmin();
    console.log(dataAdmin)
  }, []);

  return (
    <Layout middleware="auth" title="Dashboard">
      <Container>
        <div className="flex flex-wrap">
          <div className="w-1/3 p-2">
            <CardWidget title="Transaksi Hari Ini" count={dataAdmin?.curentTransaction}>
              <BiDollar size={55} />
            </CardWidget>
          </div>
          <div className="w-1/3 p-2">
            <CardWidget title="Total Produk" count={dataAdmin?.allProduct}>
              <BsBox size={40} />
            </CardWidget>
          </div>
          <div className="w-1/3 p-2">
            <CardWidget title="Total Transaksi" count={dataAdmin?.allTransaction}>
              <BsReceipt size={40} />
            </CardWidget>
          </div>
        </div>
        <div className="flex flex-wrap">
          {/* <div className="w-3/6 p-2">
            <div className="bg-white shadow-md w-full h-72 rounded p-5">
              <div className="text-gray-500">Data Pelanggan Bulan Ini</div>
              {Object.keys(dataAdmin).length > 0 && (
                <Chart
                  options={chartData.options}
                  series={chartData.series}
                  height="90%"
                  type="bar"
                />
              )}
            </div>
          </div> */}
          <div className="w-3/6 p-2">
            <div className="bg-white shadow-md w-full h-72 p-5 rounded">
              <div className="text-gray-500 mb-4">Transaksi</div>
              {dataAdmin?.payment?.map((item) => (
                <>
                  <hr />
                  <div className="flex justify-between items-center py-4">
                    <div className="text-gray-500 font-bold text-sm">
                      {item.name}
                    </div>
                    <div className="text-red-300 font-semibold text-sm">
                      {item.total}
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
          <div className="w-3/6 p-2">
            <div className="bg-white shadow-md w-full h-72 rounded p-5">
              <div className="flex align-middle justify-between">
              <div className="text-gray-500">Paling Laris</div>
              {/* create select with tailwind css */}
              <select onClick={handleSelectTopCategory} className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline">
                  <option disabled>Pilih Kategori</option>
                  <option value="Product">Produk</option>
                  <option value="Sablon">Jenis Sablon</option>
                  <option value="Color">Warna</option>
                  <option value="Grade">Kualitas</option>
              </select>
              </div>
              {topCategory == "Product" && (
                Object.keys(dataAdmin).length > 0 && (
                  <Chart
                    options={chartProduk.options}
                    series={chartProduk.series}
                    height="90%"
                    type="donut"
                  />
                )
              )}
               {topCategory == "Color" && (
                Object.keys(dataAdmin).length > 0 && (
                  <Chart
                    options={chartColors.options}
                    series={chartColors.series}
                    height="90%"
                    type="donut"
                  />
                )
              )}
               {topCategory == "Grade" && (
                Object.keys(dataAdmin).length > 0 && (
                  <Chart
                    options={chartGrade.options}
                    series={chartGrade.series}
                    height="90%"
                    type="donut"
                  />
                )
              )}
               {topCategory == "Sablon" && (
                Object.keys(dataAdmin).length > 0 && (
                  <Chart
                    options={chartSablon.options}
                    series={chartSablon.series}
                    height="90%"
                    type="donut"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}
