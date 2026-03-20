const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root_password_123',
  database: 'ifkeep_db',
  port: 3306
});

db.connect((err) => {
  if (err) console.error('❌ ERRO MYSQL:', err.message);
  else console.log('✅ CONECTADO AO MYSQL!');
});

// --- MATÉRIAS ---
app.get('/subjects', (req, res) => {
  db.query('SELECT name FROM subjects', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results.map(row => row.name));
  });
});

app.post('/subjects', (req, res) => {
  const { name } = req.body;
  console.log(`📥 [SUBJECT] Tentando salvar: ${name}`);
  db.query("INSERT INTO subjects (name) VALUES (?)", [name], (err) => {
    if (err) {
      console.error("❌ Erro ao salvar matéria:", err.message);
      return res.status(500).json(err);
    }
    console.log(`✅ [SUBJECT] "${name}" salva com sucesso!`);
    res.json({ message: "Salvo" });
  });
});

app.delete('/subjects/:name', (req, res) => {
  const { name } = req.params;
  console.log(`🗑️ [SUBJECT] Solicitada exclusão de: ${name}`);
  db.query("DELETE FROM subjects WHERE name = ?", [name], (err) => {
    if (err) {
      console.error("❌ Erro ao excluir matéria:", err.message);
      return res.status(500).json(err);
    }
    db.query("DELETE FROM notes WHERE subject = ?", [name], () => {
      console.log(`✨ [SUBJECT] "${name}" e suas notas foram removidas.`);
      res.json({ message: "Matéria excluída permanentemente" });
    });
  });
});

// --- NOTAS ---
app.get('/notes', (req, res) => {
  db.query('SELECT * FROM notes ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/notes', (req, res) => {
  const { title, content, color, subject, archived, date } = req.body;
  console.log(`📥 [NOTE] Criando nota: "${title || 'Sem título'}" na matéria: ${subject}`);
  const sql = "INSERT INTO notes (title, content, color, subject, archived, date) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [title, content, color, subject, archived ? 1 : 0, date], (err, result) => {
    if (err) {
      console.error("❌ Erro ao salvar nota:", err.message);
      return res.status(500).json(err);
    }
    console.log(`✅ [NOTE] Nota ID ${result.insertId} salva!`);
    res.json({ id: result.insertId });
  });
});

app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ [NOTE] Deletando nota ID: ${id}`);
  db.query("DELETE FROM notes WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("❌ Erro ao excluir nota:", err.message);
      return res.status(500).json(err);
    }
    console.log(`✨ [NOTE] Nota ${id} removida.`);
    res.json({ message: "Nota excluída" });
  });
});

app.listen(3001, () => {
  console.log('-----------------------------------');
  console.log('🚀 Server ON: http://localhost:3001');
  console.log('-----------------------------------');
});