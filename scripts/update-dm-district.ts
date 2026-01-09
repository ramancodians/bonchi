
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateDM() {
    try {
        const mobile = "9876543210";
        const newDistrict = "Saran"; // Real district in Bihar

        console.log(`Updating DM with mobile ${mobile} to district ${newDistrict}...`);

        const user = await prisma.user.findFirst({
            where: { mobile }
        });

        if (!user) {
            console.error("User not found!");
            return;
        }

        // Update User record
        await prisma.user.update({
            where: { id: user.id },
            data: { district: newDistrict }
        });

        // Update DM Profile
        const dm = await prisma.districtCoordinator.findUnique({
            where: { user_id: user.id }
        });

        if (dm) {
            await prisma.districtCoordinator.update({
                where: { id: dm.id },
                data: {
                    assigned_districts: [newDistrict], // Overwrite with real district
                    // If they had other districts, this resets to just Saran. Safe for test account.
                }
            });
            console.log("DM Profile updated.");
        }

        console.log("Update successful!");

    } catch (error) {
        console.error("Error updating DM:", error);
    } finally {
        await prisma.$disconnect();
    }
}

updateDM();
