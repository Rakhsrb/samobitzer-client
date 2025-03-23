import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ProjectCard } from "./partials/ProjectCard";
import { Pending } from "../components/Pending";
import { useTranslation } from "react-i18next";
import { fetcher } from "../middlewares/Fetcher";
import useSWR from "swr";

export const ProjectsModule = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const [pageSize, setPageSize] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState("");

  const getUrl = (category, size) => {
    if (category) {
      return `/projects?category=${category}&pageSize=${size}`;
    }
    return `/projects?pageSize=${size}`;
  };

  const [url, setUrl] = useState(getUrl(selectedCategory, pageSize));

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  useEffect(() => {
    setUrl(getUrl(selectedCategory, pageSize));
  }, [selectedCategory, pageSize]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setPageSize(6);
    setUrl(getUrl(category, 6));
  };

  const handleLoadMore = () => {
    const newPageSize = pageSize + 6;
    setPageSize(newPageSize);
  };

  return (
    <section className="px-4 py-20">
      <div data-aos="fade-up" className="container">
        <h1
          className={`text-4xl md:text-5xl font-bold mb-20 text-red-800 text-center ${
            location.pathname == "/" ? "" : "hidden"
          }`}
        >
          {t("headings.projects.mainTitle")}
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          {["", "vrfsystem", "camera", "stellaj", "sandwich", "other"].map(
            (category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(category)}
                className={`bg-gray-200 transition-all font-semibold text-[12px] md:text-sm py-2 px-4 rounded-md ${
                  selectedCategory === category
                    ? "text-red-700"
                    : "hover:bg-red-700 hover:text-white"
                }`}
              >
                {t(`filters.${category || "all"}`)}
              </button>
            )
          )}
          <button className="bg-red-700 text-white font-semibold text-[12px] md:text-sm py-2 px-4 rounded-md">
            {t("headings.projects.add")}
          </button>
        </div>
        {isLoading ? (
          <Pending />
        ) : data.data.length > 0 ? (
          <div className="pt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {data.data.map((item, index) => (
              <ProjectCard data-aos="zoom-in" key={index} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-l-xl h-[30vh] flex items-center justify-center bg-slate-100">
            <h1 className="text-red-800 font-bold text-3xl">NO DATA</h1>
          </div>
        )}
        {data?.data?.length > 0 && data?.total > data?.data?.length && (
          <div className="flex justify-center mt-5">
            <button
              onClick={handleLoadMore}
              className="bg-[#5D75A5] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#4A5F88] transition-all"
            >
              Ko'proq ko'rish
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
