import {
  FaHandHoldingHeart,
  FaHospital,
  FaUserMd,
  FaPills,
  FaUserTie,
} from "react-icons/fa";

export const API_ENDPOINT = "http://localhost:3000/api";

export const PUBLIC_ROUTES = ["/login", "/register", "/bonchi-mitra"];

export const PARTNER_TYPES = [
  {
    label: "District Manager",
    value: "DISTRICT_CORDINATOR",
    icon: FaUserTie,
  },
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
