import multer from 'multer';
import {GridFsStorage} from 'multer-gridfs-storage'

const Storage = new GridFsStorage({
    url: "mongodb://localhost:27017/certificates",
    options: { useNewUrlParser: true },
    file: (request, file) => {
        const match = ["image/png", "image/jpg","image/pdf"];

        if(match.indexOf(file.memeType) === -1) 
            return`${Date.now()}-blog-${file.originalname}`;

        return {
            bucketName: "photos",
            filename: `${Date.now()}-blog-${file.originalname}`
        }
    }
});

export default multer({Storage}); 