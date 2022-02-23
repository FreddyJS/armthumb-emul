import compile_assembly from '../src/compiler';
import defaultCPU from '../src/cpu';

const assembly_folder = __dirname + "/tests/";
const prompt = require('prompt-sync')();
const fs = require('fs');

let ci = false;
process.argv.forEach((arg) => {
  if (arg === '--ci') {
    ci = true;
  }
});

console.log('[tests] Starting tests...');
let files = fs.readdirSync(assembly_folder);
files = files.filter((f: string) => f.endsWith('.S'));
console.log(`[tests] Found ${files.length} files to test.`);

let passed = 0;
let failed = 0;
for (let i = 0; i < files.length; i++) {
  const file = files[i];
  console.log(`[tests] Testing '${file}'... (${i + 1}/${files.length})`);
  const assembly = fs.readFileSync(assembly_folder + file, 'utf8');
  const compiled = compile_assembly(assembly);
  if (compiled.error) {
    console.error(`[tests] Compilation error: ${compiled.error.message}`);
    failed++;
    continue;
  }
  console.log(`[tests] Compiled '${file}' successfully. Executing...`);
  const cpu = {...defaultCPU};
  cpu.load_assembly(assembly);
  cpu.run();

  try {
    const expected = fs.readFileSync(assembly_folder + file + ".json", 'utf8');
    const state = JSON.parse(expected);
    if (JSON.stringify(cpu.regs) !== JSON.stringify(state.regs)) {
      console.error(`[tests] Registers mismatch. Expected: ${JSON.stringify(state.regs)}, got: ${JSON.stringify(cpu.regs)}`);
      failed++;
    }
    if (JSON.stringify(cpu.memory) !== JSON.stringify(state.memory)) {
      console.error(`[tests] Memory mismatch. Expected: ${JSON.stringify(state.memory)}, got: ${JSON.stringify(cpu.memory)}`);
      failed++;
    }
  } catch (error) {
    // No expected output saved yet.
    console.warn(`[tests] No expected output saved for '${file}'.`);
  }
  console.log(`[tests] ${file} passed.`);
  passed++;

  if (!ci) {
    let answer: string = prompt('[tests] Display CPU state? (y/n) ');
    if (answer.toLowerCase() === 'y') {
      console.log(`[tests] CPU state:`);
  
      console.log(" - Registers:");
      console.log("   " + JSON.stringify(cpu.regs));
      console.log(" - Memory:");
      console.log("   " + JSON.stringify(cpu.memory));
  
      answer = prompt('[tests] Save the CPU state to a file? (y/n) ');
      if (answer.toLowerCase() === 'y') {
        const filename = assembly_folder + file + '.json';
        fs.writeFileSync(filename, JSON.stringify(cpu, null, 2));
      }
    }
  }
}

console.log(`[tests] Finished testing. ${passed}/${files.length} passed.`);

// const assembly = fs.readFileSync('./tests/mov.S', 'utf8');
// console.log('[tests] File `mov.S` loaded');

// const program = compile_assembly(assembly);
// if (program.error) {
//   console.log('[tests] Compilation failed');
//   console.log('[compiler] Error: ' + program.error.message + ' in line ' + program.error.line + ' column ' + program.error.column);
// } else {
//   console.log('[tests] Compilation succeeded');
//   console.log('[tests] Instructions:');
//   for (const ins of program.ins) {
//     console.log(" - OP[" + ins.operation + "] -> Operands: " + ins.operands.map((op) => "type[" + op.type + "](" + op.value + ")").join(', '));
//   }

//   const cpu = {...defaultCPU};
//   cpu.load(program.ins);
//   cpu.run();
//   console.log('[tests] CPU Registers:');
//   let line = "\t";
//   for (let i = 0; i < Object.keys(cpu.regs).length; i++) {
//     line += "R" + i + ": " + cpu.regs["r" + i] + " ";
//     if (i % 4 == 3) {
//       console.log(line);
//       line = "\t";
//     }
//   }

//   // Save the state to a JSON file
//   fs.writeFileSync('./tests/mov.S.json', cpu.dump_state());
// }

// console.log('[tests] Finished tests');
