import { useCallback, useEffect } from "react";
import { Dispatch, SetStateAction } from "react";

interface MarkerProps {
  map: any;
  stores: any[];
  setCurrentStore: Dispatch<SetStateAction<any>>;
}

export default function Markers({ map, stores, setCurrentStore }: MarkerProps) {
  const loadKakaoMarkers = useCallback(() => {
    if (map) {
      // 식당 데이터 마커 띄우기
      stores?.map((store) => {
        var imageSrc = store?.bizcnd_code_nm
            ? `/images/markers/${store?.bizcnd_code_nm}.png`
            : "/images/markers/default.png",
          imageSize = new window.kakao.maps.Size(40, 40),
          imageOption = { offset: new window.kakao.maps.Point(27, 69) };

        // 마커의 이미지 정보를 가지고 있는 마커이미지를 생성합니다
        var markerImage = new window.kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption
        );

        // 마커가 표시될 위치입니다
        var markerPosition = new window.kakao.maps.LatLng(
          store?.y_dnts,
          store?.x_cnts
        );

        // 마커를 생성합니다
        var marker = new window.kakao.maps.Marker({
          position: markerPosition,
          image: markerImage,
        });
        // 마커가 지도 위에 표시되도록 설정한다.
        marker.setMap(map);

        // 마커 커서가 오버되었을 때 마커 위에 표시할 인포윈도우 생성
        var content = `<div class="infowindow">${store?.upso_nm}</div>`; // 인포윈도에 표시될 내용

        //커스텀 오버레이를 생성합니다
        var customOverlay = new window.kakao.maps.CustomOverlay({
          position: markerPosition,
          content: content,
          xAnchor: 0.6,
          yAnchor: 0.91,
        });

        // 마커에 마우스오버 이벤트 등록
        window.kakao.maps.event.addListener(marker, "mouseover", function () {
          // 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시
          customOverlay.setMap(map);
        });
        // 마커에 마우스아웃 이벤트를 등록
        window.kakao.maps.event.addListener(marker, "mouseout", function () {
          // 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시
          customOverlay.setMap(null);
        });

        // 선택한 가게 저장
        window.kakao.maps.event.addListener(marker, "click", function () {
          setCurrentStore(store);
        });
      });
    }
  }, [map, setCurrentStore, stores]);

  useEffect(() => {
    loadKakaoMarkers();
  }, [loadKakaoMarkers, map]);
  return <></>;
}
