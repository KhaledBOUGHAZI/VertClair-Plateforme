import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


class MotDePasseVertClairValidator:
    def validate(self, password, user=None):
        if len(password) < 10:
            raise ValidationError(
                _("Le mot de passe doit contenir au moins 10 caractères."),
                code="password_too_short",
            )

        if not re.search(r"[A-Z]", password):
            raise ValidationError(
                _("Le mot de passe doit contenir au moins une majuscule."),
                code="password_no_upper",
            )

        if not re.search(r"[a-z]", password):
            raise ValidationError(
                _("Le mot de passe doit contenir au moins une minuscule."),
                code="password_no_lower",
            )

        if not re.search(r"\d", password):
            raise ValidationError(
                _("Le mot de passe doit contenir au moins un chiffre."),
                code="password_no_digit",
            )

        if not re.search(r"[^A-Za-z0-9]", password):
            raise ValidationError(
                _("Le mot de passe doit contenir au moins un caractère spécial."),
                code="password_no_special",
            )

    def get_help_text(self):
        return _(
            "Votre mot de passe doit contenir au moins 10 caractères, "
            "une majuscule, une minuscule, un chiffre et un caractère spécial."
        )