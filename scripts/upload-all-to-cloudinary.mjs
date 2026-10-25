import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "yk1l1nlz",
  api_key: "692664317512116",
  api_secret: "HiQn1ovc8aSAeQ2NIoXX-zn4j40",
  secure: true,
});

const foldersToUpload = [
  { dir: "public/asset/photo", cloudFolder: "alokworld/leadership", webPrefix: "/asset/photo" },
  { dir: "public/asset/personalities", cloudFolder: "alokworld/personalities", webPrefix: "/asset/personalities" },
  { dir: "public/asset/alokadhivationposter2026", cloudFolder: "alokworld/posters", webPrefix: "/asset/alokadhivationposter2026" },
  { dir: "public/asset/topofwebsite", cloudFolder: "alokworld/banners", webPrefix: "/asset/topofwebsite" },
  { dir: "public/asset/gallery", cloudFolder: "alokworld/gallery", webPrefix: "/asset/gallery" },
  { dir: "public/asset/listofmemberswithdesignation", cloudFolder: "alokworld/documents", webPrefix: "/asset/listofmemberswithdesignation" },
];

// Single file extras
const singleFiles = [
  { filePath: "public/asset/Atibal Singh rajput.jpeg", cloudFolder: "alokworld/leadership", webPath: "/asset/Atibal Singh rajput.jpeg" },
  { filePath: "public/asset/archives/1002458487.jpg", cloudFolder: "alokworld/leadership", webPath: "/asset/archives/1002458487.jpg" },
];

async function run() {
  console.log("=== STARTING CLOUDINARY MEDIA UPLOAD ===");
  const urlMap = {};

  for (const group of foldersToUpload) {
    if (!fs.existsSync(group.dir)) continue;
    const files = fs.readdirSync(group.dir);

    for (const f of files) {
      const fullPath = path.join(group.dir, f);
      const stat = fs.statSync(fullPath);
      if (!stat.isFile()) continue;

      const ext = path.extname(f).toLowerCase();
      if (![".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(ext)) {
        continue;
      }

      const webPath = `${group.webPrefix}/${f}`;
      console.log(`Uploading ${webPath} -> ${group.cloudFolder}...`);

      try {
        const res = await cloudinary.uploader.upload(fullPath, {
          folder: group.cloudFolder,
          use_filename: true,
          unique_filename: false,
          overwrite: true,
        });

        urlMap[webPath] = res.secure_url;
        // Also map decoded and encoded versions
        urlMap[encodeURI(webPath)] = res.secure_url;
        // Also map just the filename
        urlMap[f] = res.secure_url;
        console.log(`  ✓ Uploaded: ${res.secure_url}`);
      } catch (err) {
        console.error(`  ✕ Error uploading ${webPath}:`, err.message);
      }
    }
  }

  for (const sf of singleFiles) {
    if (fs.existsSync(sf.filePath)) {
      try {
        const res = await cloudinary.uploader.upload(sf.filePath, {
          folder: sf.cloudFolder,
          use_filename: true,
          unique_filename: false,
          overwrite: true,
        });
        urlMap[sf.webPath] = res.secure_url;
        urlMap[encodeURI(sf.webPath)] = res.secure_url;
        console.log(`  ✓ Single file uploaded: ${res.secure_url}`);
      } catch (err) {
        console.error(`  ✕ Error uploading ${sf.webPath}:`, err.message);
      }
    }
  }

  // Save mapping file
  fs.writeFileSync("scripts/cloudinary-url-map.json", JSON.stringify(urlMap, null, 2), "utf8");
  console.log(`\n=== UPLOAD FINISHED: ${Object.keys(urlMap).length} URLs MAPPED ===`);
}

run().catch(console.error);
