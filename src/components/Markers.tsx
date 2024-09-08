"use client";
import { currentStoreState, locationState, mapState } from "@/atom";
import { StoreType } from "@/interface";
import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
interface MarkerProps {
  stores: StoreType[];
}

export default function Markers({ stores }: MarkerProps) {
  const map = useRecoilValue(mapState);
  const setCurrentStore = useSetRecoilState(currentStoreState);
  const [location, setLocation] = useRecoilState(locationState);
  const categoryToEnglish = (category?: string | null): string => {
    if (!category) return "default";
    const categoryMap: { [key: string]: string } = {
      한식: "korean",
      카페: "cafe",
      분식: "snack",
      동남아: "southeast_asian",
      양식: "western",
      술집: "pub",
      베이커리: "bakery",
      인도_중동: "indian_middle_eastern",
      중국식: "chinese",
      탕류: "soup",
      일식: "japanese",
      복어취급: "puffer_fish",
      default: "default",
    };

    return categoryMap[category] || "default"; // 매핑되지 않은 경우 기본값 사용
  };

  const loadKakaoMarkers = useCallback(() => {
    if (map) {
      // 식당 데이터 마커 띄우기
      stores?.map((store) => {
        const englishCategory = categoryToEnglish(store?.category);
        var imageSrc = `/images/markers/${englishCategory}.png`,
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
          store?.lat,
          store?.lng
        );

        // 마커를 생성합니다
        var marker = new window.kakao.maps.Marker({
          position: markerPosition,
          image: markerImage,
        });
        // 마커가 지도 위에 표시되도록 설정한다.
        marker.setMap(map);

        // 마커 커서가 오버되었을 때 마커 위에 표시할 인포윈도우 생성
        var content = `<div class="infowindow">${store?.name}</div>`; // 인포윈도에 표시될 내용

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
          setLocation({ ...location, lat: store.lat, lng: store.lng });
        });
      });
    }
  }, [map, stores]);

  useEffect(() => {
    loadKakaoMarkers();
  }, [loadKakaoMarkers, map]);
  return <></>;
}
