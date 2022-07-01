# Piiquante
# Construisez une API sécurisée pour une application d'avis gastronomiques
L'application frontend a été développée en amont, elle est disponible sur [ce repository](https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6).
## Installation
Créer un dossier vide. Il contiendra le code complet du projet, regroupé dans deux dossiers : un dossier frontend et un dossier backend.
### 1. Installation de l'application Frontend

Ouvrez un terminal.
Depuis le dossier précédement créé, clonez le repository de l'application frontend avec la commande :
<pre><code>git clone https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6.git frontend</code></pre>

Suivez les instructions d'installation de l'application frontend détaillées dans le document README.md.

### 2. Installation de l'API

Ouvrez un nouveau terminal.
Depuis le dossier précédement créé, clonez le repository de l'API avec la commande :
<pre><code>git clone https://github.com/D2C45/Piiquante.git backend</code></pre>

Depuis le dossier backend, installez les dépendances avec la commande :
<pre><code>npm install</code></pre>

### 3. Création d'une base de données noSQL MongoDB

Rendez-vous sur le site de [MongoDb](https://account.mongodb.com/) et créez un compte.

Une fois le compte créé, créez votre base de données en veillant à la configurer de sorte à ce que l'utilisateur puisse exécuter l'application sur sa propre machine :
<pre>Network Access -> Allow access from anywhere</pre>

### 4. Configuration des variables d'environnement
A la racine du dossier backend, créez un fichier .env dans lequel seront renseignés vos identifiants de connexion à MongoDB et les différentes chaînes de cryptage :

<pre><code>PORT = 3000
MONGODB_USER = identifiant de votre base de données
MONGODB_PASSWORD = mot de passe de votre base de données
MONGODB_CLUSTER_NAME = nom du cluster de votre base de données
MONGODB_DATABASE_NAME = nom de votre base de données
TOKEN_PASSWORD = clé d'encodage secrète pour le token
CRYPTO_PASSWORD = clé de cryptage de l'email avec cryptojs</code></pre>

A la racine du dossier backend, créer un fichier .gitignore dans lequel vous placez les node modules, le fichier .env et le dossier images :
<pre><code>node_modules
.env
images</code></pre>

Enfin, démarrez le serveur avec la commande :
<pre><code>node server</code></pre>
