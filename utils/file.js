const fs = require('fs');

const deleteFile = filePath => {
  fs.unlink('../client/public' + filePath, (req, res, next, err) => {
    if (err) {
      next();
    }
    console.log('File deleted succesfully');
  });
};

exports.deleteFile = deleteFile;
