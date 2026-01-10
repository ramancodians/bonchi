import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getListingsAPI } from "../../hooks/api";
import { FaSearch, FaMapMarkerAlt, FaPhoneAlt, FaHospital, FaNotesMedical, FaPills } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface ListingPageProps {
    type: "HOSPITAL" | "LAB" | "MEDICAL_STORE";
    title: string;
}

const ListingPage: React.FC<ListingPageProps> = ({ type, title }) => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ["listings", type, page, search],
        queryFn: () => getListingsAPI(page, 10, type, search),
        keepPreviousData: true,
    });

    const handleCall = (number: string) => {
        window.location.href = `tel:${number}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => navigate(-1)} className="text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">{title}</h1>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder={`Search ${title}...`}
                        className="w-full bg-gray-100 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : data?.items?.length > 0 ? (
                    data.items.map((item: any) => {
                        // Determine data source based on type
                        const details = type === "MEDICAL_STORE" ? item.medical_store : item.hospital_partner;
                        if (!details) return null;

                        const name = type === "MEDICAL_STORE" ? details.store_name : details.hospital_name;
                        const addressStr = details.addresses?.[0] ? `${details.addresses[0].district}, ${details.addresses[0].state}` : details.full_address;

                        return (
                            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            {type === "MEDICAL_STORE" ? (
                                                <FaPills className="text-green-500" />
                                            ) : type === "LAB" ? (
                                                <FaNotesMedical className="text-blue-500" />
                                            ) : (
                                                <FaHospital className="text-red-500" />
                                            )}
                                            <h3 className="font-bold text-gray-800 line-clamp-1">{name}</h3>
                                        </div>

                                        <p className="text-sm text-gray-500 flex items-start gap-1 mb-2">
                                            <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-gray-400 size-3" />
                                            <span className="line-clamp-2">{details.full_address}</span>
                                        </p>

                                        {/* Tags for Hospital */}
                                        {type !== "MEDICAL_STORE" && details.medical_services && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {details.medical_services.slice(0, 3).map((s: string) => (
                                                    <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded-full font-medium">
                                                        {s.replace(/_/g, " ")}
                                                    </span>
                                                ))}
                                                {details.medical_services.length > 3 && (
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full font-medium">
                                                        +{details.medical_services.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleCall(details.mobile_number)}
                                        className="flex-shrink-0 w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center hover:bg-green-100 transition-colors"
                                    >
                                        <FaPhoneAlt size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 text-gray-400">
                        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaSearch size={30} className="opacity-30" />
                        </div>
                        <p>No results found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListingPage;
