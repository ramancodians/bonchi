import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

// Generate unique ID
const uniqueId = () => {
  {
    return uuidv4();
  }
};

// Configure S3 client
export const s3Config = new S3Client({
  region: "sgp1",
  forcePathStyle: false,
  endpoint: "https://sgp1.digitaloceanspaces.com",
  credentials: {
    accessKeyId: "DO00CMP6U3N7RBF7VPYR",
    secretAccessKey: "ueJ0j/eD3x01KbPg6UB0nMgl+gKbfOamdsKfvVP4BE0",
  },
});

// Configure multer with S3 storage
export const uploadMiddleWare = multer({
  storage: multerS3({
    s3: s3Config,
    bucket: "ssda",
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: async (request: any, file: any, cb: any) => {
      const filePath = `bonchi/${moment().format(
        "DD-MMM-YYYY"
      )}_${uniqueId()}/${file.originalname}`;
      cb(null, filePath);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});
