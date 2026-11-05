const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const SECRET = 'if_keep_secret_key_2024';

const GOOGLE_CLIENT_ID = 'COLOQUE_AQUI_SEU_CLIENT_ID_EXATO.apps.googleusercontent.com'; 
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root_password_123',
  database: process.env.DB_DATABASE || 'ifkeep_db',
  port: process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: false // Obrigatório para conectar com segurança ao TiDB Cloud
  }
});

db.connect((err) => {
  if (err) {
    console.error('❌ ERRO MYSQL:', err.message);
  } else {
    console.log('✅ CONECTADO AO MYSQL!');
    
    // Tabela de usuários
    db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        secret_word VARCHAR(255) NOT NULL
      )
    `);

    // Tabela de matérias (removendo qualquer índice restritivo antigo)
    db.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL
      )
    `, (err) => {
      if (!err) {
        db.query("ALTER TABLE subjects DROP INDEX user_id", () => {});
        db.query("ALTER TABLE subjects DROP INDEX name", () => {});
      }
    });

    // Tabela de notas
    db.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title TEXT,
        content TEXT,
        color VARCHAR(50) DEFAULT 'transparent',
        subject VARCHAR(255) DEFAULT 'Geral',
        archived TINYINT(1) DEFAULT 0,
        archived_at DATETIME NULL,
        pinned TINYINT(1) DEFAULT 0,
        date VARCHAR(50)
      )
    `, (err) => {
      if (!err) {
        // Garante a coluna pinned caso a tabela já exista
        db.query("ALTER TABLE notes ADD COLUMN pinned TINYINT(1) DEFAULT 0", (errAlter) => {
          // Ignora se a coluna já existir (Erro 1060)
        });
      }
    });
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/google-login', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID });
    const { email, name } = ticket.getPayload();

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      let user = results[0];
      if (!user) {
        db.query("INSERT INTO users (username, email, password, secret_word) VALUES (?, ?, ?, ?)", [name, email, 'google-auth', 'google-auth'], (err, result) => {
          const newToken = jwt.sign({ id: result.insertId }, SECRET, { expiresIn: '24h' });
          res.json({ token: newToken, username: name });
        });
      } else {
        const newToken = jwt.sign({ id: user.id }, SECRET, { expiresIn: '24h' });
        res.json({ token: newToken, username: user.username });
      }
    });
  } catch (err) { res.status(401).json({ error: "Falha na autenticação do Google" }); }
});

app.post('/register', async (req, res) => {
  const { username, email, password, secret_word } = req.body;
  const hash = await bcrypt.hash(password, 10);
  
  db.query("INSERT INTO users (username, email, password, secret_word) VALUES (?, ?, ?, ?)", [username, email, hash, secret_word], (err) => {
    if (err) {
      console.error("Erro no cadastro:", err);
      return res.status(400).json({ error: "E-mail ou usuário já cadastrado" });
    }
    res.json({ message: "Conta criada com sucesso!" });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: "Usuário não encontrado" });
    
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Senha incorreta" });
    
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '24h' });
    res.json({ token, username: user.username });
  });
});

app.post('/reset-password', async (req, res) => {
  const { email, secret_word, newPassword } = req.body;
  
  db.query("SELECT * FROM users WHERE email = ? AND secret_word = ?", [email, secret_word], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: "E-mail ou Palavra-Secreta incorretos." });
    }
    
    const hash = await bcrypt.hash(newPassword, 10);
    db.query("UPDATE users SET password = ? WHERE id = ?", [hash, results[0].id], (err) => {
      if (err) return res.status(500).json({ error: "Erro ao salvar nova senha." });
      res.json({ message: "Senha atualizada! Faça login." });
    });
  });
});

app.get('/subjects', authenticateToken, (req, res) => {
  db.query('SELECT id, name FROM subjects WHERE user_id = ? ORDER BY id DESC', [req.user.id], (err, results) => {
    res.json(err ? [] : results);
  });
});

app.post('/subjects', authenticateToken, (req, res) => {
  const name = req.body.name ? req.body.name.trim().substring(0, 30) : '';
  if (!name) return res.status(400).json({ error: "Nome inválido." });

  db.query("INSERT INTO subjects (name, user_id) VALUES (?, ?)", [name, req.user.id], (err) => {
    if (err) {
      console.error("Erro ao criar matéria:", err);
      return res.status(500).json({ error: "Erro ao salvar matéria." });
    }
    res.json({ message: "Salvo" });
  });
});

app.put('/subjects/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const name = req.body.name ? req.body.name.trim().substring(0, 30) : '';
  
  if (!name) {
    return res.status(400).json({ error: "O nome da matéria não pode estar vazio." });
  }

  db.query("SELECT name FROM subjects WHERE id = ? AND user_id = ?", [id, req.user.id], (err, rows) => {
    if (err || rows.length === 0) return res.status(404).json({ error: "Matéria não encontrada." });
    const oldName = rows[0].name;

    db.query("UPDATE subjects SET name = ? WHERE id = ? AND user_id = ?", [name, id, req.user.id], (err2) => {
      if (err2) return res.status(500).json({ error: "Erro ao atualizar matéria." });
      db.query("UPDATE notes SET subject = ? WHERE subject = ? AND user_id = ?", [name, oldName, req.user.id], () => {
        res.json({ message: "Matéria renomeada com sucesso!" });
      });
    });
  });
});

app.get('/notes', authenticateToken, (req, res) => {
  const deleteExpiredQuery = "DELETE FROM notes WHERE user_id = ? AND archived = 1 AND archived_at < NOW() - INTERVAL 10 DAY";
  
  db.query(deleteExpiredQuery, [req.user.id], (err) => {
    if (err) console.error("Erro ao limpar notas expiradas:", err);

    db.query('SELECT * FROM notes WHERE user_id = ? ORDER BY pinned DESC, id DESC', [req.user.id], (err, results) => {
      res.json(err ? [] : results);
    });
  });
});

app.post('/notes', authenticateToken, (req, res) => {
  const { title, content, color, subject, archived, pinned, date } = req.body;
  db.query("INSERT INTO notes (title, content, color, subject, archived, pinned, date, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
  [title, content, color, subject, archived ? 1 : 0, pinned ? 1 : 0, date, req.user.id], (err) => {
    if (err) {
      console.error("Erro ao criar nota:", err);
      return res.status(500).json({ error: "Erro ao salvar nota." });
    }
    res.json({ message: "Salvo" });
  });
});

app.put('/notes/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  let bodyData = { ...req.body };

  if (bodyData.archived === 1 || bodyData.archived === true) {
     bodyData.archived = 1;
     bodyData.archived_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
  } else if (bodyData.archived === 0 || bodyData.archived === false) {
     bodyData.archived = 0;
     bodyData.archived_at = null;
  }

  if (bodyData.pinned !== undefined) {
    bodyData.pinned = bodyData.pinned ? 1 : 0;
  }

  const validColumns = ['title', 'content', 'color', 'subject', 'archived', 'archived_at', 'pinned', 'date'];
  const filteredData = {};
  Object.keys(bodyData).forEach(key => {
    if (validColumns.includes(key)) {
      filteredData[key] = bodyData[key];
    }
  });

  if (Object.keys(filteredData).length === 0) return res.json({ message: "Nada a atualizar" });

  const fields = Object.keys(filteredData).map(k => `${k} = ?`).join(', ');
  const values = [...Object.values(filteredData), id, req.user.id];
  
  db.query(`UPDATE notes SET ${fields} WHERE id = ? AND user_id = ?`, values, (err) => {
    if (err) {
      console.error("Erro ao atualizar nota:", err);
      return res.status(500).json({ error: "Erro ao atualizar a nota." });
    }
    res.json({ message: "Atualizado com sucesso" });
  });
});

app.delete('/notes/:id', authenticateToken, (req, res) => {
  db.query("DELETE FROM notes WHERE id = ? AND user_id = ?", [req.params.id, req.user.id], (err) => {
    res.json({ message: "Excluído" });
  });
});

app.delete('/subjects/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.query("SELECT name FROM subjects WHERE id = ? AND user_id = ?", [id, req.user.id], (err, rows) => {
    if (!err && rows.length > 0) {
      const subName = rows[0].name;
      db.query("DELETE FROM notes WHERE subject = ? AND user_id = ?", [subName, req.user.id], () => {});
    }
    db.query("DELETE FROM subjects WHERE id = ? AND user_id = ?", [id, req.user.id], (err2) => {
      if (err2) return res.status(500).json({ error: "Erro ao excluir matéria." });
      res.json({ message: "Excluído com sucesso!" });
    });
  });
});

app.listen(3001, () => console.log('🚀 Server ON: 3001'));