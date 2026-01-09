import { Router } from "express";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseUtil";
import { PaginatedResult } from "../../utils/types";
import prisma from "../../db";
import { hashPassword } from "../../utils/securityUtils";
import { UserRoles } from "@prisma/client";

const PartnersRouter = Router();

// List all partners (Hospital + Medical Store) with pagination
PartnersRouter.get("/list", async (req, res) => {
  try {
    const { page = "1", limit = "10", role, search } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    // Build where clause
    const where: any = {};

    if (role && (role === "HOSPITAL_PARTNER" || role === "MEDICAL_STORE")) {
      where.role = role;
    } else {
      // Default: show both partner types
      where.role = {
        in: ["HOSPITAL_PARTNER", "MEDICAL_STORE"],
      };
    }

    if (search) {
      where.OR = [
        { first_name: { contains: search as string, mode: "insensitive" } },
        { last_name: { contains: search as string, mode: "insensitive" } },
        { mobile: { contains: search as string } },
        { email: { contains: search as string, mode: "insensitive" } },
      ];
    }

    // Get total count
    const total = await prisma.user.count({ where });

    // Get users with their partner details
    const users = await prisma.user.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        mobile: true,
        email: true,
        role: true,
        createdAt: true,
        hospital_partner: {
          select: {
            id: true,
            hospital_name: true,
            registration_number: true,
            mobile_number: true,
            addresses: {
              select: {
                district: true,
                state: true,
              },
              take: 1, // Take the first address
            },
          },
        },
        medical_store: {
          select: {
            id: true,
            store_name: true,
            drug_license_number: true,
            mobile_number: true,
            addresses: {
              select: {
                district: true,
                state: true,
              },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const result: PaginatedResult<(typeof users)[0]> = {
      items: users,
      pagination: {
        total,
        take,
        skip,
      },
    };

    return sendSuccessResponse(res, { data: result });
  } catch (error) {
    console.error("Error fetching partners:", error);
    return sendErrorResponse(res, {
      message: "Failed to fetch partners",
      status: 500,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Create new partner (Hospital or Medical Store based on role in request)
PartnersRouter.post("/create", async (req, res) => {
  try {
    const {
      // User credentials
      mobile,
      password,
      first_name,
      last_name,
      email,
      role, // HOSPITAL_PARTNER or MEDICAL_STORE

      // Partner-specific data
      ...partnerData
    } = req.body;

    // Validate required user fields
    if (!mobile || !password || !first_name || !last_name || !role) {
      return sendErrorResponse(res, {
        message:
          "Missing required fields: mobile, password, first_name, last_name, role",
        status: 400,
      });
    }

    // Validate role
    if (
      role !== "HOSPITAL_PARTNER" &&
      role !== "MEDICAL_STORE" &&
      role !== "HEALTH_ASSISTANT" &&
      role !== UserRoles.DISTRICT_CORDINATOR
    ) {
      return sendErrorResponse(res, {
        message:
          "Invalid role. Must be HOSPITAL_PARTNER, MEDICAL_STORE, or HEALTH_ASSISTANT, or DISTRICT_CORDINATOR",
        status: 400,
      });
    }

    // Check if user with this mobile already exists
    const existingUser = await prisma.user.findUnique({
      where: { mobile },
    });

    if (existingUser) {
      return sendErrorResponse(res, {
        message: "User with this mobile number already exists",
        status: 409,
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Get the admin user ID from request (set by auth middleware)
    const createdByUserId = (req as any).user?.id;

    // Create user and partner in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create User
      const newUser = await tx.user.create({
        data: {
          mobile,
          password: hashedPassword,
          first_name,
          last_name,
          email: email || null,
          role: role as UserRoles,
          termsAccepted: true,
        },
      });

      if (role === UserRoles.DISTRICT_CORDINATOR) {
        await prisma.district_coordinators.create({
          data: {
            user_id: newUser.id,
            created_by_user_id: createdByUserId,
          },
        });
      }

      if (role === "HOSPITAL_PARTNER") {
        // ... (Existing Hospital logic)
        const {
          hospital_name,
          registration_number,
          contact_person_name,
          mobile_number,
          full_address,
          hospital_types = [],
          medical_services = [],
          specialties = [],
        } = partnerData;

        if (
          !hospital_name ||
          !registration_number ||
          !contact_person_name ||
          !mobile_number ||
          !full_address
        ) {
          throw new Error("Missing required hospital fields");
        }

        // ... Check Exists ...
        const existingHospital = await tx.hospitalPartner.findUnique({
          where: { registration_number },
        });
        if (existingHospital)
          throw new Error(
            "Hospital with this registration number already exists"
          );

        const hospitalPartner = await tx.hospitalPartner.create({
          data: {
            user_id: newUser.id,
            created_by_user_id: createdByUserId,
            hospital_name,
            hospital_types,
            registration_number,
            year_of_establishment: partnerData.year_of_establishment || null,
            contact_person_name,
            designation: partnerData.designation || null,
            mobile_number,
            alternate_mobile_number:
              partnerData.alternate_mobile_number || null,
            email: partnerData.email || null,
            full_address,
            area_locality: partnerData.area_locality || null,
            block: partnerData.block || null,
            district: partnerData.district || null,
            state: partnerData.state || null,
            pincode: partnerData.pincode || null,
            medical_services,
            specialties,
            specialty_other: partnerData.specialty_other || null,
            opd_discount: partnerData.opd_discount || null,
            diagnostic_discount: partnerData.diagnostic_discount || null,
            surgery_discount: partnerData.surgery_discount || null,
            free_services: partnerData.free_services || null,
          },
        });
        return { user: newUser, partner: hospitalPartner };
      } else if (role === "MEDICAL_STORE") {
        // ... (Existing Medical Store logic)
        const {
          store_name,
          owner_name,
          drug_license_number,
          mobile_number,
          full_address,
        } = partnerData;

        if (
          !store_name ||
          !owner_name ||
          !drug_license_number ||
          !mobile_number ||
          !full_address
        ) {
          throw new Error("Missing required medical store fields");
        }

        const existingStore = await tx.medicalStore.findUnique({
          where: { drug_license_number },
        });
        if (existingStore)
          throw new Error(
            "Medical store with this drug license number already exists"
          );

        const medicalStore = await tx.medicalStore.create({
          data: {
            user_id: newUser.id,
            created_by_user_id: createdByUserId,
            store_name,
            owner_name,
            drug_license_number,
            gst_number: partnerData.gst_number || null,
            mobile_number,
            alternate_mobile_number:
              partnerData.alternate_mobile_number || null,
            email: partnerData.email || null,
            full_address,
            village_ward: partnerData.village_ward || null,
            block: partnerData.block || null,
            district: partnerData.district || null,
            state: partnerData.state || null,
            pincode: partnerData.pincode || null,
            medicine_discount: partnerData.medicine_discount || null,
            generic_medicine_discount:
              partnerData.generic_medicine_discount || null,
            home_delivery_available:
              partnerData.home_delivery_available || false,
            bonchi_healthcard_accepted:
              partnerData.bonchi_healthcard_accepted ?? true,
            display_partner_board: partnerData.display_partner_board ?? true,
            drug_license_copy_url: partnerData.drug_license_copy_url || null,
            store_photo_url: partnerData.store_photo_url || null,
            owner_aadhaar_pan_url: partnerData.owner_aadhaar_pan_url || null,
            discount_agreement_consent:
              partnerData.discount_agreement_consent || false,
            insurance_understanding:
              partnerData.insurance_understanding || false,
            terms_accepted: partnerData.terms_accepted || false,
          },
        });
        return { user: newUser, partner: medicalStore };
      } else if (role === "HEALTH_ASSISTANT") {
        // New Health Assistant Logic
        const {
          profession,
          qualification,
          specialization,
          experience_years,
          address,
          aadhaar_number,
        } = partnerData;

        const healthAssistant = await tx.healthAssistant.create({
          data: {
            user_id: newUser.id,
            profession: profession || "Health Assistant",
            qualification: qualification || null,
            specialization: specialization || null,
            experience_years: experience_years
              ? parseInt(experience_years)
              : null,
            address: address || null,
            aadhaar_number: aadhaar_number || null,
            is_verified: true, // Auto-verify for now since created by Admin/Agent
          },
        });
        return { user: newUser, partner: healthAssistant };
      }
    });

    return sendSuccessResponse(res, {
      data: {
        message: `${
          role === "HOSPITAL_PARTNER"
            ? "Hospital Partner"
            : role === "MEDICAL_STORE"
            ? "Medical Store"
            : "Health Assistant"
        } created successfully`,
        userId: result.user.id,
        partnerId: result.partner.id,
      },
      status: 201,
    });
  } catch (error) {
    console.error("Error creating partner:", error);
    return sendErrorResponse(res, {
      message:
        error instanceof Error ? error.message : "Failed to create partner",
      status: 500,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update partner
PartnersRouter.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role, ...updateData } = req.body;

    // Find the user first to determine partner type
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!user) {
      return sendErrorResponse(res, {
        message: "Partner not found",
        status: 404,
      });
    }

    if (user.role !== "HOSPITAL_PARTNER" && user.role !== "MEDICAL_STORE") {
      return sendErrorResponse(res, {
        message: "User is not a partner",
        status: 400,
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update user data if provided
      const { first_name, last_name, email, mobile, ...partnerSpecificData } =
        updateData;

      const userUpdateData: any = {};
      if (first_name) userUpdateData.first_name = first_name;
      if (last_name) userUpdateData.last_name = last_name;
      if (email !== undefined) userUpdateData.email = email;
      if (mobile) userUpdateData.mobile = mobile;

      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id },
          data: userUpdateData,
        });
      }

      // Update partner-specific data
      if (user.role === "HOSPITAL_PARTNER") {
        const partner = await tx.hospitalPartner.update({
          where: { user_id: id },
          data: partnerSpecificData,
        });
        return { partner };
      } else {
        const partner = await tx.medicalStore.update({
          where: { user_id: id },
          data: partnerSpecificData,
        });
        return { partner };
      }
    });

    return sendSuccessResponse(res, {
      data: {
        message: "Partner updated successfully",
        partner: result.partner,
      },
    });
  } catch (error) {
    console.error("Error updating partner:", error);
    return sendErrorResponse(res, {
      message: "Failed to update partner",
      status: 500,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Delete partner
PartnersRouter.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user first
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!user) {
      return sendErrorResponse(res, {
        message: "Partner not found",
        status: 404,
      });
    }

    if (user.role !== "HOSPITAL_PARTNER" && user.role !== "MEDICAL_STORE") {
      return sendErrorResponse(res, {
        message: "User is not a partner",
        status: 400,
      });
    }

    // Delete user (cascade will delete partner due to onDelete: Cascade)
    await prisma.user.delete({
      where: { id },
    });

    return sendSuccessResponse(res, {
      data: {
        message: "Partner deleted successfully",
      },
    });
  } catch (error) {
    console.error("Error deleting partner:", error);
    return sendErrorResponse(res, {
      message: "Failed to delete partner",
      status: 500,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default PartnersRouter;
