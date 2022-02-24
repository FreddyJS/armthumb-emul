import compile_assembly from '../src/compiler';
import defaultCPU from '../src/cpu';

const ColorReset = "\x1b[0m"
const ColorRed = "\x1b[31m"
const ColorGreen = "\x1b[32m"
const ColorCyan = "\x1b[36m"

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

const cpu = defaultCPU();
let passed = 0;
let failed = 0;

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  console.log(`\n[tests] Testing '${file}'... (${i + 1}/${files.length})`);
  const assembly = fs.readFileSync(assembly_folder + file, 'utf8');
  const compiled = compile_assembly(assembly);
  if (compiled.error) {
    console.error(`[tests] ${ColorRed}Compilation error${ColorReset}: ${compiled.error.message}`);
    failed++;
    continue;
  }
  cpu.reset();
  console.log(`[tests] ${ColorCyan}Compiled${ColorReset} '${file}' successfully. Executing...`);
  cpu.load(compiled.ins);
  cpu.run();
  console.log(`[tests] ${ColorCyan}Executed${ColorReset} '${file}' successfully.`);

  try {
    const expected = fs.readFileSync(assembly_folder + file + ".json", 'utf8');
    const state = JSON.parse(expected);
    console.log(`[tests] Comparing expected state with actual state...`);
    if (JSON.stringify(cpu.regs) !== JSON.stringify(state.regs)) {
      console.error(`[tests] Registers mismatch. Expected: ${JSON.stringify(state.regs)}`);
      console.log(`          got: ${JSON.stringify(cpu.regs)}`);
      failed++;
      continue;
    }
    if (state.memory !== undefined && JSON.stringify(cpu.memory) !== JSON.stringify(state.memory)) {
      console.error(`[tests] Memory mismatch. Expected: ${JSON.stringify(state.memory)}`);
      console.error(`        got: ${JSON.stringify(cpu.memory)}`);
      failed++;
      continue;
    }
  } catch (error) {
    // No expected output saved yet.
    console.warn(`[tests] No expected output saved for '${file}'.`);
  }
  console.log(`[tests] File '${file}' ${ColorGreen}passed${ColorReset}!`);
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
        const state = {
          regs: cpu.regs,
          memory: cpu.memory.every((v: number) => v === 0) ? undefined : cpu.memory
        }
        fs.writeFileSync(filename, JSON.stringify(state, null, 2));
      }
    }
  }
}

console.log(`[tests] Finished testing. ${passed}/${files.length} passed.`);
