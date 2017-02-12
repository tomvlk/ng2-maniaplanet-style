
class TextBlock {

  private _content = '';
  private _styles = {
    color: null,
    isBold: false,
    isCapitalized: false,
    isItalic: false,
    isNarrow: false,
    isWide: false,
    isLink: null,
    isShadowed: false,
    link: null
  };

  public getContent() {
    return this._content;
  }

  public styles(s?): any {
    if (s !== undefined) {
      for (var style in this._styles) {
        if (s[style] !== undefined)
          this._styles[style] = s[style];
      }
      return this;
    }
    return this._styles;
  }

  public append(c) {
    this._content += c;
  }

  public copy () {
    var s = new TextBlock();
    s.styles(this._styles);
    return s;
  }

  public equals (other) {
    var otherStyles = other.styles();
    for (var style in otherStyles) {
      if (this._styles[style] !== otherStyles[style])
        return false;
    }
    return true;
  }

}

class Tag {

  constructor (
    private type,
    private attributes = {},
    private content = '',
  ) {

  }

  public render(forceTag?) {
    if (forceTag || Object.keys(this.attributes).length > 0) {
      forceTag = true;
    } else return this.content;

    var output = '<' + this.type;
    for (var attr in this.attributes) {
      if (! this.attributes.hasOwnProperty(attr)) continue;
      if (! this.attributes[attr]) continue;
      output += ' ' + attr + '="' + this.attributes[attr] + '"';
    }
    output += '>' + this.content + '</' + this.type +'>';
    return output;
  }
}

export function MPStyle(input, options) {
  options = {
    mlProtocol: options && options.mlProtocol ? options.mlProtocol : 'maniaplanet://',
    stripTags: options && options.stripTags ? options.stripTags : [],
    useClasses: options && options.useClasses ? options.useClasses : false
  };
  var blocks = [(new TextBlock())];
  var escaped = false;
  var formatBlocks = [0];
  var append = function(c) {
    blocks[blocks.length - 1].append(c);
  };
  var setStyle = function(style) {
    var nb = blocks[blocks.length - 1]
      .copy()
      .styles(style);
    blocks.push(nb);
    formatBlocks[formatBlocks.length - 1]++;
  };
  var parse = function(input) {
    for (var i = 0; i < input.length; i++) {
      var c = input.charAt(i).toLowerCase();
      if (c == '$') {
        if (!escaped)
          escaped = true;
        else {
          append(c);
          escaped = false;
        }
      }
      else {
        if (!escaped) {
          append(input.charAt(i));
          continue;
        }
        var cs = blocks[formatBlocks[formatBlocks.length - 1]].styles();
        switch (c) {
          case 'o':
            if (options.stripTags.indexOf('o') < 0)
              setStyle({isBold: !cs.isBold});
            break;
          case 'i':
            if (options.stripTags.indexOf('i') < 0)
              setStyle({isItalic: !cs.isItalic});
            break;
          case 's':
            if (options.stripTags.indexOf('s') < 0)
              setStyle({isShadowed: !cs.isShadowed});
            break;
          case 'n':
            if (options.stripTags.indexOf('n') < 0)
              setStyle({isNarrow: true, isWide: false});
            break;
          case 'w':
            if (options.stripTags.indexOf('w') < 0)
              setStyle({isWide: true, isNarrow: false});
            break;
          case 'g':
            setStyle({color: null});
            break;
          case 'z':
            blocks.push(formatBlocks.length < 2 ? new TextBlock() : blocks[formatBlocks[formatBlocks.length - 2]].copy());
            formatBlocks[formatBlocks.length - 1]++;
            break;
          case 't':
            if (options.stripTags.indexOf('t') < 0)
              setStyle({isCapitalized: !cs.isCapitalized});
            break;
          case 'h':
          case 'l':
          case 'p':
            if (cs.isLink === null) {
              var href = null;
              if (input.charAt(i + 1) == '[') {
                for (var j = i + 1; j < input.length; j++) {
                  if (input.charAt(j) == ']') {
                    href = input.substr(i+2, j-i-2);
                    break;
                  }
                }
                i += href.length + 2;
              }
              if (options.stripTags.indexOf(c) < 0)
                setStyle({isLink: c, link: href});
            } else {
              setStyle({isLink: null, link: null});
            }
            break;
          case '<':
            blocks.push(blocks[blocks.length - 1].copy());
            formatBlocks.push(blocks.length - 1);
            break;
          case '>':
            formatBlocks.pop();
            blocks.push(blocks[formatBlocks[formatBlocks.length - 1]].copy());
            formatBlocks[formatBlocks.length - 1] = blocks.length - 1;
            break;
        }
        if (input.substr(i, 3).match(/[0-9a-f]{3}/i)) {
          if (options.stripTags.indexOf('color') < 0)
            setStyle({color: input.substr(i, 3)});
          i += 2;
        }
        escaped = false;
      }
    }
  };
  var render = function() {
    var output = '';
    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (block.getContent()) {
        var content = block.getContent();
        while (i+1 < blocks.length && block.equals(blocks[i+1]))
          content += blocks[++i].getContent();
        var style = block.styles();
        if (style.isLink) {
          var href = style.link ? style.link : content;
          if (style.isLink == 'h' || style.isLink == 'p') {
            if (!href.startsWith(options.mlProtocol))
              href = options.mlProtocol + href;
          }
          var attr:any = {'href': href};
          if (options.useClasses)
            attr.class = 'mp-link mp-link-' + style.isLink;
          content = (new Tag('a', attr, content)).render();
        }
        var cssStyle = '';
        var classes = [];
        if (style.isBold) {
          cssStyle += 'font-weight:bold;';
          classes.push('mp-bold');
        }
        if (style.isItalic) {
          cssStyle += 'font-style:italic;';
          classes.push('mp-italic');
        }
        if (style.color) {
          cssStyle += 'color:#' + style.color + ';';
          classes.push('mp-color');
        }
        if (style.isShadowed) {
          cssStyle += 'text-shadow:1px 1px 1px rgba(0, 0, 0, 0.5);';
          classes.push('mp-shadow');
        }
        if (style.isNarrow) {
          cssStyle += 'letter-spacing:-.1em;font-size:95%;';
          classes.push('mp-narrow');
        }
        if (style.isWide) {
          cssStyle += 'letter-spacing:.1em;font-size:105%;';
          classes.push('mp-wide');
        }
        if (style.isCapitalized) {
          cssStyle += 'text-transform:uppercase;';
          classes.push('mp-upper');
        }
        var attributes:any = {};
        if (cssStyle) {
          if (!options.useClasses) {
            attributes.style = cssStyle;
          } else {
            if (style.color)
              attributes.style = 'color:#' + style.color + ';';
          }
        }
        if (options.useClasses && classes.length)
          attributes.class = classes.join(' ');
        content = (new Tag('span', attributes, content)).render();
        output += content;
      }
    }
    return output;
  };
  parse(input);
  return render();
}
