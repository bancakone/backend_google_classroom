const bcrypt = require("bcryptjs");
const { db } = require("../models/Schemas");

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body; // role: 'professeur' ou 'etudiant'
    if (!role || !["professeur", "etudiant"].includes(role)) {
      return res.status(400).json({ message: "Rôle invalide" });
    }
    const table = role === "professeur" ? "Professeur" : "Etudiant";
    db.get(
      `SELECT * FROM ${table} WHERE email = ?`,
      [email],
      async (err, user) => {
        if (err) return res.status(500).json({ message: "Erreur de serveur" });
        if (!user)
          return res
            .status(401)
            .json({ message: "Email ou mot de passe incorrect" });
        if (!user.password)
          return res.status(401).json({ message: "Mot de passe non défini" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res
            .status(401)
            .json({ message: "Email ou mot de passe incorrect" });
        // Pas de JWT, juste retour de l'utilisateur
        res.json({
          user: { id: user.id, email: user.email, nom: user.nom, role },
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Erreur de serveur" });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, nom, role } = req.body; // role: 'professeur' ou 'etudiant'
    if (!role || !["professeur", "etudiant"].includes(role)) {
      return res.status(400).json({ message: "Rôle invalide" });
    }
    const table = role === "professeur" ? "Professeur" : "Etudiant";
    db.get(
      `SELECT * FROM ${table} WHERE email = ?`,
      [email],
      async (err, existingUser) => {
        if (err) return res.status(500).json({ message: "Erreur de serveur" });
        if (existingUser)
          return res.status(400).json({ message: "Email déjà utilisé" });
        const hashedPassword = await bcrypt.hash(password, 12);
        db.run(
          `INSERT INTO ${table} (nom, email, password) VALUES (?, ?, ?)`,
          [nom, email, hashedPassword],
          function (err) {
            if (err)
              return res.status(500).json({ message: "Erreur de serveur" });
            res.status(201).json({ id: this.lastID, nom, email, role });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Erreur de serveur" });
  }
};
