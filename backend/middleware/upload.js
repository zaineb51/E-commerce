const multer = require("multer"); 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
  const uniqueSuffix = Date.now() + '-' + file.originalname   
  cb(null, file.fieldname + '-' + uniqueSuffix)
    
  } 
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg") {
      cb(null, true)
    }
    else {
      cb(new Error("fichier incompatible"))
    }
  }
})


module.exports = upload

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null,'uploads')
//     },
//     filename: (req,file,cb) => {
//         cb(null, file.originalname)
//     }
// })

// const filefilter = (req, file, cb) => {
//     if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
//       cb(null, true);
//     } else {
//       cb(new Error("error"), false);
//     }
//   };

//   module.exports = multer({
//     storage: storage,
//     fileFilter: filefilter,
//   });