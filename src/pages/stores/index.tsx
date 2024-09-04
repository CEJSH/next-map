import { StoreType } from "@/interface";
import axios from "axios";
import Image from "next/image";

export default function StoreListPage({ stores }: { stores: StoreType[] }) {
  return (
    <div className="px-4 md:max-w-4xl mx-auto py-8">
      <ul role="list" className="divide-y divide-gray-100">
        {stores?.map((store, index) => {
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
        })}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  const stores = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/stores/`);

  return { props: { stores: stores.data } };
}
