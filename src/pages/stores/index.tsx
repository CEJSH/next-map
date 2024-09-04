import Loading from "@/components/Loading";
import { StoreType } from "@/interface";
import axios from "axios";
import Image from "next/image";
import { useQuery } from "react-query";

export default function StoreListPage() {
  const {
    data: stores,
    isLoading,
    isError,
  } = useQuery("stores", async () => {
    const { data } = await axios("/api/stores");
    return data as StoreType[];
  });

  if (isError) {
    return (
      <div className="w-full h-screen mx-auto pt-[30%] text-red-500 text-center font-semibold">
        Try Again...
      </div>
    );
  }

  return (
    <div className="px-4 md:max-w-4xl mx-auto py-8">
      <ul role="list" className="divide-y divide-gray-100">
        {isLoading ? (
          <Loading />
        ) : (
          stores?.map((store, index) => {
            return (
              <li className="flex justify-between gap-x-6 py-5" key={index}>
                <div className="flex gap-x-4">
                  <Image
                    width={48}
                    height={48}
                    alt="아이콘 이미지"
                    src={
                      store?.category
                        ? `/images/markers/${store?.category}.png`
                        : "/images/markers/default.png"
                    }
                  />
                  <div>
                    <div className="text-sm font-semibold leading-9 text-gray-900">
                      {store?.name}
                    </div>
                    <div className="mt-1 text-xs font-semibold leading-5 text-gray-500">
                      {store?.storeType}
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <div className="text-sm font-semibold leading-9 text-gray-900">
                    {store?.address}
                  </div>{" "}
                  <div className="mt-1 text-xs font-semibold leading-5 text-gray-500">
                    {store?.phone || "번호없음"} | {store?.foodCertifyName} |{" "}
                    {store?.category}
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
