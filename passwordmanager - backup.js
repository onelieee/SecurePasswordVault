const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const salt = Buffer.from('salt_', 'utf-8');

function generateKey(password) {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
}

function encrypt(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + encrypted;
}

function decrypt(text, key) {
  try {
    const iv = Buffer.from(text.slice(0, 32), 'hex');
    const encryptedText = text.slice(32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  } catch (err) {
    throw new Error('Decryption failed');
  }
}

function getUserPasswordFile(username) {
  return `passwords_${username}.txt`;
}

function savePassword(username, site, accountUsername, password, key) {
    
        const passwords = loadPasswords(username, key);
        passwords.push({ site, username: accountUsername, password });
        const encryptedPasswords = encrypt(JSON.stringify(passwords), key);
        fs.writeFileSync(getUserPasswordFile(username), encryptedPasswords);
   
        console.log('Invalid input');
  
        
}

function loadPasswords(username, key) {
  try {
    const encryptedPasswords = fs.readFileSync(getUserPasswordFile(username), 'utf-8');
    const decryptedPasswords = decrypt(encryptedPasswords, key);
    return JSON.parse(decryptedPasswords);
  } catch (err) {
    return [];
  }
}

function masterPasswordPolicy(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

app.post('/login', (req, res) => {
  const { username, masterPassword } = req.body;
  const key = generateKey(masterPassword);

  try {
    loadPasswords(username, key);
    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(400).json({ message: 'Incorrect username or master password' });
  }
});

app.post('/save-password', (req, res) => {
  const { username, masterPassword, site, accountUsername, password } = req.body;
  const key = generateKey(masterPassword);

  savePassword(username, site, accountUsername, password, key);
  res.json({ message: 'Password saved successfully!' });
});

app.post('/view-passwords', (req, res) => {
  const { username, masterPassword } = req.body;
  const key = generateKey(masterPassword);

  try {
    const passwords = loadPasswords(username, key);
    res.json(passwords);
  } catch (err) {
    res.status(400).json({ message: 'Incorrect username or master password' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
