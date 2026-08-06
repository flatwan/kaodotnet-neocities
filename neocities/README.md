# NOTES

<!-- Fait pas gaffe a ca -->


        <link href="./style.css?v=3" rel="stylesheet" type="text/css" media="all">
        <link href="./components/bars.css?v=1" rel="stylesheet" type="text/css" media="all">

(Tu peux ouvrir le fichier dans ton navigateur
pour avoir un meilleur affichage stv)

## INSTRUCTIONS LORS DE LA MODIF DU SITE

- Si une image ou un css est updatée,
il faut changer sa "version" dans l'html/css.  

Ca permet aux navigateurs d'automatiquement retélecharger l'image  

(sinon ça affiche toujours l'ancienne avec le cache).  

ex: avant update: `<img src="./resources/flatwan.png?v=2">`  

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

<html class="desktop_bg">

    ...

</html>
```

```css
/* css */

.desktop_bg {
    background-image: url("./resources/bliss.jpg?v=1");
    background-size: cover;
}
```

Ceci appliquera "bliss" comme fond dans toute la page

### rot_on_hover

A appliquer sur une `<img>` pour qu'elle tourne légèrement

quand elle est survolée.  

ex:

```html
<img class="logo rot_on_hover" src="./resources/flatwan.png?v=2">
```

rendu:

<img class="logo rot_on_hover" src="./resources/flatwan.png?v=2" alt="monocouille">

### change_on_hover

A appliquer à un text (surtout un `<a>`) pour qu'un texte change de contenu

quand il est survolé.

ex:

```html
<a href="./index.html" class="change_on_hover">
    <span class="no_change"><strong>kao(dot)net</strong></span>
    <span class="change"><strong>K40(D0T)N3T</strong></span>
</a>

```

rendu:

<a href="./index.html" class="change_on_hover">
    <span class="no_change"><strong>kao(dot)net</strong></span>
    <span class="change"><strong>K40(D0T)N3T</strong></span>
</a>

("kao(dot)net" devient "K40(D0T)N3T")

### frame

Enveloppe l'element dans une boite.

ex:

```html
<div class="frame">
    <p>Je suis dans une boite</p>
</div>
```

rendu:

<div class="frame">
    <p>Je suis dans une boite</p>
</div>
