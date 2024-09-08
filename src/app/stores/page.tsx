"use client";

import React, { useRef, useEffect, useCallback } from "react";
import Loading from "@/components/Loading";
import { StoreType } from "@/interface";

import { useInfiniteQuery } from "react-query";

import axios from "axios";

import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import Loader from "@/components/Loader";
import SearchFilter from "@/components/SearchFilter";
import { useRecoilValue } from "recoil";
import { searchState } from "@/atom";
import StoreList from "@/components/StoreList";

export default function StoreListPage() {
  const ref = useRef<HTMLDivElement | null>(null);
  const pageRef = useIntersectionObserver(ref, {});
  const isPageEnd = !!pageRef?.isIntersecting;
  const searchValue = useRecoilValue(searchState);

  const searchParams = {
    q: searchValue?.q,
    district: searchValue?.district,
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
      <SearchFilter />
      <ul role="list" className="divide-y divide-gray-100">
        {isLoading ? (
          <Loading />
        ) : (
          stores?.pages?.map((page, index) => {
            return (
              <React.Fragment key={index}>
                {page.data.map((store: StoreType, i: number) => (
                  <StoreList key={i} store={store} i={i} />
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
