
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createDM() {
    try {
        const mobile = "9876543210";
        const password = "password123";
        const email = "dm@bonchi.in";

        console.log("Checking if user exists...");
        const existingUser = await prisma.user.findFirst({
            where: { mobile }
        });

        if (existingUser) {
            console.log("User already exists. Deleting...");
            await prisma.user.delete({ where: { id: existingUser.id } });
        }

        console.log("Creating District Manager...");
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                first_name: "Test",
                last_name: "District Manager",
                mobile,
                email,
                password: hashedPassword,
                role: "DISTRICT_CORDINATOR", // Ensure this matches enum
                district: "Test District",
                state: "Test State",

                district_coordinator: {
                    create: {
                        assigned_districts: ["Test District"],
                        employee_id: "DM-TEST-001",
                        official_email: email,
                        status: "ACTIVE"
                    }
                }
            },
        });

        console.log("District Manager created successfully!");
        console.log("--------------------------------------");
        console.log(`Mobile: ${mobile}`);
        console.log(`Password: ${password}`);
        console.log("--------------------------------------");

    } catch (error) {
        console.error("Error creating DM:", error);
    } finally {
        await prisma.$disconnect();
    }
}

createDM();
