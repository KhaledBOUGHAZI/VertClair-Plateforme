"""Permissions communes aux écrans d'administration Fenny."""

def est_fenny(user):
    """
    Autorise :
    - un superutilisateur Django ;
    - un utilisateur authentifié dont le profil VertClair a le rôle ``fenny``.
    """
    if not getattr(user, "is_authenticated", False):
        return False

    if getattr(user, "is_superuser", False):
        return True

    profil = getattr(user, "profil_vertclair", None)
    return bool(profil and profil.role == "fenny")
