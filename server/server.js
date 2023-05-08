import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import csvtojson from "csvtojson";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';
import { getImage, uploadImage } from "./controller/image-controller.js";

//import routes
import authRoutes from './routes/auth.js'
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

dotenv.config();

// Serve static files from public directory
app.use(express.static("public"));

// connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/certificates", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

//routes middleware
app.use('/api', authRoutes);
  

// create a schema for certificate
const certificateSchema = new mongoose.Schema({
  name: String,
  title: String,
  dateOfIssue: Date,
  pdfUrl: String,
});

// create a model for certificate
const Certificate = mongoose.model("Certificate", certificateSchema);

// set up multer storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// create multer instance
// const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route for uploading CSV file
app.post(
  "/api/certificates/upload",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).send("No file uploaded.");
      } else {
        const jsonArray = await csvtojson().fromFile(req.file.path);
        await Certificate.insertMany(jsonArray);
        res.send("File uploaded and data saved to database.");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error.");
    }
  }
);

app.get("/api/csvdata", async (req, res) => {
  try {
    const csvData = await Certificate.find({});
    res.json(csvData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

const uploadStorage = multer({ storage: storage })

// Single file
app.post("/upload/single", uploadStorage.single("file"), (req, res) => {
  console.log(req.file)
  return res.send("Single file")
})
//Multiple files
app.post("/upload/multiple", uploadStorage.array("file", 10), (req, res) => {
  console.log(req.files)
  return res.send("Multiple files")
})


app.post('/file/upload',upload.single('file'),uploadImage);
app.get('file/:filename',getImage);


// start the server
app.listen(5000, () => {
  console.log("Server started on port 5000");
});

