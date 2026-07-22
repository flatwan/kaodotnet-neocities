INSTRUCTIONS LORS DE LA MODIF DU SITE:
(note: il nous faudrait un moyen de check si l'autre est en train de modif une page)
- Si une image est updatée, il faut changer sa "version" dans l'html/css. Ca permet aux navigateurs d'automatiquement retélecharger l'image (sinon ça affiche toujours l'ancienne avec le cache).
ex: avant update: <img src="./resources/flatwan.png?v=1"> | après update: <img src="./resources/flatwan.png?v=2">

si j'ai d'autres remarques je les écrirais ici