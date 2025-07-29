// models/Schemas.js
// Schéma et accès CRUD SQLite pour le projet Google Classroom
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const dbPath = path.resolve(__dirname, "../database.sqlite");
const db = new sqlite3.Database(dbPath);

// Création des tables si elles n'existent pas
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Professeur (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Classe (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    professeur_id INTEGER NOT NULL,
    FOREIGN KEY (professeur_id) REFERENCES Professeur(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Groupe (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    classe_id INTEGER NOT NULL,
    coordinateur_id INTEGER,
    progression TEXT,
    FOREIGN KEY (classe_id) REFERENCES Classe(id),
    FOREIGN KEY (coordinateur_id) REFERENCES Etudiant(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Etudiant (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS GroupeEtudiant (
    groupe_id INTEGER,
    etudiant_id INTEGER,
    PRIMARY KEY (groupe_id, etudiant_id),
    FOREIGN KEY (groupe_id) REFERENCES Groupe(id),
    FOREIGN KEY (etudiant_id) REFERENCES Etudiant(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Discussion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    professeur_id INTEGER,
    etudiant_id INTEGER,
    groupe_id INTEGER,
    UNIQUE(professeur_id, etudiant_id),
    FOREIGN KEY (professeur_id) REFERENCES Professeur(id),
    FOREIGN KEY (etudiant_id) REFERENCES Etudiant(id),
    FOREIGN KEY (groupe_id) REFERENCES Groupe(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Message (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discussion_id INTEGER NOT NULL,
    auteur_type TEXT NOT NULL, -- 'professeur' ou 'etudiant'
    auteur_id INTEGER NOT NULL,
    contenu TEXT NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY (discussion_id) REFERENCES Discussion(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Travail (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titre TEXT NOT NULL,
    dateSoumission TEXT,
    groupe_id INTEGER,
    statut TEXT,
    FOREIGN KEY (groupe_id) REFERENCES Groupe(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Etape (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    travail_id INTEGER NOT NULL,
    titre TEXT NOT NULL,
    description TEXT,
    ordre INTEGER,
    progression INTEGER DEFAULT 0,
    FOREIGN KEY (travail_id) REFERENCES Travail(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS SoumissionEtape (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    etape_id INTEGER NOT NULL,
    coordinateur_id INTEGER NOT NULL,
    fichier_id INTEGER,
    dateSoumission TEXT,
    commentaire TEXT,
    statut TEXT,
    FOREIGN KEY (etape_id) REFERENCES Etape(id),
    FOREIGN KEY (coordinateur_id) REFERENCES Etudiant(id),
    FOREIGN KEY (fichier_id) REFERENCES Fichier(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Fichier (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    url TEXT NOT NULL,
    travail_id INTEGER,
    post_id INTEGER,
    FOREIGN KEY (travail_id) REFERENCES Travail(id),
    FOREIGN KEY (post_id) REFERENCES Post(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Post (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    professeur_id INTEGER NOT NULL,
    classe_id INTEGER NOT NULL,
    titre TEXT NOT NULL,
    contenu TEXT,
    date TEXT NOT NULL,
    FOREIGN KEY (professeur_id) REFERENCES Professeur(id),
    FOREIGN KEY (classe_id) REFERENCES Classe(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Commentaire (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    auteur TEXT NOT NULL,
    contenu TEXT NOT NULL,
    date TEXT,
    travail_id INTEGER,
    FOREIGN KEY (travail_id) REFERENCES Travail(id)
  )`);
});

// Exemples de fonctions CRUD (ajouter, lire, supprimer)
module.exports = {
  db,
  // Groupe - CRUD
  getGroupeById: (id, cb) => {
    db.get("SELECT * FROM Groupe WHERE id = ?", [id], cb);
  },
  updateGroupe: (id, nom, coordinateur_id, progression, cb) => {
    db.run(
      "UPDATE Groupe SET nom = ?, coordinateur_id = ?, progression = ? WHERE id = ?",
      [nom, coordinateur_id, progression, id],
      cb
    );
  },
  deleteGroupe: (id, cb) => {
    db.run("DELETE FROM Groupe WHERE id = ?", [id], cb);
  },
  // Professeur
  createProfesseur: (nom, email, password, cb) => {
    db.run(
      "INSERT INTO Professeur (nom, email, password) VALUES (?, ?, ?)",
      [nom, email, password],
      cb
    );
  },
  getProfesseurs: (cb) => {
    db.all("SELECT * FROM Professeur", cb);
  },
  // Classe
  createClasse: (nom, professeur_id, cb) => {
    db.run(
      "INSERT INTO Classe (nom, professeur_id) VALUES (?, ?)",
      [nom, professeur_id],
      cb
    );
  },
  getClassesByProf: (professeur_id, cb) => {
    db.all("SELECT * FROM Classe WHERE professeur_id = ?", [professeur_id], cb);
  },
  // Groupe
  createGroupe: (
    nom,
    classe_id,
    coordinateur_id = null,
    progression = null,
    cb
  ) => {
    db.run(
      "INSERT INTO Groupe (nom, classe_id, coordinateur_id, progression) VALUES (?, ?, ?, ?)",
      [nom, classe_id, coordinateur_id, progression],
      cb
    );
  },
  getGroupesByClasse: (classe_id, cb) => {
    db.all("SELECT * FROM Groupe WHERE classe_id = ?", [classe_id], cb);
  },
  setCoordinateur: (groupe_id, etudiant_id, cb) => {
    db.run(
      "UPDATE Groupe SET coordinateur_id = ? WHERE id = ?",
      [etudiant_id, groupe_id],
      cb
    );
  },
  db,
  // Professeur
  createProfesseur: (nom, email, password, cb) => {
    db.run(
      "INSERT INTO Professeur (nom, email, password) VALUES (?, ?, ?)",
      [nom, email, password],
      cb
    );
  },
  getProfesseurs: (cb) => {
    db.all("SELECT * FROM Professeur", cb);
  },
  // Classe
  createClasse: (nom, professeur_id, cb) => {
    db.run(
      "INSERT INTO Classe (nom, professeur_id) VALUES (?, ?)",
      [nom, professeur_id],
      cb
    );
  },
  getClassesByProf: (professeur_id, cb) => {
    db.all("SELECT * FROM Classe WHERE professeur_id = ?", [professeur_id], cb);
  },
  // Groupe
  createGroupe: (nom, classe_id, cb) => {
    db.run(
      "INSERT INTO Groupe (nom, classe_id) VALUES (?, ?)",
      [nom, classe_id],
      cb
    );
  },
  getGroupesByClasse: (classe_id, cb) => {
    db.all("SELECT * FROM Groupe WHERE classe_id = ?", [classe_id], cb);
  },
  getAllGroupes: (cb) => {
    db.all("SELECT * FROM Groupe", cb);
  },
  setCoordinateur: (groupe_id, etudiant_id, cb) => {
    db.run(
      "UPDATE Groupe SET coordinateur_id = ? WHERE id = ?",
      [etudiant_id, groupe_id],
      cb
    );
  },
  // Etudiant
  createEtudiant: (nom, email, password, cb) => {
    db.run(
      "INSERT INTO Etudiant (nom, email, password) VALUES (?, ?, ?)",
      [nom, email, password],
      cb
    );
  },
  getEtudiantsByGroupe: (groupe_id, cb) => {
    db.all(
      `SELECT e.* FROM Etudiant e JOIN GroupeEtudiant ge ON e.id = ge.etudiant_id WHERE ge.groupe_id = ?`,
      [groupe_id],
      cb
    );
  },
  addEtudiantToGroupe: (groupe_id, etudiant_id, cb) => {
    db.run(
      "INSERT INTO GroupeEtudiant (groupe_id, etudiant_id) VALUES (?, ?)",
      [groupe_id, etudiant_id],
      cb
    );
  },
  // Discussion privée
  createDiscussion: (professeur_id, etudiant_id, groupe_id, cb) => {
    db.run(
      "INSERT OR IGNORE INTO Discussion (professeur_id, etudiant_id, groupe_id) VALUES (?, ?, ?)",
      [professeur_id, etudiant_id, groupe_id],
      cb
    );
  },
  getDiscussionsByProf: (professeur_id, cb) => {
    db.all(
      "SELECT * FROM Discussion WHERE professeur_id = ?",
      [professeur_id],
      cb
    );
  },
  getDiscussionsByEtudiant: (etudiant_id, cb) => {
    db.all("SELECT * FROM Discussion WHERE etudiant_id = ?", [etudiant_id], cb);
  },
  // Messages
  createMessage: (discussion_id, auteur_type, auteur_id, contenu, date, cb) => {
    db.run(
      "INSERT INTO Message (discussion_id, auteur_type, auteur_id, contenu, date) VALUES (?, ?, ?, ?, ?)",
      [discussion_id, auteur_type, auteur_id, contenu, date],
      cb
    );
  },
  getMessagesByDiscussion: (discussion_id, cb) => {
    db.all(
      "SELECT * FROM Message WHERE discussion_id = ? ORDER BY date ASC",
      [discussion_id],
      cb
    );
  },
  // Devoirs (Travail)
  createTravail: (titre, dateSoumission, groupe_id, statut, cb) => {
    db.run(
      "INSERT INTO Travail (titre, dateSoumission, groupe_id, statut) VALUES (?, ?, ?, ?)",
      [titre, dateSoumission, groupe_id, statut],
      cb
    );
  },
  getTravauxByGroupe: (groupe_id, cb) => {
    db.all("SELECT * FROM Travail WHERE groupe_id = ?", [groupe_id], cb);
  },
  // Etapes de travail
  createEtape: (travail_id, titre, description, ordre, cb) => {
    db.run(
      "INSERT INTO Etape (travail_id, titre, description, ordre) VALUES (?, ?, ?, ?)",
      [travail_id, titre, description, ordre],
      cb
    );
  },
  getEtapesByTravail: (travail_id, cb) => {
    db.all(
      "SELECT * FROM Etape WHERE travail_id = ? ORDER BY ordre ASC",
      [travail_id],
      cb
    );
  },
  updateEtapeProgression: (etape_id, progression, cb) => {
    db.run(
      "UPDATE Etape SET progression = ? WHERE id = ?",
      [progression, etape_id],
      cb
    );
  },
  // Soumissions d'étape
  createSoumissionEtape: (
    etape_id,
    coordinateur_id,
    fichier_id,
    dateSoumission,
    commentaire,
    statut,
    cb
  ) => {
    db.run(
      "INSERT INTO SoumissionEtape (etape_id, coordinateur_id, fichier_id, dateSoumission, commentaire, statut) VALUES (?, ?, ?, ?, ?, ?)",
      [
        etape_id,
        coordinateur_id,
        fichier_id,
        dateSoumission,
        commentaire,
        statut,
      ],
      cb
    );
  },
  getSoumissionsByEtape: (etape_id, cb) => {
    db.all(
      "SELECT * FROM SoumissionEtape WHERE etape_id = ? ORDER BY dateSoumission ASC",
      [etape_id],
      cb
    );
  },
  // Fichiers (pour devoir ou post)
  createFichier: (nom, url, travail_id, post_id, cb) => {
    db.run(
      "INSERT INTO Fichier (nom, url, travail_id, post_id) VALUES (?, ?, ?, ?)",
      [nom, url, travail_id, post_id],
      cb
    );
  },
  getFichiersByTravail: (travail_id, cb) => {
    db.all("SELECT * FROM Fichier WHERE travail_id = ?", [travail_id], cb);
  },
  getFichiersByPost: (post_id, cb) => {
    db.all("SELECT * FROM Fichier WHERE post_id = ?", [post_id], cb);
  },
  // Post du professeur
  createPost: (professeur_id, classe_id, titre, contenu, date, cb) => {
    db.run(
      "INSERT INTO Post (professeur_id, classe_id, titre, contenu, date) VALUES (?, ?, ?, ?, ?)",
      [professeur_id, classe_id, titre, contenu, date],
      cb
    );
  },
  getPostsByClasse: (classe_id, cb) => {
    db.all(
      "SELECT * FROM Post WHERE classe_id = ? ORDER BY date DESC",
      [classe_id],
      cb
    );
  },
  // Commentaires sur devoir
  createCommentaire: (auteur, contenu, date, travail_id, cb) => {
    db.run(
      "INSERT INTO Commentaire (auteur, contenu, date, travail_id) VALUES (?, ?, ?, ?)",
      [auteur, contenu, date, travail_id],
      cb
    );
  },
  getCommentairesByTravail: (travail_id, cb) => {
    db.all("SELECT * FROM Commentaire WHERE travail_id = ?", [travail_id], cb);
  },
  // Groupe - CRUD
  getGroupeById: (id, cb) => {
    db.get("SELECT * FROM Groupe WHERE id = ?", [id], cb);
  },
  updateGroupe: (id, nom, coordinateur_id, progression, cb) => {
    db.run(
      "UPDATE Groupe SET nom = ?, coordinateur_id = ?, progression = ? WHERE id = ?",
      [nom, coordinateur_id, progression, id],
      cb
    );
  },
  deleteGroupe: (id, cb) => {
    db.run("DELETE FROM Groupe WHERE id = ?", [id], cb);
  },
  // Statuts progression
  StatutProgression: [
    "THEME_SOUMIS",
    "THEME_VALIDE",
    "CHAPITRE_1_OK",
    "CHAPITRE_2_OK",
    "CHAPITRE_3_OK",
    "VERSION_PROVISOIRE",
    "DIAPO_PRETE",
    "CORRECTION_SOUTENANCE",
    "VERSION_FINALE",
  ],
};
