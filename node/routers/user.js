require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const db = require("../config/db");
const verifyToken = require("../helpers/verifyToken");

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Rota para cadastrar um usuário ok
router.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = "INSERT INTO users (nameus, email, passwordus) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hashedPassword], (error, result) => {
        if (error) return res.status(500).json({ error });
        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    });
});

// Rota para autenticar um usuário e gerar o token JWT ok
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (error, result) => {
        if (error) return res.status(500).json({ error });
        if (result.length === 0) return res.status(401).json({ message: "Usuário não encontrado!" });
        const user = result[0];
        if (!bcrypt.compareSync(password, user.passwordus)) return res.status(401).json({ message: "Senha inválida!" });
        const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 });
        res.status(200).json({ token });
    });
});

// Rota para listar todos os usuários ok
router.get("/", verifyToken, (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (error, result) => {
        if (error) return res.status(500).json({ error });
        res.status(200).json(result);
    });
});

// Rota para buscar um usuário pelo ID ok
router.get("/:id", verifyToken, (req, res) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [req.params.id], (error, result) => {
        if (error) return res.status(500).json({ error });
        if (result.length === 0) return res.status(404).json({ message: "Usuário não encontrado!" });
        res.status(200).json(result[0]);
    });
});

// Rota para atualizar um usuário pelo ID ok
router.put("/:id", verifyToken, (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = "UPDATE users SET nameus = ?, email = ?, passwordus = ? WHERE id = ?";
    db.query(sql, [name, email, hashedPassword, req.params.id], (error, result) => {
        if (error) return res.status(500).json({ error });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Usuário não encontrado!" });
        res.status(200).json({ message: "Usuário atualizado com sucesso!" });
    });
});

// Rota para deletar um usuário pelo ID ok
router.delete("/:id", verifyToken, (req, res) => {
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [req.params.id], (error, result) => {
        if (error) return res.status(500).json({ error });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Usuário não encontrado!" });
        res.status(200).json({ message: "Usuário deletado com sucesso!" });
    });
});

module.exports = router;
