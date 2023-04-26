const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const db = require("../config/db");

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Rota para cadastrar um usuário
router.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hashedPassword], (error, result) => {
        if (error) return res.status(500).json({ error });
        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    });
});

// Rota para autenticar um usuário e gerar o token JWT
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (error, result) => {
        if (error) return res.status(500).json({ error });
        if (result.length === 0) return res.status(401).json({ message: "Usuário não encontrado!" });
        const user = result[0];
        if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ message: "Senha inválida!" });
        const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 });
        res.status(200).json({ token });
    });
});

// Rota para listar todos os usuários
router.get("/", (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (error, result) => {
        if (error) return res.status(500).json({ error });
        res.status(200).json(result);
    });
});

// Rota para buscar um usuário pelo ID
router.get("/:id", (req, res) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [req.params.id], (error, result) => {
        if (error) return res.status(500).json({ error });
        if (result.length === 0) return res.status(404).json({ message: "Usuário não encontrado!" });
        res.status(200).json(result[0]);
    });
});

// Rota para atualizar um usuário pelo ID
router.put("/:id", (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
    db.query(sql, [name, email, hashedPassword, req.params.id], (error, result) => {
        if (error) return res.status(500).json({ error });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Usuário não encontrado!" });
        res.status(200).json({ message: "Usuário atualizado com sucesso!" });
    });
});

// Rota para deletar um usuário pelo ID
router.delete("/:id", (req, res) => {
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [req.params.id], (error, result) => {
        if (error) return res.status(500).json({ error });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Usuário não encontrado!" });
        res.status(200).json({ message: "Usuário deletado com sucesso!" });
    });
});

module.exports = router;
