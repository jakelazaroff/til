# Conditionally extend a template

Django supports [template inheritance](https://docs.djangoproject.com/en/5.0/ref/templates/language/#id1) via the `extends` tag. Often, a template inheritance chain follows all the way up to a "base" template that contains the full markup for a page, from the doctype to the closing HTML tag.

A common pattern when using libraries like htmx is returning HTML fragments. In these cases, it can make sense to conditionally extend a template: return the full page when visited directly but [return a fragment when requested via Ajax](https://htmx.org/docs/#progressive_enhancement).

Let's say we have this page layout, `layout.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- ... -->
  </head>
  <body>
    {% block content %}{% endblock %}
  </body>
</html>
```

A template rendered within this layout would look something like this:

<!-- prettier-ignore -->
```html
{% extends "layout.html"}

{% block content %}<p>Hello, world!</p>{% endblock %}
```

To render the template standalone, we can create a "stub" layout (say, `ajax.html`) that declares the block and nothing else:

```html
{% block content %}{% endblock %}
```

Then, instead of using a string literal for the name of the template to extend, we use a variable. We can default to `layout.html` if it's omitted:

<!-- prettier-ignore -->
```html
{% extends layout|default:"layout.html"}

{% block content %}<p>Hello, world!</p>{% endblock %}
```

The view that renders the template might look something like this:

```python
def view(request: HttpRequest):
  return render(
    request,
    template_name="some_template.html",
    context={ "layout": "ajax.html" if request.headers.get("hx-request") else None },
  )
```
