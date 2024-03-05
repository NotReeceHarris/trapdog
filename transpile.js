const fs = require('fs');
const path = require('path');

function removeUnwantedFiles(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);

    if (fs.statSync(filePath).isDirectory()) {
      removeUnwantedFiles(filePath);
    } else {
      const content = fs.readFileSync(filePath, 'utf8');

      if (content === '' || content === '"use strict";') {
        fs.unlinkSync(filePath);
      }
    }
  });
}

removeUnwantedFiles('./dist');