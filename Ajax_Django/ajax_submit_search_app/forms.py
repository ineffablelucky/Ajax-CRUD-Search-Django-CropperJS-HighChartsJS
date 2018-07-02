from django import forms
from .models import Person


class UpdateForm(forms.ModelForm):

    class Meta:
        model = Person
        fields = '__all__'

    def save(self, commit=True):
        p = super().save(commit=False)

        if commit:
            p.save()

        return p

    def clean_name(self):
        data = self.cleaned_data.get('name').title()
        return data

    def clean_dob(self):
        data = self.cleaned_data.get('dob')
        return data
