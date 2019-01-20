const Firestore = require('@google-cloud/firestore');

const firestore = new Firestore({
    projectId: 'YOUR_PROJECT_ID',
    keyFilename: '/path/to/keyfile.json',
  });

  // add papaparse json para converter o arquivo e salvar no banco de dados