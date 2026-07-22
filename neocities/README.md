# NOTES

<!-- Fait pas gaffe a ca -->
<link href="./style.css?v=1" rel="stylesheet" type="text/css" media="all">

(Tu peux ouvrir le fichier dans ton navigateur
pour avoir un meilleur affichage stv)

## INSTRUCTIONS LORS DE LA MODIF DU SITE

(note: il nous faudrait un moyen de check si l'autre est en train de modif une page)

- Si une image est updatée, il faut changer sa "version" dans l'html/css.  
Ca permet aux navigateurs d'automatiquement retélecharger l'image  
(sinon ça affiche toujours l'ancienne avec le cache).  
ex: avant update: `<img src="./resources/flatwan.png?v=1">`  
après update: `<img src="./resources/flatwan.png?v=2">`

## CLASS CUSTOMS

### checklist

Permet d'avoir une fausse checklist non fonctionnelle
(Utilisé par TODO dans la main page)  
ex:

```html
<ul class="checklist">
    <li>A faire</li>
    <li class="done">Fait</li>
</ul>
```

rendu:

☐ A faire  
☑ Fait

### [...]_bg

A appliquer sur un `<html>` pour que toute la page ait le fond en question  
ex:

```html
<!-- html -->
<html class="bliss_bg">
    ...
</html>
```

```css
/* css */
.bliss_bg {
    background-image: url("./resources/bliss.jpg?v=1");
    background-size: cover;
}
```

Ceci appliquera "bliss" comme fond dans toute la page
