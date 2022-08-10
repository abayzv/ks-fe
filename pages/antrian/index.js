import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { useRecoilValueLoadable } from "recoil";
import { getQueue } from "../../store/queue";

export default function index() {
  const { contents } = useRecoilValueLoadable(getQueue);
  const [dataAntrian, setDataAntrian] = useState();

  const pad = (number, digits) => {
    return (
      Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number
    );
  };
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const [liveTime, setLiveTime] = useState(
    pad(hours, 2) + " : " + pad(minutes, 2) + " : " + pad(seconds, 2)
  );

  const setTime = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    setLiveTime(
      pad(hours, 2) + " : " + pad(minutes, 2) + " : " + pad(seconds, 2)
    );
  };

  const getDataAntrian = async () => {
    try {
      const response = await axios.get("/api/queue");
      setDataAntrian(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setInterval(() => {
      setTime();
    }, 1000);
    setInterval(() => {
      getDataAntrian();
    }, 10000);
  }, []);

  return (
    <>
      <div className="flex flex-col h-screen relative">
        <div className="px-5 h-1/4 w-1/1">
          <div className="flex justify-between px-5">
            <div className=" py-7">
              <img src="/assets/images/logo.png" width={250} alt="" />
            </div>
            <div className="bg-red-500 rounded-b-xl h-10 p-7 px-10 flex items-center text-white font-bold text-2xl">
              <time>{liveTime}</time>
            </div>
          </div>
        </div>
        <div className="bg-blue-500 w-full h-full">
          <div className="px-5 flex  -mt-10 h-full">
            <div className="px-3 w-3/5 h-5/6">
              <div className="bg-gray-500 mt-3 h-2/6 rounded-xl">
                <img
                  src="https://yamaha-motor.co.id/productaward/img/banner_01-min.jpg"
                  className="w-full h-full rounded-xl"
                  alt=""
                />
              </div>
              <div className="bg-gray-500 mt-9 h-4/6 rounded-md">
                <iframe
                  src="https://www.youtube.com/embed/jUaacJIuRTw?autoplay=0"
                  height={"100%"}
                  width="100%"
                  className="rounded-md"
                ></iframe>
              </div>
            </div>
            <div className="px-3 w-2/5 h-5/6">
              {Array.isArray(dataAntrian) &&
                dataAntrian?.map((item) => {
                  return (
                    item?.status == "process" && (
                      <div className="bg-black border-gray-200 border-solid border-4 mt-3 h-1/4 rounded-xl shadow-md">
                        <div className="flex items-center justify-between h-full">
                          <div className="w-2/3 px-5">
                            <div className="text-white">Nomor Antrian</div>
                            <div className="text-5xl font-bold text-white">
                              {pad(item.number, 4)}
                            </div>
                            <div className="text-yellow-300 font-bold mt-1">
                              {item.mechanic?.name}
                            </div>
                          </div>
                          <div
                            className="bg-white w-1/3 h-full rounded-xl"
                            style={{
                              backgroundImage: `url(${item.mechanic?.image})`,
                              backgroundSize: "cover",
                            }}
                          ></div>
                        </div>
                      </div>
                    )
                  );
                })}
            </div>
          </div>
        </div>
        <div className="w-full h-10 bottom-0 absolute bg-black text-white">
          <marquee
            width="100%"
            direction="left"
            height="100%"
            className="flex items-center"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
            nostrum, facere magni a molestias, reiciendis amet voluptate tempore
            inventore corporis voluptas eligendi atque quam molestiae sunt
            quibusdam iusto incidunt totam? Soluta maiores nihil labore eaque
            provident molestiae similique aut itaque, a eius ullam inventore!
            Aperiam reprehenderit omnis labore, commodi repudiandae cum ipsa
            dolor mollitia voluptatum praesentium quod beatae eius assumenda
            saepe atque dolore odit nisi sint vel molestiae doloremque quaerat?
            Iure id, harum doloremque deleniti modi ex dolores quae. Animi quis
            non assumenda, nisi quam sed. Natus blanditiis quos voluptatibus
            fugit porro facere accusantium facilis necessitatibus, earum magni.
            Optio, rem!
          </marquee>
        </div>
        <div className="h-10 bottom-0 absolute bg-red-500 flex items-center font-semibold text-white px-10 text-xl">
          INFORMASI
        </div>
      </div>
    </>
  );
}
