const fs = require("fs");
const path = require("path");

const glob = require("glob");
const svgo = require("svgo");

const fd = fs.openSync("_bootstrap_icons.sass", "w", 0o644);

fs.writeSync(
  fd,
  `\
/*! Bootstrap Icons v${
    require("bootstrap-icons/package.json").version
  } (https://icons.getbootstrap.com/)
 Copyright (c) 2019-2021 The Bootstrap Authors
 Licensed under MIT (https://github.com/twbs/icons/blob/main/LICENSE.md)
 Bootstrap Icons Sass v${
   require("../package.json").version
 } (https://github.com/matsurihi-me/bootstrap-icons-sass)
 Copyright (c) 2022 matsurihi.me
 Licensed under MIT (https://github.com/matsurihi-me/bootstrap-icons-sass/blob/main/LICENSE)
`
);
fs.writeSync(
  fd,
  `\
@function bi-str-replace($string,$search,$replace)
  $index: str-index($string, $search)
  @if $index
    @return str-slice($string, 1, $index - 1) + $replace + bi-str-replace(str-slice($string, $index + str-length($search)), $search, $replace)
  @return $string
@function bi-escape-svg($string)
  @return bi-str-replace($string, '#', '%23')
@mixin bi-mixin-base($fill: currentColor, $size: 1em, $icon-size: 100%)
  &::before
    content: ''
    display: inline-block
    width: $size
    height: $size
    mask-size: $icon-size $icon-size
    mask-position: center
    mask-repeat: no-repeat
    background-color: $fill
    transform: translateY($size * 0.15)
`
);

function escapeSvg(svg) {
  return svg.replaceAll("#", "%23");
}

const files = glob.sync("node_modules/bootstrap-icons/icons/*.svg");
files.forEach((file) => {
  const name = path.basename(file, ".svg");
  const svg = svgo.optimize(fs.readFileSync(file).toString(), {
    path: file,
    plugins: [
      "removeDimensions",
      { name: "removeAttrs", params: { attrs: "(class|fill|stroke)" } },
    ],
  }).data;
  const svgWithFill = svgo
    .optimize(svg, {
      plugins: [
        {
          name: "addAttributesToSVGElement",
          params: { attribute: { fill: "%FILL%" } },
        },
      ],
    })
    .data.replace("%FILL%", "' + $fill + '");

  fs.writeSync(
    fd,
    `\
@function bi-${name}($fill: #000)
  @return 'data:image/svg+xml,' + bi-escape-svg('${svgWithFill}')
@mixin bi-${name}($fill: currentColor, $size: 1em, $icon-size: 100%)
  @include bi-mixin-base($fill, $size, $icon-size)
  &::before
    mask-image: url('data:image/svg+xml,${escapeSvg(svg)}')
`
  );
});

fs.closeSync(fd);
