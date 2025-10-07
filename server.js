// ആവശ്യമായ പാക്കേജുകൾ ഇമ്പോർട്ട് ചെയ്യുന്നു
const express = require('express');
const path = require('path');
const fs = require('fs'); // ഫയലുകൾ കൈകാര്യം ചെയ്യാനുള്ള മൊഡ്യൂൾ

// ഒരു എക്സ്പ്രസ് ആപ്പ് ഉണ്ടാക്കുന്നു
const app = express();
const PORT = 3000;

// ഫോമിൽ നിന്ന് വരുന്ന ഡാറ്റയെ വായിക്കാൻ സഹായിക്കുന്ന മിഡിൽവെയർ
app.use(express.urlencoded({ extended: true }));

// 'public' എന്ന ഫോൾഡറിലുള്ള സ്റ്റാറ്റിക് ഫയലുകൾ സെർവ് ചെയ്യാൻ
app.use(express.static(path.join(__dirname, 'public')));

// ഫോം സബ്മിറ്റ് ചെയ്യുമ്പോൾ ഡാറ്റ സ്വീകരിക്കുന്നതിനുള്ള റൂട്ട്
app.post('/submit-form', (req, res) => {
  const formData = req.body;

  console.log('പുതിയ അഡ്മിഷൻ അപേക്ഷ ലഭിച്ചു:');
  console.log('=================================');
  console.log(`പേര്: ${formData.studentName}`);
  console.log(`സ്ഥലം: ${formData.place}`);
  console.log('=================================');
  
  const dataDir = path.join(__dirname, 'data');
  const dataFile = path.join(dataDir, 'submissions.csv');
  const csvData = `${formData.studentName},${formData.place},"${formData.address}",${formData.whatsapp},${formData.classToJoin}\n`;
  
  if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
  }

  fs.appendFile(dataFile, csvData, (err) => {
      if (err) {
          console.error('ഫയലിൽ ഡാറ്റ സേവ് ചെയ്യുന്നതിൽ പിഴവ് സംഭവിച്ചു:', err);
      } else {
          console.log('ഡാറ്റ വിജയകരമായി submissions.csv എന്ന ഫയലിൽ സേവ് ചെയ്തു.');
      }
  });

  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 40px;">
      <h1 style="color: #0d9488;">നന്ദി!</h1>
      <p>നിങ്ങളുടെ അപേക്ഷ ഞങ്ങൾക്ക് ലഭിച്ചിരിക്കുന്നു.</p>
      <a href="/" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #0d9488; color: white; text-decoration: none; border-radius: 5px;">ഹോം പേജിലേക്ക് മടങ്ങുക</a>
    </div>
  `);
});

// സെർവർ സ്റ്റാർട്ട് ചെയ്യുന്നു
app.listen(PORT, () => {
  console.log(`സെർവർ http://localhost:${PORT} എന്ന വിലാസത്തിൽ പ്രവർത്തിക്കുന്നു`);
});