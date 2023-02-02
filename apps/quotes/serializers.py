from rest_framework import serializers
from .models import OcTsgQuote, OcTsgQuoteProduct


class QuoteListSerializer(serializers.ModelSerializer):
    class Meta:
        model = OcTsgQuote
        fields = '__all__'
        depth = 2

