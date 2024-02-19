from django.core.exceptions import ValidationError


def even_value_validator(value):
    if value % 2 != 0:
        raise ValidationError("The value must be an even number")
