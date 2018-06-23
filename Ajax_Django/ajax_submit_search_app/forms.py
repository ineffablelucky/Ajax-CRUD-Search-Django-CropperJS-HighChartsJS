from django import forms
from .models import Person


class UpdateForm(forms.ModelForm):

    class Meta:
        model = Person
        fields = '__all__'

    def save(self, commit=True):
        p = super().save(commit=False)
        print("p", p)
        commit = False
        if commit:
            p.save()
        print("after save")
        return p

    def clean_name(self):
        data = self.cleaned_data.get('name').title()
        print("7777777", data)
        return data

    def clean_dob(self):
        data = self.cleaned_data.get('dob')
        print("6666667", data)
        return data
