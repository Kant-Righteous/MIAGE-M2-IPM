Développement Front

Développement Front 2
Design
Responsive
Accessibilité
SEO (Search Engine Optimization)
Bonnes pratiques

React js 3
Une bibliothèque de développement Front en js

Objectifs 4
• Maîtriser une bibliothèque js dédiée au front
• Comme les bibliothèques sont très différentes
• Savoir repérer les éléments importants quand on utilise une bibliothèque
• Se raccrocher à la théorie

| Les framework | web les plus utilisés (2024) | 5   |
| ------------- | ---------------------------- | --- |
Source
https://www.statista.com/statistics/1
124699/worldwide-developer-survey-
most-used-frameworks-web/

Top 5 des frameworks frontend web 6
• React
• Next.js (basé sur React, ajoute du traitement côté serveur)
• Angular
• Vue.js
• Svelte

React js 7
• Bibliothèque javaScript
• Dédiée au Front
• Fonctionne côté client (Rien côté serveur)
• Doit être compilé en js pour être interprété par un navigateur (transpilation)
• Peut être associé à d’autre éléments dans une stack technique

React js 8
• Au-dessus du bas niveau html, css, js
• Intégration de structures html dans du code javaScript (jsx)
• Système de routage de navigation
• Création de vues dynamiques
• Intégration avec des API externes pour les données
• Possibilité d’animer

Rappels Web 9
DOM

DOM – Document Object Model 10
• Lors du chargement d’une page Web, Le navigateur crée un DOM de la page
• HTML DOM est un objet standard servant d’API pour HTML
• DOM définit
• Les éléments HTML comme des objets.
• Les propriétés des éléments HTML
• Les accesseurs à tous les éléments HTML
• Les événements attachés aux éléments HTML
• HTML DOM est un standard portant sur comment accéder, modifier, ajouter ou
supprimer des éléments HTML
• On retrouve donc les aspects hiérarchiques de HTML (enfants, parent, frères)

Javascript HTML DOM 11
• JavaScript est le langage de programmation du HTML et du Web
• DOM et JavaScript permettent la création de HTML dynamique
• Modifier/ajouter/supprimer des éléments HTML et leurs attributs
• Modifier le style CSS des éléments et des attributs
• Réagir aux événements HTML existants dans la page
• Créer de nouveaux événements

Le standard est verbeux 12

D’autres bibliothèques aux dessus de js 13

Retour sur React - Approche par composants 14
Ou presque

Modèle de composant
Component
Facets
Sinks Event
tnevE
selcatpeceR
secruoS
Attributes
Receives
From
oT
sdneS
15

Modèle de composant de React 16
• On parle de « composant fonctionnel »
• Le composant est du code jsx renvoyé par une fonction
• Source et Sink : Evénements Javascript
• On retrouve le fonctionnement des événements DOM classique
• On utilise généralement des callbacks (ex. onClick)
• Système asynchrone de mise à jour des attributs
• On sort du paradigme objet
• Tout passe par les paramètres de la fonction
• Pas d’appel de méthode pour implémenter les facettes
• Le composant est potentiellement recalculé à chaque redessin
• Par défaut, fonction appelés dans le workflow React

| React | Dataflow | :   |
| ----- | -------- | --- |
17
communication Parents vers Enfants
• Sous forme de paramètres

| React | Reverse Dataflow | :   |
| ----- | ---------------- | --- |
18
communication Enfants vers Parents
• Sous forme de callbacks passées paramètres

jsx 19
• Langage dédié à React js
• Ressemble à
• Html
• js
• N’est pas du
• Html
• Js
• Donc, il y a des différences de vocabulaire
• N’est pas interprétable par le navigateur
• Langage compilé produisant du js utilisant la bibliothèque React js
• Peut inclure des expression js dans du html-like

| Jsx     | - exemples      |            |                                | 20  |
| ------- | --------------- | ---------- | ------------------------------ | --- |
| • const | name            | = "David"; |                                |     |
| • const | welcomeSubtitle |            | = <h2>Bienvenue {name} !</h2>; |     |

Exercice 1 – Affichage d’une carte utilisateur 21
Premiers pas avec jsx

Objectifs – Création d’un objet représentant
22
une personne
• Création d’un projet
• Mise en place de variables servant de propriétés (name, age, email)
• Utilisation de collection, boucle, map pour représenter les sections variables
(hobbies)
• Conditionnement du style

Structure de données 23
• const user = {
• name: "John Doe",
• age: 40,
• email: "john.doe@gmail.com",
• hobbies: ["Reading", "Traveling", "Gaming"],
• };

Objectif – Une carte magnifique ! 24
Div « App »
H1
Header « App-header »
Div « user-card »
H2
- Rouge si < 18
- Orange si < 22
P
- Vert sinon
P
H3
Div « hobby »
Div
Div « hobby »
Div « hobby »

Configuration du projet 25
• Il faut
• VS Code
• Nodejs / npm
• Extension React Developer Tools du navigateur
• Exploration des composants
• Profiler pour les performances de la page
• On utilise Vite pour créer la structure du projet
• Boiler-plate
• https://vitejs.fr/guide/

| Problème potentiel « | Execution | Policy | »   | 26  |
| -------------------- | --------- | ------ | --- | --- |
• « Impossible de charger le fichier C:\Program Files\nodejs\npm.ps1, car
| l’exécution de scripts est désactivée sur ce système |     | »   |     |     |
| ---------------------------------------------------- | --- | --- | --- | --- |
• Solution (dans powerShell ou en console vsCode)
• Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

Création d’un projet 27
• Prérequis
• NodeJs installé
• Dans un dossier dédié
• npm create vite@latest
• Utilisation de Vite comme outil de génération front
• Suppression des éléments en trop
• Dossier assets (facultatif)
• Les svg
• Les css
• Dans main.jsx
• Suppression du import index.css
• Dans App.jsx

Mise en œuvre 28
• Rapatrier la feuille App.css depuis moodle
• Ajouter l’importation dans App.jsx
• Tout le travail se fera dans la fonction App
• Déclaration de l’objet user
• Fonction de changement de rendu
• Fonction de changement de style

Retour sur le fonctionnement de React 29

React 30
• Programmation réactive
• Une modification impacte une partie du projet et pas l’ensemble
• Asynchrone
• Virtual DOM
| • Changement dans le virtual DOM => changement dans le DOM |     |     |
| ---------------------------------------------------------- | --- | --- |
• Evite des refresh inutiles
| • Fonctionnement à base de « | composants fonctionnels | »   |
| ---------------------------- | ----------------------- | --- |

| Css | dans React | 31  |
| --- | ---------- | --- |
• Structuré autour des composants
| •   | Souvent limité au composant  |     |
| --- | ---------------------------- | --- |
| •   | Limite les conflits          |     |
| •   | Peut compliquer la cohérence |     |
• Syntaxe différente du css classique
| •        | ATTENTION : camelCase au lieu de kebab-case        |     |
| -------- | -------------------------------------------------- | --- |
| •        | Exemple : background-color devient backgroundColor |     |
| • Inline | styles (attribut style des éléments HTML)          |     |
• Attention, styles complexes ou utilisation de pseudo sélecteur difficiles à gérer
• 1 fichier css par scope local (portée limitée à 1 composant)
| •        | Problème s’il existe des styles globaux    |     |
| -------- | ------------------------------------------ | --- |
| • Styled | components                                 |     |
| •        | Création d’un composant avec du css dedans |     |
| •        | Verbeux et crée des dépendances            |     |
• Les 3 solutions cohabitent

Framework css 32
• Css pré-écrits
• Amène de l’homogénéité (y compris entre appareils)
• Gain de temps
• Exemple
• Bootstrap (composants prêts à l’emploi)
• Tailwind css (personnalisable)
• Chakra UI (accent mis sur l’accessibilité)
• …

Architecture et Transpilation 33
• La base : index.html
• Inclut l’appel au script main.jsx
• main.jsx
• Fait l’insertion du résultat de App.jsx
dans l’élément « root » de la page via
l’API DOM
• App.jsx contient les composants
React à rendre
• Transpilation
• Agrège jsx, css pour produit html, css et
js interprétable par un navigateur

Syntaxe jsx 34
• Mélange de js et de pseudo-html
• Syntaxe proche, mais peut différer sur les attributs
• Toutes les balises doivent être fermées
• Le composant renvoie un nœud unique
• qui peut être un <Fragment/> ou </>
• si on ne veut pas d’un nœud typé
• Ajout d’une interprétation js dans le html
• Entre {}

| Les « | Props | »   | 35  |
| ----- | ----- | --- | --- |
• On peut fabriquer d’autres fonctions (ou composants)
| • Pour faciliter la lecture         |     |     |     |
| ----------------------------------- | --- | --- | --- |
| • Pour faciliter la réutilisabilité |     |     |     |
• Un composant React peut avoir des paramètres (tableau props)
| • Pour améliorer la réutilisabilité        |     |     |     |
| ------------------------------------------ | --- | --- | --- |
| • On utilise la déstructuration du tableau |     |     |     |

La notion de Hook 36
• Fonctions de la bibliothèques React
• Hooks d’état local
• Mémorise une valeur, permet la mise à jour, provoque le redessin
• useState, useReducer
• Hooks de contexte
• Permet la communication entre parents éloignés
• Sans devoir créer une chaîne d’appels complexe
• useContext
• Hooks de référencement
• Permet de conserver des informations non utiles au rendu
• Généralement un nœud du DOM
• useRef, useImperativeHandle

La notion de Hook 37
• Hooks d’effet
• Permet la synchronisation avec des éléments extérieurs
• Réseau, DOM, animations, éléments d’interface écrits en utilisant une autre bibliothèque,
et autres codes non React.
• useEffect, useLayoutEffect, useInsertionEffect
• Hooks de performance
• Permet de mettre en cache des calculs ou des définitions de fonctions pour éviter des
recalculs inutiles du Virtual DOM
• useMemo, useCallback, useTransition, useDeferredValue
• Hooks personnalisés
• Création de nouveaux hooks

useState 38
Un hook d’état local
Le hook le plus utilisé

Premier Hook : useState + Render 39
• Const [getter, setter] = useState(initialisation)
• Par convention, le getter prend le nom de la propriété
• Ex. [count, setCount] = useState(0)
• Render causé par la mise à jour d’un state
• Rendu sur changement d’état, puis rendu des enfants
• Modification du ReactDom
• Puis calcul par React des transformations nécessaires sur le DOM
• Et Mise à jour des useState

Exercice 2 - Compteur 40
Base du projet sur moodle
Illustration du comportement asynchrone

Détails 41
• Tout dans le fichier App.jsx
• Un useState pour le compteur
• Un <bouton> pour déclencher
• Un <h1> pour l’affichage de count
• Quelle est la différence d’effet entre
la ligne de code commentée et la
dernière ligne ?

Exercice 3 - Formulaire 42
Base du projet sur moodle
Champs contrôlés vs. Champs non contrôlés

IMPORTANT : Cas des formulaires 43
• Différence entre champs contrôlés et non contrôlés

Exercice 4 – Gestion de produits 44
Base du projet sur moodle
Un exemple concret

Interface 45

Structure de l’interface 46

Objectifs 47
• Dessiner le modèle de composant avec Corba CCM
• L’idée est de concevoir des composants simples ET réutilisables
• CheckBox, InputText, …
• Implémenter UI-First
• Implémenter chaque sous-composants de SearchBar
• Implémenter SearchBar
• Implémenter chaque sous-composants de TableProducts
• Implémenter TableProducts
• Utilisation de class CSS de Bootstrap
• Finir l’implémentation

Les autres hook 48

Hook - useEffect 49
• Création d’effets de bord
• Surveillance d’un ensemble de variable
• Callback appelée sur chaque changement de ces variables
• Rend les variables observables
• Limite les redessins
• Peut servir à initialiser des abonnements globaux
• Penser au désabonnement
• Utilisation à limiter
• Eviter les setters dans le useEffect

Les défauts de useEffect 50
• A utiliser sur des comportements hors de la logique du composant
• Ex : mise à jour du titre de la page.
• Ne pas utiliser de setters (venant de useState) au premier niveau du useEffect

Compteur avec useEffect 51
• Démo
• Code disponible sur Moodle

Hook - useMemo 52
• Permet de créer un déclencheur sur changement effectif
• Permet d’éviter des rendus inutiles sur changement des autres états
• Même syntaxe que useEffect
• En plus, retourne une valeur
• « Memoisation »
• Mise en cache d’une valeur
• Réaction sur changement
• N’utiliser que si nécessaire
• Pas d’optimisation préventive
• Consomme de la mémoire

Fonctionnement et optimisation 53
• Rappel : Principe de rendu de React
• Exécution de fonctions
• Restitue un virtual Dom
• Compare avec la version précédente
• Met à jour le DOM
• Utilisation de la console du navigateur en mode « Verbose »
• Affiche les latences excessives en warning
• Utilisation du profiler
• Pour identifier les composants générant de la latence
• Utilisation de useMemo et memo pour contrer les render inutiles

Exemple de « mémoisation » d’un composant 54
• Base du code sur Moodle
• ExempleMemoisation
• Step 1 : on regarde en console l’effet de la modification de la zone de texte
• Pourquoi ?
• Utilisation du profileur du navigateur (lancer enregistrement d’une action)
• Est-ce grave ?
• Step 2 : ajout d’un traitement long dans le composant Info
• => impacte les performances de la zone de texte
• Pourquoi ?
• Utilisation du profileur du navigateur (lancer enregistrement d’une action)
• Est-ce grave ?

| Exemple de « |     | mémoisation |     | » d’un composant | 55  |
| ------------ | --- | ----------- | --- | ---------------- | --- |
• Pour améliorer la perrformance, deux solutions
| • Solution 1 – | Réorganisation du code (App2.jsx) |     |     |     |     |
| -------------- | --------------------------------- | --- | --- | --- | --- |
• On isole les parties impactées par un changement d’état
• Fonctions séparées
| • Limite les redessins |             | des éléments indépendants |            |     |     |
| ---------------------- | ----------- | ------------------------- | ---------- | --- | --- |
| • Solution 2 –         | Mémoisation |                           | (App3.jsx) |     |     |
• Sauvegarde des paramètres et des résultats d’une fonction
• Permet d’éviter la réexécution de la fonction pour les mêmes paramètres

| Exemple de « |     | mémoisation |     | » d’un composant |     | 56  |
| ------------ | --- | ----------- | --- | ---------------- | --- | --- |
• Maintenant, on ajoute une dépendance entre App et Info (App4.jsx)
| • Ex: Ajout d’un handleClick               |             |     | passé en param à Info |            |       |     |
| ------------------------------------------ | ----------- | --- | --------------------- | ---------- | ----- | --- |
| • Retour du lag alors que la fonction ne « |             |     |                       | change     | » pas |     |
| • Solution 1 –                             | Mémoisation |     | avec useMemo          | (App5.jsx) |       |     |
• Plus adapté aux variables qu’aux fonctions
| • Solution 2 –              | Mémoisation |     | avec useCallback(App6.jsx) |     |     |     |
| --------------------------- | ----------- | --- | -------------------------- | --- | --- | --- |
| • Simplification du useMemo |             |     | pour les fonctions         |     |     |     |
• Si trop de dépendances, on peut aussi utiliser des useRef
• Globalement, ne « Mémoiser » que quand il y a des pbs de performance

Exercices 57
A partir des 4 boutons

Les Quatre Saisons 58

Comportement 59
|        | toSummer | toFall | toWinter | toSpring |
| ------ | -------- | ------ | -------- | -------- |
| Spring |  Summer | X      | X        | X        |
toSummer
| Summer | X   |  Summer | X   | X   |
| ------ | --- | -------- | --- | --- |
Spring Summer
| Fall | X   | X   | Summer |     |
| ---- | --- | --- | ------ | --- |

| Winter | X   | X   | X   |  Summer |
| ------ | --- | --- | --- | -------- |
toSpring
toFall
toWinter
Winter Fall

A faire 60
• Diagramme de composants
• Bouton
• Label
• Dialogue ?
• Implémentation : comment ?
• Représentation de l’état ?
• Gestion de l’activation ?
• Gestion des transitions ?
• On va jouer avec de la mémoisation dans un second temps (avec le hool
personnalisé)
• On commence par une implémentation simple qu’on fera évoluer plus tard