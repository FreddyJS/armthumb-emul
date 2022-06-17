import compile_assembly from '../compiler';
import defaultCPU, { armCPU_T } from '../cpu';

const ASM_DIR = __dirname + '/asm/';

var exec = require('child_process').execSync;
const fs = require('fs');

let ci = false;
process.argv.forEach((arg) => {
  if (arg === '--ci') {
    ci = true;
  }
});

function checkWithCrosscompiler(file: string) {
  // Using arm-linux-gnueabihf-as to compile the assembly
  const cmd = `arm-linux-gnueabihf-as -mthumb -o ${file.replace('.S', '.o')} ${file}`;
  const options = { stdio: 'pipe', encoding: 'utf-8' };

  try {
    exec(cmd, options);
    return true;
  } catch (e) {
    return false;
  }
}

function dumpCPU(cpu: armCPU_T, file: string) {
  fs.writeFileSync(file, JSON.stringify(cpu, null, 2));
}

function runTest(test_name: string) {
  const cpu = defaultCPU({ memorySize: 0, stackSize: 0 });
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
  expect(checkWithCrosscompiler(ASM_DIR + `${test_name}.S`)).toBe(true);
  const program = compile_assembly(asm);
  expect(program.error).toBeUndefined();
  cpu.load(program);
  cpu.run();
  
  if (expected !== undefined) {
    const state = JSON.parse(expected);
    expect(JSON.stringify(cpu)).toBe(JSON.stringify(state));
  } else {
    // In CI we already failed the test if expected output is not found
    dumpCPU(cpu, ASM_DIR + `${test_name}.S.json.tmp`);
    console.log(`No expected output saved for '${test_name}.S'. Dumping state to ${ASM_DIR}${test_name}.S.json.tmp`);
    console.log(`Expected state dumped. Remove the .tmp if everything is ok.`);
    expect(expected).toBeDefined();
  }
}

test('MOV', () => {
  // Load the assembly and expected output
  const test_name = expect.getState().currentTestName.toLowerCase();
  const cpu = defaultCPU({ memorySize: 0, stackSize: 0 });
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
  expect(checkWithCrosscompiler(ASM_DIR + `${test_name}.S`)).toBe(true);
  const program = compile_assembly(asm);
  expect(program.error).toBeUndefined();
  cpu.load(program);
  cpu.run();

  if (expected !== undefined) {
    const state = JSON.parse(expected);
    expect(JSON.stringify(cpu)).toBe(JSON.stringify(state));
  } else {
    // In CI we already failed the test if expected output is not found
    dumpCPU(cpu, ASM_DIR + `${test_name}.S.json.tmp`);
    console.log(`No expected output saved for '${test_name}.S'. Dumping state to ${ASM_DIR}${test_name}.S.json.tmp`);
    console.log(`Expected state dumped. Remove the .tmp if everything is ok.`);
    expect(expected).toBeDefined();
  }
});

test('ADD', () => {
  // Load the assembly and expected output
  const test_name = expect.getState().currentTestName.toLowerCase();
  const cpu = defaultCPU({ memorySize: 0, stackSize: 0 });
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
  expect(checkWithCrosscompiler(ASM_DIR + `${test_name}.S`)).toBe(true);
  const program = compile_assembly(asm);
  expect(program.error).toBeUndefined();
  cpu.load(program);
  cpu.run();

  if (expected !== undefined) {
    const state = JSON.parse(expected);
    expect(JSON.stringify(cpu)).toBe(JSON.stringify(state));
  } else {
    // In CI we already failed the test if expected output is not found
    dumpCPU(cpu, ASM_DIR + `${test_name}.S.json.tmp`);
    console.log(`No expected output saved for '${test_name}.S'. Dumping state to ${ASM_DIR}${test_name}.S.json.tmp`);
    console.log(`Expected state dumped. Remove the .tmp if everything is ok.`);
    expect(expected).toBeDefined();
  }
});

test('LABELS', () => {
  // Load the assembly and expected output
  const test_name = expect.getState().currentTestName.toLowerCase();
  const cpu = defaultCPU({ memorySize: 0, stackSize: 0 });
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
  expect(checkWithCrosscompiler(ASM_DIR + `${test_name}.S`)).toBe(true);
  const program = compile_assembly(asm);
  expect(program.error).toBeUndefined();
  cpu.load(program);
  cpu.run();

  if (expected !== undefined) {
    const state = JSON.parse(expected);
    expect(JSON.stringify(cpu)).toBe(JSON.stringify(state));
  } else {
    // In CI we already failed the test if expected output is not found
    dumpCPU(cpu, ASM_DIR + `${test_name}.S.json.tmp`);
    console.log(`No expected output saved for '${test_name}.S'. Dumping state to ${ASM_DIR}${test_name}.S.json.tmp`);
    console.log(`Expected state dumped. Remove the .tmp if everything is ok.`);
    expect(expected).toBeDefined();
  }
});

test('SUB', () => {
  // Load the assembly and expected output
  const test_name = expect.getState().currentTestName.toLowerCase();
  const cpu = defaultCPU({ memorySize: 0, stackSize: 0 });
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
  expect(checkWithCrosscompiler(ASM_DIR + `${test_name}.S`)).toBe(true);
  const program = compile_assembly(asm);
  expect(program.error).toBeUndefined();
  cpu.load(program);
  cpu.run();

  if (expected !== undefined) {
    const state = JSON.parse(expected);
    expect(JSON.stringify(cpu)).toBe(JSON.stringify(state));
  } else {
    // In CI we already failed the test if expected output is not found
    dumpCPU(cpu, ASM_DIR + `${test_name}.S.json.tmp`);
    console.log(`No expected output saved for '${test_name}.S'. Dumping state to ${ASM_DIR}${test_name}.S.json.tmp`);
    console.log(`Expected state dumped. Remove the .tmp if everything is ok.`);
    expect(expected).toBeDefined();
  }
});

test('MUL', () => {
  // Load the assembly and expected output
  const test_name = expect.getState().currentTestName.toLowerCase();
  const cpu = defaultCPU({ memorySize: 0, stackSize: 0 });
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
  expect(checkWithCrosscompiler(ASM_DIR + `${test_name}.S`)).toBe(true);
  const program = compile_assembly(asm);
  expect(program.error).toBeUndefined();
  cpu.load(program);
  cpu.run();

  if (expected !== undefined) {
    const state = JSON.parse(expected);
    expect(JSON.stringify(cpu)).toBe(JSON.stringify(state));
  } else {
    // In CI we already failed the test if expected output is not found
    dumpCPU(cpu, ASM_DIR + `${test_name}.S.json.tmp`);
    console.log(`No expected output saved for '${test_name}.S'. Dumping state to ${ASM_DIR}${test_name}.S.json.tmp`);
    console.log(`Expected state dumped. Remove the .tmp if everything is ok.`);
    expect(expected).toBeDefined();
  }
});


test('CMP', () => {
  // Load the assembly and expected output
  const test_name = expect.getState().currentTestName.toLowerCase();
  const cpu = defaultCPU({ memorySize: 0, stackSize: 0 });
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
  expect(checkWithCrosscompiler(ASM_DIR + `${test_name}.S`)).toBe(true);
  const program = compile_assembly(asm);
  expect(program.error).toBeUndefined();
  cpu.load(program);
  cpu.run();
  
  if (expected !== undefined) {
    const state = JSON.parse(expected);
    expect(JSON.stringify(cpu)).toBe(JSON.stringify(state));
  } else {
    // In CI we already failed the test if expected output is not found
    dumpCPU(cpu, ASM_DIR + `${test_name}.S.json.tmp`);
    console.log(`No expected output saved for '${test_name}.S'. Dumping state to ${ASM_DIR}${test_name}.S.json.tmp`);
    console.log(`Expected state dumped. Remove the .tmp if everything is ok.`);
    expect(expected).toBeDefined();
  }
});

test('CMN', () => {
  // Load the assembly and expected output
  const test_name = expect.getState().currentTestName.toLowerCase();
  
});