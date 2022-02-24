import compile_assembly from '../compiler';
import defaultCPU, { armCPU_T } from '../cpu';

const fs = require('fs');
const ASM_DIR = __dirname + '/asm/';
let ci = false;
process.argv.forEach((arg) => {
  if (arg === '--ci') {
    ci = true;
  }
});

function dumpState(cpu: armCPU_T, file: string) {
  const state = {
    regs: cpu.regs,
    memory: cpu.memory.every((v) => v === 0) ? undefined : cpu.memory,
    stack: cpu.stack.every((v) => v === 0) ? undefined : cpu.stack,
  };

  fs.writeFileSync(file, JSON.stringify(state, null, 2));
}

test('MOV', () => {
  // Load the assembly and expected output
  const test_name = expect.getState().currentTestName.toLowerCase();
  const cpu = defaultCPU();
  const asm = fs.readFileSync(ASM_DIR + `${test_name}.S`, 'utf8');
  let expected = undefined;
  try {
    expected = fs.readFileSync(ASM_DIR + `${test_name}.S.json`, 'utf8');
  } catch (error) {
    if (ci) {
      // Fail test in CI if expected output is not found
      expect(expected).toBeDefined();
    }
  }

  // Compile, load and run the assembly in the CPU
  const program = compile_assembly(asm);
  cpu.load(program.ins);
  cpu.run();

  if (expected !== undefined) {
    const state = JSON.parse(expected);
    expect(JSON.stringify(cpu.regs)).toBe(JSON.stringify(state.regs));
  } else {
    // In CI we already failed the test if expected output is not found
    dumpState(cpu, ASM_DIR + `${test_name}.S.json.tmp`);
    console.log(`No expected output saved for '${test_name}.S'. Dumping state to ${ASM_DIR}${test_name}.S.json.tmp`);
    console.log(`Expected state dumped. Remove the .tmp if everything is ok.`);
    expect(expected).toBeDefined();
  }
});

test('ADD', () => {
  // Load the assembly and expected output
  const test_name = expect.getState().currentTestName.toLowerCase();
  const cpu = defaultCPU();
  const asm = fs.readFileSync(ASM_DIR + `${test_name}.S`, 'utf8');
  let expected = undefined;
  try {
    expected = fs.readFileSync(ASM_DIR + `${test_name}.S.json`, 'utf8');
  } catch (error) {
    if (ci) {
      // Fail test in CI if expected output is not found
      expect(expected).toBeDefined();
    }
  }

  // Compile, load and run the assembly in the CPU
  const program = compile_assembly(asm);
  cpu.load(program.ins);
  cpu.run();

  if (expected !== undefined) {
    const state = JSON.parse(expected);
    expect(JSON.stringify(cpu.regs)).toBe(JSON.stringify(state.regs));
  } else {
    // In CI we already failed the test if expected output is not found
    dumpState(cpu, ASM_DIR + `${test_name}.S.json.tmp`);
    console.log(`No expected output saved for '${test_name}.S'. Dumping state to ${ASM_DIR}${test_name}.S.json.tmp`);
    console.log(`Expected state dumped. Remove the .tmp if everything is ok.`);
    expect(expected).toBeDefined();
  }
});
