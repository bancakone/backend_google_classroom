// Lister tous les groupes
router.get("/groupes", (req, res) => {
  getAllGroupes((err, rows) => {
    if (err) return res.status(500).json({ message: "Erreur" });
    res.json(rows);
  });
});
// GROUPE CRUD
router.get("/groupe/:id", (req, res) => {
  const { id } = req.params;
  getGroupeById(id, (err, row) => {
    if (err) return res.status(500).json({ message: "Erreur" });
    if (!row) return res.status(404).json({ message: "Groupe non trouvé" });
    res.json(row);
  });
});

router.put("/groupe/:id", (req, res) => {
  const { id } = req.params;
  const { nom, coordinateur_id, progression } = req.body;
  updateGroupe(id, nom, coordinateur_id, progression, function (err) {
    if (err)
      return res.status(500).json({ message: "Erreur modification groupe" });
    res.json({ message: "Groupe modifié" });
  });
});

router.delete("/groupe/:id", (req, res) => {
  const { id } = req.params;
  deleteGroupe(id, function (err) {
    if (err)
      return res.status(500).json({ message: "Erreur suppression groupe" });
    res.json({ message: "Groupe supprimé" });
  });
});
const express = require("express");
const router = express.Router();
const {
  db,
  createClasse,
  getClassesByProf,
  createGroupe,
  getGroupesByClasse,
  setCoordinateur,
  createEtudiant,
  getEtudiantsByGroupe,
  addEtudiantToGroupe,
  createDiscussion,
  getDiscussionsByProf,
  getDiscussionsByEtudiant,
  createMessage,
  getMessagesByDiscussion,
  createTravail,
  getTravauxByGroupe,
  createFichier,
  getFichiersByTravail,
  getFichiersByPost,
  createPost,
  getPostsByClasse,
  createCommentaire,
  getCommentairesByTravail,
} = require("../models/Schemas");

// CLASSE
router.post("/classe", (req, res) => {
  const { nom, professeur_id } = req.body;
  createClasse(nom, professeur_id, function (err) {
    if (err) return res.status(500).json({ message: "Erreur création classe" });
    res.json({ message: "Classe créée" });
  });
});
router.get("/classes/:professeur_id", (req, res) => {
  getClassesByProf(req.params.professeur_id, (err, rows) => {
    if (err) return res.status(500).json({ message: "Erreur" });
    res.json(rows);
  });
});

// GROUPE
router.post("/groupe", (req, res) => {
  const {
    nom,
    classe_id,
    coordinateur_id = null,
    progression = null,
  } = req.body;
  createGroupe(nom, classe_id, coordinateur_id, progression, function (err) {
    if (err) return res.status(500).json({ message: "Erreur création groupe" });
    res.json({ message: "Groupe créé" });
  });
});
router.get("/groupes/:classe_id", (req, res) => {
  getGroupesByClasse(req.params.classe_id, (err, rows) => {
    if (err) return res.status(500).json({ message: "Erreur" });
    res.json(rows);
  });
});
router.post("/groupe/coordinateur", (req, res) => {
  const { groupe_id, etudiant_id } = req.body;
  setCoordinateur(groupe_id, etudiant_id, function (err) {
    if (err) return res.status(500).json({ message: "Erreur" });
    res.json({ message: "Coordinateur défini" });
  });
});

// ETUDIANT
router.post("/etudiant", (req, res) => {
  const { nom, email, password } = req.body;
  createEtudiant(nom, email, password, function (err) {
    if (err)
      return res.status(500).json({ message: "Erreur création étudiant" });
    res.json({ message: "Etudiant créé" });
  });
});
router.get("/etudiants/:groupe_id", (req, res) => {
  getEtudiantsByGroupe(req.params.groupe_id, (err, rows) => {
    if (err) return res.status(500).json({ message: "Erreur" });
    res.json(rows);
  });
});
router.post("/groupe/ajouter-etudiant", (req, res) => {
  const { groupe_id, etudiant_id } = req.body;
  addEtudiantToGroupe(groupe_id, etudiant_id, function (err) {
    if (err) return res.status(500).json({ message: "Erreur" });
    res.json({ message: "Etudiant ajouté au groupe" });
  });
});

// DISCUSSION PRIVEE
router.post("/discussion", (req, res) => {
  const { professeur_id, etudiant_id, groupe_id } = req.body;
  createDiscussion(professeur_id, etudiant_id, groupe_id, function (err) {
    if (err)
      return res.status(500).json({ message: "Erreur création discussion" });
    res.json({ message: "Discussion créée" });
  });
});
router.get("/discussions/prof/:professeur_id", (req, res) => {
  getDiscussionsByProf(req.params.professeur_id, (err, rows) => {
    if (err) return res.status(500).json({ message: "Erreur" });
    res.json(rows);
  });
});
router.get("/discussions/etudiant/:etudiant_id", (req, res) => {
  getDiscussionsByEtudiant(req.params.etudiant_id, (err, rows) => {
    if (err) return res.status(500).json({ message: "Erreur" });
    res.json(rows);
  });
});

// MESSAGE
router.post("/message", (req, res) => {
  const { discussion_id, auteur_type, auteur_id, contenu, date } = req.body;
  createMessage(
    discussion_id,
    auteur_type,
    auteur_id,
    contenu,
    date,
    function (err) {
      if (err) return res.status(500).json({ message: "Erreur envoi message" });
      res.json({ message: "Message envoyé" });
    }
  );
});
router.get("/messages/:discussion_id", (req, res) => {
  getMessagesByDiscussion(req.params.discussion_id, (err, rows) => {
    if (err) return res.status(500).json({ message: "Erreur" });
    res.json(rows);
  });
});

// DEVOIR (Travail)
router.post("/travail", (req, res) => {
  const { titre, dateSoumission, groupe_id, statut } = req.body;
  createTravail(titre, dateSoumission, groupe_id, statut, function (err) {
    if (err)
      return res.status(500).json({ message: "Erreur création travail" });
    res.json({ message: "Travail créé" });
  });
});
router.get("/travaux/:groupe_id", (req, res) => {
  getTravauxByGroupe(req.params.groupe_id, (err, rows) => {
    if (err) return res.status(500).json({ message: "Erreur" });
    res.json(rows);
  });
});

// FICHIER
router.post("/fichier", (req, res) => {
  const { nom, url, travail_id, post_id } = req.body;
  createFichier(nom, url, travail_id, post_id, function (err) {
    if (err) return res.status(500).json({ message: "Erreur ajout fichier" });
    res.json({ message: "Fichier ajouté" });
  });
});
router.get("/fichiers/travail/:travail_id", (req, res) => {
  getFichiersByTravail(req.params.travail_id, (err, rows) => {
    if (err) return res.status(500).json({ message: "Erreur" });
    res.json(rows);
  });
});
router.get("/fichiers/post/:post_id", (req, res) => {
  getFichiersByPost(req.params.post_id, (err, rows) => {
    if (err) return res.status(500).json({ message: "Erreur" });
    res.json(rows);
  });
});

// POST
router.post("/post", (req, res) => {
  const { professeur_id, classe_id, titre, contenu, date } = req.body;
  createPost(professeur_id, classe_id, titre, contenu, date, function (err) {
    if (err) return res.status(500).json({ message: "Erreur création post" });
    res.json({ message: "Post créé" });
  });
});
router.get("/posts/:classe_id", (req, res) => {
  getPostsByClasse(req.params.classe_id, (err, rows) => {
    if (err) return res.status(500).json({ message: "Erreur" });
    res.json(rows);
  });
});

// COMMENTAIRE sur devoir
router.post("/commentaire", (req, res) => {
  const { auteur, contenu, date, travail_id } = req.body;
  createCommentaire(auteur, contenu, date, travail_id, function (err) {
    if (err)
      return res.status(500).json({ message: "Erreur ajout commentaire" });
    res.json({ message: "Commentaire ajouté" });
  });
});
router.get("/commentaires/:travail_id", (req, res) => {
  getCommentairesByTravail(req.params.travail_id, (err, rows) => {
    if (err) return res.status(500).json({ message: "Erreur" });
    res.json(rows);
  });
});

module.exports = router;
