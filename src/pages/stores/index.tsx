import React, { useRef, useEffect, useCallback, useState } from "react";
import Loading from "@/components/Loading";
import { StoreType } from "@/interface";

import { useInfiniteQuery } from "react-query";

import axios from "axios";
import Image from "next/image";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import Loader from "@/components/Loader";
import SearchFilter from "@/components/SearchFilter";

export default function StoreListPage() {
  const ref = useRef<HTMLDivElement | null>(null);
  const pageRef = useIntersectionObserver(ref, {});
  const isPageEnd = !!pageRef?.isIntersecting;
  const [q, setQ] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);

  const searchParams = {
    q: q,
    district: district,
  };

  const fetchStores = async ({ pageParam = 1 }) => {
    const { data } = await axios("/api/stores?page=" + pageParam, {
      params: {
        limit: 10,
        page: pageParam,
        ...searchParams,
      },
    });
    return data;
  };

  const {
    data: stores,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery(["stores", searchParams], fetchStores, {
    getNextPageParam: (lastPage: any) =>
      lastPage.data?.length > 0 ? lastPage.page + 1 : undefined,
  });

  const fetchNext = useCallback(async () => {
    const res = await fetchNextPage();
    if (res.isError) {
      console.log(res.error);
    }
  }, [fetchNextPage]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    if (isPageEnd && hasNextPage) {
      timerId = setTimeout(() => {
        fetchNext();
      }, 200);
    }
    return () => clearTimeout(timerId);
  }, [fetchNext, fetchNextPage, hasNextPage, isPageEnd]);

  if (isError) {
    return (
      <div className="w-full h-screen mx-auto pt-[30%] text-red-500 text-center font-semibold">
        Try Again...
      </div>
    );
  }

  return (
    <div className="px-4 md:max-w-4xl mx-auto py-8">
      {/** search filter */}
      <SearchFilter setQ={setQ} setDistrict={setDistrict} />
      <ul role="list" className="divide-y divide-gray-100">
        {isLoading ? (
          <Loading />
        ) : (
          stores?.pages?.map((page, index) => {
            return (
              <React.Fragment key={index}>
                {page.data.map((store: StoreType, i: any) => (
                  <li className="flex justify-between gap-x-6 py-5" key={i}>
                    <div className="flex gap-x-4 items-center">
                      <Image
                        className="!h-[48px]"
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
                      <div className="mt-1 text-xs truncate font-semibold leading-5 text-gray-500">
                        {store?.phone || "번호없음"} | {store?.foodCertifyName}{" "}
                        | {store?.category}
                      </div>
                    </div>
                  </li>
                ))}
              </React.Fragment>
            );
          })
        )}
      </ul>
      {(isFetching || hasNextPage || isFetchingNextPage) && <Loader />}
      <div className="w-full touch-none h-10 mb-10" ref={ref} />
    </div>
  );
}
