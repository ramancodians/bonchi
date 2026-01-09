
export const getDashboardPath = (role: string): string => {
    switch (role) {
        case "SUPER_ADMIN":
            return "/admin/dashboard"; // Or existing super admin path
        case "DISTRICT_CORDINATOR":
            return "/district-manager/dashboard";
        case "BONCHI_MITRA":
            return "/agent/dashboard";
        case "MEDICAL_STORE":
            return "/medical-store/dashboard";
        case "HEALTH_ASSISTANT":
            return "/health-assistant/dashboard";
        case "HOSPITAL_PARTNER":
            return "/hospital/dashboard";
        case "CUSTOMER":
        default:
            return "/dashboard";
    }
};
