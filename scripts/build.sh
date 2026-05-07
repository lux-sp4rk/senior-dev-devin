#!/usr/bin/env bash
# devin-the-senior-dev/scripts/build.sh
# Build index.html from story.twee

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TweeFile="$PROJECT_DIR/story.twee"
OutputFile="$PROJECT_DIR/index.html"
PassagesFile="$PROJECT_DIR/.passages.txt"

if [ ! -f "$TweeFile" ]; then
  echo "ERROR: story.twee not found at $TweeFile"
  exit 1
fi

echo "[build] story.twee → index.html"

# Extract passages from .twee to temp file
python3 - "$TweeFile" << 'PYEOF'
import re, sys

twee_path = sys.argv[1]
with open(twee_path, 'r') as f:
    content = f.read()

passages = re.split(r'\n:: ', '\n' + content)
for p in passages[1:]:
    lines = p.strip().split('\n')
    name_line = lines[0]
    match = re.match(r'^(\S+)(.*)$', name_line)
    name = match.group(1) if match else name_line
    tags = match.group(2).strip() if match and match.group(2) else ''
    body_lines = []
    for line in lines[1:]:
        if line.startswith(':: '):
            break
        body_lines.append(line)
    body = '\n'.join(body_lines)
    body = body.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    tag_attr = f' tags="{tags}"' if tags else ''
    sys.stdout.write(f'<tw-passagedata name="{name}"{tag_attr}>{body}</tw-passagedata>\n')

PYEOF
> "$PassagesFile"

# Build HTML header + passages + footer
python3 - "$OutputFile" "$PassagesFile" << 'PYEOF'
import sys

output_path = sys.argv[1]
passages_path = sys.argv[2]

with open(passages_path, 'r') as f:
    passages_content = f.read()

html = f'''<!DOCTYPE html>
<html data-init-no-bookmark="">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Devin the Senior Dev</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
    * {{ box-sizing: border-box; }}
    body {{
      background: #0a0a0a;
      color: #e0e0e0;
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      font-size: 15px;
      line-height: 1.7;
      max-width: 720px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }}
    .episode-header {{
      color: #555;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 2rem;
      border-bottom: 1px solid #222;
      padding-bottom: 1rem;
    }}
    .tw-link {{
      color: #7ee787;
      cursor: pointer;
      text-decoration: none;
    }}
    .tw-link:hover {{ color: #a5f3b4; }}
    hr {{ border: none; border-top: 1px solid #222; margin: 2rem 0; }}
  </style>
</head>
<body>
<tw-storydata name="Devin the Senior Dev" ifid="DEVIN-SENIOR-DEV-E001" format="Harlowe" format-version="3.3.0" start="prologue_greg_office" options="" hidden="">
{passages_content}
</tw-storydata>
<script>
(function(){{
  var storyData = document.querySelector('tw-storydata');
  var passages = {{}};
  var startPassage = storyData.getAttribute('start');

  Array.from(storyData.querySelectorAll('tw-passagedata')).forEach(function(p){{
    passages[p.getAttribute('name')] = p.innerHTML;
  }});

  function render(text) {{
    text = text.replace(/\[img\[([^\]]+)\]\]/g, '<img src="$1" style="max-width:100%">');
    text = text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, function(m, label, dest){{
      return '<a class="tw-link" data-dest="'+dest+'">'+label+'</a>';
    }});
    text = text.replace(/\[\[\[([^\]|]+)\|([^\]]+)\]\]\]/g, function(m, label, dest){{
      return '<a class="tw-link" data-dest="'+dest+'">'+label+'</a>';
    }});
    text = text.replace(/\[\[([^\]]+)\]\]/g, function(m, dest){{
      return '<a class="tw-link" data-dest="'+dest+'">'+dest+'</a>';
    }});
    text = text.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/_([^_]+)_/g, '<em>$1</em>');
    return text;
  }}

  function go(name) {{
    var html = passages[name] || '<p>Passage not found: ' + name + '</p>';
    document.getElementById('game').innerHTML = '<div class="episode-header">DEVIN THE SENIOR DEV — ' + name.replace(/_/g, ' ').toUpperCase() + '</div>' + render(html);
    document.getElementById('game').querySelectorAll('.tw-link').forEach(function(a){{
      a.addEventListener('click', function(e){{ go(this.getAttribute('data-dest')); }});
    }});
  }}

  document.body.innerHTML = '<div id="game"></div>';
  go(startPassage);
}})();
</script>
</body>
</html>'''

with open(output_path, 'w') as f:
    f.write(html)

PYEOF

rm -f "$PassagesFile"
echo "[build] done → index.html"