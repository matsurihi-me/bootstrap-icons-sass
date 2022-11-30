# bootstrap-icons-sass

A Sass wrapper of [Bootstrap Icons](https://icons.getbootstrap.com/).

## Usage

First, install this package.

```sh
npm install bootstrap-icons-sass
```

Next, use this in your project.

```html
<p><span class="bi-alarm" style="font-size: 2rem; color: cornflowerblue;"></i></p>
```

```sass
.bi-alarm
  @include bi-alarm
```

## Detailed information

This sass provides one function and one mixin.

### Function

This function returns svg itself with the specified fill color.

```sass
@function bi-check-circle-fill($fill: #000)
  @return 'data:image/svg+xml,' + bi-escape-svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="' + $fill + '">...</svg>')
```

### Mixin

This mixin provides a sass to replace the existing bootstrap with the icon font.

```
@mixin bi-check-all($fill: currentColor, $size: 1em, $icon-size: 100%)
  content: ''
  display: inline-block
  width: $size
  height: $size
  mask-size: $icon-size $icon-size
  mask-position: center
  mask-repeat: no-repeat
  background-color: currentColor
  transform: translateY($size * 0.15)
  mask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">...</svg>')
```

## LICENSE

This is released under the MIT License.

## Bug Report / Contribution

Feel free to create GitHub issues or pull requests.