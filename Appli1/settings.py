import os
from pathlib import Path

import dj_database_url
from dotenv import load_dotenv


# =========================================================
# DOSSIER PRINCIPAL
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

# Charge les variables du fichier .env en local.
# Sur Railway, les variables sont chargées directement
# depuis l’onglet Variables.
load_dotenv(BASE_DIR / ".env")


# =========================================================
# SÉCURITÉ DJANGO
# =========================================================

DEBUG = os.environ.get(
    "DEBUG",
    "True",
).lower() == "true"


SECRET_KEY = os.environ.get(
    "SECRET_KEY",
    "",
)

# Autorise une clé locale provisoire uniquement en développement.
# En production, l’absence de SECRET_KEY provoquera une erreur.
if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = "django-insecure-local-appli1-a-remplacer"
    else:
        raise RuntimeError(
            "La variable SECRET_KEY est absente en production."
        )


ALLOWED_HOSTS = [
    host.strip()
    for host in os.environ.get(
        "ALLOWED_HOSTS",
        (
            "127.0.0.1,"
            "localhost,"
            ".up.railway.app,"
            ".formation-ecologie.fr"
        ),
    ).split(",")
    if host.strip()
]


CSRF_TRUSTED_ORIGINS = [
    origine.strip()
    for origine in os.environ.get(
        "CSRF_TRUSTED_ORIGINS",
        (
            "http://127.0.0.1:8001,"
            "http://localhost:8001,"
            "https://*.up.railway.app,"
            "https://*.formation-ecologie.fr"
        ),
    ).split(",")
    if origine.strip()
]


# =========================================================
# APPLICATIONS DJANGO
# =========================================================

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Applications VertClair
    "accounts",
    "todo",
]


# =========================================================
# MIDDLEWARE
# =========================================================

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",

    # Gestion des fichiers statiques en production
    "whitenoise.middleware.WhiteNoiseMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# =========================================================
# URLS
# =========================================================

ROOT_URLCONF = "Appli1.urls"


# =========================================================
# TEMPLATES
# =========================================================

TEMPLATES = [
    {
        "BACKEND": (
            "django.template.backends.django.DjangoTemplates"
        ),

        "DIRS": [
            BASE_DIR / "templates",
        ],

        "APP_DIRS": True,

        "OPTIONS": {
            "context_processors": [
                (
                    "django.template.context_processors."
                    "request"
                ),
                (
                    "django.contrib.auth.context_processors."
                    "auth"
                ),
                (
                    "django.contrib.messages.context_processors."
                    "messages"
                ),
            ],
        },
    },
]


# =========================================================
# WSGI
# =========================================================

WSGI_APPLICATION = "Appli1.wsgi.application"


# =========================================================
# BASE DE DONNÉES
# =========================================================
#
# En local :
# SQLite est utilisée automatiquement.
#
# Sur Railway :
# DATABASE_URL est fournie par PostgreSQL.
# =========================================================

DATABASES = {
    "default": dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600,
        conn_health_checks=True,
    )
}


# =========================================================
# VALIDATION DES MOTS DE PASSE
# =========================================================

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": (
            "accounts.validators."
            "MotDePasseVertClairValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "UserAttributeSimilarityValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "CommonPasswordValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "NumericPasswordValidator"
        ),
    },
]


# =========================================================
# LANGUE ET FUSEAU HORAIRE
# =========================================================

LANGUAGE_CODE = "fr-fr"

TIME_ZONE = "Europe/Paris"

USE_I18N = True

USE_TZ = True


# =========================================================
# FICHIERS STATIQUES
# =========================================================

STATIC_URL = "/static/"

STATICFILES_DIRS = [
    BASE_DIR / "static",
]

STATIC_ROOT = BASE_DIR / "staticfiles"


STORAGES = {
    "default": {
        "BACKEND": (
            "django.core.files.storage."
            "FileSystemStorage"
        ),
    },

    "staticfiles": {
        "BACKEND": (
            "whitenoise.storage."
            "CompressedManifestStaticFilesStorage"
        ),
    },
}


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# =========================================================
# AUTHENTIFICATION ET RETOURS VERS VERTCLAIR
# =========================================================

VERTCLAIR_URL = os.environ.get(
    "VERTCLAIR_URL",
    "http://127.0.0.1:8000",
).rstrip("/")


LOGIN_URL = f"{VERTCLAIR_URL}/login/"

LOGIN_REDIRECT_URL = "dashboard"

LOGOUT_REDIRECT_URL = f"{VERTCLAIR_URL}/login/"


# =========================================================
# CONNEXION SSO VERTCLAIR → APPLI1
# =========================================================

APPLI1_SSO_SECRET = os.environ.get(
    "APPLI1_SSO_SECRET",
    "",
)


# =========================================================
# API ATMO FRANCE
# =========================================================

ATMO_USERNAME = os.environ.get(
    "ATMO_USERNAME",
    "",
)

ATMO_PASSWORD = os.environ.get(
    "ATMO_PASSWORD",
    "",
)

ATMO_API_URL = os.environ.get(
    "ATMO_API_URL",
    "https://admindata.atmo-france.org/api",
)


# =========================================================
# API GÉORISQUES
# =========================================================

GEORISQUES_API_TOKEN = os.environ.get(
    "GEORISQUES_API_TOKEN",
    "",
)


# =========================================================
# EMAILS IONOS
# =========================================================

EMAIL_BACKEND = (
    "django.core.mail.backends.smtp.EmailBackend"
)

EMAIL_HOST = os.environ.get(
    "EMAIL_HOST",
    "smtp.ionos.fr",
)

EMAIL_PORT = int(
    os.environ.get(
        "EMAIL_PORT",
        "587",
    )
)

EMAIL_USE_TLS = os.environ.get(
    "EMAIL_USE_TLS",
    "True",
).lower() == "true"

EMAIL_USE_SSL = os.environ.get(
    "EMAIL_USE_SSL",
    "False",
).lower() == "true"

EMAIL_HOST_USER = os.environ.get(
    "EMAIL_HOST_USER",
    "",
)

EMAIL_HOST_PASSWORD = os.environ.get(
    "EMAIL_HOST_PASSWORD",
    "",
)

DEFAULT_FROM_EMAIL = os.environ.get(
    "DEFAULT_FROM_EMAIL",
    "VertClair <vertclair@formation-ecologie.fr>",
)


# =========================================================
# STRIPE
# =========================================================

STRIPE_MODE = os.environ.get(
    "STRIPE_MODE",
    "test",
)

STRIPE_PUBLIC_KEY = os.environ.get(
    "STRIPE_PUBLIC_KEY",
    "",
)

STRIPE_SECRET_KEY = os.environ.get(
    "STRIPE_SECRET_KEY",
    "",
)

STRIPE_WEBHOOK_SECRET = os.environ.get(
    "STRIPE_WEBHOOK_SECRET",
    "",
)
VERTCLAIR_URL = os.environ.get(
    "VERTCLAIR_URL",
    "https://www.formation-ecologie.fr",
)

# =========================================================
# SÉCURITÉ EN PRODUCTION
# =========================================================

if not DEBUG:
    SECURE_SSL_REDIRECT = True

    SESSION_COOKIE_SECURE = True

    CSRF_COOKIE_SECURE = True

    SECURE_PROXY_SSL_HEADER = (
        "HTTP_X_FORWARDED_PROTO",
        "https",
    )

    SECURE_HSTS_SECONDS = 3600

    SECURE_HSTS_INCLUDE_SUBDOMAINS = True

    SECURE_HSTS_PRELOAD = True

    SECURE_CONTENT_TYPE_NOSNIFF = True