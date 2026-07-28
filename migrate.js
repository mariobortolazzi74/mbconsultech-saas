const fs = require('fs');

let html = fs.readFileSync('/Users/mariobortolazzi/progetti/mbconsultech.com/index.html', 'utf8');

const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
let body = bodyMatch[1];

body = body.replace(/class=/g, 'className=');
body = body.replace(/for=/g, 'htmlFor=');
body = body.replace(/stroke-linecap/g, 'strokeLinecap');
body = body.replace(/stroke-linejoin/g, 'strokeLinejoin');
body = body.replace(/stroke-width/g, 'strokeWidth');
body = body.replace(/viewbox/gi, 'viewBox');
body = body.replace(/<img([^>]*[^\/])>/g, '<img$1 />');
body = body.replace(/<br>/g, '<br />');
body = body.replace(/<br className="([^"]*)">/g, '<br className="$1" />');
body = body.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
body = body.replace(/\.\/assets\//g, '/assets/');

const jsx = `import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      ${body}
    </>
  );
}
`;

fs.writeFileSync('/Users/mariobortolazzi/progetti/mbconsultech-saas/src/app/page.tsx', jsx);
console.log('Migration complete');
