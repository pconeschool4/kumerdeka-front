const fs = require('fs');
const path = require('path');

const targetDir = 'C:/Users/MYPCPROL5V/Downloads/kumerdekadan/Kumerdeka-trace/frontend/src/pages';
const layoutDir = 'C:/Users/MYPCPROL5V/Downloads/kumerdekadan/Kumerdeka-trace/frontend/src/Layouts';

function fixTypography(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Text that is too dark
  content = content.replace(/text-\[#172B4D\]/g, 'text-white');
  content = content.replace(/text-\[#172b4d\]/g, 'text-white');
  content = content.replace(/text-\[#52637A\]/g, 'text-gray-200');
  content = content.replace(/text-\[#52637a\]/g, 'text-gray-200');
  
  // Text that is medium dark (make it lighter)
  content = content.replace(/text-\[#718096\]/g, 'text-[#94A3B8]');
  content = content.replace(/text-\[#A0AEC0\]/g, 'text-[#64748B]');
  
  // Borders that might be dark
  content = content.replace(/border-\[#E2E8F0\]/g, 'border-white/10');
  content = content.replace(/border-\[#EDF2F7\]/g, 'border-white/10');
  content = content.replace(/border-\[#E8EEF7\]/g, 'border-white/10');

  // Backgrounds that are too white/light (some generic ones I missed)
  content = content.replace(/bg-\[#F7FAFF\]/g, 'bg-[#0F172A]/60');
  content = content.replace(/bg-\[#F8FAFC\]/g, 'bg-[#0F172A]/60');
  content = content.replace(/bg-\[#F3F4F6\]/g, 'bg-[#0F172A]/60');
  
  // Fix specifically the inputs or cards that use plain bg-white
  // e.g. <div className="bg-white rounded-xl...
  content = content.replace(/bg-white(?= |\r|\n|\"|\'|\})/g, 'bg-white/5');
  
  // Ensure that text-white wasn't accidentally matched if someone wrote bg-white-something.
  
  fs.writeFileSync(filePath, content);
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      fixTypography(fullPath);
      console.log('Fixed', fullPath);
    }
  });
}

walkDir(targetDir);
walkDir(layoutDir);
console.log('Fixed typography and generic white backgrounds globally!');
