import {
  FaHandHoldingHeart,
  FaHospital,
  FaUserMd,
  FaPills,
} from "react-icons/fa";

export const API_ENDPOINT = import.meta.env.VITE_APP_API;

export const PUBLIC_ROUTES = ["/login", "/register", "/bonchi-mitra"];

export const PARTNER_TYPES = [
  {
    label: "Bonchi Mitra",
    value: "BONCHI_MITRA",
    icon: FaHandHoldingHeart,
  },
  {
    label: "Hospital Partner",
    value: "HOSPITAL_PARTNER",
    icon: FaHospital,
  },
  {
    label: "Health Assistant",
    value: "HEALTH_ASSISTANT",
    icon: FaUserMd,
  },
  {
    label: "Medical Store",
    value: "MEDICAL_STORE",
    icon: FaPills,
  },
];
