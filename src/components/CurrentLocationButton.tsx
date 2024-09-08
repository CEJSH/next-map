"use client";
import { mapState } from "@/atom";
import { useState } from "react";
import { MdOutlineMyLocation } from "react-icons/md";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import FullPageLoader from "./FullPageLoader";

export default function CurrentLocationButton() {
  const map = useRecoilValue(mapState);
  const [loading, setLoading] = useState<boolean>(false);
  const handleCurrentPosition = () => {
    setLoading(true);

    // geolocation으로 현재위치 가져오기
    const options = {
      enableHighAccuracy: false,
      timeout: 7000,
      maximumAge: Infinity,
    };

    if (navigator.geolocation && map) {
      console.log("aaaa", "position");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentPosition = new window.kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          if (currentPosition) {
            setLoading(false);
            // 이동
            map.panTo(currentPosition);
            toast.success("현재 위치로 이동하였습니다.");
          }
          return currentPosition;
        },
        (error) => {
          toast.error("현재 위치를 가져올 수 없습니다.");
          setLoading(false);
        },
        options
      );
    }
  };

  return (
    <>
      {loading && <FullPageLoader />}
      <button
        type="button"
        className="fixed z-10 p-2 right-10 bottom-20 bg-white rounded-md hover:shadow-lg focus:shadow-lg hover:bg-blue-200"
      >
        <MdOutlineMyLocation
          onClick={handleCurrentPosition}
          className=" w-5 h-5"
        />
      </button>
    </>
  );
}
