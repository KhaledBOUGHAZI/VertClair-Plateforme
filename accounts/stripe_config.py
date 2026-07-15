import os
import stripe
from django.conf import settings


def get_stripe_secret_key():
    return getattr(settings, "STRIPE_SECRET_KEY", "")


def get_stripe_public_key():
    return getattr(settings, "STRIPE_PUBLIC_KEY", "")


def get_stripe_webhook_secret():
    return getattr(settings, "STRIPE_WEBHOOK_SECRET", "")


def configure_stripe():
    stripe.api_key = get_stripe_secret_key()
    return stripe